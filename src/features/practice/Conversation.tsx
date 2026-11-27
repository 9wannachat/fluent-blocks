import { ChevronRight } from 'lucide-react'
import { Checkbox } from '../../components/ui/checkbox'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { Disclosure } from '../../components/ui/disclosure'
import { AlertMessage } from '../../components/ui/alert-message'
import { useEffect, useRef, useState, type Ref } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BackLink, Example, Heading, Panel } from '../../components/ui'
import { practical, practicalLessonById, practicalLessonPath, practicalModules, practicalScenarioById } from '../../content/practical'
import type { PracticalScenario } from '../../domain/practical'
import { scenarios, type Scenario } from '../../content/scenarios'
import { recordAttempt } from '../../storage'
import { Exercise } from './Exercise'

const scenarioPath = '/practice/conversation'
const criteria = [
  'คนฟังจับใจความหลักได้',
  'เลือกกริยาช่วยและรูปกริยาตามความหมาย',
  'วางคำและส่วนขยายในตำแหน่งที่เข้าใจง่าย',
  'เชื่อมความคิดตามเหตุผลหรือเหตุการณ์จริง',
  'ใช้น้ำเสียงและคำที่เหมาะกับคู่สนทนา',
]

type Branch = Scenario['branches'][number] | PracticalScenario['branches'][number]

function SpeakingTask({ scenario, branch, headingRef }: {
  scenario: Scenario; branch: Branch; headingRef: Ref<HTMLHeadingElement>
}) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function saveAssessment() {
    setStatus('saving')
    try {
      await recordAttempt({
        exerciseId: `conversation-${scenario.id}-speaking`,
        objectiveId: scenario.objectiveId,
        outcome: 'self-assessed',
      })
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return <Panel className="stack">
    <h2 ref={headingRef} tabIndex={-1}>ลองพูด {scenario.speaking.seconds} วินาที</h2>
    <p>{scenario.speaking.task}</p>
    <p>{scenario.speaking.stress}</p>
    <Disclosure title="ฟังจากตัวอย่างอีกครั้ง">
      <Example {...branch.reply} />
    </Disclosure>
    <fieldset className="choices" disabled={status === 'saved' || status === 'saving'}>
      <legend>เช็กด้วยตัวเองหลังพูด</legend>
      <p>{scenario.speaking.focus}</p>
      {criteria.map((criterion) => <Label className="choice" key={criterion}>
        <Checkbox disabled={status !== "idle" && status !== "error"} /><span>{criterion}</span>
      </Label>)}
    </fieldset>
    <div className="actions">
      <Button type="button" disabled={status === 'saved' || status === 'saving'} onClick={() => void saveAssessment()}>
        {status === 'saved' ? 'ประเมินตนเองแล้ว' : 'บันทึกว่าประเมินตนเองแล้ว'}
      </Button>
    </div>
    {status === 'error' && <AlertMessage>บันทึกไม่ได้ ลองอีกครั้ง</AlertMessage>}
    {status === 'saved' && <p role="status">บันทึกการฝึกพูดแล้ว</p>}
  </Panel>
}

function Dialogue({ scenario, graded }: { scenario: Scenario | PracticalScenario; graded: boolean }) {
  const [branch, setBranch] = useState<Branch | null>(null)
  const [step, setStep] = useState<'first' | 'follow' | 'speak'>('first')
  const firstHeading = useRef<HTMLHeadingElement>(null)
  const nextHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (step !== 'first') nextHeading.current?.focus()
  }, [step])

  function reset() {
    setBranch(null)
    setStep('first')
    firstHeading.current?.focus()
  }

  return <>
    <Panel className="stack">
      <h2 ref={firstHeading} tabIndex={-1}>คู่สนทนาเริ่ม</h2>
      <Example {...scenario.firstTurn} />
      {step === 'first' && <>
        <p>ลองตอบออกเสียงก่อน แล้วเลือกแนวตอบที่ใกล้กับสิ่งที่คุณอยากสื่อ</p>
        <div className="actions">
          {scenario.branches.map((item) => <Button key={item.id} type="button" variant="outline"
            aria-pressed={branch?.id === item.id} onClick={() => setBranch(item)}>{item.intent}</Button>)}
        </div>
        <Disclosure title="พิมพ์คำตอบของคุณเอง">
          <Exercise item={{
            id: `conversation-${scenario.id}-open`, kind: graded ? 'translate' : 'conversation',
            prompt: 'ตอบคู่สนทนาเป็นภาษาอังกฤษด้วยคำของคุณเอง',
            answers: scenario.branches.map((item) => item.reply.en),
            hint: 'เลือกว่าคุณต้องการตอบเรื่องไหนก่อน แล้วลองเติมรายละเอียดหรือถามต่อ',
            explanation: scenario.branches.map((item) => item.reply.note).join(' '),
          }} objective={scenario.objectiveId} />
        </Disclosure>
      </>}
    </Panel>
    {branch && <Panel className="stack">
      <h2>{step === 'first' ? 'ตัวอย่างคำตอบ' : 'แนวตอบที่เลือก'}</h2>
      <Example {...branch.reply} />
      {step === 'first' && <div className="actions">
        <Button type="button" onClick={() => setStep('follow')}>ฟังคำถามต่อ</Button>
      </div>}
    </Panel>}
    {branch && step !== 'first' && <Panel className="stack">
      <h2 ref={step === 'follow' ? nextHeading : undefined} tabIndex={-1}>คู่สนทนาถามต่อ</h2>
      <Example {...branch.followUp} />
      <p>จะพูดตอบเลย หรือพิมพ์คำตอบแล้วเปิดดูตัวอย่างก็ได้</p>
      <Disclosure title="ลองตอบคำถามต่อ">
        <Exercise key={branch.id} item={'exercise' in branch ? branch.exercise : {
          id: `conversation-${scenario.id}-${branch.id}`, kind: 'conversation',
          prompt: 'ตอบคู่สนทนาเป็นภาษาอังกฤษหนึ่งหรือสองประโยค',
          answers: branch.followModels.map(({ en }) => en),
          hint: branch.followHint,
          explanation: branch.followModels.map(({ note }) => note).join(' '),
        }} objective={scenario.objectiveId} />
      </Disclosure>
      <Disclosure title="ย้อนฟังคำตอบตัวอย่างหลังลองพูด">
        {branch.followModels.map((item) => <Example key={item.en} {...item} />)}
      </Disclosure>
      {step === 'follow' && <div className="actions">
        <Button type="button" onClick={() => setStep('speak')}>ไปที่งานพูด</Button>
      </div>}
    </Panel>}
    {branch && step === 'speak' && <SpeakingTask scenario={scenario} branch={branch} headingRef={nextHeading} />}
    {branch && <div className="actions">
      <Button variant="outline" type="button" onClick={reset}>เริ่มสถานการณ์นี้ใหม่</Button>
    </div>}
  </>
}

