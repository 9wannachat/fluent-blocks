import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowRight, BookOpen, BookOpenCheck, Cable, Layers, Shuffle, SpellCheck } from 'lucide-react'
import { BackLink, Example, Heading, Missing, Panel, RowLink, Speak } from '../../components/ui'
import { AlertMessage } from '../../components/ui/alert-message'
import { Button } from '../../components/ui/button'
import { Disclosure } from '../../components/ui/disclosure'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { NativeSelect, NativeSelectOption } from '../../components/ui/native-select'
import { Progress } from '../../components/ui/progress'
import { categories, connectionsBySense, everyday, everydayCombinationsById, everydayComparisonsById, everydayPath, everydayPhrasesById, everydayWordsById, levels, resolveEverydayRelated, senseKey } from '../../content/everyday'
import { type CategoryId, type EverydayWord, type PhraseSense, type Sense } from '../../domain/everyday'
import { db, enqueuePattern, summarizeObjectives, updateProgress } from '../../storage'
import { Exercise } from '../practice/Exercise'
import { createEverydaySearch, type EverydaySearchHit } from './search'

const sections = [
  { to: 'words', title: 'สำรวจคำศัพท์', description: 'ดูว่าคนใช้คำไหนในสถานการณ์จริง', icon: BookOpen },
  { to: 'phrases', title: 'Phrasal Verbs', description: 'แยกความหมายและลองวางกรรมให้ถูกตำแหน่ง', icon: Layers },
  { to: 'combinations', title: 'คำที่ใช้คู่กัน', description: 'ฝึก collocations และรูปประโยคพร้อมใช้', icon: Cable },
  { to: 'comparisons', title: 'เทียบคำที่ใช้สลับกันบ่อย', description: 'เลือกคำให้ตรงกับเจตนาและบริบท', icon: Shuffle },
  { to: 'exercises', title: 'ฝึกจากสถานการณ์', description: 'เลือกคำ เรียงประโยค และลองพูดด้วยคำของตัวเอง', icon: SpellCheck },
  { to: 'review', title: 'ทบทวนคำและวลี', description: 'นึกคำจากบริบทแล้วให้คะแนนว่าจำได้แค่ไหน', icon: BookOpenCheck },
]
const searchWords = createEverydaySearch(everyday.words)
const searchPhrases = createEverydaySearch(everyday.phrases)
const baseVerbs = [...new Set(everyday.phrases.map((item) => item.baseVerb))].sort()
const register = { neutral: 'ทั่วไป', informal: 'กันเอง', formal: 'ทางการ' }
const structures = {
  phrasal: 'กริยา + particle',
  prepositional: 'กริยา + บุพบท',
  'phrasal-prepositional': 'กริยา + particle + บุพบท',
  'verb-combination': 'กลุ่มกริยากับคำประกอบตามบริบท',
}

function LabBack({ to = everydayPath, children = 'Everyday English Lab' }: { to?: string; children?: string }) {
  return <BackLink to={to}>{children}</BackLink>
}

export function EverydayHome() {
  const done = useLiveQuery(async () => (await db.progress.toArray()).filter((item) => item.completed && everydayWordsById.has(item.lessonId)).length, [])
  return <div className="stack page">
    <BackLink to="/practice">ฝึกใช้</BackLink>
    <Heading title="Everyday English Lab" detail="เลือกคำจากสิ่งที่เกิดขึ้นจริง แล้วฝึกเอาคำนั้นไปพูดในประโยคของคุณ" />
    {done !== undefined && <Panel className="stack">
      <p>บันทึกว่าเรียนแล้ว <strong>{done} / {everyday.words.length}</strong> คำ</p>
      <Progress value={Math.round(done / everyday.words.length * 100)} aria-label="คำศัพท์ที่บันทึกว่าเรียนแล้ว" getValueLabel={() => `${done} จาก ${everyday.words.length} คำ`} />
    </Panel>}
    <div className="grid two">{sections.map(({ to, title, description, icon: Icon }) => <Panel className="lab-link" key={to}>
      <span className="lab-icon"><Icon size={22} aria-hidden="true" /></span><h2><Link to={`${everydayPath}/${to}`}>{title}</Link></h2>
      <p>{description}</p><ArrowRight className="lab-arrow" size={18} aria-hidden="true" />
    </Panel>)}</div>
  </div>
}

