import { lessons, patterns } from './m1'
import { foundationLessons, foundationPatterns } from './m2-foundation-time'
import { wordLessons, wordPatterns } from './word-placement'
import { connectorLessons, connectorPatterns } from './connecting-natural'
import { naturalLessons, naturalPatterns } from './natural'
import { questionsLessons, questionsPatterns } from './questions-expansion'
import { conversationLessons, conversationPatterns } from './conversation-listening'
import { additionalPatterns } from './additional-patterns'
import type { Curriculum } from '../domain/content'

export const curriculum: Curriculum = {
  version: 1,
  lessons: [...lessons, ...foundationLessons, ...wordLessons, ...connectorLessons, ...naturalLessons, ...questionsLessons, ...conversationLessons],
  patterns: [...patterns, ...foundationPatterns, ...wordPatterns, ...connectorPatterns, ...naturalPatterns, ...questionsPatterns, ...conversationPatterns, ...additionalPatterns],
}
export const lessonById = new Map(curriculum.lessons.map((lesson) => [lesson.id, lesson]))
export const patternById = new Map(curriculum.patterns.map((pattern) => [pattern.id, pattern]))
