import { Card } from './ui/card'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../storage'

export function Heading({ label, title, detail }: { label?: string; title: string; detail?: string }) {
  return <header className="page-heading">
    {label && <p className="eyebrow">{label}</p>}
    <h1>{title}</h1>
    {detail && <p className="lead">{detail}</p>}
  </header>
}

export function Panel({ className = '', ...props }: React.ComponentPropsWithoutRef<'section'>) {
  return <Card as="section" className={`panel ${className}`} {...props} />
}

export function Missing() {
  return <><Heading title="ไม่พบหน้านี้" /><Button asChild><Link to="/">กลับหน้าหลัก</Link></Button></>
}

export function useVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  useEffect(() => {
    if (!window.speechSynthesis) return
    const update = () => setVoices(window.speechSynthesis.getVoices().filter((voice) => /^en\b/i.test(voice.lang)))
    update()
    window.speechSynthesis.addEventListener('voiceschanged', update)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])
  return voices
}

export function Speak({ text }: { text: string }) {
  const [error, setError] = useState(false)
  const preferences = useLiveQuery(() => db.settings.get('preferences'), [])
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return null
  function play() {
    setError(false)
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = window.speechSynthesis.getVoices().find((item) => item.voiceURI === preferences?.voiceURI)
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang ?? 'en-US'
    utterance.rate = preferences?.speechRate ?? 0.9
    utterance.onerror = (event) => { if (event.error !== 'interrupted' && event.error !== 'canceled') setError(true) }
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }
  return <span className="audio"><Button variant="outline" size="icon" type="button" onClick={play} aria-label={`ฟังตัวอย่าง ${text}`}><Volume2 size={17} /></Button>{error && <small role="status">เล่นเสียงไม่ได้ ลองอ่านจากตัวอย่าง</small>}</span>
}

export function Example({ en, th, note }: { en: string; th: string; note?: string }) {
  return <div className="example">
    <div className="inline spread"><strong lang="en">{en}</strong><Speak text={en} /></div>
    <div>{th}</div>
    {note && <small>{note}</small>}
  </div>
}
