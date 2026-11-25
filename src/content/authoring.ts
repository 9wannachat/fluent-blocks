import type { Exercise, Lesson, Pattern } from '../domain/content'

export type PracticeLine = [prompt: string, answer: string | string[], hint: string, explanation: string, options?: string[]]
export type PatternLine = [
  template: string, meaning: string, intent: string, slot: string, constraint: string,
  first: [en: string, th: string, context: string], second: [en: string, th: string, context: string],
  placement: string, register?: Pattern['register'], alternative?: string,
]

export function authorLesson(
  id: string, en: string, th: string, hook: string, objective: string, concept: string, formula: string,
  examples: [string, string, string][], contrasts: [string, string, string][], dialogue: [string, string][],
  mistakes: [string, string, string][], practice: PracticeLine[], speaking: string, library: PatternLine[],
  prerequisites: string[] = [],
): { lesson: Lesson; patterns: Pattern[] } {
  const patterns: Pattern[] = library.map(([template, meaning, intent, slot, constraint, first, second, placement, register, alternative], index) => ({
    id: `p-${id}-${index + 1}`, template, meaning, intent, register: register ?? 'neutral',
    slots: slot ? [{ name: slot, rule: constraint, example: first[0] }] : [],
    examples: [first, second].map(([en, th, note]) => ({ en, th, note })),
    why: constraint, placement, alternatives: alternative ? [alternative] : [], mistakes: [], lessons: [id], tags: [en, th, intent],
  }))
  const sequence: Exercise['kind'][] = ['choice', 'fill', 'transform', 'translate', 'repair']
  return {
    lesson: {
      id, module: Number(id.split('-')[0].slice(1)), titleEn: en, titleTh: th, hook, objective, concept, formula,
      minutes: 10, prerequisites, tags: [en, th],
      examples: examples.map(([en, th, note]) => ({ en, th, note })),
      contrasts: contrasts.map(([a, b, note]) => ({ a, b, note })),
      dialogue: dialogue.map(([en, th]) => ({ en, th })),
      mistakes: mistakes.map(([wrong, right, note]) => ({ wrong, right, note })),
      exercises: practice.map(([prompt, answer, hint, explanation, options], index) => ({
        id: `${id}-exercise-${index + 1}`, prompt, answers: typeof answer === 'string' ? [answer] : answer,
        kind: options ? 'choice' : sequence[index] === 'choice' ? 'fill' : sequence[index], hint, explanation, options,
        difficulty: index === 0 ? 'recognition' : index < 3 ? 'guided' : 'production',
      })),
      speaking, review: patterns.map((pattern) => pattern.id),
    },
    patterns,
  }
}
