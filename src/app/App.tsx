import { Alert } from '../components/ui/alert'
import { Separator } from '../components/ui/separator'
import { Button } from '../components/ui/button'
import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { BookOpen, LayoutGrid, LibraryBig, PencilLine, Settings as SettingsIcon } from 'lucide-react'
import { useOffline } from './useOffline'
import { Heading, Missing } from '../components/ui'
import { Learn, LessonPage, ModuleReview } from '../features/learning/Learn'
import { Home } from '../features/learning/Home'
import { Diagnostic } from '../features/learning/Diagnostic'
import { Builder } from '../features/sentence-builder/Builder'
import { ConnectorLab, DecisionLab, Practice } from '../features/practice/Practice'
import { Reference, PatternPage, Review, TopicPage } from '../features/reference/Reference'
import { Vocabulary } from '../features/reference/Vocabulary'
import { Podcast } from '../features/podcast/Podcast'
import { Conversation } from '../features/practice/Conversation'
import { Settings } from '../features/settings/Settings'

const destinations = [
  { title: 'ภาพรวม', en: 'Overview', to: '/', icon: LayoutGrid },
  { title: 'เรียน', en: 'Learn', to: '/learn', icon: BookOpen },
  { title: 'ฝึกใช้', en: 'Practice', to: '/practice', icon: PencilLine },
  { title: 'อ้างอิง', en: 'Reference', to: '/reference', icon: LibraryBig },
]

function Navigation({ className, desktop = false }: { className: string; desktop?: boolean }) {
  return <nav className={className} aria-label="เมนูหลัก">{destinations.map(({ title, en, to, icon: Icon }) =>
    <Button asChild variant="ghost" key={to}><NavLink end={to === '/'} to={to}><Icon size={desktop ? 19 : 20} aria-hidden="true" /><span>{title}<small lang="en">{en}</small></span></NavLink></Button>)}</nav>
}

function Connection() {
  const [online, setOnline] = useState(navigator.onLine)
  const { offlineReady, dismissReady, waiting, updating, update, error } = useOffline()
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine)
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => { window.removeEventListener('online', sync); window.removeEventListener('offline', sync) }
  }, [])
  return <>{!online && <Alert className="notice" role="status">ออฟไลน์ · เปิดบทเรียนที่มากับแอปได้เมื่อเตรียมข้อมูลเสร็จ</Alert>}
    {offlineReady && <Alert className="notice inline spread" role="status">บทเรียนพร้อมใช้ออฟไลน์ <Button type="button" variant="outline" onClick={dismissReady}>ปิดข้อความ</Button></Alert>}
    {waiting && <Alert className="notice inline spread" role="status">มีแอปรุ่นใหม่ <Button type="button" disabled={updating} onClick={update}>{updating ? 'กำลังอัปเดต' : 'อัปเดตและโหลดใหม่'}</Button></Alert>}
    {error && <Alert className="notice" role="status">เตรียมออฟไลน์หรืออัปเดตไม่สำเร็จ ลองโหลดหน้านี้ใหม่เมื่อออนไลน์</Alert>}
  </>
}

export function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return <div className="shell">
    <a className="skip-link" href="#main">ข้ามไปเนื้อหา</a>
    <header className="mobile-header"><Brand /><Button asChild variant="outline" size="icon"><Link to="/settings" aria-label="ตั้งค่า"><SettingsIcon size={21} /></Link></Button></header>
    <aside className="sidebar"><Brand /><Separator className="sidebar-divider" /><Navigation className="side-nav" desktop /><Button asChild variant="outline"><NavLink className="side-settings" to="/settings"><SettingsIcon size={19} aria-hidden="true" /><span>ตั้งค่า<small lang="en">Settings</small></span></NavLink></Button></aside>
    <main className="main" id="main" tabIndex={-1}>
      <Connection />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/diagnostic" element={<Diagnostic />} />
        <Route path="/learn/module/:moduleId/review" element={<ModuleReview />} />
        <Route path="/learn/:lessonId" element={<LessonPage key={pathname} />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/builder" element={<div className="stack page"><Link to="/practice">← ฝึกใช้</Link><Heading label="SENTENCE BUILDER" title="สร้างประโยคจากเจตนา" /><Builder /></div>} />
        <Route path="/practice/decision" element={<DecisionLab />} />
        <Route path="/practice/connectors" element={<ConnectorLab />} />
        <Route path="/practice/podcast" element={<Podcast />} />
        <Route path="/practice/conversation" element={<Conversation />} />
        <Route path="/practice/conversation/:scenarioId" element={<Conversation key={pathname} />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="/reference/pattern/:patternId" element={<PatternPage />} />
        <Route path="/reference/topics/:topicId" element={<TopicPage />} />
        <Route path="/reference/notebook" element={<Vocabulary />} />
        <Route path="/review" element={<Review />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Missing />} />
      </Routes>
    </main>
    <Navigation className="bottom-nav" />
  </div>
}

function Brand() {
  return <Link className="brand" to="/" aria-label="Fluent Blocks หน้าหลัก"><span className="brand-mark" aria-hidden="true" /><span lang="en">Fluent Blocks</span></Link>
}
