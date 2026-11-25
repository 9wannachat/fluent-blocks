import Dexie, { type EntityTable } from 'dexie';
import { localDateKey, scheduleReview, type ReviewCard, type ReviewRating } from '../domain/review';
import {
  attemptSchema, backupKeys, backupSchema, podcastSchema, progressSchema,
  recordKey, reviewSchema, settingsSchema, vocabularySchema,
  type Attempt, type Backup, type BackupKey, type LessonProgress,
  type PodcastEntry, type Settings, type VocabularyEntry,
} from './schema';

export type { Attempt, Backup, LessonProgress, PodcastEntry, Settings, VocabularyEntry } from './schema';
export { sourceUrlSchema } from './schema';
export { summarizeObjectives, type ObjectiveStatistics } from './statistics';

interface RecoveryBackup {
  id: 'before-replace';
  backup: Backup;
}

export class StudyDatabase extends Dexie {
  progress!: EntityTable<LessonProgress, 'lessonId'>;
  attempts!: EntityTable<Attempt, 'id'>;
  reviews!: EntityTable<ReviewCard, 'patternId'>;
  vocabulary!: EntityTable<VocabularyEntry, 'id'>;
  podcast!: EntityTable<PodcastEntry, 'id'>;
  settings!: EntityTable<Settings, 'id'>;
  recovery!: EntityTable<RecoveryBackup, 'id'>;

  constructor(name = 'fluent-blocks') {
    super(name);
    const stores = {
      progress: 'lessonId,updatedAt',
      attempts: 'id,exerciseId,objectiveId,updatedAt',
      reviews: 'patternId,dueOn',
      vocabulary: 'id,updatedAt',
      podcast: 'id,updatedAt',
      settings: 'id',
    };
    this.version(1).stores(stores);
    this.version(2).stores({
      ...stores,
      attempts: 'id,exerciseId,objectiveId,updatedAt,[objectiveId+updatedAt]',
      recovery: 'id',
    });
  }
}

export const db = new StudyDatabase();

export const defaultSettings: Settings = {
  id: 'preferences',
  theme: 'system',
  voiceURI: '',
  speechRate: 1,
  routineMinutes: [5, 8, 7, 5, 5],
  updatedAt: new Date(0).toISOString(),
};

type ProgressPatch = Partial<Pick<LessonProgress, 'completed' | 'bookmarked' | 'resumeBlock'>>;
type PreferencesPatch = Partial<Omit<Settings, 'id' | 'updatedAt'>>;
type NoteInput<T> = Omit<T, 'id' | 'updatedAt'> & { id?: string };

export function updateProgress(lessonId: string, patch: ProgressPatch, store = db): Promise<LessonProgress> {
  return store.transaction('rw', store.progress, async () => {
    const previous = await store.progress.get(lessonId);
    const next = progressSchema.parse({
      completed: false,
      bookmarked: false,
      resumeBlock: 0,
      ...previous,
      ...patch,
      lessonId,
      updatedAt: new Date().toISOString(),
    });
    await store.progress.put(next);
    return next;
  });
}

