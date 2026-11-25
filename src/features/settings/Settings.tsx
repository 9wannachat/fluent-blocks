import { Checkbox } from '../../components/ui/checkbox'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { NativeSelect, NativeSelectOption } from '../../components/ui/native-select'
import { Label } from '../../components/ui/label'
import { AlertMessage } from '../../components/ui/alert-message'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Heading, Panel, Speak, useVoices } from '../../components/ui'
import {
  applyBackup, db, defaultSettings, exportBackup, getRecoveryBackup, previewBackup, saveSettings,
  type BackupPreview, type Settings as Preferences,
} from '../../storage'
import type { BackupKey } from '../../storage/schema'

const routineLabels = ['ทบทวนจากความจำ', 'อ่านบทเรียน', 'สร้างประโยค', 'วิเคราะห์สิ่งที่ฟัง', 'พูดหรือเล่าใหม่']
const backupLabels: Record<BackupKey, string> = {
  progress: 'ความคืบหน้าบทเรียน', attempts: 'คำตอบที่บันทึก', reviews: 'รายการทบทวน',
  vocabulary: 'คำในสมุดศัพท์', podcast: 'ประโยคในสมุดพอดแคสต์', settings: 'การตั้งค่า',
}

function downloadJson(json: string, name: string) {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function PreferencesForm({ preferences, onSaved }: { preferences: Preferences; onSaved: () => void }) {
  const voices = useVoices()
  const [voiceURI, setVoiceURI] = useState(preferences.voiceURI)
  const [speechRate, setSpeechRate] = useState(preferences.speechRate)
  const [routine, setRoutine] = useState(preferences.routineMinutes.map(String))
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const supportsVoice = Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance)
  const total = routine.reduce((minutes, duration) => minutes + Number(duration), 0)

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const [retrieval, lesson, builder, listening, speaking] = routine.map(Number)
    if (total === 0) {
      setError('ตั้งเวลาอย่างน้อยหนึ่งกิจกรรมให้มากกว่า 0 นาที')
      return
    }
    setPending(true)
    try {
      await saveSettings({ voiceURI, speechRate, routineMinutes: [retrieval, lesson, builder, listening, speaking] })
      onSaved()
    } catch {
      setError('บันทึกการตั้งค่าไม่ได้ ลองอีกครั้ง')
    } finally {
      setPending(false)
    }
  }

  return <Panel>
    <form className="stack" onSubmit={save}>
      <h2>เสียงและกิจวัตร</h2>
      <fieldset className="stack">
        <legend>เสียงภาษาอังกฤษ</legend>
        {supportsVoice ? <>
          <Label>เสียง<NativeSelect value={voiceURI} onChange={(event) => setVoiceURI(event.target.value)}>
            <NativeSelectOption value="">เสียงเริ่มต้นของเครื่อง</NativeSelectOption>
            {voiceURI && !voices.some((voice) => voice.voiceURI === voiceURI) && <NativeSelectOption value={voiceURI}>เสียงที่บันทึกไว้ (ยังไม่พร้อมใช้งาน)</NativeSelectOption>}
            {voices.map((voice) => <NativeSelectOption value={voice.voiceURI} key={voice.voiceURI}>{voice.name} ({voice.lang}){voice.localService ? ' · บนเครื่อง' : ''}</NativeSelectOption>)}
          </NativeSelect></Label>
          <Label>ความเร็วเสียง
            <NativeSelect value={speechRate} onChange={(event) => setSpeechRate(Number(event.target.value))}>
              {[...new Set([0.5, 0.75, 0.9, 1, 1.25, 1.5, 2, speechRate])].sort((a, b) => a - b).map((value) => <NativeSelectOption value={value} key={value}>{value}×</NativeSelectOption>)}
            </NativeSelect>
          </Label>
          <div className="inline"><span>ลองฟังหลังจากบันทึก</span><Speak text="Have you eaten yet?" /></div>
          <p className="muted">รายการเสียงขึ้นอยู่กับเครื่องและเบราว์เซอร์ เสียงบางตัวอาจต้องใช้อินเทอร์เน็ต</p>
        </> : <p>เครื่องนี้ยังเล่นเสียงตัวอย่างไม่ได้ อ่านและฝึกพูดจากข้อความในบทเรียนได้</p>}
      </fieldset>
      <fieldset className="stack">
        <legend>เวลาเรียนต่อรอบ</legend>
        <p className="muted">รวม {total} นาที · ใส่ 0 เพื่อพักกิจกรรมนั้นไว้</p>
        <div className="grid two">
          {routineLabels.map((label, index) => <Label key={label}>{label} (นาที)
            <Input type="number" required min={0} max={180} step={1} value={routine[index]}
              onChange={(event) => setRoutine(routine.map((value, slot) => slot === index ? event.target.value : value))} />
          </Label>)}
        </div>
      </fieldset>
      <div className="actions"><Button type="submit" disabled={pending}>บันทึกการตั้งค่า</Button></div>
      {error && <AlertMessage>{error}</AlertMessage>}
    </form>
  </Panel>
}

