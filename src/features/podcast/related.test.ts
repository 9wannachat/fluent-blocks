import { describe, expect, it } from 'vitest'
import type { Pattern } from '../../domain/content'
import { findRelatedPatterns, parseTimestamp, timestampLabel } from './related'

describe('podcast notebook helpers', () => {
  it('parses the supported timestamp inputs', () => {
    expect(parseTimestamp(' 2:03 ')).toBe(123)
    expect(parseTimestamp('123')).toBe(123)
    expect(parseTimestamp('1:02:03')).toBe(3723)
    expect(parseTimestamp('')).toBeNull()
    expect(parseTimestamp(timestampLabel(3723))).toBe(3723)
    expect(() => parseTimestamp('1:60')).toThrow()
    expect(() => parseTimestamp('-1')).toThrow()
  })

  it('prioritizes words in templates over tags and ignores common words', () => {
    const makePattern = (id: string, template: string, tags: string[]): Pattern => ({
      id, template, tags, intent: 'question', meaning: 'คำถาม', register: 'neutral', slots: [],
      examples: [], why: 'ถาม', placement: 'หน้า', alternatives: [], mistakes: [], lessons: [],
    })
    const target = makePattern('past-question', 'Did you + verb?', ['past simple'])
    const related = makePattern('question-tag', 'What happened?', ['did questions'])
    const unrelated = makePattern('state', 'You are…', ['state'])
    const patterns = [related, unrelated, target]
    expect(findRelatedPatterns('So, did you notice any changes?', patterns)).toEqual([target, related])
    expect(findRelatedPatterns('you and the', patterns)).toEqual([])
  })
})
