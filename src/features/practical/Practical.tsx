import { ExpansionWorkshop } from '../../components/ExpansionWorkshop'
import { practicalWorkshops } from '../../content/practical/workshops'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowRight } from 'lucide-react'
import { BackLink, Example, Heading, Missing, Panel, RowLink, Speak } from '../../components/ui'
import { AlertMessage } from '../../components/ui/alert-message'
import { Button } from '../../components/ui/button'
import { Disclosure } from '../../components/ui/disclosure'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import {
  practical, practicalLessonById, practicalLessonPath, practicalModules, practicalPath,
  practicalReviewId, resolvePracticalRelated,
} from '../../content/practical'
import type { PracticalLesson } from '../../domain/practical'
import { db, enqueuePattern, updateProgress } from '../../storage'
import { Exercise } from '../practice/Exercise'

const registerLabels = {
  polite: 'สุภาพ', formal: 'ทางการ', neutral: 'ทั่วไป', casual: 'คุยสบาย ๆ', informal: 'กันเอง',
}
const sections = ['คำและวลี', 'ตัวอย่าง', 'ลองฝึก', 'บทบาทสมมติ'] as const

export function PracticalHome() {
  return <div className="stack page">
    <BackLink to="/learn">เส้นทางการเรียน</BackLink>
    <Heading title="ภาษาอังกฤษตามสถานการณ์" detail="เลือกเหตุการณ์ที่อยากรับมือ แล้วลองพูดด้วยคำของคุณ" />
    <Panel><ul className="clean lesson-list">{practicalModules.map(({ id, title, description }) =>
      <RowLink key={id} to={`${practicalPath}/${id}`} subtitle={description} lang="en">{title}</RowLink>)}</ul></Panel>
  </div>
}

export function PracticalModulePage({ review = false }: { review?: boolean }) {
  const { moduleId } = useParams()
  const module = practicalModules.find(({ id }) => id === moduleId)
  const lessons = practical.lessons.filter((lesson) => lesson.moduleId === moduleId)
  const progress = useLiveQuery(async () => new Set((await db.progress.toArray())
    .filter((entry) => entry.completed).map(({ lessonId }) => lessonId)), [])
  if (!module) return <Missing />
  return <div className="stack page">
    <BackLink to={review ? `${practicalPath}/${module.id}` : practicalPath}>{review ? module.title : 'ภาษาอังกฤษตามสถานการณ์'}</BackLink>
    <Heading title={review ? 'ทบทวนท้ายห้อง' : module.title} detail={review ? module.title : module.description} />
    {review ? lessons.map((lesson) => <Panel className="stack" key={lesson.id}>
      <h2>{lesson.titleTh}</h2>
      <Exercise item={lesson.exercises.at(-1)!} objective={lesson.id} />
    </Panel>) : <>
      <Panel className="stack"><h2>บทเรียน {progress && <small>{lessons.filter(({ id }) => progress.has(id)).length} / {lessons.length} บท</small>}</h2>
        <ul className="clean lesson-list">{lessons.map((lesson) => <RowLink key={lesson.id} to={practicalLessonPath(lesson)} subtitle={lesson.titleEn}>
          {lesson.titleTh}{progress?.has(lesson.id) && <small className="everyday-status">อ่านจบแล้ว</small>}
        </RowLink>)}</ul>
      </Panel>
      <Button asChild variant="outline"><Link to={`${practicalPath}/${module.id}/review`}>ทบทวนท้ายห้อง <ArrowRight size={16} aria-hidden="true" /></Link></Button>
    </>}
  </div>
}

function Vocabulary({ lesson }: { lesson: PracticalLesson }) {
  return <Panel className="stack"><h2>คำที่ใช้ในสถานการณ์นี้</h2>
    <p><strong>เป้าหมาย</strong> {lesson.objective}</p><p>{lesson.concept}</p>
    {lesson.vocabulary.map(({ term, pronunciation, meaning, context, forms, register, variant }) =>
      <div key={term} className="example stack">
        <div className="inline spread"><strong lang="en">{term}</strong><Speak text={term} /></div>
        <p><span lang="en">{pronunciation}</span> · {meaning}</p>
        <p>{context}</p>
        {(register || variant) && <p className="muted">{[register && registerLabels[register], variant].filter(Boolean).join(' · ')}</p>}
        {forms?.length ? <p>รูปคำ <span lang="en">{forms.join(' · ')}</span></p> : null}
      </div>)}
    <h3>คำที่ใช้คู่กัน</h3><ul>{lesson.collocations.map((value) => <li key={value}>{value}</li>)}</ul>
    <h3>กริยาวลีในบริบท</h3><ul>{lesson.phrasalVerbs.map((value) => <li key={value}>{value}</li>)}</ul>
    <h3>รูปประโยคที่นำไปใช้ซ้ำ</h3><div className="formula" lang="en">{lesson.formula}</div>
  </Panel>
}

