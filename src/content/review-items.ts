import { patternById } from './index'
import { practicalReviewItems } from './practical'
import { everydayReviewItems } from './everyday'

export type ReviewItem = {
  id: string
  meaning: string
  context: string
  to?: string
  term: string
  examples: { en: string; th: string; note: string }[]
}

export function resolveReviewItem(id: string): ReviewItem | undefined {
  const pattern = patternById.get(id)
  if (pattern) return { id, meaning: pattern.meaning, context: pattern.intent, term: pattern.template, examples: pattern.examples }
  return everydayReviewItems.get(id) ?? practicalReviewItems.get(id)
}
