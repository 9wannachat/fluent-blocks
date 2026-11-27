import { practicalWorkshops } from '../src/content/practical/workshops'
import { practical } from '../src/content/practical'
import { everydayRelated } from '../src/content/everyday'
import { validatePracticalContent } from '../src/domain/practical'
import { everyday } from '../src/content/everyday'
import { validateEverydayContent, validateExpansion } from '../src/domain/everyday'
import { curriculum } from '../src/content'
import { modules } from '../src/content/modules'
import { scenarios, scenarioSchema } from '../src/content/scenarios'
import { curriculumSchema } from '../src/domain/content'
import { matchesAnswer, normalizeAnswer } from '../src/domain/feedback'

const { lessons, patterns } = curriculumSchema.parse(curriculum)

function unique(values: string[], label: string) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index)
  if (duplicates.length) throw new Error(`Duplicate ${label}: ${[...new Set(duplicates)].join(', ')}`)
}

function checkReferences(values: string[], landings: Map<string, unknown>, owner: string) {
  for (const value of values) if (!landings.has(value)) throw new Error(`${owner}: missing reference ${value}`)
}

const lessonIds = new Map(lessons.map((lesson) => [lesson.id, lesson]))
const patternIds = new Map(patterns.map((pattern) => [pattern.id, pattern]))
unique(lessons.map((lesson) => lesson.id), 'lesson IDs')
unique(patterns.map((pattern) => pattern.id), 'pattern IDs')
unique(patterns.map((pattern) => normalizeAnswer(pattern.template)), 'pattern templates')
unique(lessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id)), 'exercise IDs')

function hasCycle(id: string, chain = new Set<string>()): boolean {
  if (chain.has(id)) return true
  return lessonIds.get(id)!.prerequisites.some((parent) => hasCycle(parent, new Set([...chain, id])))
}

for (const lesson of lessons) {
  checkReferences(lesson.prerequisites, lessonIds, lesson.id)
  checkReferences(lesson.review, patternIds, lesson.id)
  unique(lesson.examples.map((example) => normalizeAnswer(example.en)), `${lesson.id} examples`)
  for (const exercise of lesson.exercises) {
    if (exercise.options && exercise.kind !== 'order') unique(exercise.options.map(normalizeAnswer), `${exercise.id} options`)
    if (exercise.options && exercise.kind === 'order') {
      const key = (items: string[]) => items.flatMap((item) => normalizeAnswer(item).split(' ')).sort().join(' ')
      if (!exercise.answers.some((answer) => key([answer]) === key(exercise.options!))) {
        throw new Error(`${exercise.id}: order tiles cannot form an accepted answer`)
      }
    }
    if (exercise.options && exercise.kind !== 'order' &&
        !exercise.options.some((option) => matchesAnswer(option, exercise.answers))) {
      throw new Error(`${exercise.id}: no answer can be selected`)
    }
  }
}

for (const lesson of lessons) if (hasCycle(lesson.id)) throw new Error(`${lesson.id}: prerequisite cycle`)
for (const pattern of patterns) {
  checkReferences(pattern.lessons, lessonIds, pattern.id)
  unique(pattern.examples.map((example) => normalizeAnswer(example.en)), `${pattern.id} examples`)
}
for (const { id, count } of modules) {
  if (lessons.filter(({ module }) => module === id).length !== count) throw new Error(`Module ${id}: incomplete lesson inventory`)
}
if (patterns.length < 300) throw new Error('V1 requires at least 300 distinct patterns')
if (scenarios.length !== 10) throw new Error('V1 requires ten branching scenarios')
unique(scenarios.map(({ id }) => id), 'scenario IDs')
for (const item of scenarios) {
  scenarioSchema.parse(item)
  checkReferences([item.objectiveId], lessonIds, item.id)
}
console.log(`Validated ${lessons.length} lessons and ${patterns.length} patterns, and ${scenarios.length} scenarios`)

const lab = validateEverydayContent(everyday, new Set(patternIds.keys()),
  new Set(lessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id))))
console.log(`Everyday English Lab: ${lab.words.length} words, ${lab.phrases.length} verb phrases, ${lab.collocations.length} collocations, ${lab.sentencePatterns.length} sentence patterns, ${lab.comparisons.length} comparisons, ${lab.activities.length} contextual activities`)

const practicalPack = validatePracticalContent(practical,
  new Set([...lessonIds.keys(), ...patternIds.keys(), ...everydayRelated.keys()]),
  new Set([
    ...lessons.flatMap((lesson) => lesson.exercises.map(({ id }) => id)),
    ...[...lab.words, ...lab.phrases].flatMap((item) => item.exercises.map(({ id }) => id)),
    ...[...lab.comparisons, ...lab.activities, ...lab.workshops].map(({ exercise }) => exercise.id),
  ]),
  new Set(scenarios.map(({ id }) => id)))
console.log(`Practical English: ${practicalPack.lessons.length} lessons and ${practicalPack.scenarios.length} scenarios`)

for (const [lessonId, expansion] of Object.entries(practicalWorkshops)) {
  if (!practicalPack.lessons.some(({ id }) => id === lessonId)) throw new Error(`Workshop has no lesson: ${lessonId}`)
  validateExpansion(expansion)
}