function useFilters() {
  const [params, setParams] = useSearchParams()
  function update(key: string, value: string) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }
  return { params, update }
}

function FilterSelect({ label, all, value, options, onChange }: {
  label: string; all: string; value: string; options: readonly [string, string][]; onChange: (value: string) => void
}) {
  return <Label>{label}<NativeSelect value={value} onChange={(event) => onChange(event.target.value)}>
    <NativeSelectOption value="">{all}</NativeSelectOption>
    {options.map(([id, text]) => <NativeSelectOption key={id} value={id}>{text}</NativeSelectOption>)}
  </NativeSelect></Label>
}

export function EverydayDiscovery({ mode }: { mode: 'words' | 'phrases' }) {
  const isWord = mode === 'words'
  const title = isWord ? 'สำรวจคำศัพท์' : 'Phrasal Verb Explorer'
  const { params, update } = useFilters()
  const query = params.get('q') ?? ''
  const group = params.get('group') ?? ''
  const level = params.get('level') ?? ''
  const learned = params.get('learned') ?? ''
  const progress = useLiveQuery(() => db.progress.toArray(), [])
  const completed = new Set(progress?.filter((item) => item.completed).map((item) => item.lessonId))
  const results = (isWord ? searchWords(query) : searchPhrases(query)).filter((item) => {
    if (level && item.level !== level) return false
    if (group && !('categories' in item ? item.categories.includes(group as CategoryId) : item.baseVerb === group)) return false
    return !learned || completed.has(item.id) === (learned === 'yes')
  })
  return <div className="stack page"><LabBack /><Heading title={title} detail={isWord ? 'ค้นคำแล้วเลือกจากสถานการณ์ที่อยากพูดถึง' : 'ค้นกลุ่มกริยาและดูตำแหน่งกรรมแยกตามความหมาย'} />
    <Panel className="stack">
      <Label>ค้นคำหรือความหมาย<Input type="search" value={query} onChange={(event) => update('q', event.target.value)} placeholder={isWord ? 'เช่น pour, ริน, กวาด' : 'เช่น take off, ถอด, take'} /></Label>
      <div className="grid two">
        <FilterSelect label={isWord ? 'หมวด' : 'กริยาหลัก'} all={isWord ? 'ทุกหมวด' : 'ทุกกริยา'} value={group} options={isWord ? Object.entries(categories) : baseVerbs.map((verb) => [verb, verb])} onChange={(value) => update('group', value)} />
        <FilterSelect label="ระดับความยาก" all="ทุกระดับ" value={level} options={Object.entries(levels)} onChange={(value) => update('level', value)} />
        <FilterSelect label="สถานะการเรียน" all="ทุกสถานะ" value={learned} options={[[ 'yes', 'เรียนแล้ว' ], [ 'no', 'ยังไม่ได้เรียน' ]]} onChange={(value) => update('learned', value)} />
      </div>
    </Panel>
    {learned && progress === undefined ? <Panel><p role="status">กำลังเปิดความคืบหน้า</p></Panel> :
      <DiscoveryResults key={`${mode}:${params}`} results={results} completed={completed} mode={mode} queryString={params.toString()} />}

  </div>
}

function senseQuery(queryString: string, id: string) {
  const params = new URLSearchParams(queryString)
  params.set('sense', id)
  return `?${params}`
}

function DiscoveryResults({ results, completed, mode, queryString }: {
  results: EverydaySearchHit[]; completed: Set<string>; mode: 'words' | 'phrases'; queryString: string
}) {
  const [limit, setLimit] = useState(24)
  return <Panel className="stack"><h2>ผลการค้นหา <small aria-live="polite">{results.length} รายการ</small></h2>
    {results.length ? <ul className="clean lesson-list">{results.slice(0, limit).map((item) =>
      <RowLink key={item.id} to={`${everydayPath}/${mode}/${item.id}${senseQuery(queryString, item.matchedSense.id)}`} subtitle={item.matchedSense.meaning}>
        <span lang="en">{item.term}</span>{completed.has(item.id) && <small className="everyday-status">เรียนแล้ว</small>}
      </RowLink>)}</ul> : <p>ไม่พบรายการ ลองเปลี่ยนคำค้นหรือตัวกรอง</p>}
    {results.length > limit && <div className="actions"><Button type="button" variant="outline" onClick={() => setLimit(limit + 24)}>แสดงเพิ่ม</Button></div>}
  </Panel>
}

