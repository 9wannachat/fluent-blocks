import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyBackup, exportBackup, getRecoveryBackup, previewBackup, ratePattern, recordAttempt,
  savePodcastEntry, saveSettings, saveVocabulary, StudyDatabase, updateProgress,
  type Backup,
} from './index';

let store: StudyDatabase;
let remote: StudyDatabase;

const example = {
  term: 'effort',
  meaningTh: 'ความพยายาม',
  example: 'It takes effort.',
  notes: '',
  sourceUrl: '',
  patternIds: ['it-takes'],
};

beforeEach(() => {
  store = new StudyDatabase(crypto.randomUUID());
  remote = new StudyDatabase(crypto.randomUUID());
});

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all([store.delete(), remote.delete()]);
});

describe('study storage', () => {
  it('preserves independent writes and restores data on re-open', async () => {
    await Promise.all([
      updateProgress('do-support', { bookmarked: true }, store),
      updateProgress('do-support', { completed: true, resumeBlock: 2 }, store),
    ]);
    await recordAttempt({ exerciseId: 'exercise-1', objectiveId: 'question', outcome: 'incorrect' }, store);
    await ratePattern('question', 'good', new Date(2026, 10, 26, 12), store);
    await saveSettings({ theme: 'dark' }, store);
    store.close();
    await store.open();
    expect(await store.progress.get('do-support')).toMatchObject({ completed: true, bookmarked: true, resumeBlock: 2 });
    expect(await store.attempts.count()).toBe(1);
    expect(await store.reviews.get('question')).toMatchObject({ dueOn: '2026-11-29' });
    expect(await store.settings.get('preferences')).toMatchObject({ theme: 'dark', routineMinutes: [5, 8, 7, 5, 5] });
  });

  it('migrates v1 progress and adds the recovery table', async () => {
    const previous = new Dexie(store.name);
    previous.version(1).stores({
      progress: 'lessonId,updatedAt', attempts: 'id,exerciseId,objectiveId,updatedAt',
      reviews: 'patternId,dueOn', vocabulary: 'id,updatedAt', podcast: 'id,updatedAt', settings: 'id',
    });
    await previous.table('progress').add({
      lessonId: 'old', completed: true, bookmarked: false, resumeBlock: 0, updatedAt: new Date().toISOString(),
    });
    previous.close();
    expect(await store.progress.get('old')).toMatchObject({ completed: true });
    expect(await store.recovery.count()).toBe(0);
  });

  it('rejects invalid JSON, unknown format, duplicate IDs, and unsafe URLs', async () => {
    const saved = await saveVocabulary(example, remote);
    const original = JSON.parse(await exportBackup(remote)) as Backup;
    await expect(previewBackup('{', store)).rejects.toThrow('JSON');
    await expect(previewBackup(JSON.stringify({ ...original, version: 2 }), store)).rejects.toThrow('version');
    original.data.vocabulary.push(saved);
    await expect(previewBackup(JSON.stringify(original), store)).rejects.toThrow('vocabulary.1');
    original.data.vocabulary = [{ ...saved, sourceUrl: 'javascript:alert(1)' }];
    await expect(previewBackup(JSON.stringify(original), store)).rejects.toThrow('sourceUrl');
    expect(await store.vocabulary.count()).toBe(0);
  });

  it('merges newer edits and keeps local entries and timestamps for repeat imports', async () => {
    const shared = await saveVocabulary({ ...example, id: 'shared' }, store);
    await saveVocabulary({ ...example, id: 'local' }, store);
    await remote.vocabulary.add({ ...shared, notes: 'updated', updatedAt: '2099-01-01T00:00:00.000Z' });
    const preview = await previewBackup(await exportBackup(remote), store);
    expect(preview.counts.vocabulary).toEqual({ incoming: 1, current: 2, conflicts: 1 });
    await applyBackup(preview, 'merge', store);
    await applyBackup(preview, 'merge', store);
    expect(await store.vocabulary.count()).toBe(2);
    expect(await store.vocabulary.get('shared')).toMatchObject({ notes: 'updated' });
    const stale = { ...shared, notes: 'stale', updatedAt: '2020-01-01T00:00:00.000Z' };
    await remote.vocabulary.put(stale);
    await applyBackup(await previewBackup(await exportBackup(remote), store), 'merge', store);
    expect(await store.vocabulary.get('shared')).toMatchObject({ notes: 'updated' });
  });

  it('backs up previous data during replace and rolls back failed writes', async () => {
    await saveVocabulary({ ...example, id: 'local' }, store);
    await savePodcastEntry({
      sentence: 'Did you notice that?', id: 'remote', sourceUrl: 'https://example.org/episode',
      timestampSeconds: 123, context: '', meaningTh: '', notes: '', chunks: [], tags: [], personalExample: '',
    }, remote);
    const preview = await previewBackup(await exportBackup(remote), store);
    const failure = vi.spyOn(store.podcast, 'bulkPut').mockRejectedValueOnce(new Error('interrupted'));
    await expect(applyBackup(preview, 'replace', store)).rejects.toThrow('interrupted');
    failure.mockRestore();
    expect(await store.vocabulary.count()).toBe(1);
    expect(await getRecoveryBackup(store)).toBeUndefined();
    const { previousBackup } = await applyBackup(preview, 'replace', store);
    expect(await getRecoveryBackup(store)).toBe(previousBackup);
    expect(await store.vocabulary.count()).toBe(0);
    expect(await store.podcast.get('remote')).toMatchObject({ timestampSeconds: 123 });
    expect(JSON.parse(previousBackup!).data.vocabulary[0]).toMatchObject({ id: 'local' });
  });
});
