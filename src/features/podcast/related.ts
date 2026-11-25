import type { Pattern } from '../../domain/content'

const common = new Set(['a', 'an', 'the', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'to', 'of', 'and', 'or', 'in', 'is', 'are'])

function words(text: string): Set<string> {
  return new Set((text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])
    .filter((word) => !common.has(word)))
}

export function findRelatedPatterns(text: string, patterns: readonly Pattern[]): Pattern[] {
  const input = words(text)
  if (input.size === 0) return []
  return patterns.map((pattern) => {
    const template = words(pattern.template)
    const tags = words(pattern.tags.join(' '))
    let score = 0
    for (const word of input) {
      if (template.has(word)) score += 3
      if (tags.has(word)) score += 1
    }
    return { pattern, score }
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 6).map(({ pattern }) => pattern)
}

export function timestampLabel(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

export function parseTimestamp(value: string): number | null {
  const timestamp = value.trim()
  if (!timestamp) return null
  if (/^\d+$/.test(timestamp)) return Number(timestamp)
  const parts = timestamp.split(':')
  if (!/^\d+(?::[0-5]\d){1,2}$/.test(timestamp)) throw new Error('ใส่เวลาต้นทางเป็นนาที:วินาที หรือจำนวนวินาที')
  return parts.reduce((seconds, part) => seconds * 60 + Number(part), 0)
}
