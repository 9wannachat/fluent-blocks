import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { NativeSelect, NativeSelectOption } from '../../components/ui/native-select'
import { Label } from '../../components/ui/label'
import { AlertMessage } from '../../components/ui/alert-message'
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronRight, Search } from 'lucide-react'
import MiniSearch from 'minisearch'
import { useLiveQuery } from 'dexie-react-hooks'
import { curriculum, lessonById, patternById } from '../../content'
import { modules } from '../../content/modules'
import { BackLink, Example, Heading, Missing, Panel, RowLink } from '../../components/ui'
import { db, enqueuePattern, ratePattern } from '../../storage'
import { localDateKey } from '../../domain/review'
import { resolveReviewItem, type ReviewItem } from '../../content/review-items'
import { practicalReviewItems } from '../../content/practical'
import { everydayReviewItems } from '../../content/everyday'
import type { Pattern } from '../../domain/content'

const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[‘’]/g, "'").trim()
const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('th', { granularity: 'word' }) : null
const searchable = curriculum.patterns.map((item) => ({ id: item.id, template: item.template, detail: [
  item.meaning, item.intent, item.why, item.placement, ...item.tags, ...item.alternatives,
  ...item.examples.flatMap(({ en, th }) => [en, th]),
  ...item.lessons.flatMap((id) => { const lesson = lessonById.get(id); return lesson ? [lesson.titleEn, lesson.titleTh] : [] }),
].join(' ') }))
const index = new MiniSearch({
  fields: ['template', 'detail'],
  tokenize: (text) => segmenter ? Array.from(segmenter.segment(text.normalize('NFKC'))).filter((item) => item.isWordLike).map((item) => item.segment) : text.split(/[^\p{L}\p{M}\p{N}']+/u).filter(Boolean),
})
index.addAll(searchable)

const registerLabels = { neutral: 'ทั่วไป', informal: 'กันเอง', formal: 'ทางการ' }

const glossary = [
  ['still / yet / already', 'ยังคง / หรือยัง / แล้ว', 'I still haven’t finished. เน้นว่ายังค้างอยู่ ส่วน I haven’t finished yet. มองไปที่การเสร็จที่คาดว่าจะเกิด'],
  ['worth', 'คุ้มค่า', 'It’s worth trying. ใช้ worth + -ing และ It’s worth a thousand baht. ใช้ worth + noun'],
  ['guess / think', 'เดาว่า หรือคิดว่าแบบไม่ฟันธง / คิดว่า', 'I guess you’re right. มักให้น้ำหนักเบากว่า I think you’re right. น้ำเสียงและบริบทก็มีผล'],
  ['even / very', 'แม้แต่ หรือด้วยซ้ำ / มาก', 'Even I noticed. เน้นคนที่คาดไม่ถึง ส่วน It’s very clear. เพิ่มระดับของ clear'],
  ['kind / kind of / kinds of', 'ประเภท / ค่อนข้าง / หลายประเภท', 'I kind of like it. ใช้ kind of ลดน้ำหนักความชอบ ส่วน What kind of music? ใช้ถามประเภท'],
  ['should / would', 'ควร / จะ ในสถานการณ์สมมติหรือการขออย่างสุภาพ', 'You should ask. คือคำแนะนำ ส่วน I would ask. คือสิ่งที่ผู้พูดจะทำเมื่อสมมติสถานการณ์'],
  ['through', 'ผ่าน หรือประสบ', 'I’ve been through a lot. หมายถึงผ่านเรื่องราวมามาก'],
  ['notice', 'สังเกตเห็น', 'Did you notice any changes? ใช้ถามว่าเห็นความเปลี่ยนแปลงอะไรไหม'],
  ['effort', 'ความพยายาม', 'It takes effort. หมายถึงต้องใช้ความพยายาม ส่วน It’s worth the effort. หมายถึงคุ้มกับความพยายาม'],
  ['confusing / confused / tricky', 'ทำให้สับสน / รู้สึกสับสน / ยากเพราะมีจุดให้ระวัง', 'That’s a confusing one. คุณสมบัติของเรื่อง ส่วน I’m confused. บอกความรู้สึกของคน'],
  ['abroad / aboard', 'ต่างประเทศ / บนยานพาหนะ', 'I went abroad ten years ago. กับ We’re aboard the ferry.'],
  ['honestly', 'พูดตรง ๆ', 'Honestly, I don’t know. ใช้วางท่าทีไว้ก่อนใจความ'],
  ['right now', 'ตอนนี้เลย หรือ ณ ตอนนี้', 'I’m working right now. จำกัดช่วงเวลาที่พูดถึง'],
  ['for ages / since forever', 'นานมาก ๆ', 'I’ve been watching your show for ages. กับ since forever ซึ่งเป็นการพูดเกินจริงแบบกันเอง'],
  ['live vicariously through', 'รู้สึกเหมือนได้สัมผัสผ่านประสบการณ์ของคนอื่น', 'I live vicariously through your travel videos. เป็นวลีที่ค่อนข้างเฉพาะบริบท'],
  ['not really / just a little bit', 'ไม่ค่อย / แค่นิดเดียว', 'Do you cook often? Not really. พูดเป็นคำตอบสั้นได้'],
] as const

/** Shows slot placeholders such as [subject] as quiet chips inside the English template. */
function Template({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]+\])/).filter(Boolean).map((part, index) =>
    part.startsWith('[') ? <span className="slot" key={index}>{part.slice(1, -1)}</span> : <span key={index}>{part}</span>)}</>
}

