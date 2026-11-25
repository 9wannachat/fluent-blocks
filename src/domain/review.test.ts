import { describe, expect, it } from 'vitest';
import { getDueReviews, localDateKey, scheduleReview } from './review';

describe('calendar review scheduling', () => {
  const now = new Date(2026, 11, 31, 23, 45);

  it('applies each rating and crosses the local year boundary', () => {
    const first = scheduleReview('coffee', undefined, 'again', now);
    expect(first).toMatchObject({ step: 0, dueOn: '2027-01-01' });
    const good = scheduleReview('coffee', first, 'good', now);
    expect(good).toMatchObject({ step: 1, dueOn: '2027-01-03' });
    const hard = scheduleReview('coffee', good, 'hard', now);
    expect(hard).toMatchObject({ step: 1, dueOn: '2027-01-03' });
    const easy = scheduleReview('coffee', hard, 'easy', now);
    expect(easy).toMatchObject({ step: 3, dueOn: '2027-01-14' });
    const capped = scheduleReview('coffee', easy, 'easy', now);
    expect(capped).toMatchObject({ step: 4, dueOn: '2027-01-30' });
    expect(scheduleReview('coffee', capped, 'again', now)).toEqual(first);
  });

  it('orders cards by local due date including today', () => {
    const a = scheduleReview('a', undefined, 'again', new Date(2027, 0, 1));
    const b = scheduleReview('b', undefined, 'again', now);
    const c = scheduleReview('c', undefined, 'easy', now);
    expect(localDateKey(new Date(2027, 0, 2, 0))).toBe('2027-01-02');
    expect(getDueReviews([a, c, b], new Date(2027, 0, 2, 0))).toEqual([b, a]);
  });
});