function Examples({ lesson }: { lesson: PracticalLesson }) {
  return <Panel className="stack">
    <h2>ตัวอย่างในสถานการณ์</h2>
    {lesson.examples.map((example) => <Example key={example.en} {...example} />)}
    <h3>เทียบความหมาย</h3>
    {lesson.contrasts.map(({ a, b, note }) => <div key={a} className="example"><strong lang="en">{a} / {b}</strong><p>{note}</p></div>)}
    <h3>จุดที่แก้แล้วฟังเป็นธรรมชาติขึ้น</h3>
    <ul>{lesson.mistakes.map(({ wrong, right, note }) => <li key={wrong}><span lang="en"><s>{wrong}</s> → <strong>{right}</strong></span><p>{note}</p></li>)}</ul>
  </Panel>
}

function PracticalLessonView({ lesson }: { lesson: PracticalLesson }) {
  const cardId = practicalReviewId(lesson.id)
  const state = useLiveQuery(async () => ({
    progress: await db.progress.get(lesson.id),
    review: await db.reviews.get(cardId),
  }), [lesson.id, cardId])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState('0')
  async function save(action: () => Promise<unknown>) {
    setPending(true)
    setError(false)
    try { await action() } catch { setError(true) } finally { setPending(false) }
  }
  const scenario = practical.scenarios.find(({ objectiveId }) => objectiveId === lesson.id)
  const workshop = practicalWorkshops[lesson.id]
  const related = lesson.relatedIds.flatMap((id) => resolvePracticalRelated(id) ?? [])
  return <div className="stack page">
    <BackLink to={`${practicalPath}/${lesson.moduleId}`}>กลับไปที่ห้องเรียน</BackLink>
    <Heading label={lesson.titleEn} title={lesson.titleTh} detail={lesson.hook} />
    <Tabs className="lesson-tabs" value={tab} onValueChange={setTab}>
      <TabsList aria-label="ส่วนของบทเรียน">{sections.map((section, index) => <TabsTrigger key={section} value={String(index)}>{section}</TabsTrigger>)}</TabsList>
      <TabsContent value="0"><Vocabulary lesson={lesson} /></TabsContent>
      <TabsContent value="1"><Examples lesson={lesson} /></TabsContent>
      <TabsContent value="2"><div className="stack">{workshop && <ExpansionWorkshop expansion={workshop} />}<Panel className="stack"><h2>ลองตอบจากสถานการณ์</h2>
        {lesson.exercises.map((exercise) => <Exercise key={exercise.id} item={exercise} objective={lesson.id} />)}
      </Panel></div></TabsContent>
      <TabsContent value="3"><Panel className="stack"><h2>ลองรับบทแล้วพูดเอง</h2>
        <p>{lesson.speaking}</p>
        {scenario && <div className="actions"><Button asChild><Link to={`/practice/conversation/${scenario.id}`}>เปิดบทสนทนาโต้ตอบ</Link></Button></div>}
        <Disclosure title="ฟังบทสนทนาตัวอย่าง">
          {lesson.dialogue.map(({ en, th }, index) => <Example key={index} en={en} th={th} />)}
        </Disclosure>
        <Exercise objective={lesson.id} item={{
          id: `${lesson.id}-roleplay`, kind: 'speaking', prompt: 'ลองพูดโดยใช้รายละเอียดของคุณเอง แล้วจดประโยคที่พูด',
          answers: lesson.dialogue.map(({ en }) => en), hint: lesson.formula, explanation: lesson.concept,
          selfCheck: ['คำตอบสื่อสิ่งที่ต้องการในสถานการณ์นี้หรือไม่', 'ระบุรายละเอียดที่คู่สนทนาต้องใช้เพื่อตอบหรือช่วยต่อหรือไม่'],
        }} />
      </Panel></TabsContent>
    </Tabs>
    {related.length > 0 && <Panel className="stack"><h2>เนื้อหาที่ใช้ต่อได้</h2>
      <ul className="clean lesson-list">{related.map(({ title, to }) => <RowLink key={to} to={to}>{title}</RowLink>)}</ul>
    </Panel>}
    {lesson.vocabulary.some(({ term }) => term.toLowerCase() === 'contain') && <div className="actions"><Button asChild variant="outline"><Link to="/practice/builder?preset=contain">ลองสร้างคำถามเรื่องส่วนผสม</Link></Button></div>}
    <Panel className="stack"><h2>ความคืบหน้าและทบทวน</h2>
      {state ? <div className="actions">
        <Button type="button" variant={state.progress?.completed ? 'outline' : 'default'} aria-pressed={state.progress?.completed ?? false} disabled={pending}
          onClick={() => void save(() => updateProgress(lesson.id, { completed: !state.progress?.completed }))}>
          {state.progress?.completed ? 'อ่านจบแล้ว' : 'บันทึกว่าอ่านจบ'}
        </Button>
        {state.review ? <Button asChild variant="outline"><Link to="/review">เปิดคิวทบทวน</Link></Button> :
          <Button type="button" variant="outline" disabled={pending} onClick={() => void save(() => enqueuePattern(cardId))}>เพิ่มในคิวทบทวน</Button>}
      </div> : <p role="status">กำลังเปิดความคืบหน้า</p>}
      {error && <AlertMessage>บันทึกไม่ได้ ลองอีกครั้ง</AlertMessage>}
    </Panel>
  </div>
}

export function PracticalLessonPage() {
  const { moduleId, lessonId = '' } = useParams()
  const lesson = practicalLessonById.get(lessonId)
  return lesson && lesson.moduleId === moduleId ? <PracticalLessonView key={lesson.id} lesson={lesson} /> : <Missing />
}