function PatternRow({ pattern }: { pattern: Pattern }) {
  return <li><Link className="lesson-row pattern-row" to={`/reference/pattern/${pattern.id}`} aria-label={`${pattern.template} · ${pattern.meaning}`}>
    <span className="lesson-text"><span className="lesson-title" lang="en"><Template text={pattern.template} /></span><small>{pattern.meaning}</small></span>
    <span className="lesson-meta"><span className={`register register-${pattern.register}`}>{registerLabels[pattern.register]}</span></span>
    <ChevronRight className="lesson-chevron" size={18} aria-hidden="true" />
  </Link></li>
}


export function Reference() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const intent = params.get('intent') ?? ''
  const [limit, setLimit] = useState(24)
  const term = normalize(query)
  const exact = term ? searchable.filter((item) => normalize(item.template).includes(term) || normalize(item.detail).includes(term)).map(({ id }) => id) : []
  const found = term ? [...new Set([...exact, ...index.search(term, { prefix: true, combineWith: 'AND', boost: { template: 3 } }).map(({ id }) => String(id))])] : curriculum.patterns.map(({ id }) => id)
  const shown = found.flatMap((id) => { const pattern = patternById.get(id); return pattern && (!intent || intent === pattern.intent) ? [pattern] : [] })
  const terms = glossary.filter((entries) => !term || entries.some((item) => normalize(item).includes(term)))
  const intents = [...new Set(curriculum.patterns.map((pattern) => pattern.intent))].sort()
  function change(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
    setLimit(24)
  }
  return <div className="stack page"><Heading label="REFERENCE" title="คลังคำและรูปประโยค" detail="ค้นจากคำที่ได้ยิน ความหมายภาษาไทย หรือสิ่งที่อยากสื่อ" />
    <Panel className="stack">
      <Label><span className="inline"><Search size={17} /> ค้นหา</span><Input type="search" value={query} onChange={(event) => change('q', event.target.value)} placeholder="เช่น still, ขอคำแนะนำ, กริยาช่วย" /></Label>
      <Label>กรองตามเจตนา<NativeSelect value={intent} onChange={(event) => change('intent', event.target.value)}><NativeSelectOption value="">ทุกเจตนา</NativeSelectOption>{intents.map((item) => <NativeSelectOption key={item}>{item}</NativeSelectOption>)}</NativeSelect></Label>
      <div className="actions"><Button asChild variant="outline"><Link to="/reference/notebook">สมุดคำศัพท์</Link></Button><Button asChild variant="outline"><Link to="/practice/everyday/words">คำศัพท์ในชีวิตประจำวัน</Link></Button><Button asChild variant="outline"><Link to="/review">ทบทวน</Link></Button></div>
    </Panel>
    <Panel className="stack"><h2>รูปประโยค <small aria-live="polite">{shown.length} รูปแบบ</small></h2>
      {shown.length ? <ul className="clean lesson-list">{shown.slice(0, limit).map((pattern) => <PatternRow pattern={pattern} key={pattern.id} />)}</ul> : <p>ไม่พบรูปประโยค ลองค้นคำสั้นลงหรือเลือกทุกเจตนา</p>}
      {shown.length > limit && <Button type="button" variant="outline" onClick={() => setLimit(limit + 24)}>แสดงเพิ่ม</Button>}
    </Panel>
    {terms.length > 0 && <Panel className="stack"><h2>คำและวลีที่ควรรู้</h2><div className="glossary">{terms.map(([en, th, note]) => <Example key={en} en={en} th={th} note={note} />)}</div></Panel>}
    <Panel className="stack"><h2>หัวข้อไวยากรณ์</h2><ul className="clean lesson-list">{modules.filter((module) => curriculum.lessons.some((lesson) => lesson.module === module.id)).map((module) => <RowLink key={module.id} to={`/reference/topics/${module.id}`}>{module.th}</RowLink>)}</ul></Panel>
  </div>
}

