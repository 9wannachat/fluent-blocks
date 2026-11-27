import { z } from 'zod'

const line = z.string().trim().min(1)
const id = line.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const example = z.object({ en: line, th: line, note: line })
const mistake = z.object({ wrong: line, right: line, note: line })
const contrast = z.object({ a: line, b: line, note: line })
const slot = z.object({ name: line, rule: line, example: line })

export const exerciseSchema = z.object({
  id,
  kind: z.enum(['choice', 'order', 'fill', 'auxiliary', 'tense', 'transform', 'translate', 'connector', 'expand', 'repair', 'conversation', 'speaking']),
  prompt: line,
  options: z.array(line).min(2).optional(),
  answers: z.array(line).min(1),
  hint: line,
  explanation: line,
  feedback: z.record(line, line).optional(),
  selfCheck: z.array(line).min(1).optional(),
  difficulty: z.enum(['recognition', 'guided', 'production']).optional(),
})

export const lessonSchema = z.object({
  id,
  module: z.number().int().min(1).max(10),
  titleEn: line, titleTh: line, hook: line, objective: line, concept: line, formula: line,
  minutes: z.number().int().positive(),
  prerequisites: z.array(id),
  tags: z.array(line).min(1),
  examples: z.array(example).min(5),
  contrasts: z.array(contrast).min(2),
  dialogue: z.array(z.object({ en: line, th: line })).min(2),
  mistakes: z.array(mistake).min(1),
  exercises: z.array(exerciseSchema).min(5),
  speaking: line,
  review: z.array(id).min(1),
})

export const patternSchema = z.object({
  id, template: line, meaning: line, intent: line,
  register: z.enum(['neutral', 'informal', 'formal']),
  slots: z.array(slot),
  examples: z.array(example).min(2),
  why: line, placement: line, alternatives: z.array(line), mistakes: z.array(mistake),
  lessons: z.array(id).min(1), tags: z.array(line).min(1),
})

export const curriculumSchema = z.object({
  version: z.literal(1),
  lessons: z.array(lessonSchema).min(1),
  patterns: z.array(patternSchema).min(1),
})

export type Exercise = z.infer<typeof exerciseSchema>
export type Lesson = z.infer<typeof lessonSchema>
export type Pattern = z.infer<typeof patternSchema>
export type Curriculum = z.infer<typeof curriculumSchema>
