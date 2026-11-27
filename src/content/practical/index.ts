import type { PracticalLesson, PracticalModuleId } from '../../domain/practical'
import { lessonById, patternById } from '../index'
import { resolveEverydayRelated } from '../everyday'
import { travelLessons, travelScenarios } from './travel'
import { diningLessons, diningScenarios } from './dining'
import { shoppingLessons, shoppingScenarios } from './shopping'
import { problemsLessons, problemsScenarios } from './problems'

export const practicalPath = '/learn/practical'

export const practicalModules: { id: PracticalModuleId; title: string; description: string }[] = [
  { id: 'travel', title: 'Travel English Lab', description: 'เดินทาง เช็กอิน พัก และถามทาง' },
  { id: 'dining', title: 'Restaurant & Dining Lab', description: 'จองโต๊ะ ถามส่วนผสม สั่งอาหาร และจ่ายเงิน' },
  { id: 'shopping', title: 'Shopping English Lab', description: 'ถามราคา ลองเสื้อผ้า เปลี่ยนสินค้า และติดตามพัสดุ' },
  { id: 'problems', title: 'Travel Problems & Emergency Lab', description: 'บอกว่าเกิดอะไรขึ้นและขอความช่วยเหลือให้คนฟังเข้าใจ' },
]

export const practical = {
  version: 1 as const,
  lessons: [...travelLessons, ...diningLessons, ...shoppingLessons, ...problemsLessons],
  scenarios: [...travelScenarios, ...diningScenarios, ...shoppingScenarios, ...problemsScenarios],
}

export const practicalLessonById = new Map(practical.lessons.map((lesson) => [lesson.id, lesson]))
export const practicalScenarioById = new Map(practical.scenarios.map((scenario) => [scenario.id, scenario]))
export const practicalLessonPath = ({ moduleId, id }: PracticalLesson) => `${practicalPath}/${moduleId}/${id}`
export const practicalReviewId = (lessonId: string) => `practical-review:${lessonId}`

export const practicalReviewItems = new Map(practical.lessons.map((lesson) => {
  const id = practicalReviewId(lesson.id)
  return [id, {
    id, meaning: lesson.examples[0].th, context: lesson.hook, term: lesson.examples[0].en,
    examples: lesson.examples.slice(0, 2), to: practicalLessonPath(lesson),
  }] as const
}))

export function resolvePracticalRelated(id: string) {
  const lesson = lessonById.get(id)
  if (lesson) return { title: lesson.titleTh, to: `/learn/${id}` }
  const pattern = patternById.get(id)
  if (pattern) return { title: pattern.template, to: `/reference/pattern/${id}` }
  const practicalLesson = practicalLessonById.get(id)
  if (practicalLesson) return { title: practicalLesson.titleTh, to: practicalLessonPath(practicalLesson) }
  return resolveEverydayRelated(id)
}
