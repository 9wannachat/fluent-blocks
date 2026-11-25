import { Button } from '../../components/ui/button'
import { Disclosure } from '../../components/ui/disclosure'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, AudioLines, BookOpenCheck, Cable, MessageCircle, Puzzle, Waypoints } from 'lucide-react'
import { BackLink, Heading, Panel, Example } from '../../components/ui'
import { Exercise } from './Exercise'

const tools = [
  { title: 'สร้างประโยค', en: 'Sentence Builder', detail: 'เลือกเจตนาแล้วดูว่าคำแต่ละส่วนทำงานอย่างไร', route: 'builder', icon: Puzzle },
  { title: 'เลือกโครงสร้าง', en: 'Decision Lab', detail: 'เทียบความหมายก่อนเลือกกริยาช่วยและรูปกริยา', route: 'decision', icon: Waypoints },
  { title: 'ขยายและเชื่อมประโยค', en: 'Connector Lab', detail: 'ลองย้ายคำ เปลี่ยนจุดเน้น และเชื่อมความคิด', route: 'connectors', icon: Cable },
  { title: 'ฝึกสนทนา', en: 'Conversation Lab', detail: 'ตอบคำถาม ฟังเหตุผล และต่อบทสนทนา', route: 'conversation', icon: MessageCircle },
  { title: 'สมุดพอดแคสต์', en: 'Podcast Lab', detail: 'เก็บประโยคที่ฟังแล้วนำไปพูดในบริบทของคุณ', route: 'podcast', icon: AudioLines },
  { title: 'ทบทวนจากความจำ', en: 'Spaced Review', detail: 'นึกรูปประโยคที่ถึงกำหนดทบทวน แล้วให้คะแนนว่าจำได้แค่ไหน', route: '/review', icon: BookOpenCheck },
]

export function Practice() {
  return <div className="stack page"><Heading label="PRACTICE" title="ลองพูดจากสิ่งที่อยากสื่อ" detail="ฝึกเลือกโครงสร้าง ประกอบประโยค แล้วใช้กับเรื่องของคุณเอง" />
    <div className="grid two">{tools.map(({ title, en, detail, route, icon: Icon }) => <Panel className="lab-link" key={route}>
      <span className="lab-icon"><Icon size={22} /></span><span className="eyebrow" lang="en">{en}</span>
      <h2><Link to={route}>{title}</Link></h2><p>{detail}</p><ArrowRight className="lab-arrow" size={18} />
    </Panel>)}</div></div>
}

const decisions = [
  { label: 'ความชอบหรือกิจวัตร', example: 'Does she like you?', th: 'เธอชอบคุณไหม', reason: 'ความชอบเป็นภาวะที่ใช้ present simple กับ like ถามด้วย does แล้วคืน likes เป็น like', short: 'Yes, she does.', follow: 'What does she like about you?', choices: ['Does she like you?', 'Does she likes you?', 'Is she like you?'], id: 'm2-07' },
  { label: 'สภาพหรือความรู้สึกตอนนี้', example: 'Are you hungry?', th: 'คุณหิวไหม', reason: 'Hungry เป็น adjective ที่บอกสภาพ ใช้ be แล้วดึง are ไว้ข้างหน้าในคำถาม', short: 'Yes, I am.', follow: 'What would you like to eat?', choices: ['Do you hungry?', 'Are you hungry?', 'Are you hunger?'], id: 'm2-06' },
  { label: 'กำลังทำอยู่', example: 'Are you eating?', th: 'คุณกำลังกินอยู่ไหม', reason: 'ใช้ be + V-ing เพื่อมองเหตุการณ์ที่กำลังเกิดขึ้น แล้วสลับ are กับ you', short: 'Yes, I am.', follow: 'What are you eating?', choices: ['Do you eating?', 'Are you eat?', 'Are you eating?'], id: 'm3-02' },
  { label: 'เหตุการณ์จบแล้วในอดีต', example: 'Did you eat before work?', th: 'ก่อนทำงานคุณกินอะไรมาหรือยัง', reason: 'เวลาที่ถามคือก่อนเริ่มงาน ซึ่งอยู่ในอดีต ใช้ did และ eat รูป base', short: 'Yes, I did.', follow: 'What did you have?', choices: ['Did you eat before work?', 'Did you ate before work?', 'Have you ate before work?'], id: 'm3-03' },
  { label: 'เสร็จหรือยังและสำคัญกับตอนนี้', example: 'Have you eaten yet?', th: 'คุณกินข้าวหรือยัง', reason: 'Have + eaten เชื่อมผลกับตอนนี้ ใน American English ใช้ Did you eat yet? ในบริบทนี้ได้ด้วย', short: 'Yes, I have.', follow: 'Would you like some tea?', choices: ['Have you ate yet?', 'Have you eaten yet?', 'Are you eat yet?'], id: 'm3-05' },
  { label: 'ทำต่อเนื่องมาถึงตอนนี้', example: 'Have you been working all day?', th: 'คุณทำงานมาตลอดวันเลยเหรอ', reason: 'Have + been + working เน้นกิจกรรมที่ดำเนินมาตลอดช่วงเวลา', short: 'Yes, I have.', follow: 'Do you want to take a break?', choices: ['Have you been working all day?', 'Have you been work all day?', 'Have you working all day?'], id: 'm3-06' },
  { label: 'ขอคำแนะนำ', example: 'What should I do?', th: 'ฉันควรทำยังไงดี', reason: 'Should เปิดพื้นที่ให้แนะนำ วางก่อน I แล้วใช้ do รูป base', short: 'You should ask for help.', follow: 'Who should I talk to?', choices: ['What should I doing?', 'What should I do?', 'What do I should do?'], id: 'm3-10' },
  { label: 'สมมติสถานการณ์', example: 'What would you do if you were me?', th: 'ถ้าเป็นคุณ คุณจะทำยังไง', reason: 'Would ชี้ไปที่การตอบสนองในสถานการณ์สมมติ โดยใช้ do รูป base', short: 'I’d wait until tomorrow.', follow: 'Why would you wait?', choices: ['What would you did if you were me?', 'What would you do if you were me?', 'What do you would do if you were me?'], id: 'm3-11' },
]