export async function recordAttempt(input: Omit<Attempt, 'id' | 'updatedAt'>, store = db): Promise<Attempt> {
  const next = attemptSchema.parse({ ...input, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
  await store.attempts.add(next);
  return next;
}

export function enqueuePattern(patternId: string, now = new Date(), store = db): Promise<ReviewCard> {
  return store.transaction('rw', store.reviews, async () => {
    const current = await store.reviews.get(patternId);
    if (current) return current;
    const card = reviewSchema.parse({ ...scheduleReview(patternId, undefined, 'again', now), dueOn: localDateKey(now) });
    await store.reviews.add(card);
    return card;
  });
}

export function ratePattern(patternId: string, rating: ReviewRating, now = new Date(), store = db): Promise<ReviewCard> {
  return store.transaction('rw', store.reviews, async () => {
    const previous = await store.reviews.get(patternId);
    const next = reviewSchema.parse(scheduleReview(patternId, previous, rating, now));
    await store.reviews.put(next);
    return next;
  });
}

export function saveSettings(patch: PreferencesPatch, store = db): Promise<Settings> {
  return store.transaction('rw', store.settings, async () => {
    const previous = await store.settings.get('preferences');
    const next = settingsSchema.parse({ ...defaultSettings, ...previous, ...patch, updatedAt: new Date().toISOString() });
    await store.settings.put(next);
    return next;
  });
}

export async function saveVocabulary(input: NoteInput<VocabularyEntry>, store = db): Promise<VocabularyEntry> {
  const next = vocabularySchema.parse({ ...input, id: input.id ?? crypto.randomUUID(), updatedAt: new Date().toISOString() });
  await store.vocabulary.put(next);
  return next;
}

export async function savePodcastEntry(input: NoteInput<PodcastEntry>, store = db): Promise<PodcastEntry> {
  const next = podcastSchema.parse({ ...input, id: input.id ?? crypto.randomUUID(), updatedAt: new Date().toISOString() });
  await store.podcast.put(next);
  return next;
}

const maxBackupBytes = 20 * 1024 * 1024;

function tables(store: StudyDatabase) {
  return backupKeys.map((key) => store[key]);
}

async function snapshot(store: StudyDatabase): Promise<Backup> {
  const [progress, attempts, reviews, vocabulary, podcast, settings] = await Promise.all([
    store.progress.toArray(),
    store.attempts.toArray(),
    store.reviews.toArray(),
    store.vocabulary.toArray(),
    store.podcast.toArray(),
    store.settings.toArray(),
  ]);
  return {
    format: 'fluent-blocks-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { progress, attempts, reviews, vocabulary, podcast, settings },
  };
}

function serialize(backup: Backup): string {
  return JSON.stringify(backup, null, 2);
}

export function exportBackup(store = db): Promise<string> {
  return store.transaction('r', tables(store), async () => serialize(await snapshot(store)));
}

export async function getRecoveryBackup(store = db): Promise<string | undefined> {
  const record = await store.recovery.get('before-replace');
  return record && serialize(record.backup);
}

export interface BackupPreview {
  backup: Backup;
  counts: Record<BackupKey, { incoming: number; current: number; conflicts: number }>;
}

function compareRecords(incoming: Backup['data'], current: Backup['data']): BackupPreview['counts'] {
  const counts = {} as BackupPreview['counts'];
  for (const key of backupKeys) {
    const byId = new Map(current[key].map((record) => [recordKey(record), record]));
    const conflicts = incoming[key].filter((record) => {
      const existing = byId.get(recordKey(record));
      return existing && JSON.stringify(existing) !== JSON.stringify(record);
    }).length;
    counts[key] = { incoming: incoming[key].length, current: current[key].length, conflicts };
  }
  return counts;
}

export async function previewBackup(json: string, store = db): Promise<BackupPreview> {
  if (new TextEncoder().encode(json).byteLength > maxBackupBytes) {
    throw new Error('ไฟล์สำรองเกินขนาด 20 MiB');
  }
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    throw new Error('อ่านไฟล์ JSON ไม่ได้');
  }
  const parsed = backupSchema.safeParse(value);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const location = issue?.path.join('.');
    throw new Error(location ? `ข้อมูลสำรองไม่ถูกต้องที่ ${location}` : 'รูปแบบข้อมูลสำรองไม่รองรับ');
  }
  const current = await store.transaction('r', tables(store), () => snapshot(store));
  return { backup: parsed.data, counts: compareRecords(parsed.data.data, current.data) };
}

export async function applyBackup(
  preview: BackupPreview,
  mode: 'merge' | 'replace',
  store = db,
): Promise<{ previousBackup?: string }> {
  const { data } = backupSchema.parse(preview.backup);
  return store.transaction('rw', [...tables(store), store.recovery], async () => {
    const previous = await snapshot(store);

    if (mode === 'replace') {
      await store.recovery.put({ id: 'before-replace', backup: previous });
      await Promise.all(tables(store).map((table) => table.clear()));
    }

    function recordsToWrite<Key extends BackupKey>(key: Key): Backup['data'][Key] {
      if (mode === 'replace') return data[key];
      const byId = new Map(previous.data[key].map((record) => [recordKey(record), Date.parse(record.updatedAt)]));
      return data[key].filter((record) =>
        (byId.get(recordKey(record)) ?? -Infinity) < Date.parse(record.updatedAt)) as Backup['data'][Key];
    }

    await Promise.all([
      store.progress.bulkPut(recordsToWrite('progress')),
      store.attempts.bulkPut(recordsToWrite('attempts')),
      store.reviews.bulkPut(recordsToWrite('reviews')),
      store.vocabulary.bulkPut(recordsToWrite('vocabulary')),
      store.podcast.bulkPut(recordsToWrite('podcast')),
      store.settings.bulkPut(recordsToWrite('settings')),
    ]);

    return mode === 'replace' ? { previousBackup: serialize(previous) } : {};
  });
}
