import { expect, it } from 'vitest';
import type { Attempt } from './schema';
import { summarizeObjectives } from './statistics';

it('keeps deterministic accuracy and self-assessment separate', () => {
  const attempt = (objectiveId: string, outcome: Attempt['outcome'], day: number): Attempt => ({
    id: String(day), exerciseId: 'exercise', objectiveId, outcome, updatedAt: new Date(Date.UTC(2026, 10, day)).toISOString(),
  });
  expect(summarizeObjectives([
    attempt('questions', 'self-assessed', 25), attempt('questions', 'correct', 22),
    attempt('questions', 'incorrect', 20), attempt('retelling', 'self-assessed', 21),
  ])).toEqual([
    { objectiveId: 'questions', attempts: 3, correct: 1, incorrect: 1, selfAssessed: 1, accuracy: 0.5, lastPracticedAt: '2026-11-25T00:00:00.000Z' },
    { objectiveId: 'retelling', attempts: 1, correct: 0, incorrect: 0, selfAssessed: 1, accuracy: null, lastPracticedAt: '2026-11-21T00:00:00.000Z' },
  ]);
});
