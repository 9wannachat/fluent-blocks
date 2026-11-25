import type { Exercise, Lesson, Pattern } from '../domain/content'

type ExampleRow = [en: string, th: string, note: string]
type ExerciseRow = [
  kind: Exercise['kind'], prompt: string, answers: string[], hint: string, explanation: string,
  options?: string[], feedback?: Record<string, string>,
]
type PatternRow = [
  id: string, template: string, meaning: string, intent: string, register: Pattern['register'],
  slot: string, rule: string, example: string, why: string, placement: string, alternatives?: string[],
]
interface Chapter {
  id: string
  module: number
  after: string
  en: string
  th: string
  hook: string
  objective: string
  concept: string
  formula: string
  tags: string[]
  examples: [ExampleRow, ExampleRow, ExampleRow, ExampleRow, ExampleRow, ExampleRow]
  contrasts: [ExampleRow, ExampleRow]
  dialogue: [[en: string, th: string], [en: string, th: string]]
  mistakes: [ExampleRow, ...ExampleRow[]]
  exercises: [ExerciseRow, ExerciseRow, ExerciseRow, ExerciseRow, ExerciseRow]
  speaking: string
  patterns: [PatternRow, PatternRow, PatternRow]
}

const chapters: Chapter[] = [
  {
    id: 'm4-04', module: 4, after: 'm4-03', en: 'Short answers and follow-ups',
    th: 'ตอบสั้นแล้วถามต่อ', hook: 'เพื่อนถามว่าไปงานเมื่อวานไหม คุณจะตอบแล้วชวนคุยต่อเรื่องงานได้อย่างไร?',
    objective: 'เลือกกริยาช่วยให้ตรงคำถาม และถามต่อจากข้อมูลที่ได้ยิน',
    concept: 'คำตอบสั้นเต็มรูปมักใช้ yes หรือ no ตามด้วยประธานและกริยาช่วยตัวแรกของคำถาม สลับ you เป็น I เมื่อพูดแทนตัวเอง ในบทสนทนา Yes หรือ No อย่างเดียวก็ใช้ได้ ถ้าอยากให้อีกฝ่ายเล่าต่อ ให้ถามถึงรายละเอียดที่เขาเพิ่งพูดถึง ใน Yes, I did. ลองลงน้ำหนักที่ did เบา ๆ เพื่อยืนยันคำตอบ',
    formula: 'Yes/No + subject + auxiliary (+ not) · And + WH question?',
    tags: ['questions', 'short answers', 'follow-up'],
    examples: [
      ['Yes, I did.', 'ใช่ ไปมา', 'ตอบ Did you go to the event? โดยเก็บ did จากคำถาม'],
      ['Yes, I did, but I left early.', 'ไปมา แต่กลับก่อน', 'เติมรายละเอียดหลังคำตอบสั้น'],
      ["No, I haven't.", 'ยังเลย', 'ตอบ Have you sent the invoice?'],
      ["No, we haven't started yet.", 'พวกเรายังไม่ได้เริ่มเลย', 'ตอบคำถาม present perfect โดยบอกกิจกรรมให้ชัด'],
      ['And who went with you?', 'แล้วใครไปด้วยเหรอ', 'ถามว่าคนไหนไปกับผู้ฟัง'],
      ['And how did you get there?', 'แล้วคุณเดินทางไปยังไง', 'ถามวิธีเดินทางต่อจากเรื่องที่ได้ยิน'],
    ],
    contrasts: [
      ['Yes, I did.', 'Yes, I have.', 'ตอบ Did you call her? ด้วย did และตอบ Have you called her? ด้วย have เพื่อรับกรอบเวลาที่อีกฝ่ายตั้งไว้'],
      ['Yes, I am.', "Yes, I'm ready.", 'คำตอบสั้นเชิงบวกจบที่ am เต็มรูปได้ ส่วน I’m ใช้เมื่อมีคำตาม เช่น ready'],
    ],
    dialogue: [['Did you see the show last night?', 'เมื่อคืนได้ดูการแสดงไหม'], ['Yes, I did. And who picked the songs?', 'ดูสิ แล้วใครเลือกเพลงเหรอ']],
    mistakes: [
      ['Did you go? — Yes, I do.', 'Did you go? — Yes, I did.', 'คำถามใช้ did เพราะเหตุการณ์อยู่ในอดีต คำตอบสั้นจึงใช้ did'],
      ["Are you ready? — Yes, I'm.", 'Are you ready? — Yes, I am.', 'รูปย่อ I’m วางท้ายคำตอบสั้นแบบนี้ไม่ได้'],
    ],
    exercises: [
      ['auxiliary', 'ตอบยืนยัน Did you call Mia? แบบสั้น', ['Yes, I did'], 'คำถามเริ่มด้วย did', 'สลับ you เป็น I แล้วเก็บ did', ['Yes, I do.', 'Yes, I did.', 'Yes, I have.']],
      ['fill', 'เติมกริยาช่วย: Have you started? — No, I ___.', ["haven't", 'have not'], 'No ต้องตามด้วยรูปปฏิเสธ', 'ใช้ have not หรือ haven’t ให้ตรง have ในคำถาม'],
      ['order', 'เรียงคำเพื่อถามว่า แล้วคุณเดินทางไปถึงที่นั่นยังไง', ['And how did you get there'], 'How ถามวิธีเดินทาง', 'วาง did ก่อน you และใช้ get รูปพื้นฐาน', ['there', 'did', 'how', 'get', 'you', 'And']],
      ['repair', "แก้คำตอบสั้นโดยไม่เติมคำอื่น: Are you okay? — Yes, I'm.", ['Yes, I am'], 'เขียน am แบบเต็ม', 'กริยาช่วยที่จบคำตอบแบบนี้ใช้รูปเต็ม'],
      ['choice', 'อีกฝ่ายพูด I went to Chiang Mai with a friend. ข้อไหนถามว่าคนไหนไปด้วย', ['Who went with you'], 'ต้องการรู้คนที่เป็นประธานของ went', 'Who อยู่ในช่องประธานแล้วจึงตามด้วย went', ['Who went with you?', 'Where did you go?', 'Did you go alone?']],
    ],
    speaking: 'บอกว่าเมื่อวานได้ทำอะไรหนึ่งอย่าง ตอบคำถามสมมติ Did you…? แล้วถามต่อด้วย And who…? หรือ And how…? ให้รับกับเรื่องนั้น',
    patterns: [
      ['p-yes-i-did', 'Yes, I did (+ detail).', 'ใช่ ฉันทำแล้วในเวลาที่พูดถึง', 'agreement', 'neutral', 'detail', 'เติมเหตุการณ์หรือรายละเอียดเวลาได้หลังคำตอบสั้น', 'but I left early', 'ตอบรับคำถาม Did you…? โดยไม่ต้องพูดกริยาหลักซ้ำ', 'หลัง I ใช้ did แล้วหยุดหรือเติมรายละเอียด'],
      ['p-no-havent-yet', 'No, [subject] haven’t [optional V3 phrase].', 'ยังไม่ได้ทำจนถึงตอนนี้', 'questions', 'neutral', 'subject', 'ใช้ I/you/we/they กับ haven’t และใช้ hasn’t กับ he/she/it', 'we', 'ตอบคำถาม present perfect เมื่อกิจกรรมยังไม่เกิด', 'เมื่อเติมกิจกรรมให้ใช้ V3 ตามหลัง haven’t'],
      ['p-and-follow-up', 'And [follow-up WH question]?', 'แล้วข้อมูลที่เกี่ยวกันล่ะ', 'questions', 'neutral', 'WH question', 'เลือกคำถามตรงที่ต่อจากข้อมูลเดิม', 'where did you stay?', 'ชวนอีกฝ่ายลงรายละเอียดจากเรื่องที่เพิ่งเล่า', 'วาง and ก่อนคำถามตรง'],
    ],
  },
  {
    id: 'm4-05', module: 4, after: 'm4-04', en: 'Embedded questions',
    th: 'ถามแบบมีประโยคนำ', hook: 'คุณรู้คำถาม Where does she work? แล้ว ถ้าอยากเริ่มด้วย Do you know… จะต่ออย่างไร?',
    objective: 'ใช้ลำดับประธาน–กริยาในคำถามย่อยและเลือก if/whether สำหรับคำถามใช่หรือไม่',
    concept: 'คำถามหลักอาจเปิดด้วย Do you know หรือ Could you tell me ส่วนด้านในเป็น embedded question ซึ่งใช้ลำดับ subject + verb หลังคำถาม WH และไม่มี do-support ของคำถามตรง ถ้าใจความด้านในถามว่าใช่หรือไม่ ให้เชื่อมด้วย if หรือ whether',
    formula: 'Do you know + WH/if/whether + subject + verb? · I wonder + clause.',
    tags: ['embedded questions', 'indirect questions', 'if', 'whether'],
    examples: [
      ['Do you know where she works?', 'คุณรู้ไหมว่าเธอทำงานที่ไหน', 'she ตามหลัง where และ works รับ -s กลับมา'],
      ['Do you know what time the shop closes?', 'คุณรู้ไหมว่าร้านปิดกี่โมง', 'the shop คือประธานของ closes'],
      ['Could you tell me if the lift is working?', 'ช่วยบอกหน่อยได้ไหมว่าลิฟต์ใช้ได้หรือเปล่า', 'ถามแบบสุภาพว่าสภาพใช้งานได้ไหม'],
      ['Could you tell me whether I need a ticket?', 'ช่วยบอกหน่อยได้ไหมว่าต้องใช้ตั๋วหรือเปล่า', 'whether เชื่อมคำถามแบบมีสองคำตอบ'],
      ['I wonder why he left early.', 'สงสัยว่าทำไมเขากลับก่อน', 'บอกความสงสัยแทนการถามตรง'],
      ['I wonder how they found us.', 'สงสัยว่าพวกเขาหาเราเจอได้ยังไง', 'found เป็นอดีตตามลำดับบอกเล่าด้านใน'],
    ],
    contrasts: [
      ['Where does she work?', 'Do you know where she works?', 'ตรงใช้ does + she + work ส่วนคำถามย่อยใช้ she + works'],
      ['Is the café open?', 'Do you know if the café is open?', 'if เปิดคำถามย่อย โดยวาง the café หน้า is'],
    ],
    dialogue: [['Could you tell me where the repair shop is?', 'ช่วยบอกหน่อยได้ไหมว่าร้านซ่อมอยู่ตรงไหน'], ["It's next to the laundromat.", 'อยู่ข้างร้านซักผ้าหยอดเหรียญ']],
    mistakes: [
      ['Do you know where does she work?', 'Do you know where she works?', 'Do you know เป็นส่วนที่ถาม ส่วนด้านในคืนลำดับ she works'],
      ['I wonder where is it.', 'I wonder where it is.', 'ด้านในใช้ it is'],
    ],
    exercises: [
      ['choice', 'เลือกประโยคถามทางอ้อมที่เรียงถูก', ['Do you know where she works?'], 'วาง she ไว้ก่อนกริยาของอนุประโยค', 'works รับ -s และไม่ใช้ does ภายใน', ['Do you know where she works?', 'Do you know where does she work?', 'Do you know where works she?']],
      ['fill', 'เติมคำเชื่อมแบบใช่หรือไม่: Do you know ___ the café is open?', ['if', 'whether'], 'คำถามเดิมคือ Is the café open?', 'ใช้ if หรือ whether เชื่อมคำถามแบบใช่หรือไม่'],
      ['order', 'เรียงคำใหม่ให้เป็นการบอกข้อสงสัย', ['I wonder where it is'], 'เริ่มด้วย I wonder', 'ข้างในใช้ where + it + is', ['is', 'wonder', 'it', 'where', 'I']],
      ['transform', 'ใช้ Could you tell me…? ถาม Where is the taxi stand?', ['Could you tell me where the taxi stand is'], 'ด้านใน the taxi stand อยู่หน้า is', 'คำถามหลักกลับลำดับ Could you แล้ว ส่วนด้านในใช้ลำดับบอกเล่า'],
      ['repair', 'แก้ I wonder how did they find us.', ['I wonder how they found us'], 'ตัด did และเก็บอดีตไว้ที่ find', 'find ผันเป็น found เมื่อไม่ใช้ did และวาง they ก่อน found'],
    ],
    speaking: 'สมมติอยู่สถานีที่ไม่คุ้น ลองถามแบบตรงหนึ่งครั้ง แล้วเปลี่ยนเป็น Could you tell me…? สองครั้ง โดยถามทางหนึ่งข้อและถามว่าต้องซื้อตั๋วหรือไม่อีกหนึ่งข้อ',
    patterns: [
      ['p-do-you-know-wh', 'Do you know [WH clause]?', 'คุณรู้ไหมว่า…', 'questions', 'neutral', 'WH clause', 'WH + subject + finite verb เมื่อ WH ไม่ใช่ประธาน', 'where she works', 'ถามข้อมูลเมื่ออีกฝ่ายอาจรู้', 'สลับ do ที่คำถามหลัก ส่วน clause ด้านในใช้ลำดับบอกเล่า'],
      ['p-could-you-tell-if', 'Could you tell me [if/whether clause]?', 'ช่วยบอกหน่อยได้ไหมว่า…หรือไม่', 'clarification', 'neutral', 'if/whether clause', 'if หรือ whether + subject + verb', 'whether I need a ticket', 'ขอให้ผู้ฟังยืนยันข้อมูลอย่างสุภาพ', 'if/whether ตามหลัง me และนำหน้า subject'],
      ['p-i-wonder-wh', 'I wonder [WH clause].', 'สงสัยว่า…', 'uncertainty', 'neutral', 'WH clause', 'ใช้อนุประโยคคำถาม เช่น why + subject + verb', 'why he left early', 'แสดงความสงสัยหรือเปิดทางให้อีกฝ่ายตอบ', 'วาง WH clause หลังกริยา wonder'],
    ],
  },
  {
    id: 'm4-06', module: 4, after: 'm4-05', en: 'Tag questions',
    th: 'ถามย้ำท้ายประโยค', hook: 'คุณคิดว่าพรุ่งนี้ยังนัดกันอยู่ แต่อยากเช็กกับเพื่อนอีกครั้ง',
    objective: 'ใช้ tag ท้ายประโยคเพื่อเช็กข้อมูลหรือชวนให้อีกฝ่ายเห็นด้วย',
    concept: 'tag question มักสลับขั้วกับประโยคหลัก เช่น ประโยคบอกเล่าตามด้วย tag ปฏิเสธ ถ้ามี auxiliary ให้ยกตัวแรกมาใช้ ถ้าใช้กริยาทั่วไปแบบ simple ใช้ do/does/did ใช้สรรพนามแทนประธาน ในคำพูด น้ำเสียงขึ้นมักบอกว่าต้องการเช็ก ส่วนน้ำเสียงลงมักคาดว่าอีกฝ่ายจะเห็นด้วย',
    formula: 'statement, auxiliary (+ n’t) + subject pronoun?',
    tags: ['tag questions', 'agreement', 'intonation'],
    examples: [
      ["You're coming tomorrow, aren't you?", 'พรุ่งนี้คุณจะมาใช่ไหม', 'ดึง are จาก you’re แล้วกลับเป็น aren’t'],
      ["It's getting late, isn't it?", 'เริ่มดึกแล้วเนอะ', 'is ใน it’s getting เป็นตัวช่วยของ progressive'],
      ["You know the way, don't you?", 'คุณรู้ทางใช่ไหม', 'know เป็นกริยาทั่วไปจึงใช้ do-support'],
      ["Mia called, didn't she?", 'มีอาโทรมาแล้วใช่ไหม', 'called เป็นอดีตจึงใช้ did และแทน Mia ด้วย she'],
      ["You haven't paid yet, have you?", 'คุณยังไม่ได้จ่ายใช่ไหม', 'haven’t เป็นปฏิเสธจึงใช้ have ใน tag'],
      ["He can't drive, can he?", 'เขาขับรถไม่เป็นใช่ไหม', 'tag ดึง can จากคำปฏิเสธ can’t'],
    ],
    contrasts: [
      ["We're early, aren't we?", 'Are we early?', 'tag บอกว่าผู้พูดโน้มไปทางว่าเรามาเร็ว ส่วนคำถามตรงเปิดไว้มากกว่า'],
      ['You know him, right?', "You know him, don't you?", 'right? เป็น tag สั้นในบทสนทนา ส่วน don’t you รับ tense และประธานจากประโยค'],
    ],
    dialogue: [["We haven't missed the train, have we?", 'เรายังไม่ตกรถไฟใช่ไหม'], ["No, we've got ten minutes.", 'ยัง เหลืออีกสิบนาที']],
    mistakes: [
      ["Mia called, doesn't she?", "Mia called, didn't she?", 'called เป็นอดีต จึงใช้ did ใน tag'],
      ["I'm next, amn't I?", "I'm next, aren't I?", 'ภาษาอังกฤษทั่วไปใช้ aren’t I เป็น tag เชิงลบหลัง I am ส่วน amn’t I พบได้ในบางถิ่น เช่น Ireland และ Scotland'],
    ],
    exercises: [
      ['choice', 'เติม tag ให้ You know the way, ___?', ["don't you"], 'know เป็นกริยาทั่วไปและประโยคบอกเล่า', 'ใช้ don’t เพื่อสลับขั้ว', ["don't you", "aren't you", 'do you']],
      ['fill', 'เติม tag สลับขั้ว: He can’t drive, ___?', ['can he'], 'ดึง can จาก can’t', 'ประโยคหลักปฏิเสธ จึงใช้ can he'],
      ['repair', "แก้กริยาช่วยใน Mia called, doesn't she?", ["Mia called, didn't she"], 'called เป็นอดีต', 'แบบ past simple ใช้ didn’t she'],
      ['order', "เรียง tag: We haven't paid, ___?", ['have we'], 'เลือกสองคำที่ตรงกับ tense และ subject', 'นำ have จาก haven’t มาวางก่อน we', ['we', 'have']],
      ['transform', 'เติม tag สลับขั้วใน I’m next. ให้เป็นประโยคเต็ม', ["I'm next, aren't I", "I am next, aren't I", 'I am next, am I not', "I'm next, am I not"], 'ข้อยกเว้นที่เจอบ่อยคือ aren’t I?', 'aren’t I เป็นรูปที่เจอบ่อยในบทสนทนา ส่วน am I not เป็นรูปเต็มทางการกว่า'],
    ],
    speaking: 'พูดประโยคเช็กนัดหมายสองข้อ ใช้ tag หนึ่งประโยคด้วยเสียงขึ้น แล้วพูดประโยคเดิมด้วยเสียงลง สังเกตระดับความมั่นใจที่ได้ยิน',
    patterns: [
      ['p-tag-be', '[Be statement], [be + n’t + pronoun]?', '…ใช่ไหมหรือ…เนอะ', 'agreement', 'neutral', 'be tag', 'จับคู่ be กับ tense และ pronoun ใช้ aren’t I หลัง I am ในรูปทั่วไป', 'are → aren’t you', 'บอกสมมติฐานแล้วชวนให้อีกฝ่ายยืนยัน', 'เว้นจังหวะก่อน tag และวาง auxiliary หน้า pronoun'],
      ['p-tag-do', '[Lexical statement], [do/does/did + n’t + pronoun]?', 'ทำสิ่งนั้นใช่ไหม', 'questions', 'neutral', 'do tag', 'ใช้ do/does สำหรับปัจจุบัน หรือ did สำหรับอดีต', 'called → didn’t she', 'เช็กข้อมูลเกี่ยวกับการกระทำหรือสภาพที่ใช้กริยาทั่วไป', 'วาง tag หลังประโยคสมบูรณ์'],
      ['p-tag-positive', '[Negative statement], [positive auxiliary + pronoun]?', 'ไม่ได้ทำหรือยังไม่…ใช่ไหม', 'clarification', 'neutral', 'positive auxiliary', 'ใช้รูปบวกของกริยาช่วยตัวแรกตามประธานเดิม', 'haven’t → have you', 'ขอให้อีกฝ่ายยืนยันข้อคาดการณ์เชิงปฏิเสธ', 'เว้นจังหวะสั้นก่อน tag เชิงบวก'],
    ],
  },
  {
    id: 'm4-07', module: 4, after: 'm4-06', en: 'Polite requests',
    th: 'ขอให้อีกฝ่ายช่วยอย่างเหมาะสม', hook: 'อยู่ในร้านที่เสียงดัง อยากขอให้พนักงานพูดอีกครั้ง จะขออย่างไร?',
    objective: 'แยกการขอให้ช่วย การขออนุญาต และการเปิดทางให้อีกฝ่ายปฏิเสธ',
    concept: 'ใช้ Could you + กริยารูปพื้นฐาน เพื่อขอให้อีกฝ่ายทำอะไร ถ้าขึ้นต้น Would you mind + V-ing จะถามว่าเขาขัดข้องไหม ส่วน Is it okay if I…? ขอให้เขาอนุญาตให้เราทำเอง เวลาได้ยิน Would you mind…? คำตอบ No, not at all มักหมายถึงยินดีช่วย เวลาพูดเร็ว เสียงท้าย could กับต้น you อาจเชื่อมกัน ลองฟังเป็นกลุ่ม Could you ก่อนฝึกพูดทั้งประโยค',
    formula: 'Could you + V1? · Would you mind + V-ing? · Is it okay if I + clause?',
    tags: ['polite requests', 'permission', 'pragmatics'],
    examples: [
      ['Could you say that again?', 'ช่วยพูดอีกครั้งได้ไหม', 'ขอให้ย้ำข้อมูลที่ฟังไม่ทัน'],
      ['Could you hold the door, please?', 'ช่วยจับประตูไว้ให้หน่อยได้ไหม', 'ขอความช่วยเหลือแบบตรงและสุภาพ'],
      ['Would you mind turning the music down?', 'รบกวนช่วยเบาเพลงหน่อยได้ไหม', 'ถามแบบเผื่อให้อีกฝ่ายปฏิเสธได้'],
      ['Would you mind checking the total?', 'รบกวนช่วยตรวจยอดรวมหน่อยได้ไหม', 'ขอความช่วยเหลือในร้านหรือที่ทำงาน'],
      ['Is it okay if I sit here?', 'ฉันขอนั่งตรงนี้ได้ไหม', 'เป็นผู้ขอที่จะนั่งเอง'],
      ['Is it okay if I leave a little early?', 'ขอกลับก่อนสักหน่อยได้ไหม', 'ถามว่าอีกฝ่ายโอเคกับสิ่งที่เราจะทำหรือเปล่า'],
    ],
    contrasts: [
      ['Could you open the window?', 'Is it okay if I open the window?', 'ข้อแรกขอให้อีกฝ่ายเปิด ข้อหลังขออนุญาตเปิดเอง'],
      ['Could you wait here?', 'Would you mind waiting here?', 'ทั้งสองขอให้รอ ข้อหลังเลือก V-ing และสื่อความเกรงใจเพิ่มได้'],
    ],
    dialogue: [['Would you mind spelling your name for me?', 'รบกวนสะกดชื่อให้หน่อยได้ไหม'], ["Not at all. It's N-O-K.", 'ได้เลย สะกด N-O-K']],
    mistakes: [
      ['Would you mind to wait here?', 'Would you mind waiting here?', 'mind ตามด้วย V-ing ในคำขอรูปนี้'],
      ['Could you to repeat that?', 'Could you repeat that?', 'modal could ตามด้วยกริยารูปพื้นฐานโดยไม่มี to'],
    ],
    exercises: [
      ['auxiliary', 'เติม modal เพื่อขออย่างสุภาพ เริ่มด้วย C: ___ you hold the door?', ['could'], 'ออกเสียงคล้าย good แต่ขึ้นต้นด้วยเสียง k', 'Could + you + hold เป็นรูปขอให้ช่วย'],
      ['fill', 'เติม wait ในรูปที่ถูก: Would you mind ___ outside?', ['waiting'], 'mind รับกริยาเติม -ing', 'waiting เป็น V-ing ตามหลัง mind'],
      ['order', 'เรียงคำเพื่อขออนุญาตนั่งตรงนี้', ['Is it okay if I sit here'], 'เริ่ม Is it okay', 'หลัง if ใช้ I + sit', ['if', 'sit', 'okay', 'I', 'here', 'Is', 'it']],
      ['choice', 'ตอบรับ Would you mind checking the total? แบบไม่มีข้อขัดข้อง', ['Not at all. I’ll check it now.'], 'ตอบว่าไม่ได้ขัดข้อง', 'Not at all ปฏิเสธว่าขัดข้องและตามด้วยการยืนยันว่าจะทำ', ['Not at all. I’ll check it now.', 'Yes, I’d mind. I can’t help.', 'I already paid yesterday.']],
      ['repair', 'แก้เฉพาะรูปกริยา: Could you to repeat that?', ['Could you repeat that'], 'could เป็น modal', 'ตัด to เพราะ repeat เป็น base form ตามหลัง could'],
    ],
    speaking: 'ลองขอให้เพื่อนพูดซ้ำ ขอให้พนักงานเบาเพลง และขออนุญาตนั่งเอง ใช้สามโครงต่างกัน แล้วลองออกเสียงด้วยน้ำเสียงที่ฟังเป็นมิตร',
    patterns: [
      ['p-could-you-request', 'Could you [action], please?', 'ช่วยทำ…ให้หน่อยได้ไหม', 'requests', 'neutral', 'action', 'ใช้ V1 และเติมสิ่งที่ทำให้ชัด โดย please ใส่หรือเว้นได้', 'hold the door', 'ขอให้อีกฝ่ายช่วยทำบางอย่าง', 'Could อยู่หน้า you และ please มักอยู่ท้าย'],
      ['p-would-you-mind-ing', 'Would you mind [verb-ing]?', 'จะรบกวนไหมถ้าขอให้ช่วย…', 'requests', 'neutral', 'verb-ing', 'ใช้กริยาที่ผู้ฟังทำได้ เติม -ing และส่วนขยายตามที่ต้องการ', 'checking the total', 'ตั้งคำขอให้อีกฝ่ายมีทางบอกว่าขัดข้อง', 'V-ing ตามหลัง mind', ['Could you + V1?']],
      ['p-ok-if-i', 'Is it okay if I [present verb]?', 'ฉันขอ…ได้ไหม', 'permission', 'neutral', 'present verb', 'ใช้กริยาปัจจุบันที่ทำโดยผู้พูด', 'leave a little early', 'ขออนุญาตทำกิจกรรมเอง', 'if I อยู่หลัง okay และตามด้วยกริยา'],
    ],
  },
  {
    id: 'm4-08', module: 4, after: 'm4-07', en: 'Choosing the right question',
    th: 'เลือกคำถามให้ตรงสิ่งที่อยากรู้', hook: 'เพื่อนบอกว่ากิจกรรมยกเลิก คุณอยากรู้เหตุผล อยากรู้ผลกระทบ หรืออยากขอคำแนะนำ?',
    objective: 'เลือก question frame ตามช่องข้อมูลที่ขาดและตามความสัมพันธ์กับผู้ฟัง',
    concept: 'ก่อนแต่งคำถาม ลองระบุสิ่งที่อยากได้จากคำตอบ ถ้าอยากรู้สาเหตุ ใช้ why หรือ How come ในกลุ่มที่คุยกันสบาย ๆ ถ้าถามผลกระทบเจาะจงว่า What does that mean for…? ถ้าขอให้อีกฝ่ายเสนอทางเลือก ใช้ What do you suggest…? และปรับน้ำเสียงตามเรื่องที่คุย',
    formula: 'How come + subject + verb? · What does that mean for + noun phrase? · What do you suggest + clause?',
    tags: ['question intent', 'reasons', 'advice'],
    examples: [
      ['How come the door is locked?', 'ทำไมประตูล็อกอยู่ล่ะ', 'แสดงความสงสัยจากสิ่งที่เห็น ใช้ the door is'],
      ['How come you left so early?', 'ทำไมคุณกลับเร็วขนาดนั้นล่ะ', 'ถามคนคุ้นเคยถึงสาเหตุ'],
      ['What does that mean for our booking?', 'แล้วการจองของเราจะเป็นยังไง', 'ถามผลกระทบหลังรู้ว่างานเปลี่ยนวัน'],
      ['What does that mean for people who paid?', 'แล้วคนที่จ่ายเงินไปแล้วจะเป็นยังไง', 'เจาะกลุ่มผู้ได้รับผลกระทบ'],
      ['What do you suggest we do next?', 'คุณแนะนำให้เราทำอะไรต่อ', 'ขอข้อเสนอสำหรับการตัดสินใจ'],
      ['What do you suggest I say to them?', 'คุณแนะนำให้ฉันพูดอะไรกับเขา', 'ขอตัวเลือกว่าจะพูดอย่างไร'],
    ],
    contrasts: [
      ['Why did you leave?', 'How come you left?', 'ถามเหตุผลเหมือนกัน How come เป็นกันเองกว่าและตามด้วย you left'],
      ['What happened to the booking?', 'What do you suggest we do about the booking?', 'ข้อแรกถามเหตุการณ์ ข้อหลังขอทางเลือกว่าจะจัดการอย่างไร'],
    ],
    dialogue: [["The room we've booked is closed for repairs.", 'ห้องที่เราจองปิดซ่อม'], ['What does that mean for our training session?', 'แล้วการอบรมของเราจะเป็นยังไง']],
    mistakes: [
      ['How come did they cancel?', 'How come they canceled?', 'หลัง How come ใช้ลำดับบอกเล่า คงอดีตไว้กับ canceled'],
      ['What do you suggest us to do?', 'What do you suggest we do?', 'suggest ใช้ clause ที่มีประธานและกริยา หรือใช้ V-ing ในอีกโครงหนึ่ง'],
    ],
    exercises: [
      ['choice', 'อยากรู้ผลของการยกเลิกงานต่อคนที่จ่ายแล้ว เลือกคำถาม', ['What does that mean for people who paid?'], 'เจาะผลกระทบของข้อมูลที่เพิ่งได้ยิน', 'for people who paid ระบุกลุ่มผู้ได้รับผลกระทบ', ['How come they canceled?', 'What does that mean for people who paid?', 'What do you suggest we wear?']],
      ['repair', 'แก้ลำดับคำ: How come did you leave?', ['How come you left'], 'หลัง How come วาง you ก่อนกริยา', 'ตัด did แล้วใช้ left เป็นอดีต'],
      ['order', 'เรียงเพื่อขอคำแนะนำว่าจะทำอะไรต่อ', ['What do you suggest we do next'], 'คำถามหลักใช้ What do you suggest ก่อน', 'หลัง suggest ใช้ we do next', ['we', 'suggest', 'What', 'next', 'you', 'do', 'do']],
      ['fill', 'เติมคำเชื่อม: What does that mean ___ our booking?', ['for'], 'หลังช่องว่างคือสิ่งที่ได้รับผล', 'ใช้ mean for เพื่อถามผลต่อการจอง'],
      ['transform', 'เปลี่ยน Why did they stop? เป็นคำถามที่ขึ้นต้นด้วย How come', ['How come they stopped'], 'ประธาน they อยู่หน้ากริยาอดีต', 'ใช้ stopped หลัง they โดยไม่เพิ่ม did'],
    ],
    speaking: 'สมมติว่าร้านยกเลิกโต๊ะที่จองไว้ ถามเหตุผลหนึ่งข้อ ถามผลกระทบหนึ่งข้อ และขอคำแนะนำหนึ่งข้อ แล้วเลือกข้อที่จำเป็นที่สุดในสถานการณ์จริง',
    patterns: [
      ['p-how-come-clause', 'How come [statement order]?', 'ทำไม…เหรอ', 'reasons', 'informal', 'statement order', 'subject + verb ตาม tense ของเหตุการณ์', 'you left so early', 'ชวนให้อธิบายสาเหตุในบทสนทนาแบบกันเอง', 'ไม่ย้ายกริยาช่วยไปหน้าประธานหลัง How come', ['Why + auxiliary + subject + verb?']],
      ['p-meaning-for', 'What does that mean for [affected party]?', 'แล้วจะมีผลกับ…อย่างไร', 'result', 'neutral', 'affected party', 'คน กลุ่ม หรือสิ่งที่ได้รับผล ใช้ noun phrase', 'our booking', 'ต่อจากข่าวด้วยคำถามที่นำไปใช้ตัดสินใจได้', 'วางกลุ่มที่ได้รับผลหลัง for'],
      ['p-suggest-clause-question', 'What do you suggest [subject + base verb]?', 'คุณแนะนำให้…ทำอะไร', 'advice', 'neutral', 'subject + base verb', 'ระบุคนที่ต้องทำ เช่น we หรือ I ตามด้วย base verb', 'we do next', 'ขอความเห็นเรื่องการกระทำที่ควรเลือก', 'หลัง suggest วาง subject ของข้อเสนอ'],
    ],
  },
]

