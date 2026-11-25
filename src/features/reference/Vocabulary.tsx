import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { NativeSelect, NativeSelectOption } from '../../components/ui/native-select'
import { Label } from '../../components/ui/label'
import { AlertMessage } from '../../components/ui/alert-message'
import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { BackLink, Heading, Panel, RowLink, Speak } from '../../components/ui'
import { curriculum, patternById } from '../../content'
import { db, saveVocabulary, sourceUrlSchema, type VocabularyEntry } from '../../storage'

function normalize(text: string) {
  return text.trim().normalize('NFKC').toLowerCase()
}

function VocabularyForm({ entry, onDone }: { entry?: VocabularyEntry; onDone: (saved: boolean) => void }) {
  const [linked, setLinked] = useState<string[]>(entry?.patternIds ?? [])
  const [patternQuery, setPatternQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const candidates = patternQuery.trim() ? curriculum.patterns.filter((pattern) =>
    !linked.includes(pattern.id) && normalize([pattern.template, pattern.meaning, ...pattern.tags].join(' ')).includes(normalize(patternQuery))
  ).slice(0, 12) : []

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const field = (name: string) => String(fields.get(name) ?? '').trim()
    setError('')
    const sourceUrl = field('source')
    if (!sourceUrlSchema.safeParse(sourceUrl).success) {
      setError('ใช้ URL ต้นทางที่ขึ้นต้นด้วย http:// หรือ https://')
      return
    }
    const term = field('term')
    if (!term) {
      setError('กรอกคำหรือวลีที่ต้องการเก็บ')
      return
    }
    setPending(true)
    try {
      await saveVocabulary({
        id: entry?.id, term, meaningTh: field('meaning'), example: field('example'),
        notes: field('notes'), sourceUrl, patternIds: linked,
      })
      onDone(true)
    } catch {
      setError('บันทึกคำศัพท์ไม่ได้ ตรวจข้อมูลแล้วลองอีกครั้ง')
    } finally {
      setPending(false)
    }
  }

  return <Panel>
    <form className="stack" onSubmit={save}>
      <h2>{entry ? 'แก้ไขคำศัพท์' : 'เพิ่มคำหรือวลี'}</h2>
      <div className="grid two">
        <Label>คำหรือวลี<Input name="term" required maxLength={500} defaultValue={entry?.term} /></Label>
        <Label>ความหมายภาษาไทย<Input name="meaning" maxLength={5000} defaultValue={entry?.meaningTh} /></Label>
      </div>
      <Label>ประโยคตัวอย่าง<Textarea name="example" rows={2} maxLength={5000} defaultValue={entry?.example} /></Label>
      <Label>บันทึก<Textarea name="notes" rows={2} maxLength={5000} defaultValue={entry?.notes} /></Label>
      <Label>URL ต้นทาง (ถ้ามี)<Input name="source" type="url" maxLength={2000} defaultValue={entry?.sourceUrl} /></Label>
      <fieldset className="stack">
        <legend>รูปแบบที่เชื่อมโยง</legend>
        {linked.length > 0 && <ul className="clean">{linked.map((id) => {
          const pattern = patternById.get(id)
          return <li className="row" key={id}>
            {pattern ? <Link to={`/reference/pattern/${id}`} lang="en">{pattern.template}</Link> : <span>{id}</span>}
            <Button type="button" variant="outline" aria-label={`เอา ${pattern?.template ?? id} ออก`}
              onClick={() => setLinked(linked.filter((item) => item !== id))}>เอาออก</Button>
          </li>
        })}</ul>}
        <Label>ค้นรูปแบบเพื่อเชื่อมโยง<Input type="search" value={patternQuery} onChange={(event) => {
          setPatternQuery(event.target.value)
          setSelected('')
        }} /></Label>
        {patternQuery.trim() && candidates.length === 0 && <p>ไม่พบรูปแบบที่ตรงกับคำค้น</p>}
        {candidates.length > 0 && <div className="grid two">
          <Label>ผลการค้นหา<NativeSelect value={selected} onChange={(event) => setSelected(event.target.value)}>
            <NativeSelectOption value="">เลือกรูปแบบ</NativeSelectOption>
            {candidates.map((pattern) => <NativeSelectOption key={pattern.id} value={pattern.id}>{pattern.template}</NativeSelectOption>)}
          </NativeSelect></Label>
          <div className="actions"><Button type="button" variant="outline" disabled={!selected} onClick={() => {
            setLinked([...linked, selected])
            setSelected('')
            setPatternQuery('')
          }}>เชื่อมโยงรูปแบบ</Button></div>
        </div>}
      </fieldset>
      <div className="actions">
        <Button type="submit" disabled={pending}>บันทึกคำศัพท์</Button>
        {entry && <Button type="button" variant="outline" onClick={() => onDone(false)}>ยกเลิก</Button>}
      </div>
      {error && <AlertMessage>{error}</AlertMessage>}
    </form>
  </Panel>
}

