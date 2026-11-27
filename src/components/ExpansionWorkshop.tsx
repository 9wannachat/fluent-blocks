import { useState } from 'react'
import { ChevronRight, RotateCcw } from 'lucide-react'
import { Panel, Speak } from './ui'
import { Button } from './ui/button'
import { buildExpansion, type Expansion } from '../domain/everyday'

export function ExpansionWorkshop({ expansion }: { expansion: Expansion }) {
  const { base, meaning, steps } = expansion
  const [picked, setPicked] = useState<number[]>([])
  const parts = picked.flatMap((choice, index) => choice < 0 ? [] : [steps[index].choices[choice].fragments])
  const sentence = buildExpansion(base, parts)
  const step = steps[picked.length]
  const explanations = picked.flatMap((choice, index) => choice < 0 ? [] : [steps[index].choices[choice].explanation])
  function choose(index: number) {
    setPicked([...picked, index])
  }
  return <Panel className="stack">
    <h2>ต่อประโยคจากความหมาย</h2>
    <p>เริ่มจาก <span lang="en">{base}</span> · {meaning}</p>
    <div className="example inline spread"><strong lang="en" aria-live="polite">{sentence}</strong><Speak text={sentence} /></div>
    {step ? <><h3>{step.title}</h3><div className="actions">
      {step.choices.map((choice, index) => <Button key={choice.id} type="button" variant="outline" onClick={() => choose(index)}>{choice.label} <ChevronRight size={14} aria-hidden="true" /></Button>)}
      <Button type="button" variant="ghost" onClick={() => choose(-1)}>ข้ามขั้นนี้</Button>
    </div></> : <p>ลองพูดจากใจความหลักก่อน แล้วค่อยเติมรายละเอียดที่คุณเลือก</p>}
    {explanations.length > 0 && <div className="stack"><h3>คำที่เติมเปลี่ยนประโยคอย่างไร</h3><ol>{explanations.map((line, index) => <li key={index}>{line}</li>)}</ol></div>}
    {picked.length > 0 && <div className="actions"><Button type="button" variant="outline" onClick={() => setPicked(picked.slice(0, -1))}>ย้อนหนึ่งขั้น</Button><Button type="button" variant="ghost" onClick={() => setPicked([])}><RotateCcw size={15} aria-hidden="true" /> เริ่มใหม่</Button></div>}
  </Panel>
}
