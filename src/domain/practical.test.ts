import { describe, expect, it } from 'vitest'
import { curriculum } from '../content'
import { everydayRelated } from '../content/everyday'
import { practical, practicalLessonById, practicalReviewId } from '../content/practical'
import { resolveReviewItem } from '../content/review-items'
import { scenarios } from '../content/scenarios'
import { buildSentence, defaultGrammarInput } from './grammar'
import { validatePracticalContent } from './practical'

const links = new Set([...curriculum.lessons.map(({ id }) => id), ...curriculum.patterns.map(({ id }) => id), ...everydayRelated.keys()])

describe('Practical English', () => {
  it('validates the complete catalog and preserves scenario IDs', () => {
    const catalog = validatePracticalContent(practical, links, new Set(), new Set(scenarios.map(({ id }) => id)))
    expect(catalog.lessons).toHaveLength(37)
    expect(catalog.scenarios).toHaveLength(12)
    expect(catalog.scenarios.every((scenario) => scenario.branches.every((branch) => branch.exercise.answers.length > 0))).toBe(true)
  })

  it('rejects a roleplay attached to a missing lesson', () => {
    expect(() => validatePracticalContent({
      ...practical, scenarios: [{ ...practical.scenarios[0], objectiveId: 'practical-travel-missing' }, ...practical.scenarios.slice(1)],
    }, links)).toThrow(/Unknown scenario lesson/)
  })

  it('resolves a lesson review into an existing review queue card', () => {
    const lesson = practicalLessonById.get(practical.lessons[0].id)!
    expect(resolveReviewItem(practicalReviewId(lesson.id))).toMatchObject({
      term: lesson.examples[0].en,
      meaning: lesson.examples[0].th,
      to: `/learn/practical/${lesson.moduleId}/${lesson.id}`,
    })
  })

  it('generates the ingredient question with does and the base verb', () => {
    const output = buildSentence({ ...defaultGrammarInput, subject: 'it', kind: 'yesNo', predicate: 'containPeanuts' })
    expect(output.english).toBe('Does it contain peanuts?')
  })
})
