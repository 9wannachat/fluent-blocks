import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { AlertMessage } from '../../components/ui/alert-message'
import { useMemo, useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { BackLink, Heading, Panel, RowLink, Speak } from '../../components/ui'
import { curriculum } from '../../content'
import { db, savePodcastEntry, sourceUrlSchema, type PodcastEntry } from '../../storage'
import { findRelatedPatterns, parseTimestamp, timestampLabel } from './related'

const sample = {
  sentence: 'So, did you notice any changes?',
  meaning: 'แล้วคุณสังเกตเห็นอะไรเปลี่ยนไปบ้างไหม',
  pattern: 'So, did you + V1 …?',
  roles: [
    ['So', 'คำเปิดเรื่อง', 'พาผู้ฟังเข้าสู่คำถามต่อ'],
    ['did', 'กริยาช่วยอดีต', 'รับเวลาอดีตและย้ายไปอยู่หน้าประธาน'],
    ['you', 'ประธาน', 'คนที่เราถาม'],
    ['notice', 'กริยารูปพื้นฐาน', 'ใช้รูปเดิมเพราะ did รับอดีตแล้ว'],
    ['any changes', 'กลุ่มคำที่เป็นกรรม', 'สิ่งที่เราถามว่าอีกฝ่ายสังเกตเห็นหรือเปล่า'],
  ],
}

function sourceAtTimestamp(raw: string, seconds: number | null) {
  if (!raw || !sourceUrlSchema.safeParse(raw).success) return undefined
  const url = new URL(raw)
  if (seconds !== null && ['youtu.be', 'youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
    url.searchParams.set('t', `${seconds}s`)
  }
  return url.href
}

function PodcastForm({ entry, onDone }: { entry?: PodcastEntry; onDone: (saved: boolean) => void }) {
  const [sentence, setSentence] = useState(entry?.sentence ?? '')
  const [chunks, setChunks] = useState(entry?.chunks.join('\n') ?? '')
  const [tags, setTags] = useState(entry?.tags.join(', ') ?? '')
  const [fillSample, setFillSample] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const related = useMemo(() => findRelatedPatterns(`${sentence} ${chunks} ${tags}`, curriculum.patterns), [sentence, chunks, tags])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const field = (name: string) => String(fields.get(name) ?? '').trim()
    setError('')
    setPending(true)
    try {
      const sourceUrl = field('source')
      if (!sourceUrlSchema.safeParse(sourceUrl).success) throw new Error('ใช้ URL ต้นทางที่ขึ้นต้นด้วย http:// หรือ https://')
      const timestampSeconds = parseTimestamp(field('timestamp'))
      if (timestampSeconds !== null && (!Number.isSafeInteger(timestampSeconds) || timestampSeconds > 604_800)) {
        throw new Error('เวลาต้นทางต้องอยู่ระหว่าง 0 ถึง 604800 วินาที')
      }
      if (!sentence.trim()) throw new Error('กรอกประโยคที่ต้องการเก็บ')
      await savePodcastEntry({
        id: entry?.id, sentence, sourceUrl, timestampSeconds, context: field('context'),
        meaningTh: field('meaning'), notes: field('notes'), personalExample: field('personal'),
        chunks: [...new Set(chunks.split(/\n+/).map((value) => value.trim()).filter(Boolean))],
        tags: [...new Set(tags.split(',').map((value) => value.trim()).filter(Boolean))],
      })
      onDone(true)
    } catch (failure) {
      setError(failure instanceof Error && failure.name === 'Error' ? failure.message : 'บันทึกประโยคไม่ได้ ตรวจข้อมูลแล้วลองอีกครั้ง')
    } finally {
      setPending(false)
    }
  }

  return <Panel>
    <form className="stack" onSubmit={save}>
      <div className="inline spread"><h2>{entry ? 'แก้ประโยคในสมุด' : 'เพิ่มประโยคที่ได้ยิน'}</h2>
        {!entry && !fillSample && <Button type="button" variant="outline" onClick={() => {
          setSentence(sample.sentence)
          setChunks('So\ndid you notice…?')
          setTags('question, past simple')
          setFillSample(true)
        }}>ลองจากตัวอย่าง</Button>}
      </div>
      <Label>ประโยคสั้นที่อยากฝึก<Textarea required maxLength={500} rows={2} value={sentence} onChange={(event) => setSentence(event.target.value)} /></Label>
      <div className="grid two">
        <Label>URL ต้นทาง (ถ้ามี)<Input name="source" type="url" maxLength={2000} defaultValue={entry?.sourceUrl} /></Label>
        <Label>เวลาต้นทาง (ถ้ามี)<Input name="timestamp" placeholder="12:30" defaultValue={entry?.timestampSeconds == null ? '' : timestampLabel(entry.timestampSeconds)} /></Label>
      </div>
      <Label>บริบทที่ได้ยิน<Textarea name="context" rows={2} maxLength={5000} defaultValue={entry?.context} /></Label>
      <Label>ความหมายภาษาไทย<Textarea key={String(fillSample)} name="meaning" rows={2} maxLength={5000} defaultValue={entry?.meaningTh ?? (fillSample ? sample.meaning : '')} /></Label>
      <Label>กลุ่มคำที่อยากจำ (หนึ่งรายการต่อบรรทัด)<Textarea rows={2} maxLength={4000} value={chunks} onChange={(event) => setChunks(event.target.value)} /></Label>
      <Label>หัวข้อไวยากรณ์ (คั่นด้วยจุลภาค)<Input maxLength={2000} value={tags} onChange={(event) => setTags(event.target.value)} /></Label>
      {related.length > 0 && <div><h3>รูปแบบที่เกี่ยวข้อง</h3><ul className="clean lesson-list">{related.map((pattern) => <RowLink key={pattern.id} to={`/reference/pattern/${pattern.id}`} lang="en" subtitle={pattern.meaning}>{pattern.template}</RowLink>)}</ul></div>}
      <Label>ลองเขียนประโยคของตัวเอง<Textarea name="personal" rows={2} maxLength={5000} defaultValue={entry?.personalExample} /></Label>
      <Label>บันทึกเพิ่มเติม<Textarea name="notes" rows={2} maxLength={5000} defaultValue={entry?.notes} /></Label>
      <div className="actions"><Button type="submit" disabled={pending}>บันทึกประโยค</Button>
        {entry && <Button type="button" variant="outline" onClick={() => onDone(false)}>ยกเลิก</Button>}
      </div>
      {error && <AlertMessage>{error}</AlertMessage>}
    </form>
  </Panel>
}

export function Podcast() {
  const items = useLiveQuery(() => db.podcast.orderBy('updatedAt').reverse().toArray(), [])
  const [editing, setEditing] = useState<string>()
  const [confirmDelete, setConfirmDelete] = useState<string>()
  const [revision, setRevision] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const entry = items?.find(({ id }) => id === editing)
  const visible = items?.filter((item) => [item.sentence, item.meaningTh, ...item.chunks, ...item.tags].join(' ')
    .normalize('NFKC').toLowerCase().includes(query.trim().normalize('NFKC').toLowerCase()))

  async function remove(id: string) {
    setError('')
    setMessage('')
    try {
      await db.podcast.delete(id)
      if (editing === id) setEditing(undefined)
      setConfirmDelete(undefined)
      setMessage('ลบประโยคแล้ว')
    } catch {
      setError('ลบประโยคไม่ได้ ลองอีกครั้ง')
    }
  }

  return <div className="stack page">
    <BackLink to="/practice">ฝึกใช้</BackLink>
    <Heading label="PODCAST LAB" title="สมุดประโยคจากสิ่งที่ฟัง" detail="เก็บประโยคสั้นที่ได้ยิน แยกกลุ่มคำ แล้วลองพูดประโยคของตัวเอง" />
    <Panel className="stack">
      <h2>ฝึกแยกประโยค</h2>
      <div className="example">
        <div className="inline spread"><strong lang="en">{sample.sentence}</strong><Speak text={sample.sentence} /></div>
        <p>{sample.meaning}</p>
      </div>
      <dl className="clean podcast-roles">{sample.roles.map(([word, role, explanation]) => <div className="row" key={word}>
        <dt lang="en"><strong>{word}</strong></dt><dd>{role} · {explanation}</dd>
      </div>)}</dl>
      <p>นำไปใช้ซ้ำด้วย <strong lang="en">{sample.pattern}</strong> ลองสร้างสามประโยคเกี่ยวกับสิ่งที่สังเกตเห็น การเดินทาง และเรื่องที่เพื่อนเล่า แล้วพูดโดยไม่ดูประโยค</p>
    </Panel>
    <div id="podcast-editor">
      <PodcastForm key={`${entry?.id ?? 'new'}-${revision}`} entry={entry} onDone={(saved) => {
        setMessage(saved ? 'บันทึกประโยคแล้ว' : '')
        setEditing(undefined)
        setRevision(revision + 1)
      }} />
    </div>
    {message && <p role="status">{message}</p>}
    {error && <AlertMessage>{error}</AlertMessage>}
    <Panel className="stack">
      <h2>ประโยคที่บันทึก</h2>
      <Label>ค้นประโยคหรือกลุ่มคำ<Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></Label>
      {items === undefined && <p role="status">กำลังเปิดสมุด</p>}
      {items?.length === 0 && <p>ประโยคที่บันทึกจากแบบฟอร์มด้านบนจะปรากฏที่นี่</p>}
      {items && items.length > 0 && visible?.length === 0 && <p>ไม่พบประโยคที่ตรงกับคำค้น</p>}
      {visible?.map((item) => {
        const source = sourceAtTimestamp(item.sourceUrl, item.timestampSeconds)
        return <article className="example stack" key={item.id}>
          <h3 className="inline" lang="en">{item.sentence}<Speak text={item.sentence} /></h3>
          {item.meaningTh && <p>{item.meaningTh}</p>}
          {item.context && <p>บริบท · {item.context}</p>}
          {item.chunks.length > 0 && <p>กลุ่มคำ · {item.chunks.join(' · ')}</p>}
          {item.tags.length > 0 && <p>ไวยากรณ์ · {item.tags.join(' · ')}</p>}
          {item.personalExample && <p>ตัวอย่างของฉัน · <span lang="en">{item.personalExample}</span></p>}
          {item.notes && <p>บันทึก · {item.notes}</p>}
          <div className="actions">
            {source && <a href={source} target="_blank" rel="noreferrer noopener">เปิดต้นทาง</a>}
            {item.timestampSeconds !== null && <span>เวลาต้นทาง {timestampLabel(item.timestampSeconds)}</span>}
            <a href="#podcast-editor" onClick={() => { setEditing(item.id); setMessage('') }}>แก้ไข</a>
            <Button type="button" variant="outline" onClick={() => setConfirmDelete(item.id)}>ลบ</Button>
          </div>
          {confirmDelete === item.id && <div className="actions">
            <span>ลบประโยคนี้ออกจากสมุดหรือไม่</span>
            <Button type="button" onClick={() => { void remove(item.id) }}>ยืนยันการลบ</Button>
            <Button type="button" variant="outline" onClick={() => setConfirmDelete(undefined)}>ยกเลิก</Button>
          </div>}
        </article>
      })}
    </Panel>
  </div>
}