function BackupPanel({ onImport }: { onImport: () => void }) {
  const [preview, setPreview] = useState<BackupPreview>()
  const [replace, setReplace] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const recovery = useLiveQuery(() => db.recovery.get('before-replace'), [])

  async function inspectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setPreview(undefined)
    setReplace(false)
    setMessage('')
    setError('')
    setPending(true)
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error('ไฟล์สำรองเกินขนาด 20 MiB')
      setPreview(await previewBackup(await file.text()))
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'เปิดไฟล์สำรองไม่ได้')
    } finally {
      setPending(false)
    }
  }

  async function download(recover: boolean) {
    setMessage('')
    setError('')
    setPending(true)
    try {
      const json = recover ? await getRecoveryBackup() : await exportBackup()
      if (!json) throw new Error('ยังไม่มีข้อมูลกู้คืน')
      downloadJson(json, recover ? 'fluent-blocks-before-replace.json' : 'fluent-blocks-backup.json')
      setMessage('สร้างไฟล์สำรองแล้ว')
    } catch {
      setError('สร้างไฟล์สำรองไม่ได้ ลองอีกครั้ง')
    } finally {
      setPending(false)
    }
  }

  async function importPreview(mode: 'merge' | 'replace') {
    if (!preview || (mode === 'replace' && !replace)) return
    setMessage('')
    setError('')
    setPending(true)
    try {
      await applyBackup(preview, mode)
      onImport()
      setPreview(undefined)
      setReplace(false)
      setMessage(mode === 'replace' ? 'แทนที่ข้อมูลแล้ว ดาวน์โหลดข้อมูลเดิมได้จากสำเนากู้คืน' : 'รวมข้อมูลแล้ว')
    } catch {
      setError('นำเข้าไม่สำเร็จ ข้อมูลก่อนนำเข้ายังอยู่ ลองอีกครั้ง')
    } finally {
      setPending(false)
    }
  }

  return <Panel className="stack">
    <h2>ข้อมูลและไฟล์สำรอง</h2>
    <p>ข้อมูลเรียนอยู่ในเบราว์เซอร์นี้และไม่ซิงก์ข้ามเครื่องโดยอัตโนมัติ เก็บไฟล์สำรองไว้ก่อนล้างข้อมูลเบราว์เซอร์หรือเปลี่ยนเครื่อง</p>
    <div className="actions">
      <Button type="button" variant="outline" disabled={pending} onClick={() => { void download(false) }}>ส่งออก JSON</Button>
      {recovery && <Button type="button" variant="outline" disabled={pending} onClick={() => { void download(true) }}>ดาวน์โหลดสำเนาก่อนแทนที่</Button>}
    </div>
    <Label>เลือกไฟล์สำรอง JSON<Input type="file" accept=".json,application/json" disabled={pending} onChange={inspectFile} /></Label>
    {preview && <div className="stack" aria-label="ตัวอย่างข้อมูลนำเข้า">
      <h3>ตรวจข้อมูลก่อนนำเข้า</h3>
      <ul className="clean">{Object.entries(preview.counts).map(([key, counts]) => <li key={key} className="row">
        <span>{backupLabels[key as BackupKey]}</span>
        <span>นำเข้า {counts.incoming} · ในเครื่อง {counts.current}{counts.conflicts ? ` · ต่างกัน ${counts.conflicts}` : ''}</span>
      </li>)}</ul>
      <p>รวมข้อมูลจะเก็บรายการเดิมไว้และเลือกข้อมูลที่แก้ล่าสุดเมื่อ ID ตรงกัน การแทนที่จะเขียนทับข้อมูลทั้งหมดในแอปและเก็บสำเนาของข้อมูลเดิมก่อนทำรายการ</p>
      <Label className="inline"><Checkbox checked={replace} disabled={pending} onCheckedChange={(checked) => setReplace(checked === true)} />ยืนยันว่าต้องการแทนที่ข้อมูลในเครื่อง</Label>
      <div className="actions">
        <Button type="button" disabled={pending} onClick={() => { void importPreview('merge') }}>รวมข้อมูล</Button>
        <Button type="button" variant="outline" disabled={pending || !replace} onClick={() => { void importPreview('replace') }}>แทนที่ทั้งหมด</Button>
        <Button type="button" variant="outline" disabled={pending} onClick={() => { setPreview(undefined); setReplace(false) }}>ยกเลิก</Button>
      </div>
    </div>}
    {message && <p role="status">{message}</p>}
    {error && <AlertMessage>{error}</AlertMessage>}
  </Panel>
}

export function Settings() {
  const [saved, setSaved] = useState(false)
  const preferences = useLiveQuery(async () => (await db.settings.get('preferences')) ?? defaultSettings, [])
  return <div className="stack page">
    <Heading title="การตั้งค่า" detail="ปรับจังหวะเรียน เลือกเสียง และสำรองข้อมูลของคุณ" />
    {preferences ? <PreferencesForm key={JSON.stringify(preferences)} preferences={preferences} onSaved={() => setSaved(true)} /> : <p role="status">กำลังเปิดการตั้งค่า</p>}
    {saved && <p role="status">บันทึกการตั้งค่าแล้ว</p>}
    <BackupPanel onImport={() => setSaved(false)} />
    <Panel><h2>เพิ่มไว้ที่หน้าจอโฮม</h2><p>บน iPhone เปิด Fluent Blocks ใน Safari แตะปุ่มแชร์ แล้วเลือก Add to Home Screen หลังเปิดแอปครั้งแรก ให้รอข้อความว่าพร้อมใช้งานออฟไลน์ก่อนออกจากเครือข่าย</p></Panel>
  </div>
}
