import { describe, expect, it } from 'vitest'
import { everyday } from '../content/everyday'
import { curriculum } from '../content'
import { buildExpansion, categoryIds, validateEverydayContent } from './everyday'
import { createEverydaySearch } from '../features/everyday/search'

describe('Everyday English Lab content', () => {
  it('ships the planned inventory and valid exercises', () => {
    const valid = validateEverydayContent(everyday, new Set(curriculum.patterns.map(({ id }) => id)))
    expect(valid.words).toHaveLength(60)
    expect(categoryIds.map((category) => valid.words.filter(({ categories }) => categories[0] === category).length))
      .toEqual([9, 7, 8, 7, 7, 8, 7, 7])
    expect(valid.phrases).toHaveLength(30)
    expect(valid.collocations).toHaveLength(30)
    expect(valid.sentencePatterns).toHaveLength(30)
    expect(valid.comparisons).toHaveLength(17)
    expect(valid.activities.length).toBeGreaterThanOrEqual(14)
  })

  it('queries English headwords, inflected forms, Thai and phrasal verb groups', () => {
    const words = createEverydaySearch(everyday.words)
    const phrases = createEverydaySearch(everyday.phrases)
    expect(words('POUR')[0].term).toBe('pour')
    expect(words('poured').map(({ term }) => term)).toContain('pour')
    expect(words('ริน').map(({ term }) => term)).toContain('pour')
    expect(phrases('take off')[0].term).toBe('take off')
    expect(phrases('เครื่องบินออกจากพื้น').find(({ term }) => term === 'take off')?.matchedSense.id).toBe('flight')
    expect(phrases('take').filter(({ baseVerb }) => baseVerb === 'take')).toHaveLength(4)
  })

  it('builds a sentence from independently selected fragments in their intended positions', () => {
    expect(buildExpansion('I like coffee.', [
      { replace: { from: 'like', to: 'really like' } },
      { before: 'I think' },
      { after: 'because it helps me relax' },
      { after: ', especially after work' },
    ])).toBe('I think I really like coffee because it helps me relax, especially after work.')
  })
})
