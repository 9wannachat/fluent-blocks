export function normalizeAnswer(answer: string): string {
  return answer.normalize('NFKC').toLowerCase().replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N}'\s]/gu, ' ').trim().replace(/\s+/g, ' ')
}

export function matchesAnswer(answer: string, alternatives: string[]): boolean {
  const normalized = normalizeAnswer(answer)
  return normalized.length > 0 && alternatives.some((alternative) => normalizeAnswer(alternative) === normalized)
}

export function getAnswerFeedback(answer: string, feedback: Record<string, string> = {}) {
  const normalized = normalizeAnswer(answer)
  return Object.entries(feedback).find(([variant]) => normalizeAnswer(variant) === normalized)?.[1]
}