export function PatternPage() {
  const { patternId = '' } = useParams()
  const pattern = patternById.get(patternId)
  const review = useLiveQuery(() => db.reviews.get(patternId), [patternId])
  const [error, setError] = useState(false)
  if (!pattern) return <Missing />
  async function add() {
    setError(false)
    try { await enqueuePattern(patternId) } catch { setError(true) }
  }
  return <div className="stack page"><BackLink to="/reference">คลังรูปประโยค</BackLink>
    <Heading label={`${pattern.intent} · ${registerLabels[pattern.register]}`} title={pattern.template} detail={pattern.meaning} />
    <Panel className="stack"><h2>ใช้เมื่อไหร่</h2><p>{pattern.why}</p><p>{pattern.placement}</p>
      {pattern.slots.length > 0 && <><h3>คำที่นำมาเติมได้</h3><ul>{pattern.slots.map((slot) => <li key={slot.name}><span lang="en">{slot.name}</span> · {slot.rule} · <span lang="en">{slot.example}</span></li>)}</ul></>}
      {pattern.alternatives.length > 0 && <><h3>ทางเลือก</h3><ul>{pattern.alternatives.map((item) => <li key={item}>{item}</li>)}</ul></>}
    </Panel>
    <Panel className="stack"><h2>ตัวอย่าง</h2>{pattern.examples.map((item) => <Example {...item} key={item.en} />)}
      {pattern.mistakes.map((item) => <p key={item.wrong}><s lang="en">{item.wrong}</s> → <strong lang="en">{item.right}</strong> · {item.note}</p>)}
    </Panel>
    <Panel className="stack"><h2>บทเรียนที่เกี่ยวข้อง</h2><ul className="clean lesson-list">{pattern.lessons.map((id) => <RowLink key={id} to={`/learn/${id}`} subtitle={lessonById.get(id)?.titleEn}>{lessonById.get(id)?.titleTh}</RowLink>)}</ul>
      {review ? <p>ทบทวนครั้งถัดไป {review.dueOn} · <Link to="/review">เปิดคิว</Link></p> : <Button type="button" onClick={() => void add()}>เพิ่มในคิวทบทวน</Button>}
      {error && <AlertMessage>เพิ่มรายการไม่ได้ ลองอีกครั้ง</AlertMessage>}
    </Panel>
  </div>
}

export function TopicPage() {
  const { topicId } = useParams()
  const module = modules.find((item) => String(item.id) === topicId)
  const lessons = curriculum.lessons.filter((lesson) => lesson.module === module?.id)
  if (!module || !lessons.length) return <Missing />
  const ids = new Set(lessons.map((lesson) => lesson.id))
  return <div className="stack page"><BackLink to="/reference">อ้างอิง</BackLink><Heading label={module.en} title={module.th} />
    <Panel className="stack"><h2>บทเรียน</h2><ul className="clean lesson-list">{lessons.map((lesson) => <RowLink key={lesson.id} to={`/learn/${lesson.id}`}>{lesson.titleTh}</RowLink>)}</ul></Panel>
    <Panel className="stack"><h2>รูปประโยคในหัวข้อนี้</h2><ul className="clean lesson-list">{curriculum.patterns.filter((item) => item.lessons.some((id) => ids.has(id))).map((item) => <PatternRow pattern={item} key={item.id} />)}</ul></Panel>
  </div>
}