export function Vocabulary() {
  const items = useLiveQuery(() => db.vocabulary.orderBy('updatedAt').reverse().toArray(), [])
  const [editing, setEditing] = useState<string>()
  const [confirmDelete, setConfirmDelete] = useState<string>()
  const [revision, setRevision] = useState(0)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const entry = items?.find(({ id }) => id === editing)
  const visible = items?.filter((item) => normalize([item.term, item.meaningTh, item.example, item.notes].join(' ')).includes(normalize(query)))

  async function remove(id: string) {
    setMessage('')
    setError('')
    try {
      await db.vocabulary.delete(id)
      if (editing === id) setEditing(undefined)
      setConfirmDelete(undefined)
      setMessage('ลบคำศัพท์แล้ว')
    } catch {
      setError('ลบคำศัพท์ไม่ได้ ลองอีกครั้ง')
    }
  }

  return <div className="stack page">
    <BackLink to="/reference">คลังอ้างอิง</BackLink>
    <Heading label="REFERENCE" title="สมุดคำศัพท์" detail="เก็บคำกับตัวอย่างที่คุณพร้อมนำไปพูด และเชื่อมกับรูปแบบที่ใช้ซ้ำได้" />
    <div id="vocabulary-editor">
      <VocabularyForm key={`${entry?.id ?? 'new'}-${revision}`} entry={entry} onDone={(saved) => {
        setMessage(saved ? 'บันทึกคำศัพท์แล้ว' : '')
        setEditing(undefined)
        setRevision(revision + 1)
      }} />
    </div>
    {message && <p role="status">{message}</p>}
    {error && <AlertMessage>{error}</AlertMessage>}
    <Panel className="stack">
      <h2>คำศัพท์ที่บันทึก</h2>
      <Label>ค้นในสมุดคำศัพท์<Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></Label>
      {items === undefined && <p role="status">กำลังเปิดสมุด</p>}
      {items?.length === 0 && <p>คำหรือวลีที่บันทึกจากแบบฟอร์มด้านบนจะปรากฏที่นี่</p>}
      {items && items.length > 0 && visible?.length === 0 && <p>ไม่พบคำหรือวลีที่ตรงกับคำค้น</p>}
      {visible?.map((item) => <article className="example stack" key={item.id}>
        <h3 className="inline" lang="en">{item.term}<Speak text={item.term} /></h3>
        {item.meaningTh && <p>{item.meaningTh}</p>}
        {item.example && <p lang="en">{item.example}</p>}
        {item.notes && <p>{item.notes}</p>}
        {item.patternIds.length > 0 && <ul className="clean lesson-list">{item.patternIds.map((id) => {
          const pattern = patternById.get(id)
          return pattern ? <RowLink key={id} to={`/reference/pattern/${id}`} lang="en" subtitle={pattern.meaning}>{pattern.template}</RowLink> : <li key={id}>{id}</li>
        })}</ul>}
        <div className="actions">
          {item.sourceUrl && sourceUrlSchema.safeParse(item.sourceUrl).success && <a href={item.sourceUrl} target="_blank" rel="noreferrer noopener">เปิดต้นทาง</a>}
          <a href="#vocabulary-editor" onClick={() => { setEditing(item.id); setMessage('') }}>แก้ไข</a>
          <Button type="button" variant="outline" onClick={() => setConfirmDelete(item.id)}>ลบ</Button>
        </div>
        {confirmDelete === item.id && <div className="actions">
          <span>ลบคำนี้ออกจากสมุดหรือไม่</span>
          <Button type="button" onClick={() => { void remove(item.id) }}>ยืนยันการลบ</Button>
          <Button type="button" variant="outline" onClick={() => setConfirmDelete(undefined)}>ยกเลิก</Button>
        </div>}
      </article>)}
    </Panel>
  </div>
}
