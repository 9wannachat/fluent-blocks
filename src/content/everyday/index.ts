import type { CategoryId, EverydayDataset } from '../../domain/everyday'
import { words } from './words'
import { phrases } from './phrases'
import { comparisons } from './comparisons'
import { collocations, sentencePatterns } from './combinations'
import { connections, workshops } from './connections'
import { activities, expansion } from './activities'

export const everyday: EverydayDataset = { version: 1, words, phrases, comparisons, collocations, sentencePatterns, activities, expansion, connections, workshops }
export const categories: Record<CategoryId, string> = {
  'daily-actions': 'การกระทำในชีวิตประจำวัน',
  'physical-movements': 'การเคลื่อนไหว',
  emotions: 'อารมณ์และปฏิกิริยา',
  clothing: 'เสื้อผ้าและการแต่งตัว',
  household: 'งานบ้าน',
  cooking: 'ทำอาหาร',
  social: 'ปฏิสัมพันธ์กับคนอื่น',
  sounds: 'เสียงและการแสดงออก',
}
export const levels = { starter: 'เริ่มใช้', intermediate: 'ใช้คล่องขึ้น', stretch: 'ท้าทาย' } as const

export const everydayWordsById = new Map(words.map((item) => [item.id, item]))
export const everydayPhrasesById = new Map(phrases.map((item) => [item.id, item]))
export const everydayComparisonsById = new Map(comparisons.map((item) => [item.id, item]))
export const everydayCombinationsById = new Map([...collocations, ...sentencePatterns].map((item) => [item.id, item]))

export const senseKey = (itemId: string, senseId: string) => `${itemId}:${senseId}`
export const workshopById = new Map(workshops.map((item) => [item.id, item]))
export const connectionsBySense = new Map(connections.map((link) => [senseKey(link.itemId, link.senseId), link]))

export const everydayPath = '/practice/everyday'
export const everydayRelated = new Map<string, { title: string; to: string }>([
  ...words.map(({ id, term }) => [id, { title: term, to: `${everydayPath}/words/${id}` }] as const),
  ...phrases.map(({ id, term }) => [id, { title: term, to: `${everydayPath}/phrases/${id}` }] as const),
  ...comparisons.map(({ id, title }) => [id, { title, to: `${everydayPath}/comparisons/${id}` }] as const),
  ...[...collocations, ...sentencePatterns].map(({ id, term }) => [id, { title: term, to: `${everydayPath}/combinations/${id}${id.startsWith('everyday-pattern-') ? '?view=patterns' : ''}` }] as const),
  ...activities.map(({ id, title }) => [id, { title, to: `${everydayPath}/exercises?activity=${id}` }] as const),
])

export function resolveEverydayRelated(id: string) {
  const [itemId, senseId] = id.split(':')
  const item = everydayRelated.get(itemId)
  return item && senseId ? { ...item, to: `${item.to}?sense=${senseId}` } : item
}

export const everydayReviewItems = new Map(
  [...words, ...phrases].flatMap((item) => {
    const cards = item.senses.map((sense) => {
      const id = senseKey(item.id, sense.id)
      const to = `${everydayRelated.get(item.id)!.to}?sense=${sense.id}`
      return [id, { id, meaning: sense.meaning, context: sense.context, term: item.term, examples: sense.examples, to }] as const
    })
    return [[item.id, { ...cards[0][1], id: item.id }] as const, ...cards]
  }),
)
