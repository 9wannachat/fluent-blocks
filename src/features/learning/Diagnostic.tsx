import { Button } from '../../components/ui/button'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BackLink, Heading, Panel } from '../../components/ui'
import { lessonById } from '../../content'
import { Exercise } from '../practice/Exercise'

const items = [
  ['m2-03', 'โครงประโยค', 'บอกว่า “วันนี้ฉันเหนื่อย”', 'I’m tired today.', 'I tired today.', 'I do tired today.'],
  ['m2-03', 'โครงประโยค', 'The soup ___ a little salty.', 'tastes', 'tastes like it', 'is taste'],
  ['m2-05', 'โครงประโยค', 'บอกว่ามีที่นั่งว่างสองที่', 'There are two seats available.', 'There is two seats available.', 'It have two seats available.'],
  ['m2-07', 'กริยาช่วย', 'ถามว่าเธอชอบกาแฟไหม', 'Does she like coffee?', 'Does she likes coffee?', 'Is she like coffee?'],
  ['m2-07', 'กริยาช่วย', 'Did Sam ___ the office early?', 'leave', 'left', 'leaves'],
  ['m2-09', 'กริยาช่วย', 'ถามว่าพวกเขาทำงานมาทั้งวันหรือเปล่า', 'Have they been working all day?', 'Have they working all day?', 'Do they been working all day?'],
  ['m3-05', 'เวลาและเหตุการณ์', 'ถามถึงประสบการณ์การเดินทางในชีวิต', 'Have you ever been to Japan?', 'Have you ever go to Japan?', 'Were you ever go to Japan?'],
  ['m3-05', 'เวลาและเหตุการณ์', 'I ___ her yesterday.', 'saw', 'have seen', 'see'],
  ['m3-05', 'เวลาและเหตุการณ์', 'We’ve lived here ___ two years.', 'for', 'since', 'during two years ago'],
  ['m5-04', 'ตำแหน่งคำ', 'บอกว่า “ฉันยังจำได้”', 'I still remember.', 'I am still remember.', 'I remember yet.'],
  ['m5-04', 'ตำแหน่งคำ', 'บอกว่า “ฉันยังอยู่ที่นี่”', 'I’m still here.', 'I still am be here.', 'I here still.'],
  ['m5-05', 'ตำแหน่งคำ', 'เน้นว่าแม้แต่ตัวฉันก็สังเกตเห็น', 'Even I noticed.', 'I noticed even.', 'Very I noticed.'],
  ['m7-05', 'คำเชื่อม', 'It was raining, ___ we stayed inside. เลือกคำบอกผล', 'so', 'because', 'although'],
  ['m7-02', 'คำเชื่อม', 'I wanted to go, ___ I had to work. เลือกคำบอกความขัดกัน', 'but', 'because', 'unless'],
  ['m7-03', 'คำเชื่อม', '___ it was late, we kept talking. เลือกคำบอกว่าดึกแล้วแต่ก็ยังคุย', 'Although', 'So', 'Unless'],
  ['m8-03', 'ภาษาพูด', 'แสดงความเห็นว่า “ฉันว่าคุณน่าจะพูดถูก”', 'I guess you’re right.', 'I guess you to right.', 'I’m guess you’re right.'],
  ['m8-07', 'ภาษาพูด', 'ตอบว่า “ไม่ค่อยนะ” เมื่อมีคนถามว่าชอบดูบอลไหม', 'Not really.', 'Really not I.', 'I’m not really do.'],
  ['m8-04', 'ภาษาพูด', 'บอกว่า “อยากออกไปเดินเล่น”', 'I feel like going for a walk.', 'I feel like go for a walk.', 'I feel like to going for a walk.'],
] as const

export function Diagnostic() {
  const [results, setResults] = useState<Record<number, boolean>>({})
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [session, setSession] = useState(0)
  const [id, skill, prompt, correct, ...incorrect] = items[index]
  const options = [correct as string, ...incorrect]
  options.push(...options.splice(0, index % options.length))
  const missed = [...new Map(items.flatMap(([lesson, skill], index) => results[index] === false ? [[lesson, skill] as const] : [])).entries()]
  function restart() { setResults({}); setIndex(0); setFinished(false); setSession(session + 1) }
  return <div className="stack page"><BackLink to="/learn">เส้นทางการเรียน</BackLink>
    <Heading label="DIAGNOSTIC" title="สำรวจทักษะที่อยากฝึก" detail="ใช้ผลเพื่อเลือกบทเรียนที่เหมาะกับคุณ และเลือกเปลี่ยนเองได้ทุกเมื่อ" />
    {finished ? <Panel className="stack"><h2>บทที่แนะนำ</h2>
      {missed.length === 0 ? <p>ทำชุดนี้ได้ครบ ลองเลือกบทที่ท้าทายขึ้นหรือไปฝึกพูดในสถานการณ์จริง</p> :
        <ul>{missed.map(([lesson, skill]) => <li key={lesson}>{lessonById.has(lesson) ? <Link to={`/learn/${lesson}`}>{lessonById.get(lesson)?.titleTh}</Link> : <span>{skill}</span>}</li>)}</ul>}
      <div className="actions"><Button asChild><Link to="/learn">เลือกบทเรียนเอง</Link></Button><Button variant="outline" type="button" onClick={restart}>ทำใหม่</Button></div>
    </Panel> : <Panel className="stack"><h2>{skill} · ข้อ {index + 1}/{items.length}</h2>
      <Exercise key={`${session}-${index}`} objective={id} item={{ id: `diagnostic-${index + 1}`, kind: 'choice', prompt, options, answers: [correct], hint: 'คิดถึงสิ่งที่ต้องการสื่อและหน้าที่ของคำแต่ละคำ', explanation: `รูป “${correct}” ตรงกับบริบทของข้อนี้` }}
        onAnswer={(_, valid) => setResults((current) => index in current ? current : { ...current, [index]: valid })} />
      <Button type="button" disabled={!(index in results)} onClick={() => index === items.length - 1 ? setFinished(true) : setIndex(index + 1)}>{index === items.length - 1 ? 'ดูบทที่แนะนำ' : 'ข้อต่อไป'}</Button>
    </Panel>}
  </div>
}
