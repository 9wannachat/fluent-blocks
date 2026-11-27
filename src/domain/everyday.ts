import { z } from 'zod'
import { exerciseSchema, type Exercise } from './content'
import { matchesAnswer, normalizeAnswer } from './feedback'

const text = z.string().trim().min(1)
const id = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const prefixed = (prefix: string) => id.refine((value) => value.startsWith(`everyday-${prefix}-`))
const example = z.object({ en: text, th: text, note: text })
const mistake = z.object({ wrong: text, right: text, note: text })
const register = z.enum(['neutral', 'informal', 'formal'])
const difficulty = z.enum(['starter', 'intermediate', 'stretch'])
export const categoryIds = ['daily-actions', 'physical-movements', 'emotions', 'clothing', 'household', 'cooking', 'social', 'sounds'] as const
const category = z.enum(categoryIds)
const senseSchema = z.object({
  id, meaning: text, context: text, when: text, situations: z.array(text).min(1), register,
  collocations: z.array(text).min(1), patterns: z.array(text).min(1),
  examples: z.array(example).min(2), similar: z.array(z.object({ term: text, note: text })).min(1),
  mistakes: z.array(mistake).min(1),
})
const phraseSenseSchema = senseSchema.extend({
  structure: z.enum(['phrasal', 'prepositional', 'phrasal-prepositional', 'verb-combination']),
  object: z.enum(['separable', 'fixed', 'none']),
  placement: text,
  pronoun: text,
})
export const wordSchema = z.object({
  id: prefixed('word'), term: text, ipa: text.optional(), thaiReading: text, partOfSpeech: text, level: difficulty,
  categories: z.array(category).min(1),
  forms: z.array(z.object({ label: text, word: text })).min(1),
  senses: z.array(senseSchema).min(1), exercises: z.array(exerciseSchema).min(2),
})
export const phraseSchema = z.object({
  id: prefixed('phrase'), term: text, baseVerb: text, level: difficulty,
  senses: z.array(phraseSenseSchema).min(1), exercises: z.array(exerciseSchema).min(1),
})
export const comparisonSchema = z.object({
  id: prefixed('compare'), title: text, situation: text, distinction: text, naturalChoice: text,
  examples: z.array(example).min(2), mistakes: z.array(mistake).min(1), exercise: exerciseSchema,
})
const combinationFields = {
  term: text, meaning: text, context: text, usage: text, level: difficulty, examples: z.array(example).min(2),
  patternId: id.optional(),
}
const collocationSchema = z.object({ id: prefixed('collocation'), ...combinationFields })
const patternSchema = z.object({ id: prefixed('pattern'), ...combinationFields })
export const activityTypes = ['recognition', 'word-selection', 'construction', 'transformation', 'comparison', 'expansion', 'production'] as const
export const activitySchema = z.object({
  id: prefixed('activity'), type: z.enum(activityTypes), title: text, situation: text, exercise: exerciseSchema,
})
const fragments = z.object({
  before: text.optional(),
  after: text.optional(),
  replace: z.object({ from: text, to: text }).optional(),
}).refine(({ before, after, replace }) => Boolean(before || after || replace))
export const expansionSchema = z.object({
  base: text, meaning: text,
  steps: z.array(z.object({ id, title: text, choices: z.array(z.object({ id, label: text, fragments, explanation: text })).min(2) })).min(2),
})
const connectionSchema = z.object({ itemId: id, senseId: id, relatedIds: z.array(text.regex(/^[a-z0-9-]+(?::[a-z0-9-]+)?$/)), workshopId: id.optional() })
const workshopSchema = z.object({
  id, title: text, situation: text, builderPreset: z.enum(['pour', 'wear']).optional(),
  expansion: expansionSchema, exercise: exerciseSchema,
})
export type EverydayConnection = z.infer<typeof connectionSchema>
export type EverydayWorkshop = z.infer<typeof workshopSchema>

export const everydaySchema = z.object({
  version: z.literal(1), words: z.array(wordSchema).min(60), phrases: z.array(phraseSchema).min(30),
  comparisons: z.array(comparisonSchema).min(17), collocations: z.array(collocationSchema).min(30),
  sentencePatterns: z.array(patternSchema).min(30), activities: z.array(activitySchema).min(7), expansion: expansionSchema,
  connections: z.array(connectionSchema), workshops: z.array(workshopSchema),
})
export type CategoryId = (typeof categoryIds)[number]
export type EverydayWord = z.infer<typeof wordSchema>
export type EverydayPhrase = z.infer<typeof phraseSchema>
export type EverydayComparison = z.infer<typeof comparisonSchema>
export type EverydayCombination = z.infer<typeof patternSchema>
export type EverydayActivity = z.infer<typeof activitySchema>
export type Expansion = z.infer<typeof expansionSchema>
export type Sense = z.infer<typeof senseSchema>
export type PhraseSense = z.infer<typeof phraseSenseSchema>
export type EverydayDataset = z.infer<typeof everydaySchema>

