export const reviewIntervals = [1, 3, 7, 14, 30] as const;
export const reviewRatings = ['again', 'hard', 'good', 'easy'] as const;

export type ReviewRating = (typeof reviewRatings)[number];

export interface ReviewCard {
  patternId: string;
  step: number;
  dueOn: string;
  lastRating: ReviewRating;
  updatedAt: string;
}

export function localDateKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function scheduleReview(
  patternId: string,
  previous: ReviewCard | undefined,
  rating: ReviewRating,
  now = new Date(),
): ReviewCard {
  const startingStep = previous?.step ?? 0;
  const adjustment = { again: 0, hard: 0, good: 1, easy: 2 }[rating];
  const step = rating === 'again'
    ? 0
    : Math.min(startingStep + adjustment, reviewIntervals.length - 1);
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + reviewIntervals[step]!);
  return { patternId, step, dueOn: localDateKey(nextDate), lastRating: rating, updatedAt: now.toISOString() };
}

export function getDueReviews(cards: readonly ReviewCard[], now = new Date()): ReviewCard[] {
  const today = localDateKey(now);
  return cards.filter(({ dueOn }) => dueOn <= today).sort((left, right) =>
    left.dueOn.localeCompare(right.dueOn) || left.patternId.localeCompare(right.patternId));
}
