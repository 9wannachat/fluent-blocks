import { scenarioFeedback } from './scenario-feedback'
import type { Exercise } from '../../domain/content'
import type { PracticalLesson, PracticalScenario } from '../../domain/practical'

type Example = [en: string, th: string, note: string]
type Turn = [en: string, th: string]
type Contrast = [a: string, b: string, note: string]
type Mistake = [wrong: string, right: string, note: string]
type Vocabulary = [term: string, pronunciation: string, meaning: string, context: string, extra?: Pick<PracticalLesson['vocabulary'][number], 'forms' | 'register' | 'variant'>]
type Drill = [kind: Exercise['kind'], prompt: string, answer: string | string[], explanation: string, options?: string[]]
export type LessonDraft = {
  key: string
  title: [en: string, th: string]
  hook: string
  objective: string
  concept: string
  formula: string
  vocabulary: Vocabulary[]
  collocations: string[]
  phrasalVerbs: string[]
  examples: Example[]
  contrasts: Contrast[]
  dialogue: Turn[]
  mistakes: Mistake[]
  exercises: Drill[]
  speaking: string
  relatedIds: string[]
}

const model = ([en, th, note]: Example) => ({ en, th, note })
const turn = ([en, th]: Turn) => ({ en, th })

export function practicalLesson(moduleId: PracticalLesson['moduleId'], draft: LessonDraft): PracticalLesson {
  const id = `practical-${moduleId}-${draft.key}`
  return {
    id, moduleId, titleEn: draft.title[0], titleTh: draft.title[1], hook: draft.hook, objective: draft.objective,
    concept: draft.concept, formula: draft.formula, minutes: 10, tags: [moduleId, draft.title[0], draft.title[1]],
    vocabulary: draft.vocabulary.map(([term, pronunciation, meaning, context, extra]) => ({ term, pronunciation, meaning, context, ...extra })),
    collocations: draft.collocations, phrasalVerbs: draft.phrasalVerbs,
    examples: draft.examples.map(model),
    contrasts: draft.contrasts.map(([a, b, note]) => ({ a, b, note })),
    dialogue: draft.dialogue.map(turn),
    mistakes: draft.mistakes.map(([wrong, right, note]) => ({ wrong, right, note })),
    exercises: draft.exercises.map(([kind, prompt, answer, explanation, options], index) => ({
      id: `${id}-e${index + 1}`, kind, prompt, answers: typeof answer === 'string' ? [answer] : answer,
      hint: draft.formula, explanation, ...(options ? { options } : {}),
      difficulty: options && kind !== 'order' ? 'recognition' : kind === 'translate' ? 'production' : 'guided',
    })),
    speaking: draft.speaking, relatedIds: draft.relatedIds,
  }
}

type Branch = [
  key: string, intent: string, reply: Example, followUp: Turn, models: Example[], hint: string, answers: string[],
]

export function practicalScenario(
  key: string, title: string, context: string, objectiveId: string, opening: Turn, branches: Branch[],
  speaking: PracticalScenario['speaking'],
): PracticalScenario {
  const id = `practical-scenario-${key}`
  return {
    id, title, context, objectiveId, firstTurn: turn(opening), speaking,
    branches: branches.map(([branchId, intent, reply, followUp, models, hint, answers]) => ({
      id: branchId, intent, reply: model(reply), followUp: turn(followUp), followModels: models.map(model), followHint: hint,
      exercise: {
        id: `${id}-${branchId}-reply`, kind: 'translate', prompt: hint, answers: [...models.map(([en]) => en), ...answers],
        hint, explanation: models.map(([, , note]) => note).join(' '), difficulty: 'production',
        feedback: scenarioFeedback[key]?.[branchId],
        selfCheck: ['ตอบตรงคำถามล่าสุด', 'ระบุข้อมูลที่อีกฝ่ายต้องใช้', 'ใช้น้ำเสียงเหมาะกับสถานการณ์'],
      },
    })),
  }
}