chapters.push(
  {
    id: 'm6-01', module: 6, after: 'm2-10', en: 'Time, place, manner and reason',
    th: 'ขยายว่าเมื่อไร ที่ไหน อย่างไร และทำไม', hook: 'คุณพูดว่า I called her. แล้วอยากให้เพื่อนเห็นภาพว่าโทรเมื่อไรและทำไม',
    objective: 'เพิ่มคำขยายจากข้อมูลที่คนฟังต้องการ และย้ายกรอบเวลาไปหน้าได้เมื่อเหมาะกับบริบท',
    concept: 'เขียนแกน subject + verb ก่อน แล้วเลือกข้อมูลเสริมทีละอย่าง เวลาอาจอยู่ต้นประโยคเพื่อเปิดฉากหรืออยู่ท้ายเพื่อเติมรายละเอียด สถานที่และวิธีมักอยู่หลังแกน ส่วน because เปิดอนุประโยคที่อธิบายเหตุผล เลือกตำแหน่งตามสิ่งที่อยากให้คนฟังรู้ก่อน',
    formula: '[Time frame,] subject + verb (+ object) + place/manner + because clause',
    tags: ['expansion', 'time', 'place', 'manner', 'reason'],
    examples: [
      ['After lunch, I called my sister.', 'หลังมื้อเที่ยง ฉันโทรหาพี่สาว', 'วางเวลาเป็นฉากก่อนเล่าเหตุการณ์'],
      ['After the meeting, we took a short break.', 'หลังประชุม พวกเราพักกันสั้น ๆ', 'ผูกเหตุการณ์กับช่วงเวลาในวันทำงาน'],
      ['I left my keys on the kitchen table.', 'ฉันวางกุญแจไว้บนโต๊ะในครัว', 'ระบุตำแหน่งหลังกุญแจ'],
      ['I left the parcel by the front door.', 'ฉันวางพัสดุไว้ข้างประตูหน้า', 'บอกตำแหน่งให้คนรับหาเจอ'],
      ['I spoke quietly because the baby was asleep.', 'ฉันพูดเบา ๆ เพราะลูกหลับอยู่', 'quietly บอกวิธี ส่วน because บอกเหตุผล'],
      ['We walked slowly because the pavement was slippery.', 'เราเดินช้า ๆ เพราะทางเท้าลื่น', 'เหตุผลอธิบายว่าทำไมเดินช้า'],
    ],
    contrasts: [
      ['After lunch, I called my sister.', 'I called my sister after lunch.', 'ทั้งสองแบบได้ แบบแรกพาเข้าช่วงเวลา แบบที่สองเล่าการโทรก่อน'],
      ['I called her at the station.', 'I called her because I was at the station.', 'at the station ระบุสถานที่ ส่วน because เปิดเหตุผลว่าการอยู่ที่นั่นทำให้โทร'],
    ],
    dialogue: [['Where did you leave my bag?', 'คุณวางกระเป๋าฉันไว้ตรงไหน'], ['I left it by the sofa because the table was full.', 'วางไว้ข้างโซฟา เพราะบนโต๊ะมีของเต็ม']],
    mistakes: [
      ['I left on the table my keys.', 'I left my keys on the table.', 'ประโยคกลาง ๆ วางกรรมสั้นหลัง left ก่อนกลุ่มคำบอกตำแหน่ง'],
      ['I spoke quiet because the baby was asleep.', 'I spoke quietly because the baby was asleep.', 'ใช้ adverb quietly เพื่อขยายวิธีที่พูด'],
    ],
    exercises: [
      ['order', 'เรียงให้ได้ประโยคว่าฉันวางกุญแจไว้บนโต๊ะ', ['I left my keys on the table'], 'วางกรรมหลัง left ก่อนตำแหน่ง', 'my keys เป็นกรรม และ on the table บอกที่วาง', ['on the table', 'my keys', 'I', 'left']],
      ['fill', 'เติมคำบอกวิธีจาก quiet: I spoke ___ because the baby was asleep.', ['quietly'], 'คำนี้ขยาย spoke', 'เปลี่ยน adjective quiet เป็น adverb quietly'],
      ['choice', 'ข้อไหนเน้นเปิดฉากด้วยกรอบเวลา', ['After lunch, I called my sister.'], 'มองหาประโยคที่บอกเวลาเป็นอย่างแรก', 'After lunch เปิดฉากก่อนประธาน I', ['After lunch, I called my sister.', 'I called my sister after lunch.', 'I called my sister from the station.']],
      ['transform', 'ย้าย after the meeting ไปต้นประโยค: We took a short break after the meeting.', ['After the meeting, we took a short break'], 'คงแกน we took a short break ไว้', 'กลุ่มคำ After the meeting เป็นประโยคนำที่บอกเวลา'],
      ['connector', 'เติมคำเดียวเพื่อบอกเหตุผล: We walked slowly ___ the pavement was slippery.', ['because', 'as', 'since'], 'ส่วนหลังเป็นเหตุผลที่เราเดินช้า', 'because ชัดและใช้บ่อย ส่วน as หรือ since ใช้บอกเหตุผลได้เช่นกัน'],
    ],
    speaking: 'เล่าเรื่องทำของหายหรือวางของผิดที่ เริ่มจากประโยคสั้น แล้วเพิ่มเวลา สถานที่ และเหตุผลอย่างละหนึ่งอย่าง',
    patterns: [
      ['p-after-time-frame', 'After [event], [main clause].', 'หลังเหตุการณ์นี้ ก็เกิด…', 'narrative', 'neutral', 'event', 'ใช้คำนามบอกเหตุการณ์ เช่น lunch/the meeting หรือ clause ที่บอกเหตุการณ์', 'the meeting', 'บอกกรอบเวลาก่อนเล่าสิ่งที่ทำ', 'After phrase ขึ้นหน้าและมักคั่นด้วยจุลภาค'],
      ['p-left-object-location', 'I left [object] [location].', 'ฉันวาง…ไว้ที่…', 'daily life', 'neutral', 'location', 'ใช้กลุ่มบอกตำแหน่ง เช่น by/under/on + คำนาม', 'by the front door', 'ช่วยให้ผู้ฟังหาสิ่งของที่เราวางไว้ได้', 'วาง object สั้นก่อนกลุ่มบอกตำแหน่ง'],
      ['p-manner-because', '[Clause with manner] because [reason clause].', 'ทำด้วยวิธีนี้เพราะ…', 'reasons', 'neutral', 'reason clause', 'ใช้กลุ่มที่มี subject + finite verb', 'the pavement was slippery', 'เชื่อมว่าทำอย่างไรกับเหตุผลที่เลือกวิธีนั้น', 'วางคำบอกวิธีใกล้กริยา และให้ประโยคเหตุผลตามหลัง because'],
    ],
  },
  {
    id: 'm6-02', module: 6, after: 'm6-01', en: 'Noun phrases',
    th: 'เติมรายละเอียดให้ชื่อคนและสิ่งของ', hook: 'บนโต๊ะมีกระเป๋าหลายใบ บอกให้เพื่อนหยิบใบสีฟ้าที่อยู่ข้างประตูได้ไหม?',
    objective: 'เลือกคำบอกจำนวน ลักษณะ และตำแหน่งรอบคำนามโดยเก็บชื่อสิ่งหลักไว้ชัดเจน',
    concept: 'กลุ่มคำนาม (noun phrase) มีคำนามหลัก เช่น bag คำบอกเจ้าของ จำนวน หรือสีมักมาก่อน ส่วนกลุ่มบอกตำแหน่ง เช่น next to the door ตามหลัง เลือกรายละเอียดที่ทำให้ผู้ฟังชี้สิ่งเดียวกันได้ และใช้ a few กับคำนามนับได้พหูพจน์',
    formula: 'determiner/quantity + adjective + head noun (+ identifying phrase)',
    tags: ['noun phrase', 'quantity', 'adjective order', 'identification'],
    examples: [
      ['Can you get the blue bag next to the door?', 'ช่วยหยิบกระเป๋าสีฟ้าที่อยู่ข้างประตูให้หน่อยได้ไหม', 'blue มาก่อน bag และตำแหน่งตามหลัง'],
      ['I like the little café next to the station.', 'ฉันชอบคาเฟ่เล็ก ๆ ข้างสถานี', 'บอกขนาดและตำแหน่งของร้านเดียวกัน'],
      ['I have a few questions about the schedule.', 'ฉันมีคำถามเรื่องกำหนดการสองสามข้อ', 'a few บอกจำนวนเล็กน้อยของสิ่งที่นับได้'],
      ['We bought a few apples for the trip.', 'เราซื้อแอปเปิลสองสามลูกไว้สำหรับเดินทาง', 'apples เป็นพหูพจน์หลัง a few'],
      ['My usual bus is late again.', 'รถเมล์เที่ยวที่ฉันขึ้นประจำมาช้าอีกแล้ว', 'my บอกความเกี่ยวข้อง และ usual บอกว่าเป็นคันที่ขึ้นประจำ'],
      ['I ordered my usual coffee.', 'ฉันสั่งกาแฟแบบที่สั่งประจำ', 'ใช้ usual กับของที่คุ้นกันในบริบท'],
    ],
    contrasts: [
      ['The bag is blue.', 'The blue bag is mine.', 'blue ในข้อแรกบอกสภาพหลัง is ส่วนในข้อหลัง blue อยู่ในกลุ่มคำนามเพื่อชี้กระเป๋า'],
      ['I have a few questions.', 'I have a little time.', 'questions นับเป็นข้อได้จึงใช้ a few ส่วน time ในที่นี้ใช้ a little'],
    ],
    dialogue: [['Which mug should I use?', 'ฉันควรใช้แก้วใบไหน'], ['Use the small white mug next to the sink.', 'ใช้แก้วสีขาวใบเล็กข้างอ่างล้างจาน']],
    mistakes: [
      ['Please get the bag blue.', 'Please get the blue bag.', 'คำบอกสีที่ใช้ขยายคำนามโดยตรงอยู่หน้า bag'],
      ['I have a few question.', 'I have a few questions.', 'a few ตามด้วยคำนามนับได้พหูพจน์'],
    ],
    exercises: [
      ['order', 'เรียงกลุ่มคำให้หมายถึง กระเป๋าสีฟ้าข้างประตู', ['the blue bag next to the door'], 'ชื่อหลักคือ bag', 'วาง blue ก่อน bag และวางตำแหน่งตามหลัง', ['next to the door', 'bag', 'blue', 'the']],
      ['choice', 'เลือกคำที่เติมได้: I have ___ questions.', ['a few'], 'questions เป็นพหูพจน์นับได้', 'a few ใช้กับคำนามนับได้พหูพจน์', ['a few', 'a little', 'much']],
      ['repair', 'แก้เฉพาะลำดับคำ: She took the notebook red.', ['She took the red notebook'], 'red อยู่หน้า notebook เมื่อใช้ชี้สมุด', 'the red notebook เป็นกลุ่มคำนามทั้งกลุ่ม'],
      ['fill', 'เติม apple ในรูปที่ถูก: We bought a few ___.', ['apples'], 'a few แสดงว่ามากกว่าหนึ่ง', 'เติม -s ให้ apples เป็นพหูพจน์'],
      ['transform', 'รวม I took the mug. The mug was next to the sink. ใช้ next to เพื่อระบุแก้ว', ['I took the mug next to the sink'], 'ใช้ the mug ครั้งเดียว', 'next to the sink ตามหลัง mug เพื่อบอกว่าเป็นใบไหน'],
    ],
    speaking: 'เลือกของสามชิ้นใกล้ตัว บอกเพื่อนสมมติให้หยิบของแต่ละชิ้น โดยใช้สี ขนาด หรือตำแหน่งเท่าที่ทำให้เพื่อนหาเจอ',
    patterns: [
      ['p-noun-next-to', '[Determiner + adjective + noun] next to [landmark]', 'สิ่งที่อยู่ข้างจุดสังเกต', 'daily life', 'neutral', 'landmark', 'ใช้สถานที่หรือวัตถุที่อีกฝ่ายรู้จัก', 'the door', 'เพิ่มข้อมูลให้ผู้ฟังชี้ของถูกชิ้น', 'next to phrase ตามหลังคำนามที่ขยาย'],
      ['p-a-few-plural', 'a few [countable plural noun]', '…จำนวนเล็กน้อย', 'daily life', 'neutral', 'countable plural noun', 'ใช้รูปพหูพจน์ของคำนามที่นับทีละหน่วยได้', 'questions', 'บอกว่ามีอยู่บ้าง โดยไม่ต้องบอกจำนวนเป๊ะ', 'a few อยู่หน้าคำนาม เช่น a few apples'],
      ['p-my-usual', 'my usual [routine noun]', '…แบบที่ฉันใช้หรือทำประจำ', 'daily life', 'neutral', 'routine noun', 'ของหรือบริการที่เลือกเป็นประจำในบริบทนั้น', 'coffee', 'อ้างถึงทางเลือกเดิมโดยไม่ต้องบอกรายละเอียดทั้งหมด', 'my มาก่อน usual และคำนามตามหลัง'],
    ],
  },
  {
    id: 'm6-03', module: 6, after: 'm6-02', en: 'Complements beyond the subject',
    th: 'บอกว่าสิ่งหนึ่งทำให้ใครหรืออะไรเป็นอย่างไร', hook: 'คุณอยากบอกว่าเสียงเพลงช่วยให้อารมณ์ดีขึ้น หรือการปิดประตูช่วยให้ห้องเงียบ',
    objective: 'ใช้ adjective หรือ noun phrase หลังกรรมเพื่อบอกสภาพ บทบาท หรือผลที่เกิดกับกรรม',
    concept: 'object complement บอกว่ากรรมเป็นอย่างไรหรือทำหน้าที่อะไร เช่น ใน It made me tired คำว่า tired บอกสภาพของ me หลังสาเหตุที่กล่าวถึง กริยา make, find, keep และ leave ใช้กับรูปนี้ได้ในความหมายที่ต่างกัน เลือก adjective เพื่อบอกสภาพหรือ noun phrase เพื่อบอกบทบาท',
    formula: 'subject + make/find/keep/leave + object + adjective or noun phrase',
    tags: ['complements', 'adjectives', 'results', 'state'],
    examples: [
      ['The music made me happy.', 'เพลงทำให้ฉันอารมณ์ดี', 'happy บอกผลที่เกิดกับ me'],
      ['The delay made everyone nervous.', 'ความล่าช้าทำให้ทุกคนกังวล', 'nervous บอกสภาพของ everyone'],
      ['I found the map confusing.', 'ฉันรู้สึกว่าแผนที่เข้าใจยาก', 'confusing บอกว่าแผนที่ทำให้สับสน'],
      ['I found the instructions helpful.', 'ฉันเห็นว่าคำแนะนำมีประโยชน์', 'helpful เป็นการประเมิน instructions'],
      ['Please keep the door closed.', 'ช่วยปิดประตูไว้ด้วย', 'closed คือสภาพที่อยากให้ประตูคงอยู่'],
      ['Keep the receipt dry.', 'เก็บใบเสร็จให้แห้งไว้', 'dry บอกสภาพของใบเสร็จ'],
    ],
    contrasts: [
      ['The map is confusing.', 'I am confused.', 'confusing บอกว่าแผนที่ทำให้สับสน ส่วน confused บอกอาการของคนที่สับสน'],
      ['They made the room quiet.', 'They made him team leader.', 'quiet บอกสภาพด้วย adjective ส่วน team leader บอกบทบาทด้วย noun phrase'],
    ],
    dialogue: [['How was the workshop?', 'เวิร์กช็อปเป็นยังไงบ้าง'], ['I found the examples useful, but the room was noisy.', 'ฉันว่าตัวอย่างมีประโยชน์ แต่ห้องเสียงดัง']],
    mistakes: [
      ['That made I nervous.', 'That made me nervous.', 'คนที่ได้รับผลอยู่ในช่องกรรม ใช้ me หลัง made'],
      ['I found the map confused.', 'I found the map confusing.', 'ในบริบทนี้แผนที่เป็นสิ่งที่ทำให้สับสน จึงใช้ confusing'],
    ],
    exercises: [
      ['choice', 'เลือกคำบอกว่าแผนที่ทำให้สับสน: I found the map ___.', ['confusing'], 'ช่องว่างบอกลักษณะของแผนที่', 'confusing ใช้กับสิ่งที่ทำให้สับสน', ['confusing', 'confused', 'confuse']],
      ['fill', 'เติม I ในรูปกรรม: The music made ___ happy.', ['me'], 'กริยา made กระทำต่อคนในช่องว่าง', 'ใช้ me เป็น object pronoun'],
      ['order', 'เรียงคำบอกให้ปิดประตูค้างไว้', ['Please keep the door closed'], 'วางสภาพหลังของที่อยากให้คงไว้', 'closed บอกสภาพของ the door', ['closed', 'the door', 'keep', 'Please']],
      ['repair', 'แก้ adjective ที่บอกว่าคำแนะนำมีประโยชน์: I found the instructions helpfully.', ['I found the instructions helpful'], 'คำท้ายบอกลักษณะของ instructions', 'ใช้ adjective helpful เพื่อบอกว่ากรรมเป็นอย่างไร'],
      ['transform', 'ใช้ made รวม The news came out. We were hopeful because of it. เริ่ม The news…', ['The news made us hopeful'], 'วางเราในช่องกรรม', 'ใช้ us ตามด้วย hopeful ซึ่งเป็นผลที่เกิดกับเรา'],
    ],
    speaking: 'นึกถึงสถานที่หรือคู่มือที่เคยใช้ พูดว่าส่วนไหน helpful หรือ confusing แล้วบอกสิ่งหนึ่งที่ทำให้คุณรู้สึกแบบนั้น',
    patterns: [
      ['p-made-object-feel', '[Cause] made [person] [adjective].', '…ทำให้…รู้สึกแบบนั้น', 'result', 'neutral', 'adjective', 'คำบอกสภาพหรือความรู้สึกที่ใช้กับคนในช่องกรรมได้', 'nervous', 'ชี้สาเหตุและผลที่รู้สึกในประโยคเดียว', 'วาง adjective หลัง object ของ made'],
      ['p-found-object-adjective', 'I found [thing] [adjective].', 'ฉันพบว่า…เป็นแบบนั้น', 'opinion', 'neutral', 'adjective', 'เลือกคำบอกลักษณะ เช่น helpful/confusing/useful', 'helpful', 'ประเมินสิ่งที่ได้ลองด้วยตัวเอง', 'วาง adjective หลังสิ่งที่ประเมิน'],
      ['p-keep-object-state', 'Keep [object] [state].', 'ทำให้…อยู่ในสภาพนั้นไว้', 'advice', 'neutral', 'state', 'ใช้ adjective หรือ participle ที่บอกสภาพ เช่น dry/closed', 'closed', 'บอกสภาพที่ควรรักษาไว้', 'วางสภาพตามหลัง the object'],
    ],
  },
  {
    id: 'm6-04', module: 6, after: 'm6-03', en: 'Infinitives and gerunds',
    th: 'เลือก to + กริยา หรือรูป -ing', hook: 'ทำไมถึงพูด I decided to go แต่พูด I enjoy walking?',
    objective: 'เลือกส่วนเติมหลังกริยาตามรูปที่กริยานั้นรับ และอธิบายผลของการเปลี่ยนรูปหลัง stop',
    concept: 'กริยาบางตัวมักตามด้วย to + V1 เช่น decide และ hope บางตัวใช้ V-ing เช่น enjoy และ avoid ให้จำกริยาพร้อมรูปที่ตามได้ เพราะความหมายอย่างเดียวทำนายได้ไม่ครบ กริยาบางตัวรับสองรูปแต่ความหมายเปลี่ยน เช่น stop doing คือเลิกกิจกรรมนั้น และ stop to do คือหยุดกิจกรรมเดิมเพื่อไปทำอีกอย่าง',
    formula: 'decide/hope + to V1 · enjoy/avoid + V-ing · stop + V-ing / to V1',
    tags: ['infinitives', 'gerunds', 'verb patterns', 'stop'],
    examples: [
      ['I decided to walk home.', 'ฉันตัดสินใจเดินกลับบ้าน', 'to walk บอกสิ่งที่ตัดสินใจทำ'],
      ['We decided to wait until Friday.', 'เราตัดสินใจรอถึงวันศุกร์', 'to wait ตามหลัง decided'],
      ['I enjoy walking after dinner.', 'ฉันชอบเดินเล่นหลังอาหารเย็น', 'walking คือกิจกรรมที่เพลิดเพลิน'],
      ['She enjoys fixing old bikes.', 'เธอชอบซ่อมจักรยานเก่า', 'enjoys รับ fixing และตามด้วยสิ่งที่ซ่อม'],
      ['I stopped to check the map.', 'ฉันหยุดเพื่อดูแผนที่', 'หยุดสิ่งที่กำลังทำอยู่เพื่อเริ่มดูแผนที่'],
      ['We stopped to get some water.', 'เราหยุดแวะเอาน้ำ', 'to get บอกจุดประสงค์ของการหยุด'],
    ],
    contrasts: [
      ['I stopped working.', 'I stopped to work.', 'ข้อแรกเลิกทำงาน ส่วนข้อหลังหยุดสิ่งอื่นที่กำลังทำเพื่อไปทำงาน ต้องมีบริบทที่บอกสิ่งเดิมได้'],
      ['I remembered locking the door.', 'I remembered to lock the door.', 'แบบ -ing คือจำได้ว่าเคยล็อก แบบ to คือจำได้ว่าต้องล็อกและทำ'],
    ],
    dialogue: [['Did you walk straight home?', 'คุณเดินตรงกลับบ้านเลยไหม'], ['No, I stopped to buy some fruit.', 'เปล่า ฉันแวะซื้อผลไม้']],
    mistakes: [
      ['I enjoy to cook.', 'I enjoy cooking.', 'enjoy รับ V-ing เมื่อพูดถึงกิจกรรม'],
      ['We decided waiting.', 'We decided to wait.', 'decide ใช้ to + กริยารูปพื้นฐานเพื่อบอกสิ่งที่ตัดสินใจทำ'],
    ],
    exercises: [
      ['fill', 'เติมรูปของ cook: I enjoy ___ on Sundays.', ['cooking'], 'ดูรูปที่ตามหลัง enjoy', 'กิจกรรมหลังกริยา enjoy ใช้ V-ing'],
      ['choice', 'เลือกประโยคที่หมายถึงหยุดเดินเพื่อดูแผนที่', ['I stopped to check the map.'], 'การดูแผนที่คือจุดประสงค์', 'to check ระบุว่าหยุดเพื่ออะไร', ['I stopped to check the map.', 'I stopped checking the map.', 'I decided to ignore the map.']],
      ['order', 'เรียงเพื่อบอกว่าเราตัดสินใจรอ', ['We decided to wait'], 'หลัง decided ใช้ to', 'to wait เป็นส่วนเติมของ decided', ['wait', 'We', 'to', 'decided']],
      ['repair', 'แก้คำหลังกริยา: She enjoys to draw.', ['She enjoys drawing'], 'enjoys ตามด้วยรูป -ing', 'drawing บอกกิจกรรมที่เธอชอบทำ'],
      ['transform', 'ใช้ stopped + V-ing แทน no longer ใน I no longer work on Sundays.', ['I stopped working on Sundays'], 'กิจกรรมที่เลิกคือ work on Sundays', 'วาง working on Sundays หลัง stopped เพื่อสื่อว่าเลิกทำกิจกรรมนั้น'],
    ],
    speaking: 'พูดหนึ่งอย่างที่ชอบทำ หนึ่งอย่างที่ตัดสินใจจะทำ และเล่าครั้งล่าสุดที่หยุดเพื่อทำอย่างอื่น ใช้รูป V-ing กับ to ให้สอดคล้องกับเจตนา',
    patterns: [
      ['p-decide-to', '[Subject] decided to [base verb].', '…ตัดสินใจที่จะทำ…', 'plans', 'neutral', 'base verb', 'ใช้รูปพื้นฐานของกิจกรรมที่เลือก', 'walk home', 'เล่าข้อตัดสินใจที่ผ่านมา', 'วาง to + V1 หลัง decided'],
      ['p-enjoy-ing', '[Subject] enjoy(s) [verb-ing].', '…ชอบทำกิจกรรมนี้', 'daily life', 'neutral', 'verb-ing', 'เติม -ing ให้กริยาของกิจกรรมที่ชอบ', 'walking after dinner', 'อธิบายกิจกรรมที่ทำแล้วเพลิดเพลิน', 'V-ing ตามหลัง enjoy(s)'],
      ['p-stop-to-purpose', '[Subject] stopped to [purpose verb].', '…หยุดเพื่อทำ…', 'narrative', 'neutral', 'purpose verb', 'ใช้รูปพื้นฐานของกิจกรรมที่เริ่มหลังหยุด', 'check the map', 'บอกจุดประสงค์ของการหยุดระหว่างทำบางอย่าง', 'วาง to + V1 หลัง stopped', ['stopped + V-ing = เลิกกิจกรรมนั้น']],
    ],
  },
  {
    id: 'm6-05', module: 6, after: 'm6-04', en: 'Worth and related verb patterns',
    th: 'บอกว่าคุ้มราคา คุ้มแรง หรือคุ้มที่จะลอง', hook: 'เพื่อนถามว่าหนังเรื่องนี้คุ้มที่จะดูหรือเปล่า คุณจะบอกว่าคุ้มเวลาได้อย่างไร?',
    objective: 'ใช้ worth กับคำนามหรือกิจกรรม และใช้ It takes… to… เมื่อพูดถึงต้นทุนในการทำ',
    concept: 'หลัง be worth ใช้คำนามบอกมูลค่า เวลา หรือแรง เช่น worth the price หรือใช้ V-ing เพื่อบอกว่าการทำกิจกรรมนั้นคุ้ม เช่น worth trying ส่วน It takes + เวลา/แรง + to V1 บอกว่าสิ่งนั้นต้องใช้ต้นทุนเท่าไร โดยยังไม่ได้ตัดสินว่าคุ้มหรือไม่',
    formula: 'thing + be worth + noun phrase / V-ing · It takes + resource + to V1',
    tags: ['worth', 'verb patterns', 'effort', 'value'],
    examples: [
      ["It's worth a thousand baht.", 'มันมีมูลค่าหนึ่งพันบาท', 'บอกราคาประเมินของสิ่งของ'],
      ["It's worth the effort.", 'มันคุ้มกับความพยายาม', 'ประเมินสิ่งที่ได้เทียบกับแรงที่ใช้'],
      ["It's worth trying again.", 'คุ้มที่จะลองอีกครั้ง', 'ใช้ trying เพื่อพูดถึงกิจกรรมที่น่าลอง'],
      ['That little museum is worth visiting.', 'พิพิธภัณฑ์เล็ก ๆ แห่งนั้นน่าไป', 'visiting คือกิจกรรมที่คุ้มกับเวลา'],
      ['It takes effort to build a habit.', 'การสร้างนิสัยต้องใช้ความพยายาม', 'ระบุ effort เป็นสิ่งที่ต้องใช้'],
      ['It takes about ten minutes to walk there.', 'เดินไปที่นั่นใช้เวลาประมาณสิบนาที', 'ประเมินเวลาที่ใช้เพื่อไปถึงจุดหมาย'],
    ],
    contrasts: [
      ["It's worth the price.", "It's worth seeing in a theater.", 'ข้อแรกประเมินความคุ้มเทียบกับราคา ส่วนข้อหลังระบุกิจกรรมที่คุ้มจะทำ'],
      ['It takes effort.', "It's worth the effort.", 'ประโยคแรกบอกว่าต้องลงแรง ประโยคหลังบอกว่าผลตอบแทนคุ้มแรง'],
    ],
    dialogue: [['Is the trail hard to walk?', 'ทางเดินเส้นนั้นเดินยากไหม'], ["A little, but it's worth it for the view.", 'ยากนิดหน่อย แต่วิวคุ้มเลย']],
    mistakes: [
      ["It's worth to try.", "It's worth trying.", 'เติม V-ing หลัง worth เมื่อต้องการบอกว่าคุ้มที่จะทำ'],
      ['It takes ten minutes walk there.', 'It takes ten minutes to walk there.', 'เติม to ก่อนกริยาที่บอกกิจกรรมที่ใช้เวลา'],
    ],
    exercises: [
      ['fill', 'เติมรูปของ try: It’s worth ___ again.', ['trying'], 'หลัง worth ใช้ V-ing เมื่อตามด้วยกิจกรรม', 'trying again เป็นกิจกรรมที่คุ้ม'],
      ['choice', 'เลือกประโยคที่บอกว่าผลตอบแทนคุ้มแรง', ["It's worth the effort."], 'มองหา worth + คำนาม', 'worth the effort เปรียบผลตอบแทนกับแรงที่จ่าย', ['It takes effort.', "It's worth the effort.", 'Effort builds a habit.']],
      ['repair', 'แก้รูปกริยา: This museum is worth to visit.', ['This museum is worth visiting'], 'worth ตามด้วย V-ing', 'visiting เชื่อมพิพิธภัณฑ์กับกิจกรรมไปเยี่ยมชม'],
      ['order', 'เรียงประโยคเพื่อบอกว่าเดินไปใช้เวลาสิบนาที', ['It takes ten minutes to walk there'], 'หลัง It takes ให้บอกเวลา', 'to walk there คือกิจกรรมที่ใช้สิบนาที', ['ten minutes', 'It takes', 'there', 'to walk']],
      ['transform', 'เปลี่ยน Building a habit takes effort. ให้ขึ้นต้น It takes… โดยเก็บความหมายเดิม', ['It takes effort to build a habit'], 'ย้ายกิจกรรมเป็น to + V1', 'It takes วางประธาน it ไว้หน้า และกิจกรรม to build a habit ไว้ท้าย'],
    ],
    speaking: 'เลือกทักษะที่กำลังฝึก บอกว่าต้องใช้เวลาและความพยายามอย่างไร แล้วพูดว่าเหตุใดจึงคุ้มที่จะทำต่อ',
    patterns: [
      ['p-worth-noun', '[Thing] is worth [value or cost].', '…มีมูลค่าหรือคุ้มกับสิ่งที่เสียไป', 'comparison', 'neutral', 'value or cost', 'ใช้ noun phrase เช่น จำนวนเงิน the effort หรือ the wait', 'the effort', 'ประเมินมูลค่าหรือความคุ้ม', 'คำนามอยู่หลัง worth'],
      ['p-worth-ing', '[Thing] is worth [verb-ing].', '…คุ้มที่จะทำหรือควรลอง', 'advice', 'neutral', 'verb-ing', 'เลือกกิจกรรมที่ทำกับประธานหรือในสถานการณ์ที่อ้างถึงได้', 'visiting', 'ประเมินว่ากิจกรรมควรค่าแก่เวลาหรือแรง', 'V-ing ตามหลัง worth', ['It’s worth it.']],
      ['p-takes-resource-to', 'It takes [resource] to [activity].', 'ต้องใช้…เพื่อทำ…', 'technical explanations', 'neutral', 'resource', 'ใช้เวลา แรง หรือความอดทนเป็นคำนาม เช่น ten minutes', 'effort', 'บอกต้นทุนหรือเวลาที่ใช้ในการทำกิจกรรม', 'วางทรัพยากรหลัง takes แล้วตามด้วย to + V1'],
    ],
  },
)

