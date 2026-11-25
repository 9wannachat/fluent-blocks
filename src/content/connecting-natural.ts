import { authorLesson, type PatternLine, type PracticeLine } from './authoring'

type Example = [en: string, th: string, context: string]
type Entry = {
  id: string
  en: string
  th: string
  concept: string
  formula: string
  examples: [Example, Example, Example, Example, Example]
  contrasts: [[string, string, string], [string, string, string]]
  wrong: string
  correction: string
  correctionWhy: string
  fill: [string, string]
  transform: [prompt: string, answer: string | string[], note: string]
  speaking: string
  patterns: PatternLine[]
}

function lessonFrom(entry: Entry) {
  const [first, second, third, fourth, fifth] = entry.examples
  const practice: PracticeLine[] = [
    [`เลือกประโยคที่ตรงกับสถานการณ์นี้ — ${first[1]} (${first[2]})`, first[0], first[2], entry.contrasts[0][2], [second[0], first[0], third[0]]],
    [entry.fill[0], entry.fill[1], entry.formula, entry.concept],
    [entry.transform[0], entry.transform[1], entry.formula, entry.transform[2]],
    [`พูดเป็นอังกฤษแบบที่บทนี้ฝึก — “${fourth[1]}” (${fourth[2]})`, fourth[0], fourth[2], entry.concept],
    [`ซ่อมประโยคนี้ — ${entry.wrong}`, entry.correction, entry.formula, entry.correctionWhy],
  ]
  return authorLesson(entry.id, entry.en, entry.th, `ลองนึกว่าคุณกำลัง${first[2]}`, `เลือกและใช้ ${entry.en} ตามเจตนาในเรื่องของตัวเอง`,
    entry.concept, entry.formula, entry.examples, entry.contrasts, [[fourth[0], fourth[1]], [fifth[0], fifth[1]]],
    [[entry.wrong, entry.correction, entry.correctionWhy]], practice, entry.speaking, entry.patterns)
}

function pattern(template: string, meaning: string, intent: string, slot: string, rule: string, first: Example, second: Example, placement: string, register?: 'informal' | 'neutral' | 'formal'): PatternLine {
  return [template, meaning, intent, slot, rule, first, second, placement, register]
}

