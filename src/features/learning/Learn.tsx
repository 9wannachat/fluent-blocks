import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Disclosure } from '../../components/ui/disclosure'
import { AlertMessage } from '../../components/ui/alert-message'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Bookmark, CalendarRange, Check, ChevronDown, ChevronRight, Clock3 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible'
import { useLiveQuery } from 'dexie-react-hooks'
import { curriculum, lessonById, patternById } from '../../content'
import { practicalPath } from '../../content/practical'
import { modules } from '../../content/modules'
import { db, updateProgress } from '../../storage'
import { lessonSections as sections, lessonSectionsShort } from './lesson-sections'
import { BackLink, Example, Heading, Missing, Panel, RowLink } from '../../components/ui'
import { Exercise } from '../practice/Exercise'

const orderedLessons = [...curriculum.lessons].sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }))

const studyPlan = [
  ['1–2', 'โครงประโยคและทบทวนพื้นฐานที่ยังติดขัด'],
  ['3–4', 'กริยาช่วย คำถาม และมุมมองต่อเวลา'],
  ['5–6', 'ตำแหน่งคำและการเชื่อมเหตุผล'],
  ['7–8', 'กลุ่มคำที่ใช้จริงและการขยายประโยค'],
  ['9–10', 'เก็บประโยคจากพอดแคสต์และลองเล่าใหม่'],
  ['11–12', 'ฝึกคุยตามสถานการณ์และย้อนทบทวน'],
] as const

export function Learn() {
  const progress = useLiveQuery(() => db.progress.toArray(), []) ?? []
  const saved = progress.filter((entry) => entry.bookmarked && lessonById.has(entry.lessonId))
  return <div className="stack page">
    <Heading label="LEARN" title="เส้นทางการเรียน" detail="เลือกหัวข้อที่อยากใช้จริง หรือกลับมาทบทวนพื้นฐานได้ทุกเมื่อ" />
    <Button asChild variant="outline"><Link to={practicalPath}>ภาษาอังกฤษตามสถานการณ์ <ArrowRight size={16} aria-hidden="true" /></Link></Button>
    <Button asChild variant="outline"><Link to="/learn/diagnostic">สำรวจทักษะและเลือกบทเริ่มต้น <ArrowRight size={16} /></Link></Button>
    <Collapsible asChild><Panel className="plan-panel">
      <div className="plan-head">
        <span className="plan-icon" aria-hidden="true"><CalendarRange size={20} /></span>
        <div><h2>แผนเรียนแบบยืดหยุ่น 12 สัปดาห์</h2><p>6 ช่วง ช่วงละ 2 สัปดาห์ ข้ามบทที่ทำได้แล้วได้</p></div>
        <CollapsibleTrigger asChild><Button type="button" variant="outline" className="plan-toggle">ดูแผน <ChevronDown aria-hidden="true" /></Button></CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ol className="plan-steps">{studyPlan.map(([weeks, focus]) => <li key={weeks}><strong>สัปดาห์ {weeks}</strong><span>{focus}</span></li>)}</ol>
        <p className="plan-note">เลือกข้ามบทที่ทำได้แล้ว และย้อนฝึกทักษะที่ติดขัดจากหน้าหลักได้ทุกสัปดาห์</p>
      </CollapsibleContent>
    </Panel></Collapsible>
    {saved.length > 0 && <Panel className="module-panel"><h2>บุ๊กมาร์ก</h2><ul className="clean lesson-list">{saved.map(({ lessonId }) => <RowLink key={lessonId} to={`/learn/${lessonId}`} subtitle={lessonById.get(lessonId)?.titleEn}>{lessonById.get(lessonId)?.titleTh}</RowLink>)}</ul></Panel>}
    {modules.filter((module) => orderedLessons.some((lesson) => lesson.module === module.id)).map((module) => {
      const lessons = orderedLessons.filter((lesson) => lesson.module === module.id)
      const done = lessons.filter((lesson) => progress.some((entry) => entry.lessonId === lesson.id && entry.completed)).length
      return <Panel key={module.id} className="module-panel">
        <div className="module-heading">
          <div><p className="eyebrow" lang="en">{module.en}</p><h2>{module.th}</h2></div>
          <span className="module-count">อ่านจบ <strong>{done}/{lessons.length}</strong></span>
        </div>
        <ol className="clean lesson-list">{lessons.map((lesson, index) => {
          const entry = progress.find((item) => item.lessonId === lesson.id)
          const status = entry?.completed ? 'done' : entry ? 'started' : 'new'
          return <li key={lesson.id}>
            <Link className={`lesson-row ${status}`} to={`/learn/${lesson.id}`}>
              <span className="lesson-index" aria-hidden="true">{status === 'done' ? <Check size={14} /> : index + 1}</span>
              <span className="lesson-text"><span className="lesson-title">{lesson.titleTh}</span><small lang="en">{lesson.titleEn}</small></span>
              <span className="lesson-meta">{status === 'done' ? <span className="lesson-badge">อ่านจบแล้ว</span> : status === 'started' ? <span className="lesson-badge started">กำลังเรียน</span> : null}<span>{lesson.minutes} นาที</span></span>
              <ChevronRight className="lesson-chevron" size={18} aria-hidden="true" />
            </Link>
          </li>
        })}</ol>
        <Button asChild variant="outline" className="module-review"><Link to={`/learn/module/${module.id}/review`}>ทบทวนท้ายหมวด <ArrowRight size={15} /></Link></Button>
      </Panel>
    })}
  </div>
}


