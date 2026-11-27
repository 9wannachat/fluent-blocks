import { resolveReviewItem } from '../../content/review-items'
import { Link } from 'react-router-dom'
import { ArrowRight, AudioLines, BookOpen, Clock3, Compass, MessageCircle, PenLine, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { curriculum, lessonById } from '../../content'
import { modules } from '../../content/modules'
import { db, defaultSettings, summarizeObjectives } from '../../storage'
import { localDateKey } from '../../domain/review'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { lessonSections } from './lesson-sections'

const preferred = ['m2-06', 'm2-07', 'm3-05', 'm5-01', 'm7-01', 'm8-01']
const orderedLessons = [...curriculum.lessons].sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }))
const routineItems = [
  { label: 'ทบทวนจากความจำ', route: '/review', Icon: RotateCcw },
  { label: 'อ่านบทเรียน', route: '/learn', Icon: BookOpen },
  { label: 'สร้างประโยค', route: '/practice/builder', Icon: PenLine },
  { label: 'วิเคราะห์สิ่งที่ฟัง', route: '/practice/podcast', Icon: AudioLines },
  { label: 'พูดหรือเล่าใหม่', route: '/practice/conversation', Icon: MessageCircle },
]

export function Home() {
  const state = useLiveQuery(async () => ({
    progress: await db.progress.toArray(),
    reviews: await db.reviews.toArray(),
    attempts: await db.attempts.toArray(),
    settings: await db.settings.get('preferences'),
  }), [])
  const completed = new Set(state?.progress.filter((item) => item.completed && lessonById.has(item.lessonId)).map((item) => item.lessonId))
  const current = state?.progress.filter((item) => !item.completed && lessonById.has(item.lessonId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
  const next = (current && lessonById.get(current.lessonId)) ??
    preferred.map((id) => lessonById.get(id)).find((lesson) => lesson && !completed.has(lesson.id)) ??
    orderedLessons.find((lesson) => !completed.has(lesson.id))
  const currentModule = modules.find((module) => module.id === next?.module)
  const total = orderedLessons.length
  const percent = Math.round(completed.size / total * 100)
  const sectionIndex = Math.min(current?.resumeBlock ?? 0, lessonSections.length - 1)
  const due = state?.reviews.filter((item) => item.dueOn <= localDateKey(new Date()) && resolveReviewItem(item.patternId)).length ?? 0
  const scores = summarizeObjectives(state?.attempts ?? []).filter(({ objectiveId }) => lessonById.has(objectiveId))
  const lastPracticedAt = scores.map((score) => score.lastPracticedAt).sort().at(-1)
  const weakest = scores.filter((score) => score.incorrect > 0).sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0)).slice(0, 3)
  const routine = state?.settings?.routineMinutes ?? defaultSettings.routineMinutes

  return <div className="dashboard">
    <header className="dashboard-heading">
      <h1>จากฟังเข้าใจ สู่พูดได้ด้วยตัวเอง</h1>
      <p>ฝึกสร้างประโยคจากสิ่งที่อยากสื่อ แล้วนำไปใช้ในบทสนทนาจริง</p>
    </header>

    <Card className="dashboard-card dashboard-feature">
      <div className="feature-lesson">
        <div className="feature-meta">
          <span className="feature-kicker">{current ? 'เรียนต่อ' : next ? 'บทเรียนแนะนำ' : 'เส้นทางการเรียน'}</span>
          {currentModule && <span>{currentModule.th}</span>}
        </div>
        <h2>{next?.titleTh ?? 'ทบทวนบทเรียนที่เคยเรียน'}</h2>
        {next && <p className="lesson-english" lang="en">{next.titleEn}</p>}
        <p className="feature-description">{next?.hook ?? 'เลือกหัวข้อที่อยากฝึกซ้ำ หรือฝึกพูดจากสถานการณ์จริง'}</p>
        <div className="actions feature-actions">
          <Button asChild size="lg" className="dashboard-cta">
            <Link to={next ? `/learn/${next.id}` : '/learn'}>{current ? 'กลับไปเรียนต่อ' : next ? 'เริ่มบทเรียน' : 'เปิดเส้นทางเรียน'} <ArrowRight aria-hidden="true" /></Link>
          </Button>
          {next && <span className="inline muted feature-duration"><Clock3 size={15} aria-hidden="true" /> {next.minutes} นาที</span>}
        </div>
      </div>
      <div className="feature-progress">
        {completed.size > 0 ? <div className="ring-layout">
          <div className="dashboard-ring" aria-hidden="true">
            <svg viewBox="0 0 96 96" fill="none"><circle cx="48" cy="48" r="42" /><circle className="ring-fill" cx="48" cy="48" r="42" pathLength="100" strokeDasharray={`${percent} 100`} /></svg>
            <span>{percent}<small>%</small></span>
          </div>
          <div><h3>ความคืบหน้าหลักสูตร</h3><p>อ่านจบ <strong>{completed.size} / {total}</strong> บท</p></div>
        </div> : <div className="progress-empty">
          <h3>ความคืบหน้าหลักสูตร</h3>
          <p><strong>{total}</strong> บทใน <strong>{modules.length}</strong> หมวด</p>
          <p className="muted">กด “บันทึกว่าอ่านจบ” ท้ายบทเรียน แล้วความคืบหน้าจะเริ่มนับที่นี่</p>
        </div>}
        {current && <div className="resume-progress">
          <p className="resume-label">บทนี้อยู่ที่ส่วน <strong>{sectionIndex + 1} จาก {lessonSections.length}</strong> · {lessonSections[sectionIndex]}</p>
          <Progress aria-label="ตำแหน่งในบทเรียนปัจจุบัน" value={(sectionIndex + 1) / lessonSections.length * 100} getValueLabel={() => `ส่วนที่ ${sectionIndex + 1} จาก ${lessonSections.length}`} />
        </div>}
      </div>
    </Card>

    <div className="dashboard-pair">
      <Card className="dashboard-card dashboard-summary">
        <CardHeader className="summary-heading"><span className="dashboard-icon"><RotateCcw size={19} aria-hidden="true" /></span><h2>ทบทวนวันนี้</h2></CardHeader>
        <CardContent><p>{due ? <><strong>{due}</strong> รายการถึงกำหนด</> : 'วันนี้ไม่มีรายการถึงกำหนด'}</p>
          <Button asChild variant="ghost" className="dashboard-link"><Link to="/review">เปิดคิวทบทวน <ArrowRight aria-hidden="true" /></Link></Button>
        </CardContent>
      </Card>
      <Card className="dashboard-card dashboard-summary">
        <CardHeader className="summary-heading"><span className="dashboard-icon"><Compass size={19} aria-hidden="true" /></span><h2>เลือกจุดเริ่มต้น</h2></CardHeader>
        <CardContent><p>สำรวจทักษะเพื่อเลือกบทที่เหมาะกับคุณ</p>
          <Button asChild variant="ghost" className="dashboard-link"><Link to="/learn/diagnostic">ทำแบบสำรวจ <ArrowRight aria-hidden="true" /></Link></Button>
        </CardContent>
      </Card>
    </div>

    <div className="dashboard-pair dashboard-details">
      <Card className="dashboard-card">
        <CardHeader className="dashboard-card-heading"><h2>กิจวัตร {routine.reduce((sum, minutes) => sum + minutes, 0)} นาที</h2>
          <Button asChild variant="outline" className="dashboard-secondary"><Link to="/settings"><SlidersHorizontal aria-hidden="true" /> ปรับเวลา</Link></Button>
        </CardHeader>
        <CardContent><ul className="clean routine-list">{routineItems.map(({ label, route, Icon }, index) =>
          <li key={label}><Link to={route}><Icon size={16} aria-hidden="true" /><span>{label}</span><small>{routine[index]} นาที</small></Link></li>
        )}</ul></CardContent>
      </Card>
      <Card className="dashboard-card">
        <CardHeader className="dashboard-card-heading"><h2>ผลการฝึก</h2></CardHeader>
        {state && state.attempts.length === 0 ? <CardContent className="practice-summary practice-empty">
          <p>ยังไม่มีผลการฝึก</p>
          <p className="muted">ตอบแบบฝึกในบทเรียนหรือห้องฝึก แล้วจะเห็นจำนวนข้อที่ตอบถูกและหัวข้อที่ควรฝึกเพิ่มที่นี่</p>
          <Button asChild variant="ghost" className="dashboard-link"><Link to="/practice">เริ่มฝึก <ArrowRight aria-hidden="true" /></Link></Button>
        </CardContent> : <CardContent className="practice-summary">
          <dl className="dashboard-metrics">
            <div><dt>ตอบถูก</dt><dd>{state?.attempts.filter((item) => item.outcome === 'correct').length ?? 0}</dd></div>
            <div><dt>ประเมินตนเอง</dt><dd>{state?.attempts.filter((item) => item.outcome === 'self-assessed').length ?? 0}</dd></div>
          </dl>
          {lastPracticedAt && <p className="muted">ฝึกล่าสุด {new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lastPracticedAt))}</p>}
          {weakest.length > 0 ? <div className="practice-weak"><h3>หัวข้อที่ควรฝึกเพิ่ม</h3><ul className="clean">{weakest.map((score) => <li key={score.objectiveId}><Link to={`/learn/${score.objectiveId}`}>{lessonById.get(score.objectiveId)?.titleTh}</Link><small>ถูก {score.correct}/{score.correct + score.incorrect} ครั้ง</small></li>)}</ul></div> :
            <Button asChild variant="ghost" className="dashboard-link"><Link to="/practice">ไปที่แบบฝึก <ArrowRight aria-hidden="true" /></Link></Button>}
        </CardContent>}
      </Card>
    </div>
  </div>
}
