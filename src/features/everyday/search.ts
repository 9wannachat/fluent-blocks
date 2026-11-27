import MiniSearch from 'minisearch'
import type { EverydayPhrase, EverydayWord } from '../../domain/everyday'

export type EverydaySearchHit<T extends Item = Item> = T & { matchedSense: T['senses'][number] }

type Item = EverydayPhrase | EverydayWord

function normalize(text: string) {
  return text.normalize('NFKC').toLowerCase().replace(/[‘’]/g, "'").trim()
}

const thaiWords = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('th', { granularity: 'word' }) : null
const tokenize = (text: string) => thaiWords
  ? [...thaiWords.segment(text)].filter((part) => part.isWordLike).map((part) => part.segment)
  : text.split(/[^\p{L}\p{M}\p{N}']+/u).filter(Boolean)

export function createEverydaySearch<ItemType extends Item>(items: readonly ItemType[]) {
  const documents = items.map((item) => ({
    id: item.id,
    term: normalize(item.term),
    detail: normalize([
      ...('baseVerb' in item ? [item.baseVerb] : [item.thaiReading, ...item.forms.map(({ word }) => word)]),
      ...item.senses.flatMap((sense) => [sense.meaning, sense.context, sense.when, ...sense.collocations, ...sense.situations]),
    ].join(' ')),
  }))
  const index = new MiniSearch({ fields: ['term', 'detail'], tokenize })
  index.addAll(documents)
  const byId = new Map(items.map((item) => [item.id, item]))

  return (rawQuery: string): EverydaySearchHit<ItemType>[] => {
    const query = normalize(rawQuery)
    if (!query) return items.map((item) => ({ ...item, matchedSense: item.senses[0] }))
    const exact = documents.filter(({ term }) => term === query)
    const phrase = documents.filter(({ term }) => term.includes(query))
    const detail = documents.filter((item) => item.detail.includes(query))
    const ranked = index.search(query, { prefix: true, combineWith: 'AND', boost: { term: 4 } })
    const ordered = new Set([...exact, ...phrase, ...ranked, ...detail].map(({ id }) => String(id)))
    const queryTokens = tokenize(query)
    return [...ordered].flatMap((id) => {
      const item = byId.get(id)
      if (!item) return []
      let matchedSense: ItemType['senses'][number] = item.senses[0]
      let best = 0
      if (normalize(item.term) !== query) for (const sense of item.senses) {
        const meaning = normalize(sense.meaning)
        const context = normalize([sense.context, sense.when, ...sense.situations, ...sense.collocations].join(' '))
        const score = (meaning.includes(query) ? 100 : 0) + (context.includes(query) ? 50 : 0)
          + queryTokens.filter((token) => meaning.includes(token)).length * 3
          + queryTokens.filter((token) => context.includes(token)).length
        if (score > best) { best = score; matchedSense = sense }
      }
      return [{ ...item, matchedSense }]
    })
  }
}
