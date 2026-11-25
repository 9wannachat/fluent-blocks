import { z } from 'zod';
import { reviewIntervals, reviewRatings } from '../domain/review';

const id = z.string().min(1).max(160).regex(/^[a-z0-9][a-z0-9_.:-]*$/i);
const updatedAt = z.iso.datetime();
const text = z.string().max(5_000);
const label = z.string().trim().min(1).max(500);
const uniqueIds = z.array(id).max(100).refine((items) => new Set(items).size === items.length);
const labels = z.array(label).max(100);

export const sourceUrlSchema = z.string().trim().max(2_000).refine((raw) => {
  if (raw === '') return true;
  try {
    const url = new URL(raw);
    return /^https?:\/\//i.test(raw) && ['https:', 'http:'].includes(url.protocol) &&
      url.username === '' && url.password === '';
  } catch {
    return false;
  }
}, 'ใช้ลิงก์ http หรือ https');

export const progressSchema = z.strictObject({
  lessonId: id,
  completed: z.boolean(),
  bookmarked: z.boolean(),
  resumeBlock: z.number().int().nonnegative().max(10_000),
  updatedAt,
});

export const attemptSchema = z.strictObject({
  id,
  exerciseId: id,
  objectiveId: id,
  outcome: z.enum(['correct', 'incorrect', 'self-assessed']),
  updatedAt,
});

export const reviewSchema = z.strictObject({
  patternId: id,
  step: z.number().int().min(0).max(reviewIntervals.length - 1),
  dueOn: z.iso.date(),
  lastRating: z.enum(reviewRatings),
  updatedAt,
});

export const vocabularySchema = z.strictObject({
  id,
  term: label,
  meaningTh: text,
  example: text,
  notes: text,
  sourceUrl: sourceUrlSchema,
  patternIds: uniqueIds,
  updatedAt,
});

export const podcastSchema = z.strictObject({
  id,
  sentence: label,
  sourceUrl: sourceUrlSchema,
  timestampSeconds: z.number().int().nonnegative().max(604_800).nullable(),
  context: text,
  meaningTh: text,
  notes: text,
  chunks: labels,
  tags: labels,
  personalExample: text,
  updatedAt,
});

const duration = z.number().int().min(0).max(180);
export const settingsSchema = z.strictObject({
  id: z.literal('preferences'),
  theme: z.enum(['light', 'dark', 'system']),
  voiceURI: z.string().max(1_000),
  speechRate: z.number().min(0.5).max(2),
  routineMinutes: z.tuple([duration, duration, duration, duration, duration])
    .refine((minutes) => minutes.some((value) => value > 0)),
  updatedAt,
});

export const backupDataSchema = z.strictObject({
  progress: z.array(progressSchema).max(10_000),
  attempts: z.array(attemptSchema).max(100_000),
  reviews: z.array(reviewSchema).max(10_000),
  vocabulary: z.array(vocabularySchema).max(10_000),
  podcast: z.array(podcastSchema).max(10_000),
  settings: z.array(settingsSchema).max(1),
});

export const backupKeys = ['progress', 'attempts', 'reviews', 'vocabulary', 'podcast', 'settings'] as const;
export type BackupKey = (typeof backupKeys)[number];

export const backupSchema = z.strictObject({
  format: z.literal('fluent-blocks-backup'),
  version: z.literal(1),
  exportedAt: updatedAt,
  data: backupDataSchema,
}).superRefine(({ data }, context) => {
  for (const key of backupKeys) {
    const seen = new Set<string>();
    for (const [index, record] of data[key].entries()) {
      const primaryKey = recordKey(record);
      if (seen.has(primaryKey)) {
        context.addIssue({ code: 'custom', path: ['data', key, index], message: 'พบ ID ซ้ำ' });
      }
      seen.add(primaryKey);
    }
  }
});

export type LessonProgress = z.infer<typeof progressSchema>;
export type Attempt = z.infer<typeof attemptSchema>;
export type VocabularyEntry = z.infer<typeof vocabularySchema>;
export type PodcastEntry = z.infer<typeof podcastSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Backup = z.infer<typeof backupSchema>;
type BackupRecord = Backup['data'][BackupKey][number];

export function recordKey(record: BackupRecord): string {
  if ('lessonId' in record) return record.lessonId;
  if ('patternId' in record) return record.patternId;
  return record.id;
}