export function LessonPage() {
  const { lessonId = '' } = useParams()
  const lesson = lessonById.get(lessonId)
  // null = no saved progress yet; undefined = still loading (render nothing that depends on the resume point).
  const progress = useLiveQuery(async () => (await db.progress.get(lessonId)) ?? null, [lessonId])
  const [error, setError] = useState('')
  useEffect(() => {
    if (!lesson) return
    void updateProgress(lessonId, {}).catch(() => setError('บันทึกความคืบหน้าไม่ได้ ลองอีกครั้ง'))
  }, [lesson, lessonId])
  if (!lesson) return <Missing />
  const active = Math.min(progress?.resumeBlock ?? 0, sections.length - 1)
  async function save(patch: Parameters<typeof updateProgress>[1]) {
    setError('')
    try { await updateProgress(lessonId, patch) }
    catch { setError('บันทึกความคืบหน้าไม่ได้ ลองอีกครั้ง') }
  }

  return <div className="stack page">
    <BackLink to="/learn">เส้นทางการเรียน</BackLink>
    <Heading label={lesson.titleEn} title={lesson.titleTh} detail={lesson.hook} />
    <div className="actions">
      <Button type="button" variant="outline" aria-pressed={progress?.bookmarked ?? false} onClick={() => void save({ bookmarked: !progress?.bookmarked })}><Bookmark size={17} />{progress?.bookmarked ? 'บุ๊กมาร์กแล้ว' : 'บุ๊กมาร์ก'}</Button>
      <span className="inline muted"><Clock3 size={16} /> {lesson.minutes} นาที</span>
    </div>
    {error && <AlertMessage>{error}</AlertMessage>}
    {progress === undefined ? <div className="lesson-loading" role="status"><span className="sr-only">กำลังเปิดบทเรียน</span></div> : <Tabs className="lesson-tabs" value={String(active)} activationMode="manual" onValueChange={(value) => void save({ resumeBlock: Number(value) })}>
      <TabsList aria-label="ส่วนของบทเรียน">{sections.map((section, index) => <TabsTrigger value={String(index)} key={section}><span className="tab-step" aria-hidden="true">{index + 1}</span><span className="tab-full">{section}</span><span className="tab-short" aria-hidden="true">{lessonSectionsShort[index]}</span></TabsTrigger>)}</TabsList>
    <TabsContent value="0"><Panel className="stack">
      <h2>เป้าหมาย</h2><p>{lesson.objective}</p>
      <h2>คิดจากสิ่งที่อยากพูด</h2><p>{lesson.concept}</p>
      <div className="formula" lang="en">{lesson.formula}</div>
      <Disclosure title="อ่านหน้าที่ของคำในสูตร">
        <ul className="builder-tokens">
          <li className="builder-token role-subject"><span lang="en">Subject</span><small>คนหรือสิ่งที่ประโยคพูดถึง</small></li>
          <li className="builder-token role-auxiliary"><span lang="en">Auxiliary</span><small>กริยาช่วยที่บอกเวลา ท่าที หรือรับหน้าที่ในคำถาม</small></li>
          <li className="builder-token role-verb"><span lang="en">Main verb</span><small>กริยาหลักที่บอกสิ่งที่เกิดขึ้นหรือสภาพ</small></li>
          <li className="builder-token role-object"><span lang="en">Object / complement</span><small>กรรมหรือคำที่เติมใจความของกริยาให้ครบ</small></li>
          <li className="builder-token role-modifier"><span lang="en">Modifier</span><small>คำขยายเวลา ระดับ หรือรายละเอียดอื่น</small></li>
        </ul>
      </Disclosure>
      {lesson.prerequisites.length > 0 && <><h3>บทที่เกี่ยวข้อง</h3><ul className="clean lesson-list">{lesson.prerequisites.map((id) => <RowLink key={id} to={`/learn/${id}`} subtitle={lessonById.get(id)?.titleEn}>{lessonById.get(id)?.titleTh}</RowLink>)}</ul></>}
    </Panel></TabsContent>
    <TabsContent value="1"><Panel className="stack">
      <h2>ตัวอย่างที่นำไปใช้ได้</h2>{lesson.examples.map((item) => <Example {...item} key={item.en} />)}
      <h2>เปรียบเทียบ</h2>{lesson.contrasts.map(({ a, b, note }) => <div className="example" key={a}><strong lang="en">{a} / {b}</strong><p>{note}</p></div>)}
      <h2>บทสนทนา</h2>{lesson.dialogue.map((item, index) => <Example {...item} key={index} />)}
      <h2>จุดที่พลาดบ่อย</h2>{lesson.mistakes.map(({ wrong, right, note }) => <div className="example" key={wrong}><span lang="en"><s>{wrong}</s> → <strong>{right}</strong></span><p>{note}</p></div>)}
    </Panel></TabsContent>
    <TabsContent value="2"><Panel className="stack"><h2>ลองใช้โครงสร้าง</h2>{lesson.exercises.map((item) => <Exercise item={item} key={item.id} objective={lesson.id} />)}</Panel></TabsContent>
    <TabsContent value="3"><Panel className="stack">
      <h2>พูดด้วยตัวเอง</h2><p>{lesson.speaking}</p>
      <Exercise key={lesson.id} objective={lesson.id} item={{
        id: `${lesson.id}-speaking`, kind: 'speaking', prompt: 'จดใจความที่พูดหรือประโยคที่พูดออกมา',
        answers: lesson.examples.slice(0, 2).map((item) => item.en), hint: lesson.formula, explanation: lesson.concept,
      }} />
      <h3>รูปแบบที่ควรทบทวน</h3><ul className="clean lesson-list">{lesson.review.map((id) => <RowLink key={id} to={`/reference/pattern/${id}`} lang="en" subtitle={patternById.get(id)?.meaning}>{patternById.get(id)?.template}</RowLink>)}</ul>
      <Button type="button" aria-pressed={progress?.completed ?? false} onClick={() => void save({ completed: !progress?.completed })}>{progress?.completed ? 'อ่านจบแล้ว' : 'บันทึกว่าอ่านจบ'}</Button>
    </Panel></TabsContent>
    </Tabs>}
    {active === sections.length - 1 && <div className="actions">{orderedLessons[orderedLessons.indexOf(lesson) + 1] && <Button asChild variant="outline"><Link to={`/learn/${orderedLessons[orderedLessons.indexOf(lesson) + 1].id}`}>บทถัดไป <ArrowRight size={16} /></Link></Button>}<Link to={`/learn/module/${lesson.module}/review`}>ทบทวนท้ายหมวด</Link></div>}
    {active < sections.length - 1 && <Button type="button" onClick={() => void save({ resumeBlock: active + 1 })}>{sections[active + 1]} <ArrowRight size={16} /></Button>}
  </div>
}

export function ModuleReview() {
  const { moduleId } = useParams()
  const module = modules.find((item) => String(item.id) === moduleId)
  const items = orderedLessons.filter((lesson) => lesson.module === module?.id)
  if (!module || items.length === 0) return <Missing />
  return <div className="stack page"><BackLink to="/learn">เส้นทางการเรียน</BackLink><Heading label={module.en} title={`ทบทวน ${module.th}`} detail="ลองดึงสิ่งที่เรียนกลับมาใช้จากความจำ แล้วอธิบายให้ตัวเองฟังว่าทำไมจึงเลือกแบบนี้" />
    {items.map((lesson) => <Panel key={lesson.id}><h2>{lesson.titleTh}</h2><Exercise item={lesson.exercises.at(-1)!} objective={lesson.id} /></Panel>)}
  </div>
}