chapters.push(
  {
    id: 'm6-06', module: 6, after: 'm6-05', en: 'Relative clauses',
    th: 'ขยายว่าเป็นคนไหน ของชิ้นไหน หรือที่ไหน', hook: 'ทั้งทีมมีหลายคนชื่อเล่นเหมือนกัน คุณจะระบุว่าเป็นคนที่ส่งลิงก์ให้เมื่อวานอย่างไร?',
    objective: 'ใช้ who/that/where ขยายคำนาม และตัดคำเชื่อมได้เมื่อคำเชื่อมอยู่ในช่องกรรมของ defining clause',
    concept: 'relative clause ตามหลังคำนามเพื่อช่วยชี้ว่าหมายถึงคนหรือสิ่งไหน ใช้ who สำหรับคน ใช้ that สำหรับคนหรือสิ่งของใน defining clause และใช้ where เมื่อคำนามเป็นสถานที่สำหรับเหตุการณ์ ถ้าตัดคำเชื่อมแล้วส่วนที่ตามมายังมีประธานของตัวเอง มักตัดคำเชื่อมที่ทำหน้าที่เป็นกรรมได้ เช่น the book I borrowed',
    formula: 'person + who + verb · place + where + clause · thing + (that) + subject + verb',
    tags: ['relative clauses', 'who', 'where', 'that'],
    examples: [
      ['The person who sent the link is Mei.', 'คนที่ส่งลิงก์คือเหมย', 'who ทำหน้าที่เป็นประธานของ sent'],
      ['I met a woman who makes her own shoes.', 'ฉันเจอผู้หญิงคนหนึ่งที่ทำรองเท้าเอง', 'who อ้างกลับไปที่ a woman'],
      ["That's the café where we first met.", 'นั่นคือคาเฟ่ที่เราเจอกันครั้งแรก', 'where แทน at that café ในเหตุการณ์'],
      ['Is this the room where you took the class?', 'นี่คือห้องที่คุณมาเรียนหรือเปล่า', 'where เชื่อมห้องกับการเรียน'],
      ['The book I borrowed is on the desk.', 'หนังสือที่ฉันยืมอยู่บนโต๊ะ', 'I เป็นประธานของ borrowed จึงละ that ที่ทำหน้าที่กรรมได้'],
      ['This is the jacket you saw online.', 'นี่คือแจ็กเก็ตตัวที่คุณเห็นออนไลน์', 'you เป็นประธานของ saw จึงละ that ได้'],
    ],
    contrasts: [
      ['The person who sent the link is Mei.', 'The person I sent the link to is Mei.', 'who ในข้อแรกแทนผู้ส่ง จึงตัดไม่ได้ ในข้อหลัง I เป็นผู้ส่งและละ who ได้'],
      ['The café where we met is closed.', 'The café we visited is closed.', 'meet ใช้สถานที่ที่เจอกัน ส่วน visit รับ café เป็นกรรม จึงไม่ต้องใช้ where'],
    ],
    dialogue: [['Which box should I open?', 'ฉันควรเปิดกล่องไหน'], ['Open the one that arrived this morning.', 'เปิดกล่องที่มาถึงเมื่อเช้านี้']],
    mistakes: [
      ['The person sent the link is Mei.', 'The person who sent the link is Mei.', 'เติม who ให้เป็นประธานของ sent ใน relative clause'],
      ['The book I borrowed it is here.', 'The book I borrowed is here.', 'book เติมความหมายช่องกรรมของ borrowed อยู่แล้ว จึงไม่ใส่ it ซ้ำ'],
    ],
    exercises: [
      ['fill', 'เติมคำเชื่อมสำหรับคน: The woman ___ lives upstairs is a nurse.', ['who', 'that'], 'ช่องว่างคือประธานของ lives', 'ใช้ who หรือ that ใน defining clause ที่บอกว่าผู้หญิงคนไหน'],
      ['choice', 'เลือกประโยคชี้คาเฟ่ที่เราเคยพบกัน', ['That’s the café where we first met.'], 'ถามว่าพบกันที่ไหน ใช้ where', 'where we first met ทำหน้าที่ขยาย café', ['That’s the café where we first met.', 'That’s the café who we first met.', 'That’s the café where first we meet yesterday.']],
      ['repair', 'ตัดเพียงคำที่ซ้ำหน้าที่: The book I borrowed it is here.', ['The book I borrowed is here'], 'book เป็นสิ่งที่ยืมอยู่แล้ว', 'ตัด it ออกจากช่องกรรมที่ book เติมไว้'],
      ['order', 'เรียงประโยคระบุแจ็กเก็ตที่คุณเห็นออนไลน์', ['This is the jacket you saw online'], 'วาง relative clause หลัง jacket', 'you saw online ขยาย jacket โดยละ that ได้', ['you', 'the jacket', 'online', 'is', 'saw', 'This']],
      ['transform', 'รวม Mei is the person. She sent the link. โดยเริ่ม Mei is… และใช้ who', ['Mei is the person who sent the link'], 'ให้ who แทน She ภายในส่วนขยาย', 'who ตามหลัง person และทำหน้าที่ประธานของ sent'],
    ],
    speaking: 'อธิบายคนหนึ่งคน สถานที่หนึ่งแห่ง และสิ่งของหนึ่งชิ้นให้เพื่อนเดาโดยไม่พูดชื่อ ใช้ who, where และกลุ่มขยายกรรมอย่างละหนึ่งครั้ง',
    patterns: [
      ['p-person-who', '[Person] who [verb phrase]', 'คนที่ทำ…', 'clarification', 'neutral', 'verb phrase', 'กริยาที่มี who เป็นประธาน รักษาความสอดคล้องกับคำนามหน้า who', 'sent the link', 'ระบุคนด้วยพฤติกรรมหรือลักษณะ', 'who clause อยู่หลังชื่อคนที่ขยาย'],
      ['p-place-where', '[Place] where [event clause]', 'สถานที่ที่เกิด…', 'narrative', 'neutral', 'event clause', 'อนุประโยคมี subject + verb โดย where เติมช่องสถานที่', 'we first met', 'ระบุสถานที่ผ่านเหตุการณ์ที่ผู้ฟังนึกออก', 'วาง where clause หลัง place'],
      ['p-omitted-object-relative', '[Thing] [subject + transitive verb]', 'สิ่งที่คนหนึ่งทำ…กับมัน', 'clarification', 'neutral', 'subject + transitive verb', 'ประธานของ clause ต้องปรากฏ และคำนามหน้า clause เติมช่องกรรม', 'I borrowed', 'ขยายสิ่งของแบบกระชับในบทสนทนา', 'วาง clause ติดกับคำนามที่ขยายและละ that ได้', ['[Thing] that [subject + verb]']],
    ],
  },
  {
    id: 'm6-07', module: 6, after: 'm6-06', en: 'That, if and whether clauses',
    th: 'ต่อใจความ ความไม่แน่ใจ และสองทางเลือก', hook: 'คุณยังไม่รู้ว่าร้านจะเปิดไหม แต่คิดว่าจะโทรไปถาม จะพูดยังไงให้แยกสิ่งที่คิดกับสิ่งที่ไม่แน่ใจ?',
    objective: 'เลือก that สำหรับใจความบอกเล่า และ if/whether สำหรับคำถามในใจแบบใช่หรือไม่',
    concept: 'that clause บอกใจความหลัง think, know หรือ say ส่วน if หรือ whether clause เปิดคำถามแบบใช่หรือไม่หลังคำอย่าง not sure และ find out ในคำพูดมักละ that หลัง I think ได้ เมื่อมีตัวเลือก or หรือใช้โครง whether to ให้ใช้ whether เพื่อระบุสองทางเลือกได้ชัด',
    formula: 'I think (that) + clause · I’m not sure if + clause · decide whether to + V1',
    tags: ['noun clauses', 'that', 'if', 'whether', 'uncertainty'],
    examples: [
      ['I think that the shop is still open.', 'ฉันคิดว่าร้านยังเปิดอยู่', 'that เชื่อมใจความที่คาดไว้'],
      ['I think we should call first.', 'ฉันว่าเราควรโทรไปก่อน', 'ละ that ได้ในบทสนทนาทั่วไป'],
      ["I'm not sure if the shop is open.", 'ฉันไม่แน่ใจว่าร้านเปิดหรือเปล่า', 'if เปิดคำถามใช่หรือไม่ในใจ'],
      ["I'm not sure if I saved the file.", 'ฉันไม่แน่ใจว่าเซฟไฟล์ไว้หรือเปล่า', 'I saved the file ใช้ลำดับบอกเล่า'],
      ['We need to decide whether to wait or leave.', 'เราต้องตัดสินใจว่าจะรอหรือกลับ', 'whether to ใช้ก่อนกริยาเมื่อประธานของการตัดสินใจกับผู้ทำตรงกัน'],
      ["I haven't decided whether to renew my pass.", 'ฉันยังไม่ได้ตัดสินใจว่าจะต่ออายุบัตรไหม', 'whether to ชี้คำถามที่ยังตัดสินใจไม่ได้'],
    ],
    contrasts: [
      ['I know that it is open.', 'I don’t know if it is open.', 'that บอกใจความที่รู้ ส่วน if ในข้อหลังเปิดคำถามว่าเปิดหรือไม่'],
      ["I don't know if it'll rain.", "If it rains, we'll stay in.", 'if แบบแรกเริ่มคำถามว่าฝนจะตกไหม แบบหลังตั้งเงื่อนไขว่าจะอยู่ข้างในถ้าฝนตก'],
    ],
    dialogue: [['Are we meeting at seven?', 'เรานัดเจอกันตอนหนึ่งทุ่มใช่ไหม'], ["I'm not sure whether it's seven or eight.", 'ฉันไม่แน่ใจว่าหนึ่งทุ่มหรือสองทุ่ม']],
    mistakes: [
      ["I'm not sure if is it open.", "I'm not sure if it is open.", 'หลัง if ที่เปิดคำถามย่อยใช้ subject ก่อน verb'],
      ['We must decide if to wait.', 'We must decide whether to wait.', 'ใช้ whether ก่อน to + V1 ในรูปนี้'],
    ],
    exercises: [
      ['fill', 'เติมคำเชื่อมเพื่อบอกสิ่งที่ทราบแน่: I know ___ the shop is open.', ['that'], 'ช่องว่างนำใจความบอกเล่า', 'that เชื่อมใจความที่เรารู้ว่าจริงในบริบทนี้'],
      ['choice', 'เลือกประโยคแสดงความไม่แน่ใจว่าได้บันทึกไฟล์ไหม', ["I'm not sure if I saved the file."], 'ต้องการความหมายว่าใช่หรือไม่', 'if เปิดคำถามในใจโดยคงลำดับ I saved', ["I'm not sure if I saved the file.", 'I know that I saved the file.', 'I think the file is too large.']],
      ['order', 'เรียงคำให้แปลว่า ฉันว่าเราควรโทรก่อน', ['I think we should call first'], 'ส่วน I think นำความเห็น', 'we should call first เป็นใจความที่คิด ละ that ได้', ['should', 'call', 'I think', 'first', 'we']],
      ['repair', 'แก้คำเชื่อมเพียงคำเดียว: We must decide if to wait.', ['We must decide whether to wait'], 'คำหน้า to ต้องรับ infinitive ได้', 'ใช้ whether to ในรูปตัดสินใจว่าจะทำหรือไม่'],
      ['transform', 'เปลี่ยน Is the shop open? ให้เป็นประโยคที่เริ่ม I’m not sure…', ["I'm not sure if the shop is open", "I'm not sure whether the shop is open", "I am not sure if the shop is open", "I am not sure whether the shop is open"], 'คงคำถามใช่หรือไม่ด้วย if หรือ whether', 'ใช้ the shop is ในอนุประโยค และใช้รูปย่อหรือเต็มของ I am ได้'],
    ],
    speaking: 'เลือกสถานการณ์ที่ต้องวางแผนแต่ข้อมูลไม่ครบ พูดสิ่งที่คิดว่าจริงหนึ่งอย่าง สิ่งที่ไม่แน่ใจหนึ่งอย่าง และสองทางเลือกที่ต้องตัดสินใจ',
    patterns: [
      ['p-think-that-clause', 'I think (that) [statement].', 'ฉันคิดว่า…', 'opinion', 'neutral', 'statement', 'subject + verb ที่อธิบายความคิดได้ครบ', 'we should call first', 'เสนอความเห็นหรือการคาดการณ์อย่างเป็นธรรมชาติ', 'วาง statement หลัง think และละ that ได้', ['I guess + clause.']],
      ['p-not-sure-if', 'I’m not sure if [statement order].', 'ฉันไม่แน่ใจว่า…หรือเปล่า', 'uncertainty', 'neutral', 'statement order', 'ใช้ประธานหน้ากริยาและเลือก tense ตามเหตุการณ์', 'I saved the file', 'บอกว่าข้อเท็จจริงแบบใช่หรือไม่ยังไม่ชัด', 'if clause ตามหลัง sure', ['I’m not sure whether + clause.']],
      ['p-decide-whether-to', 'decide whether to [base verb]', 'ตัดสินใจว่าจะทำ…หรือไม่', 'plans', 'neutral', 'base verb', 'ผู้ตัดสินใจกับผู้ทำเป็นคนหรือกลุ่มเดียวกัน', 'wait or leave', 'เสนอทางเลือกที่ยังต้องตัดสินใจ', 'วาง whether ก่อน to และเติม or + กริยารูปพื้นฐานเมื่อมีทางเลือกคู่กัน'],
    ],
  },
  {
    id: 'm6-08', module: 6, after: 'm6-07', en: 'Conditionals',
    th: 'ตั้งเงื่อนไขที่เป็นไปได้และสมมติสถานการณ์', hook: 'ฝนอาจตกพรุ่งนี้ คุณมีแผนสำรอง แต่ถ้าคุณเป็นเพื่อนที่เดินทางมาไกล คุณจะเลือกอะไร?',
    objective: 'แยกเงื่อนไขที่ยังเป็นไปได้ออกจากสมมติฐาน และจับคู่ tense กับผลตามเงื่อนไข',
    concept: 'เมื่อพูดถึงความเป็นไปได้ในอนาคต if clause มักใช้ present และผลใช้ will, can หรือคำสั่ง ถ้าจินตนาการเรื่องที่ห่างจากความจริงในตอนนี้ ใช้ past form กับ would ส่วนสิ่งที่ไม่ได้เกิดในอดีต ใช้ had + V3 กับ would have + V3 รูป past ในเงื่อนไขสมมติสื่อระยะห่างจากความจริงตามบริบท',
    formula: 'If + present, will + V1 · If + past, would + V1 · If + had + V3, would have + V3',
    tags: ['conditionals', 'hypothetical', 'would', 'past perfect'],
    examples: [
      ["If it rains, we'll stay inside.", 'ถ้าฝนตก เราจะอยู่ข้างใน', 'มีโอกาสเกิดจริง จึงใช้ rains ใน if clause'],
      ["If you arrive first, I'll text you the address.", 'ถ้าคุณไปถึงก่อน ฉันจะส่งที่อยู่ให้', 'arrive ใช้ present แม้พูดถึงอนาคต'],
      ["If I were you, I'd ask for more time.", 'ถ้าฉันเป็นคุณ ฉันจะขอเวลาเพิ่ม', 'สมมติว่าอยู่ในสถานการณ์ของผู้ฟัง'],
      ['If I had more space, I would get a bigger desk.', 'ถ้ามีที่มากกว่านี้ ฉันคงซื้อโต๊ะใหญ่ขึ้น', 'had ตรงนี้คือ past ของ have เพื่อสมมติเรื่องปัจจุบัน'],
      ['If we had left earlier, we would have caught the train.', 'ถ้าออกเร็วกว่านี้ เราคงขึ้นรถไฟทัน', 'พูดถึงอดีตที่แก้ไม่ได้แล้ว'],
      ["If I'd seen the message, I'd have replied.", 'ถ้าตอนนั้นฉันเห็นข้อความ ฉันคงตอบไปแล้ว', 'I’d ตัวแรกมาจาก I had ตัวหลังมาจาก I would'],
    ],
    contrasts: [
      ["If it rains, we'll stay inside.", "If it rained, we'd stay inside.", 'ข้อแรกวางแผนรับโอกาสจริง ข้อหลังชวนคิดในสถานการณ์สมมติ'],
      ['If I had more time, I would help.', 'If I had had more time, I would have helped.', 'ข้อแรกพูดถึงตอนนี้หรืออนาคต ข้อหลังย้อนสมมติอดีต'],
    ],
    dialogue: [['What would you do if you were me?', 'ถ้าคุณเป็นฉันจะทำยังไง'], ["I'd call them first and explain the problem.", 'ฉันจะโทรหาเขาก่อนแล้วอธิบายปัญหา']],
    mistakes: [
      ["If it will rain tomorrow, we'll stay in.", "If it rains tomorrow, we'll stay in.", 'เงื่อนไขคาดการณ์ทั่วไปใช้ present หลัง if แม้พูดถึงพรุ่งนี้'],
      ['If I had more money, I will buy it.', 'If I had more money, I would buy it.', 'ในสมมติฐานเรื่องปัจจุบัน ใช้ would ในผลตามเงื่อนไข'],
    ],
    exercises: [
      ['tense', "เติม rain ให้ตรงแผนพรุ่งนี้: If it ___, we'll stay inside.", ['rains'], 'if clause ของเงื่อนไขจริงใช้ present simple ได้', 'subject it ใช้ rains'],
      ['auxiliary', 'เติมกริยาช่วยรูปเต็มให้หมายถึง ‘ถ้าเป็นคุณ ฉันจะขอเวลาเพิ่ม’: If I were you, I ___ ask for more time.', ['would'], 'สมมติว่าเราเป็นอีกคน', 'would ตามด้วยกริยารูปพื้นฐาน ask'],
      ['choice', 'ข้อไหนสมมติย้อนอดีตว่าถ้าออกเร็วคงทันรถไฟ', ['If we had left earlier, we would have caught the train.'], 'มองหา had + V3 และ would have + V3', 'สองส่วนนี้วางเหตุและผลไว้ในอดีตที่ไม่ได้เกิดขึ้น', ["If we leave early, we'll catch the train.", 'If we left earlier, we would catch the train.', 'If we had left earlier, we would have caught the train.']],
      ['repair', "แก้คำหลังกริยา if เพื่อวางแผนแบบที่มีโอกาสเกิดจริง: If it will snow, we'll take the bus.", ["If it snows, we'll take the bus", 'If it snows, we will take the bus'], 'ปรับเฉพาะเงื่อนไขให้เป็น present simple', 'ใช้ snows หลัง it และเก็บ will ในผลได้'],
      ['order', 'เรียงเพื่อบอกว่าถ้าเป็นคุณ ฉันจะโทรหาเขา', ['If I were you, I would call them'], 'อนุประโยค If I were you เปิดก่อน', 'I would call them เป็นสิ่งที่จะทำในสมมติฐาน', ['would', 'call', 'If I were you,', 'them', 'I']],
    ],
    speaking: 'ตั้งแผนสำรองสำหรับวันพรุ่งนี้หนึ่งอย่าง ให้คำแนะนำด้วย If I were you หนึ่งข้อ แล้วลองเล่าว่าเหตุการณ์เก่าหนึ่งเรื่องจะต่างไปอย่างไรถ้าคุณเลือกอีกทาง',
    patterns: [
      ['p-if-present-will', 'If [present clause], [subject + will + V1].', 'ถ้าเกิดเงื่อนไขนี้ จะทำอย่างนี้', 'conditions', 'neutral', 'present clause', 'ใช้ present สำหรับเหตุการณ์ที่เป็นไปได้ แม้เวลาอยู่ในอนาคต', 'it rains', 'วางแผนรับสถานการณ์ที่อาจเกิด', 'ขึ้นต้นด้วย If clause หรือย้ายไปท้ายได้'],
      ['p-if-past-would', 'If [past clause], [subject + would + V1].', 'ถ้าสมมติว่า… ก็จะ…', 'conditions', 'neutral', 'past clause', 'ใช้ past form เพื่อสมมติเรื่องปัจจุบันหรืออนาคต ใช้ were ได้กับทุกประธานในสมมติฐาน', 'I were you', 'แนะนำหรือคิดทางเลือกที่ต่างจากความจริงปัจจุบัน', 'would อยู่ในผลตามเงื่อนไขในโครงพื้นฐาน'],
      ['p-if-had-would-have', 'If [subject + had + V3], [subject + would have + V3].', 'ถ้าที่ผ่านมา… ก็คง…ไปแล้ว', 'narrative', 'neutral', 'had + V3', 'ระบุเงื่อนไขอดีตที่ไม่ได้เกิดขึ้น', 'we had left earlier', 'อธิบายว่าผลในอดีตจะเปลี่ยนอย่างไรภายใต้เงื่อนไขอื่น', 'วาง would have + V3 ในส่วนผล'],
    ],
  },
  {
    id: 'm6-09', module: 6, after: 'm6-08', en: 'Reported speech',
    th: 'เล่าต่อว่าอีกคนพูด ถาม หรือขออะไร', hook: 'เพื่อนฝากบอกว่า I’m running late. คุณจะเล่าให้คนที่รออยู่ฟังยังไง?',
    objective: 'เลือก said, asked หรือ asked someone to และปรับคำแทนคน เวลา และลำดับตามมุมของผู้เล่า',
    concept: 'เมื่อเล่าคำพูดต่อ ให้ปรับ I และ you ตามคนที่พูดและคนที่ถูกพูดด้วย ถ้ากริยารายงานเป็นอดีต อาจเลื่อน tense เพื่อมองย้อน เช่น is เป็น was แต่คง present ได้เมื่อข้อมูลยังจริงและมุมมองปัจจุบันสำคัญ สำหรับคำถามย่อยใช้ลำดับบอกเล่า ส่วนคำขอใช้ asked + คนที่ถูกขอ + to V1',
    formula: 'said (that) + clause · asked [person] if/WH + clause · asked [person] to + V1',
    tags: ['reported speech', 'reported questions', 'backshift', 'requests'],
    examples: [
      ['She said she was running late.', 'เธอบอกว่าจะมาช้า', 'เล่าคำว่า I’m running late จากมุมของเธอในอดีต'],
      ['They said the office is closed today.', 'เขาบอกว่าสำนักงานปิดวันนี้', 'ใช้ is และ today เมื่อวันเดิมยังดำเนินอยู่'],
      ['She asked if I needed help.', 'เธอถามว่าฉันต้องการความช่วยเหลือไหม', 'if เปิดคำถามย่อยแบบใช่หรือไม่'],
      ['He asked where I parked.', 'เขาถามว่าฉันจอดรถที่ไหน', 'where + I + parked ใช้ลำดับประธานก่อนกริยา'],
      ['She asked me to send the file.', 'เธอขอให้ฉันส่งไฟล์', 'me คือคนที่ถูกขอ และ to send คือคำขอ'],
      ['They asked us to wait downstairs.', 'พวกเขาขอให้เรารอข้างล่าง', 'ใช้ us ในช่องคนที่ถูกขอ'],
    ],
    contrasts: [
      ['She said she was busy.', 'She told me she was busy.', 'บอกข้อมูลเหมือนกัน told ระบุผู้รับข่าวได้โดยตรงหลัง told'],
      ['She asked if I could wait.', 'She asked me to wait.', 'ข้อแรกเล่าคำถามว่ารอไหวหรือไม่ ข้อหลังรายงานเจตนาขอให้รอโดยตรง'],
    ],
    dialogue: [['What did the manager say?', 'ผู้จัดการพูดว่าอะไร'], ['She said we could go home and asked me to turn off the lights.', 'เธอบอกว่าเรากลับบ้านได้ แล้วขอให้ฉันปิดไฟ']],
    mistakes: [
      ['She said me she was busy.', 'She told me she was busy.', 'tell วางคนรับสารตรงหลังคำกริยาได้ ส่วน say ใช้ said to me ถ้าจะใส่คนรับสาร'],
      ['He asked where did I park.', 'He asked where I parked.', 'reported question ใช้ลำดับบอกเล่าและรักษาอดีตด้วย parked'],
    ],
    exercises: [
      ['choice', 'เมื่อต้องการระบุผู้รับสารหลังคำกริยาโดยตรง เลือก She ___ me she was busy.', ['told'], 'me อยู่ติดหลังกริยาโดยไม่มี to', 'tell + person + clause รับ me ในช่องคนรับสาร', ['told', 'said', 'spoke']],
      ['fill', 'เติมคำเชื่อมคำถามใช่หรือไม่: She asked ___ I needed help.', ['if', 'whether'], 'ข้อเดิมอาจเป็น Do you need help?', 'หลัง asked ใช้ if หรือ whether นำคำถามแบบใช่หรือไม่'],
      ['order', 'เรียงเพื่อบอกว่าเธอขอให้ฉันส่งไฟล์', ['She asked me to send the file'], 'คนที่ถูกขออยู่ติดกับ asked', 'to send the file ตามหลัง me', ['the file', 'to send', 'me', 'She', 'asked']],
      ['repair', 'แก้การเรียงประโยคย่อย: He asked where did I park.', ['He asked where I parked'], 'ตัด did แล้วคง past ที่กริยาหลักใน clause', 'where I parked คือลำดับที่ใช้เล่าคำถามต่อ'],
      ['transform', 'เล่าย้อนคำขอจาก May: “Please close the door.” เริ่ม May asked me…', ['May asked me to close the door'], 'ใช้ to + กริยารูปพื้นฐาน', 'ประโยคเป็นคำขอจึงเก็บความหมายด้วย asked me to close'],
    ],
    speaking: 'นึกถึงข้อความสามแบบที่เคยได้รับ เช่น แจ้งว่ามาสาย ถามว่าอยู่ไหน และขอให้ส่งไฟล์ เล่าต่อจากมุมของคุณด้วย said, asked และ asked me to',
    patterns: [
      ['p-said-that', '[Person] said (that) [statement].', 'คนหนึ่งบอกว่า…', 'narrative', 'neutral', 'statement', 'ปรับ pronoun และ tense ตามบริบทของคนเล่าและเวลาของเรื่อง', 'she was running late', 'ถ่ายทอดใจความของคนอื่นแบบกระชับ', 'วาง statement หลัง said และละ that ได้'],
      ['p-asked-reported-question', '[Person] asked [if/WH clause].', 'คนหนึ่งถามว่า…', 'questions', 'neutral', 'if/WH clause', 'เลือก if/whether หรือคำ WH แล้วใช้ subject + verb เมื่อ WH ไม่ใช่ประธาน', 'where I parked', 'เล่าว่าอีกคนต้องการทราบอะไร', 'clause ตามหลัง asked และใช้ลำดับบอกเล่า'],
      ['p-asked-person-to', '[Person] asked [listener] to [base verb].', 'คนหนึ่งขอให้…ทำ…', 'requests', 'neutral', 'listener', 'ใช้คำนามหรือ object pronoun สำหรับผู้ถูกขอ เช่น me/us', 'us', 'รายงานคำขอและระบุคนที่ต้องทำ', 'วาง listener หลัง asked แล้วตามด้วย to + V1'],
    ],
  },
)