export function buildExpansion(base: string, parts: readonly z.infer<typeof fragments>[]): string {
  const punctuation = base.match(/[.!?]$/)?.[0] ?? '.'
  let sentence = base.replace(/[.!?]$/, '')
  for (const { before, after, replace } of parts) {
    if (replace) {
      if (!sentence.includes(replace.from)) throw new Error(`Expansion replacement not found: ${replace.from}`)
      sentence = sentence.replace(replace.from, replace.to)
    }
    if (before) {
      // In English, the start of an embedded clause usually loses sentence capitalization, except I.
      const embedded = /^I(?:\b|[’'])/.test(sentence) ? sentence : sentence[0].toLowerCase() + sentence.slice(1)
      sentence = `${before} ${embedded}`
    }
    if (after) sentence += /^[,;:]/.test(after) ? after : ` ${after}`
  }
  return sentence + punctuation
}

export function validateExpansion(expansion: Expansion) {
  const parsed = expansionSchema.parse(expansion)
  if (new Set(parsed.steps.map(({ id }) => id)).size !== parsed.steps.length) throw new Error('Duplicate expansion step')
  let paths: z.infer<typeof fragments>[][] = [[]]
  for (const step of parsed.steps) {
    if (new Set(step.choices.map(({ id }) => id)).size !== step.choices.length) throw new Error(`Duplicate expansion choice in ${step.id}`)
    paths = paths.flatMap((path) => [path, ...step.choices.map((choice) => [...path, choice.fragments])])
  }
  for (const path of paths) buildExpansion(parsed.base, path)
}

export function validateEverydayContent(candidate: unknown, patternIds: ReadonlySet<string>, previousExerciseIds: ReadonlySet<string> = new Set()) {
  const dataset = everydaySchema.parse(candidate)
  const { words, phrases, comparisons, collocations, sentencePatterns, activities, expansion, connections, workshops } = dataset
  function unique(label: string, values: readonly string[]) {
    const seen = new Set<string>()
    for (const value of values) {
      if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`)
      seen.add(value)
    }
  }

  const entities = [...words, ...phrases, ...comparisons, ...collocations, ...sentencePatterns, ...activities]
  unique('Everyday ID', entities.map(({ id }) => id))
  unique('workshop ID', workshops.map(({ id }) => id))
  unique('sense connection', connections.map(({ itemId, senseId }) => `${itemId}:${senseId}`))
  const entries = new Map([...words, ...phrases].map((item) => [item.id, item]))
  const entityIds = new Set(entities.map(({ id }) => id))
  for (const link of connections) {
    if (!entries.get(link.itemId)?.senses.some(({ id }) => id === link.senseId)) throw new Error(`Unknown connected sense: ${link.itemId}/${link.senseId}`)
    if (link.workshopId && !workshops.some(({ id }) => id === link.workshopId)) throw new Error(`Unknown workshop: ${link.workshopId}`)
    unique('related ID', link.relatedIds)
    for (const id of link.relatedIds) {
      const [target, sense] = id.split(':')
      if (!entityIds.has(target) || target === link.itemId ||
          (sense && !entries.get(target)?.senses.some(({ id }) => id === sense))) throw new Error(`Invalid related ID: ${id}`)
    }
  }
  // A phrase may also appear as a word entry where the Lab teaches its pronunciation and forms.
  for (const collection of [words, phrases, collocations, sentencePatterns]) {
    unique('Everyday term', collection.map(({ term }) => normalizeAnswer(term)))
  }
  for (const value of categoryIds) if (!words.some(({ categories }) => categories.includes(value))) throw new Error(`Empty category: ${value}`)
  for (const word of words) unique(`${word.id} category`, word.categories)
  for (const item of [...words, ...phrases]) {
    unique(`${item.id} sense`, item.senses.map(({ id }) => id))
    for (const sense of item.senses) unique(`${item.id} example`, sense.examples.map(({ en }) => normalizeAnswer(en)))
  }
  for (const phrase of phrases) {
    if (!phrase.term.toLowerCase().startsWith(`${phrase.baseVerb.toLowerCase()} `)) throw new Error(`Invalid base verb: ${phrase.id}`)
    for (const sense of phrase.senses) {
      if (sense.object === 'separable' && sense.structure !== 'phrasal') throw new Error(`Invalid separable structure: ${phrase.id}/${sense.id}`)
    }
  }
  for (const item of [...collocations, ...sentencePatterns]) {
    if (item.patternId && !patternIds.has(item.patternId)) throw new Error(`Unknown linked pattern: ${item.id}/${item.patternId}`)
  }
  const exercises: Exercise[] = [
    ...[...words, ...phrases].flatMap((item) => item.exercises),
    ...[...comparisons, ...activities, ...workshops].map(({ exercise }) => exercise),
  ]
  unique('exercise ID', [...previousExerciseIds, ...exercises.map(({ id }) => id)])
  for (const exercise of exercises) {
    const { id, options, answers, kind } = exercise
    if (!id.startsWith('everyday-')) throw new Error(`Exercise has no Everyday namespace: ${id}`)
    if (!options) continue
    if (kind === 'order') {
      const tokens = normalizeAnswer(options.join(' ')).split(' ').sort().join(' ')
      if (!answers.some((answer) => normalizeAnswer(answer).split(' ').sort().join(' ') === tokens)) throw new Error(`Incomplete order tiles: ${id}`)
    } else if (!options.some((option) => matchesAnswer(option, answers))) {
      throw new Error(`No selectable answer: ${id}`)
    }
  }
  for (const type of activityTypes) if (!activities.some((item) => item.type === type)) throw new Error(`Missing practice type: ${type}`)
  for (const lesson of [expansion, ...workshops.map((workshop) => workshop.expansion)]) validateExpansion(lesson)
  return dataset
}
