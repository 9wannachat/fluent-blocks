import type { Attempt } from './schema';

export interface ObjectiveStatistics {
  objectiveId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  selfAssessed: number;
  accuracy: number | null;
  lastPracticedAt: string;
}

export function summarizeObjectives(attempts: readonly Attempt[]): ObjectiveStatistics[] {
  const objectives = new Map<string, ObjectiveStatistics>();
  for (const { objectiveId, outcome, updatedAt } of attempts) {
    const statistics = objectives.get(objectiveId) ?? {
      objectiveId, attempts: 0, correct: 0, incorrect: 0, selfAssessed: 0, accuracy: null,
      lastPracticedAt: updatedAt,
    };
    statistics.attempts++;
    if (outcome === 'self-assessed') {
      statistics.selfAssessed++;
    } else {
      statistics[outcome]++;
      statistics.accuracy = statistics.correct / (statistics.correct + statistics.incorrect);
    }
    if (Date.parse(updatedAt) > Date.parse(statistics.lastPracticedAt)) {
      statistics.lastPracticedAt = updatedAt;
    }
    objectives.set(objectiveId, statistics);
  }
  return [...objectives.values()];
}