const ratings = [['again', 'ขอเริ่มใหม่'], ['hard', 'ยาก'], ['good', 'พอจำได้'], ['easy', 'ง่าย']] as const

function ReviewCard({ pattern, vocabulary }: { pattern: ReviewItem; vocabulary: boolean }) {
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  async function rate(rating: (typeof ratings)[number][0]) {
    setBusy(true)
    setError(false)
    try { await ratePattern(pattern.id, rating) } catch { setError(true) } finally { setBusy(false) }
  }
  return <Panel className="stack"><h2>{pattern.meaning}</h2><p>{pattern.context}</p>
    {revealed ? <><p lang="en" className="formula">{pattern.term}</p>{pattern.examples.map((item) => <Example {...item} key={item.en} />)}
      {pattern.to && <Link to={pattern.to}>เปิดความหมายที่กำลังทบทวน</Link>}
      <p>เมื่อกี้นึกออกได้มากแค่ไหน</p><div className="actions">{ratings.map(([value, label]) => <Button type="button" disabled={busy} variant="outline" key={value} onClick={() => void rate(value)}>{label}</Button>)}</div></> :
      <><p>{vocabulary ? 'ลองนึกคำภาษาอังกฤษจากบริบท แล้วพูดหนึ่งประโยคก่อนดูคำตอบ' : 'ลองพูดวลีพร้อมตัวอย่างของคุณก่อนดูคำตอบ'}</p><Button type="button" onClick={() => setRevealed(true)}>{vocabulary ? 'ดูคำตอบและตัวอย่าง' : 'ดูรูปประโยค'}</Button></>}
    {error && <AlertMessage>บันทึกการทบทวนไม่ได้ ลองอีกครั้ง</AlertMessage>}
  </Panel>
}

export function Review({ everydayOnly = false }: { everydayOnly?: boolean }) {
  const today = localDateKey(new Date())
  const due = useLiveQuery(() => db.reviews.where('dueOn').belowOrEqual(today).toArray(), [today])
  const next = due?.filter((item) => !everydayOnly || everydayReviewItems.has(item.patternId))
    .map((item) => resolveReviewItem(item.patternId)).find((item) => item !== undefined)
  return <div className="stack page">
    <BackLink to={everydayOnly ? '/practice/everyday' : '/practice'}>{everydayOnly ? 'Everyday English Lab' : 'ฝึกใช้'}</BackLink>
    <Heading label="REVIEW" title={everydayOnly ? 'ทบทวนคำและวลี' : 'ทบทวนจากความจำ'} detail="เมื่อให้คะแนนความจำ ระบบใช้ช่วง 1, 3, 7, 14 และ 30 วันเพื่อจัดคิวให้กลับมาฝึกอีกครั้ง" />
    {due === undefined ? <p role="status">กำลังเปิดคิว</p> : next ? <ReviewCard pattern={next} vocabulary={everydayReviewItems.has(next.id) || practicalReviewItems.has(next.id)} key={next.id} /> :
      <Panel className="stack"><h2>{everydayOnly ? 'วันนี้ไม่มีคำหรือวลีถึงกำหนด' : 'วันนี้ไม่มีรายการถึงกำหนด'}</h2>
        <p className="muted">เปิดรายการที่อยากฝึก แล้วกด “เพิ่มในคิวทบทวน” เพื่อกลับมาฝึกตามรอบ</p>
        <Button asChild variant="outline" className="module-review"><Link to={everydayOnly ? '/practice/everyday/words' : '/reference'}>{everydayOnly ? 'สำรวจคำศัพท์' : 'เลือกรูปประโยคจากคลัง'} <ArrowRight size={15} /></Link></Button>
      </Panel>}
  </div>
}