export function DecisionLab() {
  const [selected, setSelected] = useState<number | null>(null)
  const item = selected === null ? null : decisions[selected]
  return <div className="stack page"><BackLink to="/practice">ฝึกใช้</BackLink><Heading label="DECISION LAB" title="คุณอยากสื่ออะไร" detail="ลองเลือกความหมายก่อน แล้วเลือกประโยคที่เหมาะกับสถานการณ์" />
    <Panel className="stack"><h2>เลือกเจตนา</h2><div className="actions">{decisions.map((decision, index) => <Button type="button" variant="outline" aria-pressed={selected === index} key={decision.id} onClick={() => setSelected(index)}>{decision.label}</Button>)}</div></Panel>
    {item && <Panel className="stack"><h2>{item.label}</h2><Exercise key={item.id} objective={item.id} item={{ id: `decision-${item.id}`, kind: 'auxiliary', prompt: item.th, options: item.choices, answers: [item.example], hint: 'ลองหาส่วนที่บอกเวลาและความหมายก่อน แล้วดูว่ากริยาหลักต้องใช้รูปอะไร', explanation: item.reason, feedback: Object.fromEntries(item.choices.filter((choice) => choice !== item.example).map((choice) => [choice, item.reason])) }} />
    <Disclosure title="ลองตอบสั้นและถามต่อ"><p lang="en">{item.short} · {item.follow}</p></Disclosure><Link to="/practice/builder">ลองสร้างรูปอื่นใน Sentence Builder <ArrowRight size={16} /></Link></Panel>}
  </div>
}

const expansion = [
  { text: 'It’s difficult.', th: 'มันยาก', note: 'เริ่มด้วยประโยคหลักที่บอกสภาพ' },
  { text: 'It’s kind of difficult.', th: 'มันค่อนข้างยาก', note: 'kind of ลดน้ำหนักของ difficult' },
  { text: 'I guess it’s kind of difficult.', th: 'ฉันว่ามันค่อนข้างยาก', note: 'I guess บอกว่าผู้พูดเสนอความเห็นแบบไม่ฟันธง' },
  { text: 'I guess it’s kind of difficult right now.', th: 'ฉันว่าตอนนี้มันค่อนข้างยาก', note: 'right now จำกัดข้อสังเกตไว้ที่ช่วงนี้' },
  { text: 'I guess it’s kind of difficult right now, but it’ll get easier over time.', th: 'ฉันว่าตอนนี้มันค่อนข้างยาก แต่จะค่อย ๆ ง่ายขึ้น', note: 'but เชื่อมสภาพตอนนี้กับสิ่งที่คาดว่าจะเปลี่ยน' },
  { text: 'So, I guess it’s kind of difficult right now, but it’ll get easier over time.', th: 'อืม ฉันว่าตอนนี้มันค่อนข้างยาก แต่จะค่อย ๆ ง่ายขึ้น', note: 'So ส่งสัญญาณว่าจะเริ่มสรุปหรือพูดต่อจากสิ่งที่คุยกัน' },
]

