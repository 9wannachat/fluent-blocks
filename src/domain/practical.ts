import { z } from 'zod'
import { exerciseSchema, lessonSchema } from './content'
import { matchesAnswer, normalizeAnswer } from './feedback'
import { scenarioSchema } from '../content/scenarios'

const line = z.string().trim().min(1)
const stableId = line.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
export const practicalModuleIds = ['travel', 'dining', 'shopping', 'problems'] as const
export const practicalLessonSchema = lessonSchema.omit({ module: true, prerequisites: true, review: true }).extend({
  id: stableId.regex(/^practical-(travel|dining|shopping|problems)-/),
  moduleId: z.enum(practicalModuleIds),
  vocabulary: z.array(z.object({
    term: line,
    pronunciation: line,
    meaning: line,
    context: line,
    forms: z.array(line).min(1).optional(),
    register: z.enum(['polite', 'formal', 'neutral', 'casual', 'informal']).optional(),
    variant: z.enum(['UK', 'US']).optional(),
  })).min(2),
  collocations: z.array(line).min(1),
  phrasalVerbs: z.array(line).min(1),
  relatedIds: z.array(stableId),
})

export const practicalScenarioSchema = scenarioSchema.safeExtend({
  id: stableId.regex(/^practical-scenario-/),
  objectiveId: stableId.regex(/^practical-(travel|dining|shopping|problems)-/),
  branches: z.array(scenarioSchema.shape.branches.element.extend({ exercise: exerciseSchema })).min(2),
})

export type PracticalLesson = z.infer<typeof practicalLessonSchema>
export type PracticalScenario = z.infer<typeof practicalScenarioSchema>
export type PracticalModuleId = (typeof practicalModuleIds)[number]

const counts: Record<PracticalModuleId, number> = { travel: 8, dining: 11, shopping: 9, problems: 9 }

export function validatePracticalContent(
  candidate: unknown,
  relatedIds: ReadonlySet<string>,
  previousExerciseIds: ReadonlySet<string> = new Set(),
  previousScenarioIds: ReadonlySet<string> = new Set(),
) {
  const pack = z.object({
    version: z.literal(1),
    lessons: z.array(practicalLessonSchema),
    scenarios: z.array(practicalScenarioSchema),
  }).parse(candidate)
  const lessons = new Map(pack.lessons.map((lesson) => [lesson.id, lesson]))
  if (lessons.size !== pack.lessons.length) throw new Error('Duplicate practical lesson ID')
  const scenarioIds = new Set(previousScenarioIds)
  const exerciseIds = new Set(previousExerciseIds)
  const scenariosPerModule = new Map<PracticalModuleId, number>()

  function validateExercise(exercise: z.infer<typeof exerciseSchema>) {
    if (exerciseIds.has(exercise.id)) throw new Error(`Duplicate exercise: ${exercise.id}`)
    exerciseIds.add(exercise.id)
    for (const response of Object.keys(exercise.feedback ?? {})) {
      if (matchesAnswer(response, exercise.answers)) throw new Error(`Feedback marks an accepted answer wrong: ${exercise.id}`)
    }
    if (!exercise.options) return
    const { options, answers, kind } = exercise
    if (kind === 'order') {
      const key = (words: string) => normalizeAnswer(words).split(' ').sort().join(' ')
      if (!answers.some((answer) => key(answer) === key(options.join(' ')))) throw new Error(`Unusable order tiles: ${exercise.id}`)
    } else {
      if (new Set(options.map(normalizeAnswer)).size !== options.length) throw new Error(`Duplicate options: ${exercise.id}`)
      if (!options.some((option) => matchesAnswer(option, answers))) throw new Error(`No selectable answer: ${exercise.id}`)
    }
  }

  for (const lesson of pack.lessons) {
    if (!lesson.id.startsWith(`practical-${lesson.moduleId}-`)) throw new Error(`Wrong module: ${lesson.id}`)
    if (new Set(lesson.examples.map(({ en }) => normalizeAnswer(en))).size !== lesson.examples.length) throw new Error(`Duplicate examples: ${lesson.id}`)
    for (const id of lesson.relatedIds) {
      if (id === lesson.id || !(relatedIds.has(id) || lessons.has(id))) throw new Error(`Unknown related item: ${lesson.id}/${id}`)
    }
    for (const exercise of lesson.exercises) validateExercise(exercise)
  }
  for (const scenario of pack.scenarios) {
    const lesson = lessons.get(scenario.objectiveId)
    if (!lesson) throw new Error(`Unknown scenario lesson: ${scenario.id}`)
    if (scenarioIds.has(scenario.id)) throw new Error(`Duplicate scenario: ${scenario.id}`)
    scenarioIds.add(scenario.id)
    scenariosPerModule.set(lesson.moduleId, (scenariosPerModule.get(lesson.moduleId) ?? 0) + 1)
    for (const branch of scenario.branches) {
      if (!Object.keys(branch.exercise.feedback ?? {}).length) throw new Error(`Missing targeted scenario feedback: ${scenario.id}/${branch.id}`)
      validateExercise(branch.exercise)
    }
  }
  for (const id of practicalModuleIds) {
    if (pack.lessons.filter(({ moduleId }) => moduleId === id).length !== counts[id]) throw new Error(`Incomplete lesson inventory: ${id}`)
    if (scenariosPerModule.get(id) !== 3) throw new Error(`Expected three scenarios: ${id}`)
  }
  return pack
}