function Usage({ sense, multiple, index }: { sense: Sense | PhraseSense; multiple: boolean; index: number }) {
  return <Panel className="stack">
    <h2>{multiple ? `ความหมาย ${index + 1} · ${sense.meaning}` : sense.meaning}</h2>
    <p>{sense.context}</p><p><strong>ใช้เมื่อ</strong> {sense.when} <small>· {register[sense.register]}</small></p>
    <Disclosure title="สถานการณ์ คำที่ใช้คู่กัน และรูปประโยค">
      <ul>{sense.situations.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>คำที่ใช้คู่กัน</h3><p lang="en">{sense.collocations.join(' · ')}</p>
      <h3>รูปประโยค</h3><ul lang="en">{sense.patterns.map((item) => <li key={item}>{item}</li>)}</ul>
    </Disclosure>
    {'structure' in sense && <PhrasePlacement sense={sense} />}
    <h3>ตัวอย่างในบริบท</h3>{sense.examples.map((item) => <Example key={item.en} {...item} />)}
    <Disclosure title="คำใกล้เคียงและข้อผิดพลาด">
      <ul>{sense.similar.map(({ term, note }) => <li key={term}><strong lang="en">{term}</strong> · {note}</li>)}</ul>
      <Mistakes items={sense.mistakes} />
    </Disclosure>
  </Panel>
}

function PhrasePlacement({ sense }: { sense: PhraseSense }) {
  return <div className="example"><h3>ตำแหน่งกรรม</h3>
    <p>{structures[sense.structure]} · {sense.object === 'separable' ? 'แยกได้' : sense.object === 'fixed' ? 'ตำแหน่งตายตัว' : 'ไม่ใช้กรรมตรง'}</p>
    <p>{sense.placement}</p><p>{sense.pronoun}</p>
  </div>
}

function Mistakes({ items }: { items: Sense['mistakes'] }) {
  return <ul>{items.map(({ wrong, right, note }) => <li key={wrong}><span lang="en"><s>{wrong}</s> → <strong>{right}</strong></span><p>{note}</p></li>)}</ul>
}

function StudyControls({ id, senseId, firstSense }: { id: string; senseId: string; firstSense: boolean }) {
  const reviewId = senseKey(id, senseId)
  const state = useLiveQuery(async () => ({
    progress: await db.progress.get(id),
    review: await db.reviews.get(reviewId) ?? (firstSense ? await db.reviews.get(id) : undefined),
    scores: summarizeObjectives(await db.attempts.where('objectiveId').equals(id).toArray()),
  }), [id, reviewId, firstSense])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)
  async function save(action: () => Promise<unknown>) {
    setPending(true)
    setError(false)
    try { await action() } catch { setError(true) } finally { setPending(false) }
  }
  if (!state) return <Panel className="stack"><h2>ความคืบหน้าและทบทวน</h2><p role="status">กำลังเปิดความคืบหน้า</p></Panel>
  const score = state.scores[0]
  const completed = state.progress?.completed ?? false
  return <Panel className="stack"><h2>ความคืบหน้าและทบทวน</h2>
    {score && <p>ตอบถูก {score.correct}/{score.correct + score.incorrect} ครั้ง · ประเมินตนเอง {score.selfAssessed} ครั้ง</p>}
    <div className="actions">
      <Button type="button" variant={completed ? 'outline' : 'default'} aria-pressed={completed} disabled={pending} onClick={() => void save(() => updateProgress(id, { completed: !completed }))}>{completed ? 'เรียนแล้ว' : 'บันทึกว่าเรียนแล้ว'}</Button>
      {state.review ? <Button asChild variant="outline"><Link to={`${everydayPath}/review`}>เปิดคิวทบทวน</Link></Button> :
        <Button type="button" variant="outline" disabled={pending} onClick={() => void save(() => enqueuePattern(reviewId))}>เพิ่มในคิวทบทวน</Button>}
    </div>
    {state.review && <small>ทบทวนครั้งถัดไป {state.review.dueOn}</small>}
    {error && <AlertMessage>บันทึกไม่ได้ ลองอีกครั้ง</AlertMessage>}
  </Panel>
}