export function Conversation() {
  const { scenarioId } = useParams()
  const added = scenarioId ? practicalScenarioById.get(scenarioId) : undefined
  const scenario = added ?? scenarios.find(({ id }) => id === scenarioId)
  const lesson = added ? practicalLessonById.get(added.objectiveId) : undefined
  if (scenario) return <div className="stack page">
    <BackLink to={scenarioPath}>เลือกสถานการณ์</BackLink>
    <Heading label="CONVERSATION LAB" title={scenario.title} detail={scenario.context} />
    {lesson && <Link to={practicalLessonPath(lesson)}>เปิดบทเรียนและคำศัพท์ของสถานการณ์นี้</Link>}
    <Dialogue key={scenario.id} scenario={scenario} graded={Boolean(added)} />
  </div>
  if (scenarioId) return <div className="stack page">
    <Heading title="ไม่พบสถานการณ์นี้" />
    <Link to={scenarioPath}>กลับไปรายการสถานการณ์</Link>
  </div>
  return <div className="stack page">
    <BackLink to="/practice">ฝึกใช้</BackLink>
    <Heading label="CONVERSATION LAB" title="ฝึกสนทนา" detail="เลือกสถานการณ์ ลองตอบ แล้วฟังว่าคู่สนทนาอาจถามอะไรต่อ" />
    {practicalModules.map((module) => <section className="stack" key={module.id}>
      <h2>{module.title}</h2>
      <div className="grid two">{practical.scenarios.filter((item) => practicalLessonById.get(item.objectiveId)?.moduleId === module.id).map((item) =>
        <Panel className="stack lab-link scenario-card" key={item.id}>
          <h3><Link to={`${scenarioPath}/${item.id}`}>{item.title}</Link></h3><p>{item.context}</p>
        </Panel>)}</div>
    </section>)}
    <section className="stack"><h2>สถานการณ์ทั่วไป</h2><div className="grid two">
      {scenarios.map((item) => <Panel className="stack lab-link scenario-card" key={item.id}>
        <h3><Link to={`${scenarioPath}/${item.id}`}>{item.title}</Link></h3>
        <p>{item.context}</p>
        <ChevronRight className="lab-arrow" size={18} aria-hidden="true" />
      </Panel>)}
    </div></section>
  </div>
}
