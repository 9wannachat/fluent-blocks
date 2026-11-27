import { ExpansionWorkshop } from '../../components/ExpansionWorkshop'
import { Link, useSearchParams } from 'react-router-dom'
import { BackLink, Heading, Panel, RowLink } from '../../components/ui'
import { Button } from '../../components/ui/button'
import { connectionsBySense, everyday, everydayPath, everydayRelated, senseKey, workshopById } from '../../content/everyday'
import { type EverydayActivity } from '../../domain/everyday'
import { Exercise } from '../practice/Exercise'

const labels: Record<EverydayActivity['type'], string> = {
  recognition: 'เลือกจากสถานการณ์',
  'word-selection': 'เติมคำให้เป็นธรรมชาติ',
  construction: 'เรียงคำ',
  transformation: 'เปลี่ยนรูปคำ',
  comparison: 'เทียบคำ',
  expansion: 'เติมรายละเอียด',
  production: 'สร้างประโยคเอง',
}

export function EverydayPractice() {
  const [params, setParams] = useSearchParams()
  const selected = everyday.activities.find((item) => item.id === params.get('activity'))
  const workshop = workshopById.get(params.get('workshop') ?? '')
  const sourceId = params.get('item') ?? ''
  const senseId = params.get('sense') ?? ''
  const source = everydayRelated.get(sourceId)
  const sourceConnection = connectionsBySense.get(senseKey(sourceId, senseId))
  if (workshop) return <div className="stack page">
    <BackLink to={source && sourceConnection?.workshopId === workshop.id ? `${source.to}?sense=${senseId}` : `${everydayPath}/exercises`}>กลับไปที่คำหรือแบบฝึก</BackLink>
    <Heading title={workshop.title} detail={workshop.situation} />
    <ExpansionWorkshop key={workshop.id} expansion={workshop.expansion} />
    {workshop.builderPreset && <div className="actions"><Button asChild variant="outline"><Link to={`/practice/builder?preset=${workshop.builderPreset}`}>ลองเปลี่ยนเจตนาใน Sentence Builder</Link></Button></div>}
    <Panel className="stack"><h2>ลองพูดด้วยคำของคุณ</h2>
      <Exercise key={workshop.exercise.id} item={workshop.exercise} objective={sourceConnection?.workshopId === workshop.id ? sourceId : workshop.exercise.id} />
    </Panel>
  </div>
  return <div className="stack page">
    <BackLink to={everydayPath}>Everyday English Lab</BackLink>
    <Heading title="ฝึกจากสถานการณ์" detail="ดูว่ากำลังคุยเรื่องอะไร แล้วเลือกคำ รูปคำ และลำดับที่จะพูด" />
    {selected ? <Panel className="stack">
      <h2>{selected.title}</h2><p>{selected.situation}</p>
      <Exercise key={selected.exercise.id} objective={selected.id} item={selected.exercise} />
      <div className="actions"><Button type="button" variant="outline" onClick={() => setParams({})}>เลือกแบบฝึกอื่น</Button></div>
    </Panel> : <>
      <ExpansionWorkshop expansion={everyday.expansion} />
      {Object.entries(labels).map(([type, label]) => <Panel key={type} className="stack">
        <h2>{label}</h2><ul className="clean lesson-list">{everyday.activities.filter((item) => item.type === type).map((item) =>
          <RowLink key={item.id} to={`?activity=${item.id}`} subtitle={item.situation}>{item.title}</RowLink>)}</ul>
      </Panel>)}
    </>}
  </div>
}