function example([en, th, note]: ExampleRow) {
  return { en, th, note }
}

export const questionsLessons: Lesson[] = chapters.map((chapter) => ({
  id: chapter.id,
  module: chapter.module,
  titleEn: chapter.en,
  titleTh: chapter.th,
  hook: chapter.hook,
  objective: chapter.objective,
  concept: chapter.concept,
  formula: chapter.formula,
  minutes: 9,
  prerequisites: [chapter.after],
  tags: chapter.tags,
  examples: chapter.examples.map(example),
  contrasts: chapter.contrasts.map(([a, b, note]) => ({ a, b, note })),
  dialogue: chapter.dialogue.map(([en, th]) => ({ en, th })),
  mistakes: chapter.mistakes.map(([wrong, right, note]) => ({ wrong, right, note })),
  exercises: chapter.exercises.map(([kind, prompt, answers, hint, explanation, options, feedback], index) => ({
    id: `${chapter.id}-e${index + 1}`, kind, prompt, answers, hint, explanation, options, feedback,
    difficulty: kind === 'choice' || kind === 'auxiliary' ? 'recognition' : kind === 'transform' ? 'production' : 'guided',
  })),
  speaking: chapter.speaking,
  review: chapter.patterns.map(([patternId]) => patternId),
}))

const featuredMistake: Record<string, number> = {
  'p-yes-i-did': 0, 'p-do-you-know-wh': 0, 'p-i-wonder-wh': 1, 'p-tag-do': 0,
  'p-could-you-request': 1, 'p-would-you-mind-ing': 0, 'p-how-come-clause': 0,
  'p-suggest-clause-question': 1, 'p-left-object-location': 0, 'p-manner-because': 1,
  'p-noun-next-to': 0, 'p-a-few-plural': 1, 'p-made-object-feel': 0,
  'p-found-object-adjective': 1, 'p-decide-to': 1, 'p-enjoy-ing': 0,
  'p-worth-ing': 0, 'p-takes-resource-to': 1, 'p-person-who': 0, 'p-omitted-object-relative': 1,
  'p-not-sure-if': 0, 'p-decide-whether-to': 1, 'p-if-present-will': 0, 'p-if-past-would': 1,
  'p-said-that': 0, 'p-asked-reported-question': 1,
}

export const questionsPatterns: Pattern[] = chapters.flatMap((chapter) => chapter.patterns.map(([
  id, template, meaning, intent, register, name, rule, slotExample, why, placement, alternatives = [],
], index) => ({
  id, template, meaning, intent, register, why, placement, alternatives,
  slots: [{ name, rule, example: slotExample }],
  examples: chapter.examples.slice(index * 2, index * 2 + 2).map(example),
  mistakes: chapter.mistakes.filter((_, index) => featuredMistake[id] === index).map(([wrong, right, note]) => ({ wrong, right, note })),
  lessons: [chapter.id],
  tags: chapter.tags,
})))
