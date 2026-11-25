import { describe, expect, it } from 'vitest'
import { getAnswerFeedback, matchesAnswer } from './feedback'

describe('curated answer checking', () => {
  it('normalizes punctuation, Unicode apostrophes, case and whitespace', () => {
    expect(matchesAnswer('  She DOESN’T like it. ', ["She doesn't like it"])).toBe(true)
  })

  it('accepts explicit alternatives and retains meaningful grammar', () => {
    expect(matchesAnswer('Did you eat yet?', ['Have you eaten yet?', 'Did you eat yet?'])).toBe(true)
    expect(matchesAnswer('Does she likes it?', ['Does she like it?'])).toBe(false)
    expect(getAnswerFeedback('Does she likes it?', { 'does she likes it': 'ใช้ like' })).toBe('ใช้ like')
  })
})