export function EverydayDetail({ mode }: { mode: 'words' | 'phrases' }) {
  const { itemId = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const item = (mode === 'words' ? everydayWordsById : everydayPhrasesById).get(itemId)
  if (!item) return <Missing />
  const word: EverydayWord | null = 'forms' in item ? item : null
  const index = Math.max(0, item.senses.findIndex((sense) => sense.id === params.get('sense')))
  const active = item.senses[index]
  const connection = connectionsBySense.get(senseKey(item.id, active.id))
  const backParams = new URLSearchParams(params)
  backParams.delete('sense')
  const examples = 'baseVerb' in item
    ? item.exercises.filter((exercise) => exercise.id === `${item.id}-${active.id}-choice`)
    : item.exercises
  function selectSense(id: string) {
    setParams(new URLSearchParams(senseQuery(params.toString(), id)), { preventScrollReset: true })
  }
  const related = (word ? everyday.phrases : everyday.words).find((entry) => entry.term.toLowerCase() === item.term.toLowerCase())

  return <div className="stack page">
    <LabBack to={`${everydayPath}/${mode}${backParams.size ? `?${backParams}` : ''}`}>{word ? 'สำรวจคำศัพท์' : 'Phrasal Verb Explorer'}</LabBack>
    <Heading label={word ? word.categories.map((value) => categories[value]).join(' · ') : `กริยาหลัก · ${('baseVerb' in item) ? item.baseVerb : ''}`} title={item.term} />
    <Panel className="stack"><h2>เจอคำนี้ที่ไหน</h2><p>{active.situations[0]}</p>
      <div className="inline wrap"><strong lang="en">{item.term}</strong><Speak text={item.term} /><span>{levels[item.level]}</span></div>
      {word && <><p>{word.ipa && <span lang="en">{word.ipa} · </span>}คำอ่านโดยประมาณ {word.thaiReading} · {word.partOfSpeech}</p>
        <Disclosure title="รูปคำที่ใช้บ่อย"><dl className="everyday-forms">{word.forms.map(({ label, word }) => <div key={label}><dt>{label}</dt><dd lang="en">{word}</dd></div>)}</dl></Disclosure></>}
    </Panel>
    {related && !connection?.relatedIds.some((id) => id.split(':')[0] === related.id) && <div className="actions"><Button asChild variant="outline"><Link to={`${everydayPath}/${word ? 'phrases' : 'words'}/${related.id}`}>{word ? 'ดูตำแหน่งกรรมใน Phrasal Verb Explorer' : 'ดูการออกเสียงและรูปคำในคลังคำศัพท์'}</Link></Button></div>}
    {item.senses.length > 1 && <Panel className="stack">
      <h2>เลือกความหมาย</h2><div className="actions">{item.senses.map((sense) => <Button key={sense.id} type="button" variant="outline" aria-pressed={sense.id === active.id} onClick={() => selectSense(sense.id)}>{sense.meaning}</Button>)}</div>
    </Panel>}
    <Usage key={active.id} sense={active} multiple={item.senses.length > 1} index={index} />
    {connection && <Panel className="stack"><h2>นำไปใช้ต่อ</h2>
      {connection.workshopId && <div className="actions"><Button asChild><Link to={`${everydayPath}/exercises?workshop=${connection.workshopId}&item=${item.id}&sense=${active.id}`}>สร้างประโยคจากความหมายนี้</Link></Button></div>}
      {connection.relatedIds.length > 0 && <ul className="clean lesson-list">{connection.relatedIds.map((id) => {
        const related = resolveEverydayRelated(id)
        return related && <RowLink key={id} to={related.to}>{related.title}</RowLink>
      })}</ul>}
    </Panel>}
    <Panel className="stack"><h2>ลองใช้คำนี้</h2>{examples.map((exercise) => <Exercise key={exercise.id} item={exercise} objective={item.id} />)}
      <Disclosure title="ลองใช้ในการสนทนา"><p>นึกถึง {active.situations[0]} แล้วพูดประโยคของคุณโดยใช้คำนี้ ให้เพื่อนถามต่อว่าเกิดอะไรขึ้น แล้วตอบอีกหนึ่งประโยคโดยเติมเวลา เหตุผล หรือรายละเอียดที่จำเป็น</p></Disclosure>
    </Panel>
    <StudyControls key={senseKey(item.id, active.id)} id={item.id} senseId={active.id} firstSense={index === 0} />
  </div>
}

export function EverydayComparisons() {
  const { itemId = '' } = useParams()
  if (!itemId) return <div className="stack page"><LabBack /><Heading title="เทียบคำที่ใช้สลับกันบ่อย" detail="ลองตัดสินจากสถานการณ์ก่อน แล้วค่อยสังเกตว่าแต่ละคำเน้นอะไร" />
    <Panel><ul className="clean lesson-list">{everyday.comparisons.map((comparison) => <RowLink key={comparison.id} to={`${everydayPath}/comparisons/${comparison.id}`} subtitle={comparison.situation}>{comparison.title}</RowLink>)}</ul></Panel>
  </div>
  const item = everydayComparisonsById.get(itemId)
  if (!item) return <Missing />
  return <div className="stack page"><LabBack to={`${everydayPath}/comparisons`}>เทียบคำ</LabBack><Heading title={item.title} detail={item.situation} />
    <Panel className="stack"><h2>ลองเลือกตามสถานการณ์</h2><Exercise key={item.exercise.id} item={item.exercise} objective={item.id} /></Panel>
    <Panel className="stack"><h2>ความหมายต่างกันอย่างไร</h2><p>{item.distinction}</p><p>{item.naturalChoice}</p>
      {item.examples.map((example) => <Example key={example.en} {...example} />)}<Disclosure title="ข้อผิดพลาดที่พบบ่อย"><Mistakes items={item.mistakes} /></Disclosure>
    </Panel>
  </div>
}

export function EverydayCombinations() {
  const { itemId = '' } = useParams()
  const { params, update } = useFilters()
  const patterns = params.get('view') === 'patterns'
  const query = params.get('q') ?? ''
  const level = params.get('level') ?? ''
  if (!itemId) {
    const term = query.normalize('NFKC').trim().toLowerCase()
    const items = (patterns ? everyday.sentencePatterns : everyday.collocations).filter((item) =>
      (!level || item.level === level) && (!term || [item.term, item.meaning, item.context, ...item.examples.map(({ en }) => en)]
        .some((field) => field.normalize('NFKC').toLowerCase().includes(term))))
    return <div className="stack page"><LabBack /><Heading title="คำที่ใช้คู่กันและรูปประโยค" detail="เรียนคำเป็นกลุ่มเพื่อหยิบไปพูดในสถานการณ์จริง" />
      <div className="actions"><Button type="button" variant="outline" aria-pressed={!patterns} onClick={() => update('view', '')}>Collocations</Button>
        <Button type="button" variant="outline" aria-pressed={patterns} onClick={() => update('view', 'patterns')}>Sentence Patterns</Button></div>
      <Panel className="stack">
        <Label>ค้นกลุ่มคำหรือความหมาย<Input type="search" value={query} onChange={(event) => update('q', event.target.value)} /></Label>
        <FilterSelect label="ระดับความยาก" all="ทุกระดับ" value={level} options={Object.entries(levels)} onChange={(value) => update('level', value)} />
      </Panel>
      <Panel className="stack"><h2>ผลการค้นหา <small aria-live="polite">{items.length} รายการ</small></h2>
        {items.length ? <ul className="clean lesson-list">{items.map((item) => <RowLink key={item.id} to={`${everydayPath}/combinations/${item.id}${params.size ? `?${params}` : ''}`} subtitle={item.meaning}><span lang="en">{item.term}</span></RowLink>)}</ul> :
          <p>ไม่พบรายการ ลองเปลี่ยนคำค้นหรือตัวกรอง</p>}
      </Panel>
    </div>
  }
  const item = everydayCombinationsById.get(itemId)
  if (!item) return <Missing />
  return <div className="stack page"><LabBack to={`${everydayPath}/combinations${params.size ? `?${params}` : ''}`}>คำที่ใช้คู่กันและรูปประโยค</LabBack><Heading title={item.term} detail={item.meaning} />
    <Panel className="stack"><h2>ใช้ในสถานการณ์ไหน</h2><p>{item.context}</p><p>{item.usage}</p>
      {item.examples.map((example) => <Example key={example.en} {...example} />)}
      {item.patternId && <Link to={`/reference/pattern/${item.patternId}`}>เปิดรูปประโยคที่เกี่ยวข้องในคลัง</Link>}
    </Panel>
  </div>
}