const connectors = [
  { word: 'but', en: 'It’s late, but I’ll finish this today.', th: 'ดึกแล้ว แต่ฉันจะทำให้เสร็จวันนี้', note: 'ประโยคที่สองสวนกับสิ่งที่คาดจากประโยคแรก' },
  { word: 'so', en: 'It’s late, so I’ll finish this tomorrow.', th: 'ดึกแล้ว ฉันเลยจะทำให้เสร็จพรุ่งนี้', note: 'ประโยคที่สองเป็นการตัดสินใจที่ตามมาจากเหตุผลก่อนหน้า' },
  { word: 'because', en: 'I’ll finish this tomorrow because it’s late.', th: 'ฉันจะทำให้เสร็จพรุ่งนี้เพราะดึกแล้ว', note: 'because นำอนุประโยคที่ให้เหตุผล' },
  { word: 'although', en: 'Although it’s late, I’ll finish this today.', th: 'ถึงจะดึกแล้ว ฉันก็จะทำให้เสร็จวันนี้', note: 'although นำอนุประโยคที่ยอมรับปัจจัยหนึ่งก่อน แล้วตามด้วยประโยคหลัก' },
]
const placements = [
  { label: 'ก่อนประธาน', en: 'Even I noticed.', th: 'แม้แต่ฉันก็สังเกตเห็น', note: 'I เป็นตัวอย่างที่คาดว่าจะสังเกตเห็นน้อยที่สุด' },
  { label: 'ก่อนคำกริยา', en: 'I didn’t even notice.', th: 'ฉันไม่ได้สังเกตเห็นด้วยซ้ำ', note: 'เพิ่มน้ำหนักว่าไม่ถึงขั้นสังเกตเห็น' },
  { label: 'ก่อนคำเปรียบเทียบ', en: 'It’s even better.', th: 'มันยิ่งดีขึ้นไปอีก', note: 'even เน้นระดับที่สูงขึ้นของ better' },
]

export function ConnectorLab() {
  const [step, setStep] = useState(0)
  const [connector, setConnector] = useState(0)
  const [placement, setPlacement] = useState(0)
  const current = expansion[step]
  return <div className="stack page"><BackLink to="/practice">ฝึกใช้</BackLink><Heading label="CONNECTOR LAB" title="ค่อย ๆ ต่อความคิดให้เป็นประโยค" />
    <Panel className="stack"><h2>ขยายจากประโยคหลัก</h2><Example en={current.text} th={current.th} note={current.note} />
      <div className="actions"><Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>ย้อนขั้น</Button><Button type="button" disabled={step === expansion.length - 1} onClick={() => setStep(step + 1)}>เติมอีกหนึ่งส่วน</Button><span aria-live="polite">{step + 1}/{expansion.length}</span></div>
      <p>เลือกเฉพาะส่วนที่มีประโยชน์กับสิ่งที่พูดได้ในแต่ละครั้ง</p>
    </Panel>
    <Panel className="stack"><h2>เปลี่ยนคำเชื่อม</h2><div className="actions">{connectors.map(({ word }, index) => <Button type="button" variant="outline" key={word} aria-pressed={index === connector} onClick={() => setConnector(index)}>{word}</Button>)}</div><Example {...connectors[connector]} /></Panel>
    <Panel className="stack"><h2>ย้ายจุดเน้นของ even</h2><div className="actions">{placements.map(({ label }, index) => <Button type="button" variant="outline" key={label} aria-pressed={index === placement} onClick={() => setPlacement(index)}>{label}</Button>)}</div><Example {...placements[placement]} /></Panel>
    <Panel className="stack"><h2>เปลี่ยนเรื่องเป็นของคุณ</h2><Exercise objective="m8-08" item={{ id: 'connector-own', kind: 'expand', prompt: 'บอกเรื่องที่รู้สึกว่ายากตอนนี้ แล้วเชื่อมกับสิ่งที่หวังว่าจะเปลี่ยน', answers: ['I guess it’s kind of difficult right now, but it’ll get easier over time.', 'I’m still getting used to it, but I’m making progress.'], hint: 'ลองเริ่มด้วยประโยคสั้น แล้วใช้ but เพื่อบอกความเปลี่ยนแปลง', explanation: 'เลือกคำที่บอกท่าทีและเวลาตามความหมายที่ต้องการ' }} /></Panel>
  </div>
}