const entries = [
  {
    id: 'm7-01', en: 'And, also and plus', th: 'เพิ่มข้อมูลด้วย and, also และ plus',
    concept: 'And ประสานสิ่งที่อยู่ระดับเดียวกัน ส่วน also เป็น adverb ที่เพิ่มข้อมูลและมักอยู่ก่อนกริยาทั่วไปหรือหลัง be และกริยาช่วย ในภาษาพูด plus เปิดเหตุผลเพิ่มอีกข้อได้',
    formula: 'X and Y | subject + also + verb | be + also | Plus, + clause',
    examples: [['We need pens and paper.', 'เราต้องใช้ปากกาและกระดาษ', 'จัดของเข้าประชุม'], ['I also need a notebook.', 'ฉันต้องใช้สมุดด้วย', 'เพิ่มของอีกชิ้น'], ['Plus, it’s on sale.', 'แถมยังลดราคาอยู่ด้วย', 'เพิ่มเหตุผลตอนซื้อ'], ['We can also send a link.', 'เราส่งลิงก์ให้ด้วยได้', 'เสนอวิธีส่งเอกสาร'], ['That would help, thanks.', 'แบบนั้นช่วยได้เลย ขอบคุณ', 'ตอบข้อเสนอ']],
    contrasts: [['I brought tea and coffee.', 'I also brought water.', 'and เชื่อมรายการ ส่วน also เพิ่มสิ่งจากประโยคก่อนหน้า'], ['She’s also free.', 'She also has a car.', 'หลัง be แต่ก่อน lexical verb']],
    wrong: 'I also am can help.', correction: 'I can also help.', correctionWhy: 'มี modal can แล้ว วาง also หลัง can และตามด้วย help',
    fill: ['He’s ___ available on Friday. เติม also', 'also'],
    transform: ['เพิ่ม also ใน They can join us.', 'They can also join us.', 'also ตามหลังกริยาช่วยตัวแรก'],
    speaking: 'เลือกสถานที่นัดหมายแล้วให้เหตุผลสองข้อด้วย and หรือ plus',
    patterns: [
      pattern('In addition to + noun/-ing, + clause', 'นอกจาก…แล้ว ยัง…', 'elaboration', 'noun/-ing', 'ส่วนหน้าเป็นสิ่งที่มีอยู่แล้ว', ['In addition to teaching, she runs a café.', 'นอกจากสอนหนังสือ เธอยังทำร้านกาแฟ', 'แนะนำงานของคนอื่น'], ['In addition to rent, we pay for water.', 'นอกจากค่าเช่า เราจ่ายค่าน้ำด้วย', 'อธิบายค่าใช้จ่าย'], 'เปิดด้วยส่วนเสริมแล้วตามด้วยใจความหลัก', 'formal'),
      pattern('What’s more, + clause', 'ยิ่งไปกว่านั้น…', 'elaboration', 'clause', 'เพิ่มข้อมูลเด่นที่ไปในทิศทางเดิม', ['It’s close. What’s more, it’s quiet.', 'อยู่ใกล้ แถมยังเงียบ', 'เลือกที่พัก'], ['It works offline. What’s more, it’s free.', 'ทำงานออฟไลน์ได้ แถมฟรี', 'แนะนำเครื่องมือ'], 'วางต้นประโยคเพิ่มข้อมูล'),
      pattern('On top of that, + clause', 'นอกจากนั้นยัง…', 'elaboration', 'clause', 'เพิ่มเหตุผลหรือภาระอีกชั้นตามบริบท', ['On top of that, they refunded the delivery fee.', 'นอกจากนั้นยังคืนค่าส่งให้ด้วย', 'เล่าการแก้ปัญหา'], ['On top of that, I missed my train.', 'แถมฉันยังพลาดรถไฟ', 'เล่าวันที่ยุ่ง'], 'พักจังหวะหลัง that', 'informal'),
    ],
  },
  {
    id: 'm7-02', en: 'But and however', th: 'เชื่อมความต่างด้วย but และ however',
    concept: 'But เชื่อมสองส่วนที่สวนทางกันในประโยคเดียว ส่วน however เป็นคำเชื่อมเชิงความหมาย มีอิสระด้านตำแหน่งและมักขึ้นต้นประโยคใหม่ในงานเขียน ภาษาพูดมักใช้ but เพื่อให้ต่อเนื่อง',
    formula: 'clause, but + clause | clause. However, + clause',
    examples: [['I wanted to go, but I had to work.', 'ฉันอยากไปแต่ต้องทำงาน', 'อธิบายว่าทำไมไม่ได้ไป'], ['The update is small. However, it affects everyone.', 'อัปเดตเล็ก แต่กระทบทุกคน', 'สรุปผลกระทบ'], ['It’s cheap but reliable.', 'ราคาถูกแต่ไว้ใจได้', 'แนะนำของ'], ['The price dropped, but it’s still too high.', 'ราคาลดลงแต่ยังสูงเกินไป', 'คุยว่าควรซื้อหรือยัง'], ['Then let’s wait.', 'งั้นรอกันเถอะ', 'ตอบเรื่องราคา']],
    contrasts: [['I like it, but it’s pricey.', 'I like it. However, it’s pricey.', 'ใจความใกล้กัน however มีจังหวะขึ้นประโยคแยกและเป็นทางการขึ้น'], ['It broke, but I fixed it.', 'It broke, so I fixed it.', 'but ชี้ความต่างจากที่คาด ส่วน so ชี้ผล']],
    wrong: 'It was cold, however we went out.', correction: 'It was cold. However, we went out.', correctionWhy: 'เมื่อเขียน ใช้ประโยคแยกก่อน however ในตำแหน่งนี้',
    fill: ['I wanted to join, ___ I already had plans. เติม but หรือ so เพื่อแสดงความขัดกัน', 'but'],
    transform: ['เขียนใหม่ด้วย however — The apartment is small, but it has a balcony.', 'The apartment is small. However, it has a balcony.', 'ขึ้นประโยคใหม่ก่อน however'],
    speaking: 'บอกข้อที่ชอบและข้อที่กังวลเกี่ยวกับตัวเลือกหนึ่งด้วย but',
    patterns: [
      pattern('The downside is + clause', 'ข้อเสียคือ…', 'comparison', 'clause', 'ชี้ข้อเสียหลังจากพูดถึงตัวเลือก', ['The downside is it takes two hours.', 'ข้อเสียคือใช้เวลาสองชั่วโมง', 'เทียบเส้นทาง'], ['The downside is there’s no shade.', 'ข้อเสียคือไม่มีร่ม', 'เลือกที่นั่ง'], 'วางข้อเสียที่อยากเน้นหลัง is'),
      pattern('On the other hand, + clause', 'มองอีกด้านหนึ่ง…', 'comparison', 'clause', 'เปิดมุมที่ต่างจากข้อก่อนหน้า', ['It’s a long walk. On the other hand, it’s free.', 'เดินไกล แต่มองอีกด้านคือฟรี', 'เทียบวิธีไปงาน'], ['On the other hand, a later start gives us more time to prepare.', 'อีกด้าน ถ้าเริ่มช้าจะมีเวลาเตรียมเพิ่ม', 'ประชุมวางแผน'], 'ต้นประโยคหรือช่วงพักในคำพูด'),
      pattern('That said, + clause', 'พูดอย่างนั้นแล้ว ก็ยัง…', 'agreement', 'clause', 'รับหลักที่เพิ่งพูดแล้วเติมข้อจำกัดหรือมุมอีกด้าน', ['It’s a small team. That said, they respond quickly.', 'ทีมเล็ก แต่ตอบเร็ว', 'เล่าประสบการณ์ใช้บริการ'], ['I’m busy. That said, I can spare ten minutes.', 'ฉันยุ่ง แต่แบ่งเวลาสิบนาทีได้', 'ต่อรองเวลานัด'], 'เปิดประโยคที่ตามหลังข้อความเดิม'),
    ],
  },
  {
    id: 'm7-03', en: 'Although and concession', th: 'ยอมรับข้อหนึ่งแต่ยังยืนยันอีกข้อ',
    concept: 'Although หรือ even though นำข้อเท็จจริงที่อาจทำให้ผู้ฟังคาดผลอีกแบบ ประโยคหลักบอกสิ่งที่เกิดแม้มีข้อจำกัด Though อยู่ท้ายประโยคได้ในภาษาพูด ส่วน despite ตามด้วย noun หรือ -ing',
    formula: 'although/even though + clause, + main clause | despite + noun/-ing | clause, though',
    examples: [['Although it was late, we kept talking.', 'ถึงจะดึกแล้วเราก็คุยต่อ', 'เล่าช่วงหลังอาหาร'], ['I went even though I was tired.', 'ฉันไปทั้งที่เหนื่อย', 'อธิบายสิ่งที่ฝืนทำ'], ['Despite the rain, we stayed outside.', 'แม้ฝนตกเราก็ยังอยู่ข้างนอก', 'เล่าทริป'], ['It’s a bit far. It’s worth the trip, though.', 'ไกลหน่อย แต่ก็คุ้มที่จะไป', 'แนะนำร้าน'], ['Then I’ll give it a try.', 'งั้นฉันจะลองไปดู', 'ตอบคำแนะนำ']],
    contrasts: [['Although it was crowded, we found a seat.', 'Despite the crowd, we found a seat.', 'although ตามด้วย clause ส่วน despite ตามด้วย noun phrase'], ['Even though I’m tired, I’ll go.', 'Even if I’m tired, I’ll go.', 'even though นำข้อเท็จจริง ส่วน even if นำสมมติฐาน']],
    wrong: 'Although I was tired, but I went.', correction: 'Although I was tired, I went.', correctionWhy: 'although สร้างคู่ความขัดแย้งให้สองส่วนอยู่แล้ว',
    fill: ['___ it was raining, we still walked home. เติม Although หรือ So', 'Although'],
    transform: ['เปลี่ยน Despite the delay, we made it. เป็นโครง Although จากข้อความ the train was delayed', 'Although the train was delayed, we made it.', 'although ตามด้วยประโยคย่อย'],
    speaking: 'เล่าเหตุการณ์หนึ่งที่มีอุปสรรคแต่คุณยังทำต่อ ใช้ even though',
    patterns: [
      pattern('Even though + fact, + outcome', 'ถึงแม้…ก็…', 'agreement', 'fact / outcome', 'วางข้อเท็จจริงที่ทำให้ผลตามมาดูเกินคาด', ['Even though I knew the route, I got lost.', 'ถึงจะรู้ทางฉันก็หลง', 'เล่าทริป'], ['Even though it’s old, it still works.', 'ถึงจะเก่าก็ยังใช้ได้', 'แนะนำอุปกรณ์'], 'วางต้นหรือหลังประโยคหลักได้'),
      pattern('Despite + noun/-ing, + clause', 'แม้มี…ก็…', 'agreement', 'noun/-ing', 'ระบุอุปสรรคเป็น noun หรือกิจกรรมรูป -ing', ['Despite missing the bus, I got there on time.', 'แม้พลาดรถเมล์ก็ไปทัน', 'เล่าเหตุการณ์'], ['Despite the noise, I slept well.', 'ถึงจะเสียงดังแต่ฉันหลับสบาย', 'รีวิวที่พัก'], 'ระบุอุปสรรคก่อนหรือหลังข้อหลัก', 'formal'),
      pattern('There’s still + noun, though', 'แต่ยังมี…อยู่นะ', 'result', 'noun phrase', 'แทรกข้อเหลืออยู่หลังพูดถึงสถานการณ์', ['There’s still time, though.', 'แต่ยังมีเวลาอยู่นะ', 'เพื่อนกลัวไปสาย'], ['There’s still a risk, though.', 'แต่ยังมีความเสี่ยงอยู่นะ', 'ทวนแผน'], 'though ท้ายข้อความเป็นธรรมชาติในบทสนทนา', 'informal'),
    ],
  },
  {
    id: 'm7-04', en: 'Because and since', th: 'บอกเหตุผลด้วย because และ since',
    concept: 'Because ให้เหตุผลโดยตรง เหมาะกับตอบ Why ส่วน since ใช้เมื่อเหตุเป็นเหมือนข้อมูลตั้งต้นที่ผู้ฟังน่าจะรับรู้ ถ้า since ตามเวลาหรือเหตุการณ์เริ่มต้น อาจหมายถึงตั้งแต่ ใช้ because of เมื่อส่วนที่ตามมาเป็น noun phrase',
    formula: 'because/since + clause | because of + noun phrase',
    examples: [['I called because I needed help.', 'ฉันโทรเพราะต้องการความช่วยเหลือ', 'อธิบายว่าทำไมถึงโทร'], ['Since we’re here, let’s get coffee.', 'ไหน ๆ มาถึงแล้ว ไปซื้อกาแฟกัน', 'ชวนเพื่อนในห้าง'], ['We stayed in because of the storm.', 'เราอยู่ข้างในเพราะพายุ', 'เล่าการเปลี่ยนแผน'], ['I left early because I felt sick.', 'ฉันกลับก่อนเพราะรู้สึกไม่สบาย', 'อธิบายให้เพื่อนร่วมงานฟัง'], ['I hope you’re feeling better.', 'หวังว่าตอนนี้ดีขึ้นแล้วนะ', 'ตอบเรื่องไม่สบาย']],
    contrasts: [['I left because it was noisy.', 'I left because of the noise.', 'ส่วนแรกตามด้วย clause ส่วนหลังตามด้วย noun'], ['Since we have time, let’s walk.', 'I’ve worked here since June.', 'since ตัวแรกบอกเหตุประกอบ ตัวหลังชี้จุดเริ่มเวลา']],
    wrong: 'I stayed home because of I had a cold.', correction: 'I stayed home because I had a cold.', correctionWhy: 'ตัด of เพราะส่วนที่ตามมามี subject และ verb',
    fill: ['The flight was late because ___ the fog. เติมคำเดียว', 'of'],
    transform: ['ใช้ because of แทน because the roads were icy ใน We cancelled because the roads were icy. ให้ใช้ icy roads', 'We cancelled because of the icy roads.', 'เปลี่ยนส่วนสาเหตุเป็น noun phrase'],
    speaking: 'อธิบายเหตุผลที่เลือกแผนวันนี้ แล้วลองเปลี่ยนเหตุผลหนึ่งจาก clause เป็น noun',
    patterns: [
      pattern('One reason is that + clause', 'เหตุผลหนึ่งคือ…', 'reason', 'clause', 'ระบุเหตุหนึ่งข้อโดยเหลือพื้นที่ให้ข้ออื่น', ['One reason is that the bus stops nearby.', 'เหตุผลหนึ่งคือรถเมล์จอดใกล้ ๆ', 'อธิบายทำเล'], ['One reason is that we already know the system.', 'เหตุผลหนึ่งคือเรารู้ระบบนี้แล้ว', 'เลือกเครื่องมือ'], 'that นำเหตุที่จะอธิบาย'),
      pattern('It’s mainly because + clause', 'หลัก ๆ เพราะว่า…', 'reason', 'clause', 'ยกเหตุหลักโดยไม่ปิดเหตุรอง', ['It’s mainly because I have an early start.', 'หลัก ๆ เพราะฉันต้องเริ่มงานเช้า', 'บอกเหตุผลที่กลับก่อน'], ['It’s mainly because the files are huge.', 'หลัก ๆ เพราะไฟล์ใหญ่มาก', 'อธิบายว่าทำไมช้า'], 'mainly อยู่ก่อน because'),
      pattern('Given that + clause, + decision', 'เมื่อพิจารณาว่า… จึง…', 'reason', 'clause / decision', 'ใช้ข้อเท็จจริงตั้งต้นเป็นเหตุประกอบการตัดสินใจ', ['Given that it’s late, we should stop here.', 'เมื่อเห็นว่าดึกแล้วเราควรหยุดตรงนี้', 'ปิดการประชุม'], ['Given that we have two hours, let’s take the train.', 'ในเมื่อมีสองชั่วโมง ไปด้วยรถไฟกัน', 'วางแผนเดินทาง'], 'ขึ้นต้นด้วยเงื่อนไขประกอบการตัดสินใจ', 'formal'),
    ],
  },
  {
    id: 'm7-05', en: 'So and that’s why', th: 'เชื่อมเหตุไปหาผล',
    concept: 'So เชื่อมเหตุที่บอกก่อนหน้ากับผลที่ตามมา That’s why ชี้กลับไปว่าเรื่องที่กล่าวมาเป็นเหตุของผล ส่วน so that มักบอกวัตถุประสงค์ที่ตั้งใจให้เกิด',
    formula: 'reason, so + result | reason. That’s why + result | action + so that + purpose',
    examples: [['It was raining, so we stayed inside.', 'ฝนตกเราเลยอยู่ข้างใน', 'เล่าว่าทำไมเปลี่ยนแผน'], ['I lost my keys. That’s why I’m late.', 'ฉันทำกุญแจหาย ถึงมาสาย', 'อธิบายตอนมาถึง'], ['I wrote it down so that I wouldn’t forget.', 'ฉันจดไว้เพื่อจะได้ไม่ลืม', 'เล่าวิธีกันลืม'], ['There’s no bus tonight, so let’s walk.', 'คืนนี้ไม่มีรถเมล์ งั้นเดินกัน', 'เสนอแผนสำรอง'], ['All right. It’s only ten minutes.', 'ได้ ใช้เวลาแค่สิบนาที', 'ตอบรับการเดิน']],
    contrasts: [['I left because I was tired.', 'I was tired, so I left.', 'เหตุเดิม แต่ because ไปจากผลหาเหตุ ส่วน so ไปจากเหตุหาผล'], ['I wore boots, so my feet stayed dry.', 'I wore boots so that my feet would stay dry.', 'แบบแรกบอกผลที่เกิด แบบหลังบอกจุดประสงค์']],
    wrong: 'It was raining, so because we stayed inside.', correction: 'It was raining, so we stayed inside.', correctionWhy: 'ส่วนหลังคือผล จึงใช้ so ตัวเดียว',
    fill: ['The lift was broken, ___ we took the stairs. เติม so หรือ because เพื่อบอกผล', 'so'],
    transform: ['พูดใหม่ด้วย That’s why — My phone died, so I didn’t call.', ['My phone died. That’s why I didn’t call.', 'My phone died. That is why I didn’t call.'], 'that ชี้กลับไปที่โทรศัพท์ดับ'],
    speaking: 'เล่าเหตุการณ์เล็ก ๆ อธิบายเหตุและผล แล้วเล่าใหม่โดยสลับลำดับด้วย because',
    patterns: [
      pattern('As a result, + consequence', 'ผลก็คือ…', 'result', 'clause', 'แสดงผลที่เกิดจากสาเหตุก่อนหน้า', ['The road flooded. As a result, buses stopped running.', 'ถนนน้ำท่วม ส่งผลให้รถเมล์หยุดวิ่ง', 'รายงานสถานการณ์'], ['We cut the file size. As a result, it loads faster.', 'เราลดขนาดไฟล์ ส่งผลให้โหลดเร็วขึ้น', 'สรุปการแก้ระบบ'], 'เปิดประโยคที่แสดงผล', 'formal'),
      pattern('That’s how + clause', 'นี่คือวิธีที่…', 'result', 'clause', 'ชี้กลับไปที่วิธีที่ทำให้เกิดผล', ['I asked a neighbor. That’s how I found the place.', 'ฉันถามเพื่อนบ้าน นั่นแหละถึงหาเจอ', 'เล่าเส้นทาง'], ['We practised every day. That’s how we got quicker.', 'เราฝึกทุกวัน ถึงทำได้เร็วขึ้น', 'เล่าพัฒนาการ'], 'how ตามด้วยลำดับประโยคบอกเล่า'),
      pattern('Which means + clause', 'ซึ่งหมายความว่า…', 'result', 'clause', 'อธิบายความหมายเชิงผลที่คนฟังควรสังเกต', ['The shop closes at six, which means we need to leave now.', 'ร้านปิดหกโมง แปลว่าเราต้องไปตอนนี้', 'วางแผนซื้อของ'], ['It’s a trial, which means we can stop anytime.', 'เป็นการทดลอง แปลว่าหยุดได้ทุกเมื่อ', 'อธิบายเงื่อนไข'], 'วางหลังข้อเท็จจริงที่กำลังตีความ'),
    ],
  },
  {
    id: 'm7-06', en: 'If and unless', th: 'วางเงื่อนไขด้วย if และ unless',
    concept: 'If เปิดเงื่อนไขที่ต้องเป็นจริงก่อนผลจะตามมา Unless ระบุข้อยกเว้น มักใกล้กับ if … not แต่ไม่แทนกันได้ทุกบริบท กรณีอนาคตที่เป็นไปได้ มักใช้ present ใน if-clause และใช้ will หรือคำสั่งในส่วนผล',
    formula: 'if + present, + result | result + unless + exception',
    examples: [['If it rains, we’ll stay home.', 'ถ้าฝนตกจะอยู่บ้าน', 'เผื่อแผนวันหยุด'], ['I’ll go unless it rains.', 'ฉันจะไปเว้นแต่ฝนตก', 'บอกข้อยกเว้น'], ['If you need help, call me.', 'ถ้าต้องการความช่วยเหลือ โทรมานะ', 'ให้คำแนะนำ'], ['We’ll miss the bus unless we hurry.', 'ถ้าไม่รีบเราจะพลาดรถเมล์', 'เตือนเรื่องเวลา'], ['Let’s take the shortcut.', 'ไปทางลัดกัน', 'ตอบข้อกังวล']],
    contrasts: [['I’ll go if she calls.', 'I’ll go unless she calls.', 'โทรเป็นเงื่อนไขให้ไป เทียบกับโทรเป็นข้อยกเว้นที่ทำให้ไม่ไป'], ['If you come early, we’ll talk.', 'If you can come early, we’ll talk.', 'can เน้นความสะดวกหรือความเป็นไปได้ก่อน']],
    wrong: 'I’ll stay unless if it rains.', correction: 'I’ll stay unless it rains.', correctionWhy: 'unless นำส่วนที่เป็นข้อยกเว้นได้เอง',
    fill: ['I’ll take the train ___ you can give me a ride. เติม unless เพื่อให้การติดรถเป็นข้อยกเว้น', 'unless'],
    transform: ['ใช้ unless แทน if you don’t ใน We won’t start if you don’t arrive.', ['We won’t start unless you arrive.', 'We will not start unless you arrive.'], 'ไม่เริ่มเป็นผลเมื่อเงื่อนไขมาถึงยังไม่เกิด'],
    speaking: 'ชวนเพื่อนไปเที่ยว บอกแผนเมื่ออากาศดีและข้อยกเว้นหนึ่งข้อ',
    patterns: [
      pattern('As long as + condition, + clause', 'ตราบใดที่… ก็…', 'conditions', 'condition / clause', 'วางเงื่อนไขที่พอให้แผนเดินต่อ', ['As long as we leave early, we’ll be fine.', 'ขอแค่ออกเช้าก็ไม่มีปัญหา', 'เตรียมเดินทาง'], ['You can borrow it as long as you bring it back Friday.', 'ยืมได้ขอแค่เอามาคืนวันศุกร์', 'ตกลงให้ยืมของ'], 'วางเงื่อนไขก่อนหรือหลังผล'),
      pattern('In case + clause', 'เผื่อว่า…', 'conditions', 'clause', 'ใช้เตรียมรับเหตุที่อาจเกิด โดยทำสิ่งนั้นก่อนรู้ว่าจะเกิดไหม', ['Bring cash in case the machine is broken.', 'เอาเงินสดไปเผื่อเครื่องเสีย', 'วางแผนซื้อของ'], ['Save a copy in case we lose the original.', 'เก็บสำเนาไว้เผื่อต้นฉบับหาย', 'ป้องกันไฟล์หาย'], 'วางหลังการเตรียมการ'),
      pattern('Only if + condition', 'ก็ต่อเมื่อ…เท่านั้น', 'conditions', 'condition', 'จำกัดว่าต้องเกิดเงื่อนไขนี้ก่อนจึงทำได้', ['I’d go, but only if we can leave early.', 'ฉันจะไปก็ต่อเมื่อกลับเร็วได้', 'ต่อรองกับเพื่อน'], ['You can use the room only if you book it.', 'ใช้ห้องได้ก็ต่อเมื่อจองไว้', 'อธิบายกฎ'], 'วางหลังเงื่อนไขการอนุญาตหรือข้อเสนอ'),
    ],
  },
  {
    id: 'm7-07', en: 'Examples and rephrasing', th: 'ยกตัวอย่างและพูดอีกแบบ',
    concept: 'For example ยกกรณีมาให้เห็นภาพ Like ตามด้วยของหรือกรณีตัวอย่างอย่างเป็นกันเอง In other words ไม่เพิ่มตัวอย่าง แต่ถอดใจความเดิมให้เข้าใจง่ายหรือแม่นกว่าเดิม',
    formula: 'general statement. For example, + case | category + like + example | In other words, + rephrasing',
    examples: [['Try a short activity, like taking a walk.', 'ลองกิจกรรมสั้น ๆ เช่น เดินเล่น', 'เสนอวิธีพัก'], ['Some apps work offline. For example, this one stores lessons locally.', 'บางแอปทำงานออฟไลน์ เช่น แอปนี้เก็บบทบนเครื่อง', 'ยกตัวอย่างให้ผู้ฟังเห็นภาพ'], ['It’s compact. In other words, it fits in your pocket.', 'มันขนาดกะทัดรัด พูดอีกแบบคือใส่กระเป๋าเสื้อได้', 'อธิบายคำศัพท์'], ['It’s flexible. In other words, you can pick your hours.', 'เวลายืดหยุ่น พูดง่าย ๆ คือเลือกเวลาทำงานเองได้', 'อธิบายตารางงาน'], ['Oh, that makes sense.', 'อ๋อ เข้าใจแล้ว', 'ตอบหลังได้คำอธิบาย']],
    contrasts: [['Bring something warm, like a sweater.', 'Bring something warm. In other words, dress for the cold.', 'like ยกสิ่งของหนึ่งชิ้น ส่วนการพูดอีกแบบสื่อเจตนาเดิม'], ['Here’s an example.', 'Let me put it another way.', 'แบบแรกจะให้กรณีหนึ่ง แบบหลังจะปรับคำพูด']],
    wrong: 'You can bring something like for example a jacket.', correction: 'You can bring something like a jacket.', correctionWhy: 'ใช้ตัวนำตัวอย่างอย่างใดอย่างหนึ่งเพื่อให้รายการชัด',
    fill: ['I enjoy outdoor activities ___ hiking. เติม like เพื่อยกตัวอย่าง', 'like'],
    transform: ['ใช้ In other words เชื่อม It’s optional. You can leave it blank.', 'It’s optional. In other words, you can leave it blank.', 'ประโยคหลังอธิบายผลของความหมาย optional'],
    speaking: 'เลือกคำเกี่ยวกับงานของคุณ อธิบายความหมายหนึ่งแบบ แล้วเพิ่มตัวอย่างหนึ่งกรณี',
    patterns: [
      pattern('Take + example, for example', 'ลองดู…เป็นตัวอย่าง', 'technical explanations', 'noun phrase', 'หยิบกรณีที่ผู้ฟังพอตามได้มาสาธิตแนวคิด', ['Take the booking page, for example.', 'ลองดูหน้าจองเป็นตัวอย่าง', 'อธิบายระบบ'], ['Take last week, for example.', 'ลองดูสัปดาห์ที่แล้วเป็นตัวอย่าง', 'อธิบายพฤติกรรม'], 'พูดแล้วขยายว่ากรณีนั้นแสดงอะไร'),
      pattern('Put simply, + clause', 'พูดง่าย ๆ คือ…', 'clarification', 'clause', 'ย่อรายละเอียดที่กล่าวมาให้เข้าใจใจความ', ['Put simply, your files stay on this device.', 'พูดง่าย ๆ คือไฟล์ยังอยู่ในเครื่องนี้', 'อธิบายความเป็นส่วนตัว'], ['Put simply, we need a backup plan.', 'พูดง่าย ๆ คือเราต้องมีแผนสำรอง', 'สรุปความเสี่ยง'], 'เปิดใจความใหม่หลังคำอธิบายเดิม'),
      pattern('A good example is + noun', 'ตัวอย่างที่เห็นภาพคือ…', 'technical explanations', 'noun phrase', 'เลือกสิ่งที่แสดงลักษณะที่เพิ่งพูดถึง', ['A good example is a shared calendar.', 'ตัวอย่างที่เห็นภาพคือปฏิทินร่วม', 'อธิบายเครื่องมือทีม'], ['A good example is the night market.', 'ตัวอย่างที่เห็นภาพคือตลาดกลางคืน', 'แนะนำสถานที่เดินเล่น'], 'ให้น้ำหนักตัวอย่างหลัง is'),
    ],
  },
  {
    id: 'm7-08', en: 'Sequencing', th: 'เล่าลำดับด้วย first, then และ after that',
    concept: 'First เปิดขั้นแรก Then บอกขั้นถัดไปอย่างสั้น After that ชี้กลับไปยังสิ่งที่ทำแล้วก่อนเริ่มขั้นใหม่ Finally นำขั้นสุดท้ายหรือผลหลังรอนาน เลือกใช้เมื่อช่วยให้ผู้ฟังตามเรื่องทัน',
    formula: 'First, + step | then + step | after that, + next event | finally, + last step',
    examples: [['First, open the app.', 'ก่อนอื่นเปิดแอป', 'สอนเพื่อนใช้เครื่องมือ'], ['Then pick a lesson.', 'จากนั้นเลือกบทเรียน', 'บอกขั้นถัดไป'], ['After that, you can save a pattern.', 'หลังจากนั้นเซฟรูปประโยคได้', 'พาไปยังอีกฟีเจอร์'], ['First, check the address. Then call me.', 'ตรวจที่อยู่ก่อน แล้วโทรหาฉัน', 'ให้เพื่อนตรวจจุดนัดหมาย'], ['Sure. I’ll call when I’m ready.', 'ได้ พร้อมแล้วจะโทร', 'รับคำแนะนำ']],
    contrasts: [['First, try the reset button.', 'At first, I didn’t like it.', 'first ลำดับขั้น ส่วน at first เป็นช่วงต้นก่อนเปลี่ยน'], ['After that, we ate.', 'While we ate, we talked.', 'after that คนละช่วง ส่วน while ซ้อนเวลา']],
    wrong: 'After then that, turn it off.', correction: 'After that, turn it off.', correctionWhy: 'after that เป็นกลุ่มคำครบแล้ว ส่วน then ใช้เป็นอีกทางเลือก',
    fill: ['First, wash the rice. ___, add water. เติม Then', 'Then'],
    transform: ['ใช้ After that ย้ายเหตุการณ์ grabbed coffee ให้เป็นประโยคที่สอง — We parked and then grabbed coffee.', 'We parked. After that, we grabbed coffee.', 'that ชี้กลับไปที่การจอดรถ'],
    speaking: 'อธิบายขั้นตอนทำเครื่องดื่มหรือเปิดโปรแกรมในสี่ขั้นให้ผู้ฟังทำตามได้',
    patterns: [
      pattern('The first thing I do is + base verb', 'สิ่งแรกที่ฉันทำคือ…', 'narrative', 'base verb', 'เริ่มอธิบายกิจวัตรหรือขั้นตอนจากการกระทำแรก', ['The first thing I do is check my calendar.', 'อย่างแรกที่ฉันทำคือดูปฏิทิน', 'อธิบายกิจวัตรตอนเช้า'], ['The first thing I do is back up the files.', 'สิ่งแรกที่ฉันทำคือสำรองไฟล์', 'อธิบายขั้นตอนทำงาน'], 'วางกิจกรรมหลัง is'),
      pattern('Once + completed step, + next step', 'พอ…แล้ว ก็…', 'conditions', 'clause / clause', 'กำหนดว่าขั้นถัดไปเริ่มหลังขั้นก่อนสำเร็จ', ['Once the water boils, add the noodles.', 'พอน้ำเดือดก็ใส่เส้น', 'สอนทำอาหาร'], ['Once I get a reply, I’ll let you know.', 'พอได้รับคำตอบแล้วฉันจะบอก', 'นัดหมาย'], 'ใช้ present ใน once-clause เมื่ออ้างเวลาข้างหน้า'),
      pattern('From there, + next step', 'จากตรงนั้น ขั้นต่อไปคือ…', 'transitions', 'clause', 'ใช้จุดที่พูดถึงแล้วเป็นจุดเริ่มขั้นถัดไป', ['From there, follow the signs to the exit.', 'จากตรงนั้นเดินตามป้ายไปทางออก', 'บอกทาง'], ['From there, we can decide what to fix.', 'จากขั้นนั้นเราค่อยตัดสินใจว่าจะแก้อะไร', 'วางลำดับแก้ระบบ'], 'วางต้นเมื่อชี้กลับไปขั้นก่อน'),
    ],
  },
] satisfies Entry[]

const results = entries.map(lessonFrom)
export const connectorLessons = results.map(({ lesson }) => lesson)
export const connectorPatterns = results.flatMap(({ patterns }) => patterns)
export { lessonFrom, pattern }
export type { Entry }
