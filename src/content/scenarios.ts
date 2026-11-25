import { z } from 'zod'

const line = z.string().trim().min(1)
const model = z.object({ en: line, th: line, note: line })
const turn = z.object({ en: line, th: line })
const branch = z.object({
  id: line.regex(/^[a-z0-9-]+$/),
  intent: line,
  reply: model,
  followUp: turn,
  followModels: z.array(model).min(2),
  followHint: line,
})

export const scenarioSchema = z.object({
  id: line.regex(/^[a-z0-9-]+$/),
  title: line,
  context: line,
  objectiveId: line.regex(/^m9-0[1-8]$/),
  firstTurn: turn,
  branches: z.array(branch).min(2),
  speaking: z.object({
    seconds: z.number().int().min(30).max(90),
    task: line,
    focus: line,
    stress: line,
  }),
}).refine(
  (scenario) => new Set(scenario.branches.map(({ id }) => id)).size === scenario.branches.length,
  'Branch IDs must be distinct in each scenario',
)

export type Scenario = z.infer<typeof scenarioSchema>

const say = (en: string, th: string, note: string) => ({ en, th, note })
const ask = (en: string, th: string) => ({ en, th })

export const scenarios: Scenario[] = [
  {
    id: 'meeting-someone', title: 'ทำความรู้จักกัน',
    context: 'คุณเพิ่งมางานเวิร์กช็อปทำเครื่องหนัง คนที่นั่งติดกันชวนคุยก่อนเริ่ม',
    objectiveId: 'm9-01',
    firstTurn: ask('Hey, is this your first time here?', 'สวัสดี มาที่นี่ครั้งแรกหรือเปล่า'),
    branches: [
      {
        id: 'first-time', intent: 'บอกว่ามาครั้งแรกและชวนอีกฝ่ายเล่า',
        reply: say('Yeah, it is. Have you done this before?', 'ใช่ ครั้งแรกเลย คุณเคยทำแบบนี้มาก่อนไหม', 'ตอบรับด้วย it is ตาม is ในคำถาม แล้วใช้ present perfect ถามถึงประสบการณ์'),
        followUp: ask('Once, last summer. What made you want to try it?', 'เคยครั้งหนึ่งช่วงหน้าร้อนปีที่แล้ว อะไรทำให้คุณอยากลอง'),
        followModels: [
          say('I wanted to make something I could actually use.', 'ฉันอยากทำของที่เอามาใช้ได้จริง', 'I wanted to ตามด้วยกริยารูปพื้นฐาน ส่วน I could actually use ขยาย something'),
          say('A friend showed me a wallet she’d made, and I thought I’d give it a go.', 'เพื่อนให้ดูกระเป๋าสตางค์ที่เธอทำเอง ฉันเลยอยากลองดูบ้าง', 'Give it a go เป็นสำนวนกันเองที่หมายถึงลองทำดู'),
        ],
        followHint: 'บอกแรงจูงใจหนึ่งอย่าง แล้วอาจเติมว่าเห็นหรือได้ยินเรื่องนี้จากที่ไหน',
      },
      {
        id: 'returning', intent: 'บอกว่าเคยมาแล้วและแชร์เหตุผลที่กลับมา',
        reply: say('No, I came last month too. I liked it enough to come back.', 'ไม่ใช่ เดือนที่แล้วก็มาครั้งหนึ่ง ชอบจนกลับมาอีก', 'ใช้ came กับ last month ซึ่งระบุช่วงอดีตที่จบแล้ว และ enough to บอกว่าชอบมากพอจะกลับมา'),
        followUp: ask('Nice. Is there anything I should know before we start?', 'ดีจัง มีอะไรที่ฉันควรรู้ก่อนเริ่มไหม'),
        followModels: [
          say('Ask for a scrap piece first. It helps to practice on that.', 'ขอเศษหนังก่อน จะได้ลองฝึกกับชิ้นนั้น', 'Ask for ใช้เมื่อต้องการขอสิ่งของ It helps to ตามด้วยสิ่งที่ลองทำได้'),
          say('You don’t need to bring anything. They’ll give us all the tools.', 'ไม่ต้องเอาอะไรมา เขาจะมีเครื่องมือให้หมด', 'Don’t need to บอกว่าไม่จำเป็น ส่วน will คาดการณ์สิ่งที่จะเกิดขึ้น'),
        ],
        followHint: 'เลือกว่าจะให้คำแนะนำหนึ่งข้อ หรือทำให้อีกฝ่ายสบายใจด้วยข้อมูลที่จำเป็น',
      },
    ],
    speaking: { seconds: 40, task: 'ลองแนะนำตัวสั้น ๆ ในงานที่คุณอยากไป บอกว่าเคยมาหรือยัง แล้วถามอีกฝ่ายหนึ่งคำถาม', focus: 'เลือกว่ากำลังบอกอดีตเมื่อใด หรือถามประสบการณ์จนถึงตอนนี้', stress: 'ใน FIRST time ให้ลงน้ำหนักที่ first เพื่อเน้นว่ามาครั้งแรก' },
  },
  {
    id: 'daily-life', title: 'คุยเรื่องชีวิตประจำวัน',
    context: 'เพื่อนร่วมงานชวนคุยช่วงพัก หมู่นี้ทั้งคู่ยุ่งและมีกิจวัตรตอนเย็นต่างจากเดิม',
    objectiveId: 'm9-02',
    firstTurn: ask('What do you usually do after work?', 'ปกติหลังเลิกงานคุณทำอะไร'),
    branches: [
      {
        id: 'habit', intent: 'ตอบด้วยกิจวัตรที่ทำเป็นประจำ',
        reply: say('I usually go for a walk before dinner. It helps me switch off.', 'ปกติฉันเดินเล่นก่อนมื้อเย็น ช่วยให้หยุดคิดเรื่องงานได้', 'Usually อยู่หน้ากริยา go ส่วน switch off ใช้พูดถึงการพักสมองจากเรื่องงานได้'),
        followUp: ask('Where do you normally go?', 'ปกติไปเดินแถวไหน'),
        followModels: [
          say('There’s a little park behind my building. I usually do two laps.', 'มีสวนเล็ก ๆ หลังตึกฉัน ปกติเดินรอบสวนสองรอบ', 'There’s ใช้แนะนำสถานที่ที่อีกฝ่ายยังไม่รู้ว่าอยู่ตรงนั้น'),
          say('I just walk around the neighborhood. I don’t really have a set route.', 'ก็เดินแถวบ้านนี่แหละ ไม่ได้มีเส้นทางตายตัว', 'Don’t really ทำให้คำปฏิเสธฟังเบาลงในบทสนทนา'),
        ],
        followHint: 'ระบุสถานที่หรืออธิบายว่าคุณออกไปเดินอย่างไร',
      },
      {
        id: 'different-lately', intent: 'ตอบพร้อมเทียบสิ่งที่เปลี่ยนช่วงนี้',
        reply: say('I normally cook, but lately I’ve been getting takeout.', 'ปกติทำกับข้าว แต่พักนี้ซื้ออาหารกลับมากิน', 'Present simple บอกกิจวัตร ส่วน I’ve been getting เน้นรูปแบบที่เกิดซ้ำในช่วงล่าสุด'),
        followUp: ask('How come? Have you been getting home late?', 'ทำไมล่ะ ช่วงนี้กลับบ้านดึกเหรอ'),
        followModels: [
          say('Yeah, I’ve been covering for someone this week.', 'ใช่ อาทิตย์นี้ฉันทำงานแทนคนหนึ่งอยู่', 'Cover for someone หมายถึงช่วยทำหน้าที่แทนคนที่ไม่อยู่'),
          say('Not really. I’m just tired of eating the same three things.', 'ก็ไม่นะ แค่เบื่อกินอยู่สามอย่างเดิม ๆ', 'Not really ตอบรับคำถามแบบปฏิเสธเบา ๆ ส่วน tired of ตามด้วย V-ing ได้'),
        ],
        followHint: 'บอกสาเหตุจริงหรือแก้ความเข้าใจของอีกฝ่าย แล้วอธิบายสั้น ๆ',
      },
    ],
    speaking: { seconds: 45, task: 'เล่ากิจวัตรหลังเลิกงานตามปกติ เทียบกับสิ่งที่ทำต่างออกไปช่วงนี้ และบอกเหตุผลหนึ่งอย่าง', focus: 'ให้ผู้ฟังแยกออกว่าช่วงไหนเป็นกิจวัตร และช่วงไหนเป็นพฤติกรรมที่เพิ่งเปลี่ยน', stress: 'ลองเน้น NORmally และ LATEly ตอนเปรียบเทียบสองช่วงเวลา' },
  },
  {
    id: 'travel', title: 'ถามทางระหว่างเดินทาง',
    context: 'คุณอยู่ที่สถานีในเมืองที่เพิ่งไปครั้งแรก ต้องไปพิพิธภัณฑ์ให้ทันเวลาที่จองบัตรไว้',
    objectiveId: 'm9-04',
    firstTurn: ask('Hi there. Can I help you find something?', 'สวัสดี กำลังหาอะไรอยู่ ให้ช่วยไหม'),
    branches: [
      {
        id: 'which-platform', intent: 'ถามชานชาลาไปพิพิธภัณฑ์',
        reply: say('Yes, thanks. Do you know which platform I need for the museum?', 'ช่วยหน่อยค่ะ ขอบคุณนะ คุณรู้ไหมว่าต้องขึ้นชานชาลาไหนไปพิพิธภัณฑ์', 'หลัง Do you know ใช้ which platform I need เพราะเป็นคำถามที่ซ้อนอยู่ในประโยค'),
        followUp: ask('Platform four. Are you trying to catch the 10:15?', 'ชานชาลาสี่ คุณจะขึ้นรอบสิบโมงสิบห้าหรือ'),
        followModels: [
          say('Yes. Do I have time to buy a ticket first?', 'ใช่ ฉันมีเวลาซื้อตั๋วก่อนไหม', 'Do I have time to ตามด้วยกริยารูปพื้นฐาน เหมาะเมื่อเวลามีจำกัด'),
          say('Any train that gets me there before eleven is fine.', 'ขบวนไหนก็ได้ที่ไปถึงก่อนสิบเอ็ดโมง', 'That gets me there before eleven ขยาย any train ว่าต้องเป็นขบวนที่เข้าเงื่อนไข'),
        ],
        followHint: 'ตอบเรื่องรอบรถ แล้วระบุเวลาหรือข้อจำกัดที่สำคัญกับคุณ',
      },
      {
        id: 'check-line', intent: 'ยืนยันว่ากำลังจะขึ้นสายที่ถูกต้อง',
        reply: say('I think so. Is this the right line for the museum?', 'น่าจะใช่ ขอถามหน่อยว่าสายนี้ไปพิพิธภัณฑ์ได้ไหม', 'Is this ใช้ตรวจว่าของที่อยู่ตรงหน้าเป็นสิ่งที่ต้องการหรือไม่'),
        followUp: ask('It is, but you’ll need to change at River Street.', 'ใช่ แต่ต้องเปลี่ยนสายที่ริเวอร์สตรีต'),
        followModels: [
          say('Just to check, which line do I take from there?', 'ขอเช็กอีกที จากตรงนั้นต้องขึ้นสายไหน', 'Just to check เกริ่นให้คนฟังรู้ว่าคุณกำลังขอยืนยันรายละเอียด'),
          say('Got it. Is the transfer in the same station?', 'เข้าใจแล้ว เปลี่ยนสายภายในสถานีเดียวกันไหม', 'Got it ตอบสั้น ๆ ว่ารับข้อมูลแล้ว และ is ถามถึงสถานที่ของการเปลี่ยนสาย'),
        ],
        followHint: 'ถามรายละเอียดหนึ่งเรื่องที่จะช่วยให้คุณเปลี่ยนสายได้ถูกต้อง',
      },
    ],
    speaking: { seconds: 45, task: 'สมมติว่าต้องไปสถานที่หนึ่งให้ทันเวลา บอกปลายทาง เวลาที่ต้องถึง และถามต่อเรื่องเส้นทาง', focus: 'ตรวจลำดับคำเมื่อซ้อนคำถามหลัง Do you know และลองย้ำชื่อสถานีให้ชัด', stress: 'ใน PLATFORM FOUR ลองลงน้ำหนักที่ FOUR เพื่อแยกเลขชานชาลาให้ชัด' },
  },
  {
    id: 'restaurant', title: 'คุยกับพนักงานร้านอาหาร',
    context: 'คุณกำลังสั่งอาหาร มีเมนูที่สนใจ แต่ต้องตัดสินใจจากส่วนประกอบและระดับความเผ็ด',
    objectiveId: 'm9-01',
    firstTurn: ask('Are you ready to order, or would you like another minute?', 'พร้อมสั่งหรือยังครับ หรือขอเวลาอีกสักครู่'),
    branches: [
      {
        id: 'check-ingredient', intent: 'ถามส่วนประกอบก่อนสั่ง',
        reply: say('Almost. Does the mushroom soup have any dairy in it?', 'ใกล้แล้วค่ะ ซุปเห็ดมีผลิตภัณฑ์จากนมไหม', 'Does รับ agreement ของ the mushroom soup แล้วจึงใช้ have รูปพื้นฐาน'),
        followUp: ask('Yes, it has cream. Would you like me to check the other soups?', 'มีครับ ใส่ครีม จะให้ช่วยดูซุปอย่างอื่นไหมครับ'),
        followModels: [
          say('Yes, please. Is there one without dairy?', 'ช่วยดูให้หน่อยค่ะ มีซุปที่ไม่ใส่ผลิตภัณฑ์จากนมไหม', 'ใช้ one แทน soup แล้วเติม without dairy เพื่อระบุเงื่อนไข'),
          say('That’s okay. I’ll have the grilled vegetables instead.', 'ไม่เป็นไรค่ะ ขอผักย่างแทน', 'I’ll have ใช้สั่งอาหารได้อย่างเป็นธรรมชาติ และ instead บอกว่ากำลังเปลี่ยนตัวเลือก'),
        ],
        followHint: 'ตอบรับให้พนักงานช่วย หรือเลือกอาหารอีกอย่างให้ชัด',
      },
      {
        id: 'request-milder', intent: 'สั่งอาหารและขอให้ทำเผ็ดน้อย',
        reply: say('I’ll have the noodles, please. Could you make them a little less spicy?', 'ขอก๋วยเตี๋ยวค่ะ ช่วยทำให้เผ็ดน้อยลงหน่อยได้ไหมคะ', 'Could you + V1 เป็นคำขอสุภาพ Them ใช้แทน noodles ที่เป็นพหูพจน์'),
        followUp: ask('Sure. Would you like the chili on the side?', 'ได้ครับ อยากให้แยกพริกไว้ข้าง ๆ ไหมครับ'),
        followModels: [
          say('That would be great, thanks.', 'อย่างนั้นดีเลย ขอบคุณค่ะ', 'That would be great ตอบรับข้อเสนอด้วยน้ำเสียงเป็นมิตร'),
          say('No chili at all, if that’s possible.', 'ถ้าได้ ขอไม่ใส่พริกเลยค่ะ', 'No chili at all เป็นวลีตอบที่สมบูรณ์ตามบริบท if that’s possible ทำให้คำขอนุ่มลง'),
        ],
        followHint: 'ถ้ารับข้อเสนอให้ตอบรับสั้น ๆ ถ้าต้องงดพริกให้พูดเงื่อนไขตรง ๆ',
      },
    ],
    speaking: { seconds: 40, task: 'ลองสั่งเมนูหนึ่งอย่าง ถามส่วนประกอบ และขอเปลี่ยนรายละเอียดอย่างสุภาพ', focus: 'เช็กว่าเลือกใช้ does เมื่อต้องการถามข้อมูล และ could เมื่อต้องการให้พนักงานช่วยทำอะไร', stress: 'เน้น LESS SPICY ให้ได้ยินชัดเมื่อขอลดความเผ็ด' },
  },
  {
    id: 'workplace', title: 'ตกลงงานและเวลาส่ง',
    context: 'เพื่อนร่วมทีมต้องใช้รายงานก่อนประชุม คุณมีบางส่วนพร้อมแล้วและรู้ว่าส่วนที่เหลือต้องรอข้อมูล',
    objectiveId: 'm9-07',
    firstTurn: ask('Do you think you can send me the full report by three?', 'คิดว่าจะส่งรายงานฉบับเต็มให้ฉันภายในบ่ายสามได้ไหม'),
    branches: [
      {
        id: 'offer-summary', intent: 'เสนอส่งเฉพาะสรุปก่อน',
        reply: say('I can send the summary by three. I’m still waiting for the final numbers, though.', 'ส่งสรุปภายในบ่ายสามได้ แต่ฉันยังรอตัวเลขชุดสุดท้ายอยู่', 'By three คือไม่เกินบ่ายสาม ส่วน still หลัง am เน้นว่าการรอยังต่อเนื่อง Though ท้ายประโยคช่วยเติมข้อจำกัด'),
        followUp: ask('That works. Could you flag what’s missing in the summary?', 'แบบนั้นได้ ช่วยทำเครื่องหมายในสรุปให้ดูได้ไหมว่าส่วนไหนยังขาด'),
        followModels: [
          say('Sure. I’ll mark anything that hasn’t been confirmed yet.', 'ได้เลย ฉันจะทำเครื่องหมายทุกส่วนที่ยังไม่ได้รับการยืนยัน', 'Hasn’t been confirmed เป็น present perfect แบบ passive ใช้เน้นสถานะของข้อมูล'),
          say('Of course. I’ll put a short note next to each missing figure.', 'ได้เลย ฉันจะใส่โน้ตสั้น ๆ ข้างตัวเลขแต่ละตัวที่ยังขาด', 'Next to บอกตำแหน่ง เหมาะเมื่ออยากระบุว่าจะทำเครื่องหมายตรงไหน'),
        ],
        followHint: 'บอกให้เห็นภาพว่าผู้อ่านจะหาข้อมูลที่ขาดได้อย่างไร',
      },
      {
        id: 'renegotiate', intent: 'บอกข้อจำกัดและขอขยับเวลาส่ง',
        reply: say('Three might be tight. Would four work if you need the full version?', 'บ่ายสามอาจจะฉิวเฉียด ถ้าต้องการฉบับเต็ม บ่ายสี่ทันไหม', 'Might be tight บอกอย่างสุภาพว่าเวลาอาจไม่พอ Would four work เช็กว่าข้อเสนอใช้ได้ไหม'),
        followUp: ask('The meeting starts at four. What could you get to me by three thirty?', 'ประชุมเริ่มบ่ายสี่ คุณส่งอะไรให้ฉันได้บ้างภายในบ่ายสามครึ่ง'),
        followModels: [
          say('I could send the draft with the figures I have so far.', 'ฉันส่งร่างพร้อมตัวเลขที่มีถึงตอนนี้ให้ได้', 'Could ใช้เสนอทางเลือกที่เป็นไปได้ So far กำหนดกรอบว่าข้อมูลมีเท่าที่รวบรวมได้ถึงตอนนี้'),
          say('I can share the charts. The written analysis will take a bit longer.', 'ฉันส่งกราฟให้ได้ ส่วนบทวิเคราะห์แบบเขียนจะใช้เวลาอีกหน่อย', 'ขึ้นประโยคที่สองเพื่อแยกส่วนที่พร้อมส่งจากงานที่ต้องใช้เวลา'),
        ],
        followHint: 'ระบุงานที่รับปากส่งได้และส่วนที่ต้องใช้เวลาเพิ่ม',
      },
    ],
    speaking: { seconds: 55, task: 'ลองตอบเพื่อนที่ถามถึงงานหนึ่งชิ้น บอกความคืบหน้า สิ่งที่ยังติดอยู่ และเสนอเวลาหรือส่วนที่จะส่งได้', focus: 'ระบุสิ่งที่พร้อมและสิ่งที่ยังไม่เสร็จ แยก by สำหรับเส้นตายจาก at สำหรับเวลาเริ่ม', stress: 'ลงน้ำหนักที่เวลาหลักใน by THREE, at FOUR และเว้นจังหวะก่อนเสนอเวลาใหม่' },
  },
  {
    id: 'technical-explanation', title: 'อธิบายเรื่องเทคนิคให้ง่ายขึ้น',
    context: 'เพื่อนใช้แอปเรียนภาษาเวลาเดินทางและอยากรู้ว่าทำไมเปิดบทเรียนได้เมื่อเน็ตหลุด',
    objectiveId: 'm9-08',
    firstTurn: ask('How can the lessons still open when I’m offline?', 'ทำไมถึงยังเปิดบทเรียนได้เวลาออฟไลน์'),
    branches: [
      {
        id: 'plain-sequence', intent: 'อธิบายเป็นลำดับก่อน–หลัง',
        reply: say('The app saves a copy of the lessons while you’re online. Later, it can open that copy without a connection.', 'แอปเก็บสำเนาบทเรียนตอนคุณออนไลน์ หลังจากนั้นเปิดสำเนาได้แม้ไม่มีอินเทอร์เน็ต', 'While บอกช่วงที่เกิดการบันทึก Later แยกเวลาที่เปิดจากเวลาที่เก็บ'),
        followUp: ask('So why didn’t it work the first time I tried it on the train?', 'ถ้าอย่างนั้นทำไมครั้งแรกที่ฉันลองใช้บนรถไฟถึงเปิดไม่ได้'),
        followModels: [
          say('It might not have finished saving the lessons yet.', 'ตอนนั้นอาจยังเก็บบทเรียนไม่เสร็จ', 'Might not have + V3 เป็นการคาดถึงสิ่งที่อาจยังไม่เกิดในตอนนั้น'),
          say('If the app hadn’t finished preparing the lessons, there wouldn’t have been a complete copy to open.', 'ถ้าตอนนั้นแอปยังเตรียมบทเรียนไม่เสร็จ ก็จะยังไม่มีสำเนาที่เปิดได้ครบ', 'ใช้ past perfect ในเงื่อนไขเพื่อย้อนมองเหตุการณ์จากจุดที่ลองเปิด'),
        ],
        followHint: 'แยกสิ่งที่รู้จากข้อสันนิษฐาน และอธิบายว่าต้องเกิดอะไรขึ้นก่อนเปิดออฟไลน์ได้',
      },
      {
        id: 'analogy', intent: 'ใช้การเปรียบเทียบให้เห็นภาพ',
        reply: say('Think of it like saving a map before a trip. Once it’s saved, you can look at the copy on your device.', 'ลองนึกถึงการเก็บแผนที่ก่อนออกเดินทาง พอเก็บแล้วก็ดูสำเนาบนเครื่องได้', 'Think of it like ใช้ชวนให้ผู้ฟังนึกภาพ Once it’s saved หมายถึงเมื่อเก็บเสร็จแล้ว'),
        followUp: ask('Does that mean the podcast audio is saved too?', 'ถ้าอย่างนั้นเสียงพอดแคสต์ก็ถูกเก็บไว้ด้วยใช่ไหม'),
        followModels: [
          say('Only the lesson content is saved. The podcast still plays from its original site.', 'เครื่องเก็บเฉพาะเนื้อหาบทเรียน พอดแคสต์ยังเล่นจากเว็บต้นทาง', 'Only จำกัดขอบเขตตรง the lesson content ส่วน still บอกว่าวิธีเปิดพอดแคสต์เหมือนเดิม'),
          say('The notes you write are on your device. The audio depends on the podcast app or site you use.', 'โน้ตที่เขียนอยู่บนเครื่องคุณ ส่วนเสียงขึ้นอยู่กับแอปหรือเว็บพอดแคสต์ที่ใช้', 'Depends on ชี้ว่าคำตอบขึ้นกับระบบภายนอก'),
        ],
        followHint: 'บอกให้ชัดว่าอะไรอยู่บนเครื่อง แล้วอธิบายว่าเสียงมาจากที่ไหน',
      },
    ],
    speaking: { seconds: 60, task: 'เลือกฟังก์ชันหนึ่งในเครื่องมือที่คุณรู้จัก อธิบายว่าทำงานอย่างไร ยกตัวอย่าง และบอกข้อจำกัดหนึ่งอย่าง', focus: 'ใช้คำเชื่อมที่ช่วยบอกลำดับหรือเงื่อนไข ลองถามตัวเองว่าคนฟังต้องรู้คำศัพท์เทคนิคคำไหนจริง ๆ', stress: 'เว้นจังหวะก่อน Once it’s saved เพื่อให้ได้ยินว่ากำลังเข้าสู่ขั้นถัดไป' },
  },
  {
    id: 'podcast-interview', title: 'ตอบคำถามแบบสัมภาษณ์พอดแคสต์',
    context: 'ผู้ดำเนินรายการถามถึงการเปลี่ยนแปลงที่เกิดจากนิสัยเล็ก ๆ ที่คุณเริ่มทำ',
    objectiveId: 'm9-07',
    firstTurn: ask('So, did you notice any changes after the first week?', 'แล้วหลังจากสัปดาห์แรก คุณสังเกตเห็นอะไรเปลี่ยนไปบ้างไหม'),
    branches: [
      {
        id: 'noticed', intent: 'ตอบว่ามีผล และยกหลักฐานจากสิ่งที่ทำจริง',
        reply: say('I did. By Friday, I was pausing less when I tried to explain things.', 'เห็นค่ะ พอถึงวันศุกร์ เวลาลองอธิบายอะไรฉันหยุดคิดน้อยลง', 'I did ตอบรับ did ในคำถาม แล้วใช้ past continuous บอกพฤติกรรมที่สังเกตได้ตอนนั้น'),
        followUp: ask('Can you give me an example of when that helped?', 'ช่วยยกตัวอย่างได้ไหมว่ามันช่วยตอนไหน'),
        followModels: [
          say('For example, I explained a bug to a teammate without writing the whole thing down first.', 'อย่างเช่น ฉันอธิบายบั๊กให้เพื่อนในทีมฟังได้โดยไม่ต้องเขียนทั้งหมดก่อน', 'Without ตามด้วย V-ing เพื่อบอกสิ่งที่ไม่ได้ทำก่อนลงมือ'),
          say('I was on a call and managed to ask a follow-up question right away.', 'ตอนคุยสาย ฉันถามต่อได้เลยทันที', 'Managed to บอกว่าทำสำเร็จในสถานการณ์ที่อาจยาก'),
        ],
        followHint: 'เลือกเหตุการณ์หนึ่งที่คนฟังมองเห็นภาพได้ ระบุว่าคุณทำอะไรต่างจากเดิม',
      },
      {
        id: 'not-right-away', intent: 'ตอบว่าช่วงแรกยังไม่เห็นผล แล้วเล่าว่าเริ่มเห็นตอนไหน',
        reply: say('Not right away. It took a couple of weeks before I felt more comfortable.', 'ยังไม่ทันที ต้องใช้สักสองอาทิตย์กว่าจะรู้สึกสบายใจขึ้น', 'Not right away เป็นคำตอบสั้นตามบริบท It took + เวลา + before เชื่อมเวลาที่ต้องใช้กับผลที่เริ่มเห็น'),
        followUp: ask('What kept you going in the meantime?', 'ระหว่างนั้นอะไรช่วยให้คุณทำต่อ'),
        followModels: [
          say('I made the practice short enough to do on busy days.', 'ฉันจัดให้เวลาฝึกสั้นพอที่จะทำได้ในวันยุ่ง ๆ', 'Short enough to บอกว่าระยะเวลาพอดีกับสิ่งที่อยากทำได้'),
          say('A friend checked in with me every Friday. That made it easier to stick with it.', 'เพื่อนถามไถ่ทุกวันศุกร์ เลยทำต่อเนื่องได้ง่ายขึ้น', 'Check in with คือถามไถ่ความคืบหน้า Stick with it คือทำต่อแม้ต้องใช้เวลา'),
        ],
        followHint: 'บอกสิ่งที่ช่วยให้ทำต่อ แล้วอธิบายผลในชีวิตจริงสั้น ๆ',
      },
    ],
    speaking: { seconds: 60, task: 'ลองตอบแบบแขกรับเชิญในพอดแคสต์ เล่าพฤติกรรมหนึ่งที่คุณลองเปลี่ยน บอกว่าเห็นผลเมื่อไร และยกตัวอย่าง', focus: 'แยกช่วงเวลาที่ลองทำจากเหตุการณ์ที่ช่วยให้เห็นผล ใช้ตัวอย่างเฉพาะสักหนึ่งตัวอย่าง', stress: 'ใน did you NOTICE any CHANGES ลองเน้น notice และ changes ส่วน did you พูดให้เบาลง' },
  },
  {
    id: 'agree-disagree', title: 'เห็นด้วยหรือเห็นต่างอย่างสุภาพ',
    context: 'ทีมกำลังคุยกันว่าจะยกเลิกประชุมประจำสัปดาห์แล้วเปลี่ยนเป็นการส่งข้อความอัปเดตหรือไม่',
    objectiveId: 'm9-03',
    firstTurn: ask('I think we should replace the weekly meeting with written updates. What do you think?', 'ฉันว่าเปลี่ยนประชุมประจำสัปดาห์เป็นส่งอัปเดตเป็นข้อความดีกว่า คุณคิดยังไง'),
    branches: [
      {
        id: 'mostly-agree', intent: 'เห็นด้วยและเสนอวิธีลองทำ',
        reply: say('I’m in favor of that. Could we try it for a month and see how it goes?', 'ฉันเห็นด้วย ลองทำสักเดือนได้ไหมแล้วค่อยดูว่าเป็นยังไง', 'In favor of แสดงจุดยืนแบบกลาง ๆ ส่วน could we เปิดเป็นข้อเสนอให้พิจารณา'),
        followUp: ask('Sure. How would we know if it was working?', 'ได้เลย เราจะรู้ได้อย่างไรว่าวิธีนี้ได้ผล'),
        followModels: [
          say('We could ask people whether they’re getting the information they need.', 'เราอาจถามทุกคนว่าได้รับข้อมูลที่ต้องใช้ครบไหม', 'Whether นำใจความที่ต้องการคำตอบว่าใช่หรือไม่ ใช้ลำดับประธานก่อนกริยาในส่วนนี้'),
          say('We could track how often someone has to ask for an update afterward.', 'เราอาจดูว่าต้องมีคนทักมาขออัปเดตซ้ำบ่อยแค่ไหน', 'How often นำสิ่งที่ต้องการวัด และ afterward บอกว่ามาถามหลังการอัปเดต'),
        ],
        followHint: 'เสนอวิธีวัดผลที่ทีมทำได้จริงหนึ่งอย่าง',
      },
      {
        id: 'partly-disagree', intent: 'ยอมรับประโยชน์แต่บอกสิ่งที่ยังกังวล',
        reply: say('I see the appeal, but I think we still need a place to talk through tricky decisions.', 'เข้าใจว่ามันมีข้อดี แต่ฉันคิดว่าเรายังต้องมีช่องทางคุยกันให้ละเอียดเวลาตัดสินใจเรื่องยาก ๆ', 'I see the appeal ยอมรับว่าอีกมุมมีข้อดี But เชื่อมกับข้อกังวล และ still บอกว่าความต้องการนี้ยังอยู่'),
        followUp: ask('Would a shorter meeting solve that?', 'ถ้าประชุมให้สั้นลงจะแก้เรื่องนั้นได้ไหม'),
        followModels: [
          say('It might, as long as we save that time for decisions.', 'อาจได้ ถ้าเราเก็บเวลานั้นไว้คุยเฉพาะเรื่องที่ต้องตัดสินใจ', 'As long as วางเงื่อนไขที่ต้องเป็นจริงเพื่อให้ทางเลือกนี้ใช้ได้'),
          say('Maybe. I’d prefer a short call only when someone has a question we can’t settle in writing.', 'อาจจะนะ ฉันอยากคุยสายสั้น ๆ เฉพาะเมื่อมีคำถามที่คุยทางข้อความแล้วยังตกลงกันไม่ได้', 'I’d prefer ใช้เสนอความชอบอย่างนุ่มนวล Only when จำกัดเวลาที่จำเป็นต้องคุย'),
        ],
        followHint: 'เลือกตอบว่าข้อเสนอน่าจะใช้ได้ภายใต้เงื่อนไขอะไร หรือมีตัวเลือกไหนตอบโจทย์กว่า',
      },
    ],
    speaking: { seconds: 55, task: 'ตอบความเห็นหนึ่งที่เพื่อนร่วมทีมเสนอ บอกส่วนที่เห็นด้วยหรือกังวล พร้อมเสนอวิธีลองทำหรือเงื่อนไข', focus: 'ถ้าใช้ but ให้ตรวจว่าสองส่วนมีความหมายต่างกันจริง และข้อเสนอที่ตามมาชัดว่าอยากทำอะไร', stress: 'เว้นจังหวะสั้น ๆ ก่อน but แล้วเน้นคำที่บอกข้อกังวล' },
  },
  {
    id: 'clarification', title: 'ถามให้เข้าใจตรงกัน',
    context: 'เพื่อนฝากช่วยจัดงาน แล้วพูดถึงตัวเลขที่อาจหมายถึงคนละกลุ่ม คุณต้องเช็กก่อนเตรียมของ',
    objectiveId: 'm9-04',
    firstTurn: ask('Can you make sure we have enough food for twenty?', 'ช่วยดูให้หน่อยว่าเรามีอาหารพอสำหรับยี่สิบคนไหม'),
    branches: [
      {
        id: 'ask-inclusion', intent: 'ถามตรง ๆ ว่าตัวเลขรวมใครบ้าง',
        reply: say('Does that include the volunteers, or is it twenty guests plus the volunteers?', 'ตัวเลขนั้นรวมอาสาสมัครไหม หรือเป็นแขกยี่สิบคนบวกกับอาสาสมัคร', 'ใช้ that อ้างถึงตัวเลขที่เพิ่งพูดถึง และ or ช่วยวางสองความหมายให้เลือกตอบ'),
        followUp: ask('It includes the volunteers, but two people can’t eat eggs.', 'รวมอาสาสมัครแล้ว แต่มีสองคนกินไข่ไม่ได้'),
        followModels: [
          say('Got it. Do those two need separate meals?', 'เข้าใจแล้ว สองคนนั้นต้องเตรียมอาหารแยกไหม', 'Those two เชื่อมกับคนสองคนที่เพิ่งพูดถึงได้ชัด'),
          say('Okay, so twenty meals in total, and at least two without eggs.', 'โอเค รวมยี่สิบชุด และอย่างน้อยสองชุดไม่ใส่ไข่', 'So ใช้เกริ่นสรุป In total ชี้จำนวนรวม และ at least ตั้งจำนวนขั้นต่ำ'),
        ],
        followHint: 'ย้ำตัวเลขรวม หรือถามต่อว่าต้องแยกอาหารสำหรับสองคนอย่างไร',
      },
      {
        id: 'reflect-back', intent: 'พูดทวนสิ่งที่เข้าใจก่อนให้เขายืนยัน',
        reply: say('Just to make sure I’ve got this right, you mean twenty people altogether?', 'ขอเช็กให้แน่ใจว่าฉันเข้าใจตรงกัน หมายถึงรวมทั้งหมดยี่สิบคนใช่ไหม', 'Just to make sure I’ve got this right เกริ่นว่าคุณกำลังเช็กการตีความ แล้วใช้คำถามแบบทวนความเข้าใจ'),
        followUp: ask('Actually, twenty guests. I forgot to count the three volunteers.', 'อ๋อ จริง ๆ คือแขกยี่สิบคน ฉันลืมนับอาสาสมัครอีกสามคน'),
        followModels: [
          say('Thanks for checking. I’ll plan for twenty-three, then.', 'ขอบคุณที่เช็กให้ งั้นฉันจะเตรียมสำหรับยี่สิบสามคน', 'Then ท้ายประโยคในที่นี้หมายถึงถ้าอย่างนั้น และเชื่อมการตัดสินใจกับข้อมูลที่เพิ่งได้'),
          say('Okay. Should I order a little extra in case someone brings a friend?', 'โอเค ให้สั่งเผื่ออีกนิดไหม เผื่อมีคนพาเพื่อนมาด้วย', 'In case ให้เหตุผลของการเตรียมเผื่อ และส่วนที่ตามมาใช้ present simple'),
        ],
        followHint: 'ยืนยันยอดใหม่ให้ชัด หรือถามว่าควรเตรียมเผื่อหรือไม่',
      },
    ],
    speaking: { seconds: 45, task: 'สมมติว่าเพื่อนให้ตัวเลขหรือเวลาที่ตีความได้สองแบบ ลองถามให้ชัด พูดทวนคำตอบ และสรุปว่าคุณจะทำอะไร', focus: 'ใช้คำอ้างกลับ เช่น that หรือ those เมื่อคนฟังรู้ว่าหมายถึงอะไร และย้ำตัวเลขสุดท้ายให้ชัด', stress: 'เน้น TWENty guests และ TWENty-three people ให้ได้ยินว่าตัวเลขกับกลุ่มคนเปลี่ยน' },
  },
  {
    id: 'storytelling', title: 'เล่าเรื่องที่เกิดขึ้นไม่คาดคิด',
    context: 'ระหว่างนั่งคุยกัน เพื่อนถามถึงเหตุการณ์ที่ทำให้ทริปวันหยุดเปลี่ยนแผน',
    objectiveId: 'm9-06',
    firstTurn: ask('So what happened on your weekend trip?', 'แล้วทริปสุดสัปดาห์ของคุณเกิดอะไรขึ้นเหรอ'),
    branches: [
      {
        id: 'set-scene', intent: 'ปูเหตุการณ์ก่อน แล้วบอกจุดที่แผนเปลี่ยน',
        reply: say('We were getting ready to leave when the hotel called to say our room wasn’t available.', 'เรากำลังเตรียมตัวจะออกเดินทาง ตอนที่โรงแรมโทรมาบอกว่าห้องที่จองไว้ไม่ว่าง', 'Were getting ready เป็นฉากที่กำลังเกิด ส่วน called เป็นเหตุการณ์ที่เข้ามาในจังหวะนั้น'),
        followUp: ask('Oh no. Did you manage to find somewhere else?', 'แย่จัง แล้วหาที่พักที่อื่นได้ไหม'),
        followModels: [
          say('We did. A friend sent us a link, so we booked a small place near the station.', 'ได้ เพื่อนส่งลิงก์มาให้ เราเลยจองที่พักเล็ก ๆ แถวสถานี', 'So เชื่อมข้อมูลที่ได้กับการตัดสินใจที่ตามมา'),
          say('Eventually, yes. We’d already called three other places by then.', 'สุดท้ายก็ได้ ตอนนั้นเราโทรไปอีกสามที่แล้ว', 'We’d already called ในบริบทนี้คือ we had already called ใช้ย้อนจากตอนที่หาที่พักได้'),
        ],
        followHint: 'ใช้ประโยคสั้นตอบว่าได้หรือไม่ได้ แล้วบอกเหตุการณ์ที่ทำให้ผลออกมาแบบนั้น',
      },
      {
        id: 'reveal-result', intent: 'เปิดด้วยผลลัพธ์ แล้วค่อยเล่าสาเหตุ',
        reply: say('We ended up staying close to home. Our train was canceled, and there weren’t any seats on the next one.', 'สุดท้ายเราอยู่เที่ยวแถวบ้าน รถไฟถูกยกเลิก และขบวนถัดไปก็ไม่มีที่นั่ง', 'Ended up ตามด้วย V-ing บอกผลลัพธ์ที่เกิดขึ้นจริง จากนั้น past simple ให้รายละเอียดว่าเกิดอะไรขึ้น'),
        followUp: ask('Did the weekend turn out all right anyway?', 'แล้วสุดสัปดาห์ก็ยังโอเคอยู่ไหม'),
        followModels: [
          say('Better than I expected, actually. We found a market we’d never been to.', 'ดีกว่าที่คิดนะ เราเจอตลาดที่ไม่เคยไปมาก่อน', 'We’d never been to เป็นอนุประโยคขยาย a market โดยละ that ได้ และใช้ past perfect มองย้อนจากวันที่เจอตลาด'),
          say('Yeah. It worked out because we didn’t have to rush anywhere.', 'ใช่ สุดท้ายก็ดี เพราะไม่ต้องรีบไปไหน', 'Work out บอกว่าผลออกมาดี และ because ตามด้วยเหตุผลเต็มประโยค'),
        ],
        followHint: 'บอกความรู้สึกกับผลลัพธ์และรายละเอียดหนึ่งอย่างที่สนับสนุน',
      },
    ],
    speaking: { seconds: 60, task: 'เล่าทริปหรือวันที่แผนเปลี่ยน เลือกว่าจะเปิดด้วยฉากหรือผลลัพธ์ แล้วเล่าเหตุการณ์สองถึงสามช่วงต่อกัน', focus: 'สลับ past continuous สำหรับฉากกับ past simple สำหรับเหตุการณ์ และเลือกคำเชื่อมตามความสัมพันธ์จริงของเรื่อง', stress: 'ลองพักหลัง We were getting ready to leave แล้วลงน้ำหนักที่ CALLED ตรงเหตุการณ์ที่เปลี่ยนแผน' },
  },
]
