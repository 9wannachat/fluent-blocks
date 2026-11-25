import type { Exercise, Lesson, Pattern } from '../domain/content'

type Example = Pattern['examples'][number]
type DraftExercise = Omit<Exercise, 'id'>
type DraftPattern = Omit<Pattern, 'id' | 'lessons' | 'tags'>
type DraftLesson = Omit<Lesson, 'examples' | 'exercises' | 'review'> & {
  practice: DraftExercise[]
  patterns: DraftPattern[]
}

const ex = (en: string, th: string, note: string): Example => ({ en, th, note })
const compare = (a: string, b: string, note: string) => ({ a, b, note })
const mistake = (wrong: string, right: string, note: string) => ({ wrong, right, note })
const turn = (en: string, th: string) => ({ en, th })

function pat(
  template: string, meaning: string, intent: string, register: Pattern['register'],
  placement: string, first: Example, second: Example,
  slots: Pattern['slots'] = [], alternatives: string[] = [], mistakes: Pattern['mistakes'] = [],
): DraftPattern {
  return { template, meaning, intent, register, placement, examples: [first, second],
    why: first.note, slots, alternatives, mistakes }
}

const slot = (name: string, rule: string, example: string) => ({ name, rule, example })

function choice(prompt: string, choices: [string, string, string], correct: 0 | 1 | 2,
  explanation: string, wrongNotes: Record<string, string>): DraftExercise {
  return {
    kind: 'choice', prompt, options: choices, answers: [choices[correct]],
    hint: 'นึกถึงเจตนาที่โจทย์กำหนดและคนที่กำลังฟังอยู่', explanation,
    feedback: wrongNotes, difficulty: 'recognition',
  }
}

function order(words: string[], answer: string, explanation: string, prompt?: string): DraftExercise {
  return {
    kind: 'order',
    prompt: prompt ?? `เรียงคำให้เป็นประโยคที่ขึ้นต้นด้วย ${answer.split(' ')[0]}`, options: words,
    answers: [answer], hint: 'มองหาคำขึ้นต้น แล้วจัดกลุ่มคำที่ทำหน้าที่ร่วมกัน', explanation,
    difficulty: 'guided',
  }
}

function write(kind: 'fill' | 'translate' | 'repair' | 'transform' | 'connector',
  prompt: string, answers: string[], hint: string, explanation: string,
  feedback?: Record<string, string>): DraftExercise {
  return { kind, prompt, answers, hint, explanation, feedback, difficulty: 'production' }
}

const drafts: DraftLesson[] = [
  {
    id: 'm9-01', module: 9, titleEn: 'Start and respond', titleTh: 'เริ่มคุยและตอบรับ',
    hook: 'คุณไปถึงก่อนเวิร์กช็อปเริ่มและอยากคุยกับคนข้าง ๆ สักประโยค ควรเริ่มจากอะไร',
    objective: 'เริ่มจากสิ่งที่เห็นร่วมกัน ตอบด้วยใจความหนึ่งเรื่อง แล้วชวนอีกฝ่ายคุยต่อเมื่อเหมาะ',
    concept: 'คำถามเปิดทางในเรื่องที่ทั้งคู่กำลังเจอมักตอบง่ายกว่าเริ่มจากหัวข้อกว้าง ลองฟังว่าอีกฝ่ายถามเพื่อขอข้อเท็จจริงหรือแค่อยากเริ่มคุย แล้วเลือกความยาวคำตอบตามจังหวะ',
    formula: 'Shared context + easy opening → short response + optional detail or return question',
    minutes: 10, prerequisites: ['m2-10'], tags: ['conversation', 'greeting', 'small talk', 'เริ่มคุย'],
    contrasts: [
      compare('Is this your first time here?', 'What brought you here?', 'แบบแรกตอบใช่หรือไม่แล้วขยายได้ แบบหลังขอให้เล่าที่มา'),
      compare('You too.', 'How about you?', 'You too ใช้ส่งคำอวยพรหรือความรู้สึกเดียวกันกลับ How about you ชวนอีกฝ่ายตอบเรื่องเดียวกัน'),
    ],
    dialogue: [
      turn('Hey, how’s it going so far?', 'สวัสดี เป็นยังไงบ้างตั้งแต่เริ่มมา'),
      turn('Pretty good. I’ve just finished my first piece. How about you?', 'ดีทีเดียว เพิ่งทำชิ้นแรกเสร็จ แล้วคุณล่ะ'),
      turn('I’m still working on mine.', 'ฉันยังทำของฉันอยู่เลย'),
    ],
    mistakes: [mistake('Nice to meet you again.', 'Good to see you again.', 'ถ้าเจอกันมาแล้ว good to see you again เป็นคำทักที่เข้ากับความหมายมากกว่า meet ในคำทักครั้งแรก')],
    practice: [
      choice('งานเพิ่งเริ่มไปสักพักและคุณอยากถามว่าอีกฝ่ายรู้สึกอย่างไร เลือกคำเปิดที่ตรง', ['How’s it going so far?', 'Nice to meet you too.', 'How did it end?'], 0, 'So far ถามถึงประสบการณ์ตั้งแต่เริ่มจนถึงจุดนี้', { 'Nice to meet you too.': 'เหมาะใช้ตอบเมื่ออีกฝ่ายเพิ่งบอกว่ายินดีที่ได้รู้จัก', 'How did it end?': 'ถามถึงจุดจบของเหตุการณ์ที่ผ่านมาแล้ว' }),
      order(['going', 'so far', 'How’s', 'it'], 'How’s it going so far?', 'How’s คือ how is และ it เป็นประธานก่อน going'),
      write('fill', 'เติม 1 คำให้ได้วลีชวนถามกลับ How ___ you?', ['about'], 'แปลโดยประมาณว่าแล้วคุณล่ะ', 'How about you? ชวนอีกฝ่ายตอบในหัวข้อเดิม'),
      write('repair', 'แก้คำทักให้คง Nice to และความหมายว่ายินดีที่ได้รู้จัก: Nice to meeting you.', ['Nice to meet you.'], 'หลัง to ในวลีนี้ให้ใช้กริยารูปพื้นฐาน', 'Nice to meet you เป็นคำทักในครั้งแรกที่รู้จักกัน'),
      write('translate', 'ตอบคำทัก Nice to meet you ว่ายินดีที่ได้รู้จักเหมือนกัน โดยใช้ too', ['Nice to meet you too.', 'It’s nice to meet you too.'], 'คงรูป meet แล้วเติม too ท้ายประโยค', 'Too หมายถึงเช่นกันและวางท้ายได้'),
    ],
    speaking: 'ลองเปิดบทสนทนากับคนในสถานที่ที่คุณจะไปจริง ตอบแทนทั้งสองฝ่ายหนึ่งรอบ แล้วลองพูดอีกครั้งโดยเพิ่มรายละเอียดที่เป็นของคุณเอง',
    patterns: [
      pat('Hey, how’s [it] going so far?', 'เป็นยังไงบ้างตั้งแต่เริ่มมา', 'daily life', 'informal', 'ใช้หลังอยู่ในกิจกรรมมาสักพักแทนคำเปิด', ex('Hey, how’s it going so far?', 'เป็นยังไงบ้างตั้งแต่เริ่มมา', 'How’s it going ชวนเล่าความรู้สึกโดยรวมและ so far ตั้งกรอบถึงตอนนี้'), ex('How’s the workshop going so far?', 'เวิร์กช็อปเป็นยังไงบ้างจนถึงตอนนี้', 'เปลี่ยน it เป็นกิจกรรมที่ต้องการถามตรง ๆ'), [slot('it', 'it หรือคำนามเอกพจน์แทนกิจกรรมที่กำลังเกิด', 'the workshop')]),
      pat('What brought you to [place]?', 'อะไรทำให้คุณมาที่นี่', 'questions', 'neutral', 'ถามที่มาหรือแรงจูงใจเมื่อมีบริบทร่วมแล้ว', ex('What brought you to this workshop?', 'อะไรทำให้คุณมาเวิร์กช็อปนี้', 'What เป็นประธานของ brought จึงไม่เติม did'), ex('What brought you to Chiang Mai?', 'อะไรทำให้คุณมาที่เชียงใหม่', 'ผู้ตอบอาจเล่างาน เหตุผลส่วนตัว หรือที่มา'), [slot('place', 'ชื่อสถานที่หรือกิจกรรมที่ไปได้', 'this workshop')]),
      pat('And how about you?', 'แล้วคุณล่ะ', 'transitions', 'neutral', 'ใช้หลังตอบเรื่องของตัวเองเพื่อส่งคำถามเดิมกลับ', ex('I’m here for work. And how about you?', 'ฉันมาทำงาน แล้วคุณล่ะ', 'คำถามสั้นช่วยคืนพื้นที่ให้คู่สนทนาโดยอาศัยหัวข้อก่อนหน้า'), ex('I had a good weekend. How about you?', 'สุดสัปดาห์ฉันดีนะ แล้วคุณล่ะ', 'ละ And ได้เมื่อจังหวะต่อเนื่องอยู่แล้ว'), [], ['How about you?']),
    ],
  },
  {
    id: 'm9-02', module: 9, titleEn: 'Follow up and change topics', titleTh: 'ถามต่อและเปลี่ยนหัวข้อ',
    hook: 'เพื่อนเพิ่งบอกว่าเริ่มทำงานกะเช้า คุณจะถามอะไรต่อโดยไม่ต้องคิดหัวข้อใหม่ทั้งหมด',
    objective: 'หยิบรายละเอียดที่อีกฝ่ายเพิ่งพูดมาถามต่อ และส่งสัญญาณเมื่อจะเปิดประเด็นใหม่',
    concept: 'คำถามต่อทำงานได้ดีเมื่อผู้ฟังเห็นว่าคุณจับรายละเอียดเดิมได้แล้ว ถ้าคำถามยังอยู่เรื่องเดิมให้ใช้ that หรือคำเดิมอ้างกลับ ถ้าเปลี่ยนหัวข้อจริง ๆ คำอย่าง by the way ช่วยบอกจังหวะ',
    formula: 'Listen for one detail → refer back → ask; optional topic marker → new topic',
    minutes: 11, prerequisites: ['m9-01'], tags: ['follow-up', 'conversation', 'topic', 'ถามต่อ'],
    contrasts: [
      compare('How did that go?', 'By the way, are you free tomorrow?', 'ประโยคแรกตามเรื่องเดิม ส่วน by the way เกริ่นก่อนเพิ่มอีกประเด็น'),
      compare('What was it like?', 'What did you like about it?', 'อันแรกขอภาพรวม อันหลังถามว่าส่วนไหนที่ชอบ'),
    ],
    dialogue: [
      turn('I switched to the early shift last week.', 'อาทิตย์ก่อนฉันเปลี่ยนมาทำกะเช้า'),
      turn('How’s that going for you?', 'เป็นยังไงบ้างสำหรับคุณ'),
      turn('I like it, but getting up early is hard.', 'ชอบนะ แต่ตื่นเช้ายาก'),
    ],
    mistakes: [mistake('What did that like?', 'What was that like?', 'ถามว่าประสบการณ์เป็นอย่างไรใช้ be like ใช้ did กับ like เมื่อถามว่าชอบอะไร')],
    practice: [
      choice('เพื่อนเพิ่งบอกว่าลองขึ้นเวทีครั้งแรก คุณอยากให้เล่าประสบการณ์โดยรวม', ['What kind of stage was it?', 'What was that like?', 'By the way, are you working tomorrow?'], 1, 'Was that like ถามว่าประสบการณ์เป็นอย่างไร', { 'What kind of stage was it?': 'ถามชนิดของเวที จึงแคบกว่าประสบการณ์โดยรวม', 'By the way, are you working tomorrow?': 'คำถามนี้เปิดเรื่องพรุ่งนี้ทันที' }),
      order(['that', 'for you', 'How’s', 'going'], 'How’s that going for you?', 'How’s ตามด้วย that ที่อ้างถึงเรื่องเดิม'),
      write('fill', 'เติม marker 3 คำเพื่อเปลี่ยนไปเรื่องรอง: ___, are you free tomorrow?', ['By the way'], 'วลีขึ้นต้นด้วย By', 'By the way ช่วยพาผู้ฟังไปอีกหัวข้อ'),
      write('repair', 'แก้ให้เป็นคำถามว่าชอบส่วนไหน: What did you liked about it?', ['What did you like about it?'], 'did บอกอดีตแล้ว', 'เปลี่ยน liked เป็น like หลัง did'),
      write('translate', 'ถามว่าการสัมภาษณ์ครั้งนั้นเป็นยังไง โดยขึ้นต้น How did', ['How did the interview go?', 'How did that interview go?'], 'ใช้ go ถามผลหรือความรู้สึกโดยรวม', 'Did + ประธาน + go ถามถึงผลของเหตุการณ์ในอดีต'),
    ],
    speaking: 'เล่าเรื่องสั้นหนึ่งประโยคแล้วตั้งคำถามต่อจากรายละเอียดในประโยคนั้นสองแบบ ปิดด้วยประโยคเปลี่ยนหัวข้อที่เหมาะกับคนฟัง',
    patterns: [
      pat('How did [event] go?', 'เหตุการณ์นั้นเป็นยังไงบ้าง', 'questions', 'neutral', 'ถามต่อถึงเหตุการณ์ที่จบแล้วและรู้ร่วมกัน', ex('How did the interview go?', 'สัมภาษณ์เป็นยังไงบ้าง', 'Go ในคำถามนี้หมายถึงเหตุการณ์ดำเนินไปอย่างไร'), ex('How did that first class go?', 'คาบแรกเป็นยังไงบ้าง', 'That ชี้กลับไปที่คาบที่เคยคุยกัน'), [slot('event', 'คำนามหรือวลีคำนามของเหตุการณ์ที่จบแล้ว', 'the interview')]),
      pat('What was [experience] like for you?', 'ประสบการณ์นั้นเป็นอย่างไรสำหรับคุณ', 'questions', 'neutral', 'ใช้เมื่ออยากให้เล่าความรู้สึกหรือภาพรวม', ex('What was the night shift like for you?', 'กะดึกเป็นยังไงสำหรับคุณ', 'For you เน้นมุมของผู้ฟัง'), ex('What was moving abroad like for you?', 'การย้ายไปต่างประเทศเป็นยังไงสำหรับคุณ', 'V-ing phrase เป็นประธานแทนตัวประสบการณ์ได้'), [slot('experience', 'ชื่อประสบการณ์หรือวลี V-ing', 'moving abroad')]),
      pat('That reminds me, [related thought].', 'พูดถึงเรื่องนี้แล้วทำให้นึกขึ้นได้ว่า…', 'transitions', 'neutral', 'วางต้นเทิร์นก่อนเรื่องใหม่ที่เชื่อมจากคำก่อนหน้า', ex('That reminds me, I need to book my ticket.', 'พูดถึงเรื่องนี้แล้วนึกได้ว่าฉันต้องจองตั๋ว', 'That อ้างถึงสิ่งที่อีกฝ่ายเพิ่งพูด จึงเปลี่ยนเรื่องโดยยังมีจุดเชื่อม'), ex('That reminds me, has your sister arrived yet?', 'พูดถึงตรงนี้แล้วนึกได้ พี่สาวคุณมาถึงหรือยัง', 'ใช้เกริ่นได้ทั้งก่อนประโยคบอกเล่าและคำถาม'), [slot('related thought', 'ประโยคหรือคำถามที่โยงกับเรื่องก่อนหน้า', 'I need to book my ticket')]),
    ],
  },
  {
    id: 'm9-03', module: 9, titleEn: 'Opinions and disagreement', titleTh: 'ให้ความเห็นและเห็นต่าง',
    hook: 'ทีมเสนอให้ยกเลิกประชุมรายสัปดาห์ คุณเห็นด้วยครึ่งหนึ่ง จะพูดอย่างไรให้เหตุผลของคุณยังชัด',
    objective: 'บอกจุดยืน ชี้ส่วนที่เห็นด้วยหรือกังวล และให้เหตุผลในน้ำเสียงที่เหมาะ',
    concept: 'การเห็นต่างอย่างสุภาพอาศัยการตอบประเด็นจริงที่อีกฝ่ายเสนอ ยอมรับส่วนที่เห็นประโยชน์ก่อนเมื่อเหมาะ แล้วระบุส่วนที่ยังติดใจให้คนฟังตอบต่อได้',
    formula: 'Acknowledge → optional contrast + specific stance → reason or suggestion',
    minutes: 12, prerequisites: ['m9-02'], tags: ['opinion', 'agreement', 'hedging', 'เห็นด้วย'],
    contrasts: [
      compare('Exactly.', 'I agree up to a point.', 'Exactly เห็นด้วยชัดเจน ส่วน up to a point บอกว่ามีขอบเขตของความเห็นตรงกัน'),
      compare('I’m not convinced it would help.', 'It won’t help.', 'แบบแรกแสดงว่ายังไม่ถูกโน้มน้าว แบบหลังยืนยันผลหนักกว่า'),
    ],
    dialogue: [
      turn('I think written updates would be quicker.', 'ฉันว่าอัปเดตเป็นข้อความน่าจะเร็วกว่า'),
      turn('I see your point, but I’m not convinced it would help with urgent decisions.', 'เข้าใจประเด็นนะ แต่ฉันยังไม่แน่ใจว่าจะช่วยเรื่องที่ต้องตัดสินใจด่วน'),
      turn('We could keep a short call for those.', 'เราอาจยังนัดคุยสายสั้น ๆ ไว้สำหรับเรื่องพวกนั้น'),
    ],
    mistakes: [mistake('I am agree with that.', 'I agree with that.', 'Agree เป็นกริยาหลักจึงใช้ได้ทันทีหลัง I')],
    practice: [
      choice('ต้องการบอกว่ายอมรับข้อเสนอเพียงบางส่วน', ['Exactly.', 'I agree up to a point.', 'I don’t see any benefit.'], 1, 'Up to a point บอกว่าความเห็นตรงกันมีขอบเขต', { 'Exactly.': 'ฟังเหมือนเห็นด้วยโดยไม่มีข้อสงวน', 'I don’t see any benefit.': 'ปฏิเสธว่ามีข้อดีทั้งหมด' }),
      order(['your point', 'I', 'see', 'but', 'we still need a backup plan'], 'I see your point, but we still need a backup plan.', 'วาง but ระหว่างประโยคยอมรับกับประโยคแสดงข้อกังวล'),
      write('fill', 'เติมกริยาที่หมายถึงเห็นด้วยหนึ่งคำ: I ___ with you on the timing.', ['agree'], 'ใช้กริยาหลักต่อจาก I', 'Agree with คน ส่วน on ใช้บอกประเด็นที่เห็นตรงกัน'),
      write('repair', 'แก้โดยคงกริยา agree: I am agree that we need more time.', ['I agree that we need more time.'], 'Agree เป็นกริยาอยู่แล้ว', 'ตาม agree ด้วย that-clause ที่บอกสิ่งที่เห็นด้วยได้'),
      write('translate', 'ใช้ I’m not convinced เพื่อบอกว่ายังไม่เชื่อว่ามันจะช่วย', ['I’m not convinced it would help.', 'I’m not convinced that it would help.'], 'เติม clause ด้วย it + would + help', 'ละ that ได้ในบทสนทนา และ would ใช้พูดถึงผลของข้อเสนอ'),
    ],
    speaking: 'เลือกคำชวนเชื่อหนึ่งอย่างที่คุณเห็นด้วยเพียงบางส่วน กล่าวถึงส่วนที่รับได้แล้วอธิบายข้อกังวลพร้อมตัวอย่าง',
    patterns: [
      pat('I see your point, but [concern].', 'เข้าใจประเด็น แต่ฉันยังติดใจว่า…', 'agreement', 'neutral', 'ตอบหลังเข้าใจเหตุผลของอีกฝ่าย แล้วเติมข้อกังวลที่เฉพาะเจาะจง', ex('I see your point, but we still need a backup plan.', 'เข้าใจนะ แต่เรายังต้องมีแผนสำรอง', 'วลีแรกแสดงว่าตามเหตุผลได้โดยเปิดพื้นที่ให้ขยายความเห็นตัวเอง'), ex('I see your point, but the timing is a problem for me.', 'เข้าใจนะ แต่เวลานั้นเป็นปัญหาสำหรับฉัน', 'ระบุว่าติดตรงเวลา ทำให้อีกฝ่ายเสนอเวลาใหม่ได้'), [slot('concern', 'ประโยคเต็มที่ระบุประเด็นที่อยากคุย', 'we still need a backup plan')]),
      pat('I agree up to a point.', 'ฉันเห็นด้วยในระดับหนึ่ง', 'agreement', 'neutral', 'ตามด้วยส่วนที่เห็นด้วยและข้อสงวนเมื่อจำเป็น', ex('I agree up to a point. It saves time on routine tasks.', 'ฉันเห็นด้วยบางส่วน มันช่วยประหยัดเวลางานประจำ', 'ผู้ฟังรู้ว่ามีทั้งส่วนที่รับได้และส่วนที่ยังคุยกันต่อได้'), ex('I agree up to a point, but I wouldn’t use it for every project.', 'ฉันเห็นด้วยบางส่วน แต่คงไม่ใช้กับทุกโครงการ', 'เติม but เมื่ออยากระบุขอบเขตทันที')),
      pat('I’m not convinced [clause].', 'ฉันยังไม่แน่ใจหรือยังไม่เชื่อว่า…', 'uncertainty', 'neutral', 'วางก่อนประโยคที่บอกข้อสรุปที่คุณยังไม่รับ', ex('I’m not convinced it would help.', 'ฉันยังไม่เชื่อว่าจะช่วยได้', 'สื่อว่ายังต้องมีเหตุผลเพิ่มและเปิดให้คุยต่อ'), ex('I’m not convinced that we need another meeting.', 'ฉันยังไม่แน่ใจว่าเราต้องประชุมอีกครั้ง', 'ใส่ that ให้ขอบเขตประโยคชัดได้'), [slot('clause', 'ประโยคเต็ม โดยเติม that ได้', 'it would help')]),
    ],
  },
  {
    id: 'm9-04', module: 9, titleEn: 'Check shared understanding', titleTh: 'ขอคำอธิบายและยืนยันความเข้าใจ',
    hook: 'อีกฝ่ายบอกว่าต้องส่งงานภายในวันศุกร์ คุณไม่แน่ใจว่าก่อนเริ่มงานหรือก่อนเลิกงาน',
    objective: 'ถามให้ตรงจุดและพูดทวนสิ่งที่เข้าใจเพื่อให้คู่สนทนาแก้ได้',
    concept: 'ถ้าจับใจความได้บางส่วน ให้ระบุว่าติดอยู่ตรงคำ ตัวเลข หรือเงื่อนไขไหน การพูดทวนสั้น ๆ ช่วยให้เห็นว่าคุณพร้อมทำอะไรหลังจากยืนยัน',
    formula: 'Check marker + proposed meaning / WH embedded clause → confirmed action',
    minutes: 11, prerequisites: ['m9-03'], tags: ['clarification', 'questions', 'ถามให้ชัด'],
    contrasts: [
      compare('Do you mean Friday morning?', 'What do you mean by Friday?', 'อันแรกเสนอคำตีความหนึ่งแบบ อันหลังเปิดให้อีกฝ่ายอธิบายเอง'),
      compare('Can you say that again?', 'Can you explain what happens next?', 'อันแรกขอให้พูดซ้ำ อันหลังขอให้ขยายความขั้นต่อไป'),
    ],
    dialogue: [
      turn('Can you send it by Friday?', 'ส่งภายในวันศุกร์ได้ไหม'),
      turn('When you say Friday, do you mean by the end of the day?', 'ที่บอกว่าวันศุกร์ หมายถึงก่อนจบวันใช่ไหม'),
      turn('Yes. Any time before five is fine.', 'ใช่ ก่อนห้าโมงเวลาไหนก็ได้'),
    ],
    mistakes: [mistake('Could you tell me where is the venue?', 'Could you tell me where the venue is?', 'คำถามย่อยเป็นส่วนหนึ่งของประโยค จึงเรียง subject + verb')],
    practice: [
      choice('ผู้พูดระบุว่าพบกันที่หน้าอาคาร แต่คุณต้องการยืนยันว่าคือประตูหลัก', ['What time do you close?', 'Could you say it again?', 'Do you mean the main entrance?'], 2, 'Do you mean ตามด้วยตัวเลือกที่อยากให้อีกฝ่ายยืนยัน', { 'What time do you close?': 'ถามเวลา ไม่ได้เช็กประตู', 'Could you say it again?': 'ขอฟังเดิมซ้ำโดยยังไม่เสนอจุดที่ต้องเช็ก' }),
      order(['do you mean', 'four people in total', 'When you say four'], 'When you say four, do you mean four people in total?', 'ใช้ when-clause เกริ่นสิ่งที่ได้ยิน แล้วถามความหมายที่ต้องการยืนยัน'),
      write('fill', 'เติมคำเชื่อมที่แปลว่าถ้าหนึ่งคำ: ___ I’m following you, we need to sign in first.', ['If'], 'ตั้งเงื่อนไขว่าถ้าเข้าใจตามที่อีกฝ่ายอธิบายได้ถูก', 'If I’m following you บอกว่ากำลังลองสรุปสิ่งที่ฟัง'),
      write('repair', 'แก้ลำดับคำ: Could you tell me where is the venue?', ['Could you tell me where the venue is?'], 'ประโยคขึ้นต้นเป็นคำถามอยู่แล้ว', 'เรียง where + the venue + is ในคำถามย่อย'),
      write('translate', 'ใช้ When you say เพื่อถามว่า ราคา ที่พูดถึงรวมค่าจัดส่งหรือไม่', ['When you say price, do you mean including delivery?', 'When you say “price”, do you mean including delivery?', 'When you say the price, do you mean including delivery?'], 'ยกคำเดิมก่อน แล้วถามด้วย do you mean', 'Including delivery หมายถึงรวมค่าจัดส่งด้วย'),
    ],
    speaking: 'สมมติว่าคุณได้ข้อมูลเวลาหรือสถานที่ที่ตีความได้สองแบบ ลองพูดถามให้ชัดและพูดทวนสิ่งที่จะทำต่อ',
    patterns: [
      pat('When you say [term], do you mean [interpretation]?', 'ที่พูดว่า… หมายถึง… ใช่ไหม', 'clarification', 'neutral', 'ยกคำที่ได้ยินก่อนเสนอคำอธิบายหนึ่งแบบ', ex('When you say Friday, do you mean before five?', 'ที่พูดว่าวันศุกร์ หมายถึงก่อนห้าโมงใช่ไหม', 'หยิบ Friday มาถามตรงจุดและจำกัดเวลาที่ต้องยืนยัน'), ex('When you say a short walk, do you mean about ten minutes?', 'ที่บอกว่าเดินไม่ไกล หมายถึงสักสิบนาทีใช่ไหม', 'ใช้เพื่อเปลี่ยนคำกว้างเป็นรายละเอียดที่นำไปใช้ได้'), [slot('term', 'คำหรือวลีที่อีกฝ่ายเพิ่งใช้', 'Friday'), slot('interpretation', 'คำอธิบายที่อยากให้อีกฝ่ายยืนยัน', 'before five')]),
      pat('If I’m following you, [paraphrase].', 'ถ้าฉันเข้าใจถูก…', 'clarification', 'neutral', 'เกริ่นก่อนทวนความหมายด้วยคำของตัวเอง', ex('If I’m following you, we need to sign in first.', 'ถ้าฉันเข้าใจถูก เราต้องลงชื่อก่อน', 'บอกว่าเป็นการตรวจความเข้าใจและเปิดให้แก้ทันที'), ex('If I’m following you, the second fee is optional.', 'ถ้าฉันเข้าใจถูก ค่าธรรมเนียมรายการที่สองจ่ายหรือไม่ก็ได้', 'ใช้ทวนเงื่อนไขที่มีผลต่อการตัดสินใจ'), [slot('paraphrase', 'ประโยคเต็มสรุปสิ่งที่เข้าใจ', 'we need to sign in first')]),
      pat('What does [term] refer to here?', 'ตรงนี้คำว่า… หมายถึงอะไร', 'clarification', 'neutral', 'ใช้เมื่อคำอ้างความหมายต่างกันได้ในบริบทนี้', ex('What does “they” refer to here?', 'ตรงนี้ they หมายถึงใคร', 'Refer to ถามว่าสิ่งที่พูดหรือเขียนชี้กลับไปที่อะไร'), ex('What does “coverage” refer to here?', 'ตรงนี้ coverage หมายถึงอะไร', 'เหมาะกับการเช็กคำศัพท์ที่ใช้เป็นความหมายเฉพาะ'), [slot('term', 'ยกคำหรือวลีที่ต้องการถามถึง', 'coverage')]),
    ],
  },
  {
    id: 'm9-05', module: 9, titleEn: 'Buy time and repair a turn', titleTh: 'ซื้อเวลาและแก้คำพูด',
    hook: 'คุณกำลังเล่าเรื่องแล้วนึกชื่อสถานที่หรือคำที่ต้องการไม่ออก ลองทำให้ผู้ฟังตามต่อได้',
    objective: 'ขอเวลาสั้น ๆ แก้ข้อมูลที่พูดผิด และอธิบายด้วยคำที่รู้เมื่อจำคำเฉพาะไม่ได้',
    concept: 'เวลาติดขัด ให้เลือกวิธีซ่อมตามปัญหา ถ้ากำลังคิดให้ขอเวลา ถ้าข้อมูลผิดให้แก้ตรงจุด ถ้าต้องการสื่อความหมายเดิมด้วยคำง่ายขึ้นให้เริ่มใหม่ ผู้ฟังต้องการรู้ว่าจะตามต่ออย่างไร',
    formula: 'Pause request / correction marker / rephrasing marker → continue the idea',
    minutes: 11, prerequisites: ['m9-04'], tags: ['repair', 'clarification', 'hesitation', 'แก้คำพูด'],
    contrasts: [
      compare('Give me a second to think.', 'Let me put that another way.', 'อันแรกขอเวลาหาคำหรือคำตอบ อันหลังขอพูดความคิดเดิมใหม่ให้ชัด'),
      compare('Sorry, I meant Thursday.', 'I mean, it could still work.', 'I meant ใช้ย้อนแก้ข้อมูลก่อนหน้า ส่วน I mean ในตัวอย่างหลังช่วยขยายหรือปรับน้ำเสียงของสิ่งที่กำลังพูด'),
    ],
    dialogue: [
      turn('When does your class start?', 'ชั้นเรียนคุณเริ่มเมื่อไร'),
      turn('Tuesday. Sorry, I meant Thursday.', 'วันอังคาร ขอโทษที หมายถึงวันพฤหัสบดี'),
      turn('Got it. Are you taking it after work?', 'เข้าใจแล้ว เรียนหลังเลิกงานหรือ'),
    ],
    mistakes: [mistake('Let me to put that another way.', 'Let me put that another way.', 'หลัง let + คน ใช้กริยารูปพื้นฐาน')],
    practice: [
      choice('เผลอบอกวันที่เป็นวันพุธ ทั้งที่ตั้งใจพูดวันศุกร์ เลือกวิธีแก้ตรงจุด', ['Give me a second to think.', 'What do you mean by Friday?', 'Sorry, I meant Friday.'], 2, 'I meant ตามด้วยข้อมูลที่ตั้งใจพูดเดิม', { 'Give me a second to think.': 'ขอเวลาคิดโดยยังไม่ได้แก้ข้อมูล', 'What do you mean by Friday?': 'ถามให้อีกฝ่ายขยายคำของเขาเอง' }),
      order(['me', 'that', 'Let', 'another way', 'put'], 'Let me put that another way.', 'Let + คน + กริยารูปพื้นฐาน แล้วตามด้วยส่วนที่ต้องการพูดใหม่'),
      write('fill', 'เติมอดีตของ mean: Sorry, I ___ the small one.', ['meant'], 'กำลังแก้สิ่งที่พูดไปแล้ว', 'Meant เป็น V2 แบบ irregular ของ mean'),
      write('repair', 'แก้โดยคง Let me: Let me to think for a second.', ['Let me think for a second.'], 'หลัง let me ตัด to ออก', 'Think ใช้รูปพื้นฐานหลัง let me'),
      write('translate', 'ขอเวลาคิดสักครู่โดยใช้ Give me a second', ['Give me a second to think.', 'Give me a second to think, please.'], 'เติม to think เพื่อบอกว่าจะใช้เวลาทำอะไร', 'Give me a second เป็นคำขอแบบสนทนา เติม please ได้ตามน้ำเสียง'),
    ],
    speaking: 'อธิบายของชิ้นหนึ่งโดยไม่ใช้ชื่อของมัน ลองเว้นจังหวะด้วยวลีขอเวลาคิด แล้วพูดใหม่โดยบอกว่าใช้ทำอะไร',
    patterns: [
      pat('Give me a second to [verb].', 'ขอเวลาฉันสักครู่เพื่อ…', 'repair', 'informal', 'ใช้ขอเวลาสั้น ๆ ก่อนตอบหรือเช็กบางอย่าง', ex('Give me a second to think.', 'ขอคิดสักครู่', 'Second ในที่นี้หมายถึงช่วงสั้น ๆ ไม่ต้องเท่าหนึ่งวินาที'), ex('Give me a second to check the date.', 'ขอดูวันที่สักครู่', 'เติม to + กริยาเพื่อบอกสิ่งที่จะทำระหว่างรอ'), [slot('verb', 'กริยารูปพื้นฐานและส่วนขยายที่จำเป็น', 'check the date')], ['Let me think for a second.']),
      pat('Sorry, I meant [correction].', 'ขอโทษที ฉันหมายถึง…', 'repair', 'neutral', 'พูดทันทีที่รู้ว่าข้อมูลก่อนหน้าคลาดเคลื่อน', ex('Sorry, I meant Thursday.', 'ขอโทษที หมายถึงวันพฤหัสบดี', 'ใช้ past tense เพราะย้อนถึงเจตนาตอนพูดก่อนหน้า'), ex('Sorry, I meant the small one.', 'ขอโทษที หมายถึงอันเล็ก', 'เติมคำหรือวลีเฉพาะจุดก็พอเมื่อบริบทชัด'), [slot('correction', 'คำ วลี หรือข้อมูลที่ตั้งใจสื่อจริง', 'Thursday')]),
      pat('Let me put that another way.', 'ขอลองพูดอีกแบบ', 'repair', 'neutral', 'วางก่อนอธิบายความหมายเดิมใหม่ให้เข้าใจง่าย', ex('Let me put that another way. You only pay if you use it.', 'ขอพูดอีกแบบ คุณจ่ายเฉพาะเมื่อใช้งาน', 'ส่งสัญญาณให้คนฟังเปลี่ยนไปตามคำอธิบายใหม่'), ex('Let me put that another way. It’s a shared inbox.', 'ขออธิบายอีกแบบ มันคือกล่องข้อความที่ใช้ร่วมกัน', 'ตามด้วยคำอธิบายสั้นก่อนยกตัวอย่างได้'), [], ['Let me rephrase that.']),
    ],
  },
  {
    id: 'm9-06', module: 9, titleEn: 'Tell a personal story', titleTh: 'เล่าประสบการณ์ให้คนตามทัน',
    hook: 'เพื่อนถามว่าเกิดอะไรขึ้นตอนไปรับรถเช่า คุณจะพาเขาไปถึงเหตุการณ์สำคัญโดยไม่ลืมบริบทได้อย่างไร',
    objective: 'ตั้งฉาก เลือกเหตุการณ์หลัก และปิดเรื่องด้วยผลจริง โดยสลับรูปอดีตตามมุมมอง',
    concept: 'Past continuous ตั้งฉากที่กำลังเกิด ส่วน past simple เดินเรื่องไปตามเหตุการณ์หลัก ย้อนด้วย past perfect เมื่อจำเป็นต้องชี้ว่าเหตุการณ์หนึ่งเกิดก่อนจุดอ้างอิงในอดีต',
    formula: 'Scene (was/were + V-ing) → event (V2) → earlier context if needed (had + V3) → outcome',
    minutes: 13, prerequisites: ['m9-05'], tags: ['narrative', 'past', 'storytelling', 'เล่าเรื่อง'],
    contrasts: [
      compare('We were waiting when the agent called.', 'We waited after the agent called.', 'รูปแรกโทรระหว่างรอ รูปหลังเริ่มรอหลังสายโทรเข้า ลำดับเหตุการณ์เปลี่ยน'),
      compare('We found the keys.', 'We’d found the keys by then.', 'รูปหลังมองย้อนจากจุดอ้างอิงในอดีตว่าหากุญแจเจอก่อนจุดนั้น'),
    ],
    dialogue: [
      turn('Why were you so late?', 'ทำไมถึงมาสายขนาดนั้น'),
      turn('We were walking to the station when it started pouring.', 'เรากำลังเดินไปสถานี ตอนนั้นฝนตกหนักขึ้นมา'),
      turn('What did you do?', 'แล้วทำยังไง'),
      turn('In the end, we took a taxi.', 'สุดท้ายเรานั่งแท็กซี่'),
    ],
    mistakes: [mistake('We were wait when she called.', 'We were waiting when she called.', 'หลัง were ในเหตุการณ์กำลังดำเนินต้องใช้ waiting')],
    practice: [
      choice('เลือกประโยคที่บอกว่ากำลังรออยู่แล้วเมื่อสายโทรเข้า', ['We waited after she called.', 'We were waiting when she called.', 'We had waited before she called.'], 1, 'Were waiting เป็นฉากที่มีอยู่ขณะ called', { 'We waited after she called.': 'After วางการรอไว้หลังสายโทรเข้า', 'We had waited before she called.': 'การรอถูกมองย้อนหลังจากเวลาที่โทร' }),
      order(['when it started', 'I was', 'to rain', 'cycling home'], 'I was cycling home when it started to rain.', 'ประโยค was cycling ตั้งฉาก ส่วน when นำเหตุการณ์ที่แทรกเข้ามา'),
      write('fill', 'เติม V3 หนึ่งคำ: We’d already ___ the keys by then. (find)', ['found'], 'We’d คือ we had ในประโยคนี้', 'หลัง had ใช้ V3 และ find เปลี่ยนเป็น found'),
      write('repair', 'แก้ฉากที่กำลังรอ: We were wait when the train arrived.', ['We were waiting when the train arrived.'], 'were + V-ing', 'Waiting แสดงเหตุการณ์ที่ยังดำเนินอยู่ตอนรถไฟมาถึง'),
      write('translate', 'ใช้ In the end บอกว่าสุดท้ายเรานั่งแท็กซี่', ['In the end, we took a taxi.', 'In the end, we got a taxi.'], 'เหตุการณ์เกิดแล้ว ใช้ past simple', 'ทั้ง took a taxi และ got a taxi ใช้ในบริบทนี้ได้'),
    ],
    speaking: 'เลือกเรื่องที่แผนเปลี่ยน พูดว่ากำลังทำอะไร เหตุการณ์ไหนแทรกขึ้นมา และสุดท้ายทำอย่างไร แล้วลองเล่ารอบที่สองให้สั้นลง',
    patterns: [
      pat('[Subject] was/were in the middle of [activity] when [event].', 'กำลังทำ… อยู่ตอนที่…', 'narrative', 'neutral', 'ตั้งฉากด้วย in the middle of ก่อนบอกเหตุการณ์ที่เข้ามา', ex('I was in the middle of cooking when the power went out.', 'ฉันกำลังทำอาหารอยู่ตอนที่ไฟดับ', 'In the middle of เน้นว่ายังทำไม่เสร็จในตอนที่เกิดเรื่องอื่น'), ex('We were in the middle of a call when the siren went off.', 'เรากำลังคุยสายตอนที่ไซเรนดังขึ้น', 'หลัง of ใช้ได้ทั้งวลีคำนามและรูป V-ing'), [slot('Subject', 'ประธาน เลือก was หรือ were ให้เข้ากัน', 'we'), slot('activity', 'คำนามหรือ V-ing', 'cooking'), slot('event', 'ประโยคเหตุการณ์อดีต', 'the power went out')]),
      pat('By the time [past event], [subject] had already [V3].', 'พอถึงตอนที่… ก็… ไปแล้ว', 'narrative', 'neutral', 'ใช้เมื่อต้องแยกเหตุการณ์ที่เกิดก่อนจุดอ้างอิงในอดีต', ex('By the time we arrived, they had already closed the gate.', 'พอเราไปถึง เขาปิดประตูไปแล้ว', 'Had already closed แสดงว่าการปิดเกิดก่อนเราไปถึง'), ex('By the time she called, I had already found the keys.', 'พอเธอโทรมา ฉันหากุญแจเจอไปแล้ว', 'By the time นำเหตุการณ์อ้างอิง ส่วน V3 บอกสิ่งที่เสร็จก่อน'), [slot('past event', 'ประโยคบอกจุดในอดีต', 'we arrived'), slot('subject', 'ผู้ทำเหตุการณ์ที่เกิดก่อน', 'they'), slot('V3', 'past participle พร้อมส่วนขยาย', 'closed the gate')]),
      pat('In the end, [outcome].', 'สุดท้ายแล้ว…', 'narrative', 'neutral', 'วางตอนเปิดเผยผลหลังจากผ่านขั้นตอนหรือการตัดสินใจ', ex('In the end, we took a taxi.', 'สุดท้ายเรานั่งแท็กซี่', 'วลีนี้รวบเรื่องที่ผ่านมาสู่ผลที่เกิดขึ้นจริง'), ex('In the end, nobody had to miss the concert.', 'สุดท้ายไม่มีใครต้องพลาดคอนเสิร์ต', 'ใช้ได้แม้ผลออกมาต่างจากที่กังวลไว้'), [slot('outcome', 'ประโยคบอกผลสุดท้าย', 'we took a taxi')]),
    ],
  },
  {
    id: 'm9-07', module: 9, titleEn: 'Describe change and progress', titleTh: 'อธิบายการเปลี่ยนแปลง',
    hook: 'มีคนถามว่าช่วงนี้งานดีขึ้นไหม คุณต้องการให้เห็นทั้งก่อนหน้า ตอนนี้ และสิ่งที่ยังไม่เสร็จ',
    objective: 'เลือกจุดเปรียบเทียบและแยกการเปลี่ยนแปลงที่เกิดแล้วจากสิ่งที่ยังทำต่อเนื่อง',
    concept: 'การเล่าเรื่องเปลี่ยนแปลงต้องมีหลักให้เทียบ ใช้ used to สำหรับนิสัยหรือสภาพเก่าที่ต่างจากตอนนี้ ใช้ present perfect เมื่อเน้นผลที่มีอยู่ และใช้ still กับสิ่งที่ยังคงอยู่',
    formula: 'Earlier baseline + now/these days → current result + what remains',
    minutes: 12, prerequisites: ['m9-06'], tags: ['change', 'progress', 'still', 'ความคืบหน้า'],
    contrasts: [
      compare('I used to take the bus.', 'I’m used to taking the bus.', 'อันแรกพูดถึงกิจวัตรเดิม อันหลังพูดถึงความเคยชินและใช้ taking หลัง to'),
      compare('We’ve fixed it.', 'We’ve been fixing it.', 'อันแรกเน้นผลว่าแก้เสร็จแล้ว อันหลังเน้นกิจกรรมที่ดำเนินมาโดยยังไม่ได้บอกว่าเสร็จ'),
    ],
    dialogue: [
      turn('How are things going with the new process?', 'ขั้นตอนใหม่เป็นยังไงบ้าง'),
      turn('It’s getting easier, but we’re still working through a few issues.', 'ค่อย ๆ ง่ายขึ้น แต่ยังแก้ปัญหาอยู่สองสามจุด'),
      turn('Which part still takes the most time?', 'ส่วนไหนที่ยังใช้เวลามากที่สุด'),
    ],
    mistakes: [mistake('I used to taking notes by hand.', 'I used to take notes by hand.', 'เมื่อบอกกิจวัตรในอดีต used to ตามด้วย V1')],
    practice: [
      choice('กำลังปรับตัว แต่เริ่มรู้สึกว่าง่ายขึ้นเรื่อย ๆ', ['It got easier last year.', 'It’s getting easier.', 'It’s easy every time.'], 1, 'Getting + comparative เน้นช่วงที่กำลังเปลี่ยน', { 'It got easier last year.': 'ระบุการเปลี่ยนที่เกิดในอดีต', 'It’s easy every time.': 'บอกสภาพที่เป็นประจำโดยไม่เน้นการเปลี่ยน' }),
      order(['working', 'still', 'on the last section', 'We’re'], 'We’re still working on the last section.', 'Still อยู่หลัง we are และก่อน working'),
      write('fill', 'เติมรูปกริยาของ get เพื่อบอกว่าเริ่มดีขึ้นเรื่อย ๆ: It’s ___ better.', ['getting'], 'it’s คือ it is', 'Is getting + comparative บอกการเปลี่ยนที่กำลังเกิด'),
      write('repair', 'แก้ให้หมายถึงเคยทำเป็นกิจวัตร: I used to taking notes by hand.', ['I used to take notes by hand.'], 'หลัง used to ในความหมายนี้ใช้ V1', 'Used to take บอกพฤติกรรมเดิมที่เปลี่ยนไปแล้ว'),
      write('translate', 'ใช้ still working on บอกว่าเรายังทำส่วนสุดท้ายอยู่', ['We’re still working on the last section.', 'We are still working on the last section.', 'We’re still working on the final section.'], 'วาง still หลัง are', 'Still working on สื่อว่าส่วนนั้นยังไม่เสร็จ'),
    ],
    speaking: 'เล่าเรื่องหนึ่งที่ทำได้ดีขึ้น เทียบก่อนกับตอนนี้ บอกสิ่งที่ยังติดอยู่ และเสนอสิ่งหนึ่งที่จะลองต่อ',
    patterns: [
      pat('[Subject] is/are getting [comparative].', 'กำลัง… ขึ้นเรื่อย ๆ', 'change', 'neutral', 'ใช้พูดถึงแนวโน้มที่เริ่มเห็นแต่กำลังเปลี่ยนอยู่', ex('It’s getting easier to explain.', 'อธิบายได้ง่ายขึ้นเรื่อย ๆ', 'Getting เน้นช่วงการเปลี่ยนและ easier บอกทิศทาง'), ex('The nights are getting colder.', 'ตอนกลางคืนเริ่มหนาวขึ้นเรื่อย ๆ', 'The nights เป็นพหูพจน์จึงใช้ are'), [slot('Subject', 'สิ่งที่เปลี่ยน เลือก is/are ตามประธาน', 'the nights'), slot('comparative', 'คำคุณศัพท์ขั้นกว่าและส่วนขยาย', 'easier to explain')]),
      pat('[Subject] is/are still working on [task].', 'ยังทำ… อยู่', 'change', 'neutral', 'ใช้ให้สถานะงานที่ยังดำเนินไปอยู่', ex('We’re still working on the last section.', 'เรายังทำส่วนสุดท้ายอยู่', 'Still เชื่อมสิ่งที่ทำมาก่อนหน้ากับตอนนี้'), ex('She’s still working on getting the numbers right.', 'เธอยังพยายามแก้ให้ตัวเลขถูกต้องอยู่', 'On ตามด้วย V-ing เมื่อบอกกิจกรรมที่ต้องทำต่อ'), [slot('Subject', 'ผู้ที่ยังทำงานนั้น เลือก is/are ให้ตรง', 'we'), slot('task', 'คำนามหรือ V-ing ที่เป็นงาน', 'the last section')]),
      pat('Compared with [baseline], [difference].', 'เมื่อเทียบกับ… แล้ว…', 'comparison', 'neutral', 'ตั้งฐานการเปรียบเทียบก่อนบอกสิ่งที่ต่าง', ex('Compared with last month, the process feels faster.', 'เทียบกับเดือนก่อน ขั้นตอนดูเร็วขึ้น', 'ระบุฐานเวลาเพื่อให้คนฟังประเมินคำว่าเร็วขึ้นได้'), ex('Compared with the old layout, this one is easier to scan.', 'เมื่อเทียบกับเลย์เอาต์เดิม แบบนี้กวาดตาอ่านง่ายกว่า', 'ใช้กับสิ่งที่มีรุ่นเก่าและรุ่นใหม่เพื่ออธิบายความต่าง'), [slot('baseline', 'วลีชื่อเวลา สิ่งของ หรือเวอร์ชันที่ใช้เทียบ', 'last month'), slot('difference', 'ประโยคเต็มบอกความต่าง', 'the process feels faster')], ['Compared to…']),
    ],
  },
  {
    id: 'm9-08', module: 9, titleEn: 'Explain technical ideas', titleTh: 'อธิบายเรื่องเทคนิคและยกตัวอย่าง',
    hook: 'เพื่อนอยากรู้ว่าทำไมยังเปิดแผนที่ตอนเน็ตหลุดได้ คุณจะอธิบายให้คนที่ไม่รู้ศัพท์เทคนิคตามทันไหม',
    objective: 'ให้คำอธิบายหลักหนึ่งประโยค เลือกลำดับหรือเปรียบเทียบให้เห็นภาพ และบอกเงื่อนไข',
    concept: 'เริ่มด้วยสิ่งที่เปลี่ยนในมุมของผู้ใช้ แล้วอธิบายขั้นตอนที่จำเป็น ถ้าใช้การเปรียบเทียบให้ชี้ว่าคล้ายกันตรงไหนและเมื่อไรที่คำอธิบายใช้ได้',
    formula: 'Outcome → simple mechanism or analogy → concrete example or condition',
    minutes: 12, prerequisites: ['m9-07'], tags: ['technical explanation', 'analogy', 'condition', 'อธิบาย'],
    contrasts: [
      compare('It works like a shared whiteboard.', 'It is a shared whiteboard.', 'Works like บอกความคล้ายในวิธีทำงาน ส่วน is จัดว่าเป็นสิ่งนั้นจริง ๆ'),
      compare('Once the file is saved, you can close the app.', 'If the file is saved, you can close the app.', 'Once มองว่าหลังทำเสร็จจะไปขั้นต่อไป If ตั้งเงื่อนไขว่าไฟล์ถูกบันทึกหรือยัง'),
    ],
    dialogue: [
      turn('How do the lessons still open offline?', 'บทเรียนยังเปิดออฟไลน์ได้ยังไง'),
      turn('Think of it as saving a map before a trip.', 'ลองนึกภาพเหมือนเก็บแผนที่ก่อนเดินทาง'),
      turn('What happens if the app hasn’t saved it yet?', 'แล้วจะเกิดอะไรขึ้นถ้าแอปยังไม่ได้บันทึกล่ะ'),
      turn('Then you need a connection first.', 'ถ้าอย่างนั้นต้องต่อเน็ตก่อน'),
    ],
    mistakes: [mistake('Once the file will be saved, you can leave.', 'Once the file is saved, you can leave.', 'ใช้ present simple ในอนุประโยคเวลา once ที่มองไปข้างหน้าในตัวอย่างนี้')],
    practice: [
      choice('อยากบอกว่าระบบมีวิธีทำงานคล้ายกระดานร่วมกัน', ['It will be a whiteboard tomorrow.', 'It works like a shared whiteboard.', 'Is that your whiteboard?'], 1, 'Works like ให้ภาพเปรียบเทียบวิธีทำงาน', { 'It will be a whiteboard tomorrow.': 'คาดการณ์ว่าจะกลายเป็นกระดานจริงในอนาคต', 'Is that your whiteboard?': 'ถามว่าเป็นกระดานของใคร' }),
      order(['you can', 'is saved', 'open it offline', 'Once the file'], 'Once the file is saved, you can open it offline.', 'Once นำขั้นที่ต้องเสร็จก่อน ตามด้วยสิ่งที่ทำได้หลังจากนั้น'),
      write('fill', 'เติม preposition หนึ่งคำเพื่อชวนให้นึกเทียบ: Think of it ___ a checklist that updates itself.', ['as'], 'ใช้ think of A as B', 'As ชวนให้มองสิ่งหนึ่งผ่านกรอบของอีกสิ่งหนึ่ง'),
      write('repair', 'แก้ once-clause ของประโยคเงื่อนไขเวลา: Once the file will be saved, you can leave.', ['Once the file is saved, you can leave.'], 'ใช้ present ในส่วน once', 'Is saved เป็น present simple แบบ passive'),
      write('translate', 'ใช้ What happens if เพื่อถามว่าจะเกิดอะไรขึ้นถ้าการเชื่อมต่อหลุด', ['What happens if the connection drops?', 'What happens if the internet connection drops?'], 'หลัง if เรียงประธานแล้วค่อยกริยา', 'The connection drops บอกเหตุการณ์ที่ต้องการให้ผู้พูดอธิบายผล'),
    ],
    speaking: 'อธิบายฟังก์ชันจากเครื่องมือที่คุณใช้จริงให้เพื่อนฟังในหนึ่งนาที เริ่มจากผลที่เขาจะเห็น ยกตัวอย่างหนึ่งอย่าง แล้วบอกเงื่อนไขหรือข้อจำกัด',
    patterns: [
      pat('Think of it as [analogy].', 'ลองนึกภาพว่ามันเป็นเหมือน…', 'technical explanations', 'neutral', 'ตามด้วยการเปรียบเทียบที่คนฟังนึกภาพได้', ex('Think of it as a checklist that updates itself.', 'ลองนึกว่าเป็นเช็กลิสต์ที่อัปเดตเอง', 'พาผู้ฟังจากสิ่งไม่คุ้นไปสู่ภาพที่คุ้น'), ex('Think of it as saving a map before a trip.', 'ลองนึกเหมือนบันทึกแผนที่ก่อนออกทริป', 'หลัง as ใช้ชื่อสิ่งของหรือกิจกรรม V-ing ก็ได้'), [slot('analogy', 'วลีคำนามหรือ V-ing ที่อธิบายด้วยภาพเปรียบ', 'a checklist that updates itself')]),
      pat('Once [step is complete], you can [next action].', 'เมื่อขั้นนี้เสร็จแล้ว คุณก็… ได้', 'sequencing', 'neutral', 'วางเงื่อนไขเวลาไว้ก่อนการทำขั้นถัดไป', ex('Once the file is saved, you can open it offline.', 'เมื่อไฟล์ถูกบันทึกแล้ว คุณเปิดออฟไลน์ได้', 'Once สื่อว่าต้องเสร็จก่อนจึงจะทำสิ่งถัดไปได้'), ex('Once the light turns green, you can unplug it.', 'เมื่อไฟเปลี่ยนเป็นสีเขียว คุณถอดปลั๊กได้', 'ใช้ present simple หลัง once เพื่อบอกเหตุการณ์ในอนาคต'), [slot('step is complete', 'ประโยค present ที่เป็นขั้นก่อน', 'the light turns green'), slot('next action', 'V1 และส่วนขยาย', 'unplug it')]),
      pat('What happens if [condition]?', 'จะเกิดอะไรขึ้นถ้า…', 'conditions', 'neutral', 'ใช้ถามถึงผลเมื่อต้องการลองเปลี่ยนเงื่อนไขหนึ่ง', ex('What happens if the connection drops?', 'จะเกิดอะไรขึ้นถ้าการเชื่อมต่อหลุด', 'What เป็นประธานของ happens ส่วน if ตั้งเหตุการณ์ที่อยากทดสอบ'), ex('What happens if I skip this step?', 'จะเป็นยังไงถ้าข้ามขั้นนี้', 'ถามเพื่อรู้ผลก่อนตัดสินใจทำต่อ'), [slot('condition', 'ประโยคเต็มหลัง if', 'I skip this step')]),
    ],
  },
  {
    id: 'm10-01', module: 10, titleEn: 'Listen before reading subtitles', titleTh: 'ฟังรอบแรกแล้วใช้ English subtitles',
    hook: 'คุณตามหัวข้อพอดแคสต์ทันเมื่อเปิดซับ แต่หลังปิดซับบางประโยคหายไปจากความจำ',
    objective: 'ฟังหาประเด็นก่อนใช้ซับตรวจเสียง เลือกเพียงประโยคเดียวเพื่อเอาไปพูดต่อ',
    concept: 'รอบแรกสังเกตเรื่อง คน และท่าทีโดยไม่ต้องแกะทุกคำ รอบสองเปิด English subtitles เพื่อเช็กส่วนที่ได้ยินคลาดเคลื่อน เลือกวลีที่ช่วยเล่าแนวคิดนั้น แล้วปิดซับลองพูดด้วยคำของตัวเอง',
    formula: 'Listen for gist → check one line with subtitles → listen again → express one idea',
    minutes: 12, prerequisites: [], tags: ['listening', 'subtitles', 'gist', 'ฟังจับใจความ'],
    contrasts: [
      compare('I couldn’t make out the last word.', 'I didn’t catch the main point.', 'อันแรกไม่ได้ยินคำสุดท้ายชัด อันหลังไม่ได้จับข้อหลักแม้อาจได้ยินหลายคำ'),
      compare('I got the gist.', 'I caught every word.', 'เข้าใจใจความโดยรวมได้แม้ยังไม่ได้ยินทุกคำ'),
    ],
    dialogue: [
      turn('What did you pick up on the first listen?', 'ฟังครั้งแรกจับอะไรได้บ้าง'),
      turn('I got the gist, but I couldn’t make out the last word.', 'เข้าใจคร่าว ๆ แต่ฟังคำสุดท้ายไม่ออก'),
      turn('Let’s listen again with the subtitles on.', 'ลองฟังอีกรอบแบบเปิดซับกัน'),
    ],
    mistakes: [mistake('I couldn’t made out the name.', 'I couldn’t make out the name.', 'Couldn’t ตามด้วย make รูปพื้นฐาน')],
    practice: [
      choice('ฟังเรื่องทันโดยรวม แต่พลาดหลายคำ ใช้ประโยคไหนบอกผลที่ได้', ['I got the gist.', 'I caught every word.', 'I couldn’t follow any of it.'], 0, 'Get the gist คือเข้าใจสาระสำคัญโดยไม่ต้องจับทุกคำ', { 'I caught every word.': 'บอกว่าได้ยินครบ ซึ่งโจทย์ระบุว่าพลาดหลายคำ', 'I couldn’t follow any of it.': 'บอกว่าตามไม่ทันเลย ซึ่งต่างจากเข้าใจโดยรวม' }),
      order(['out', 'the last word', 'make', 'I couldn’t'], 'I couldn’t make out the last word.', 'Make out เป็นกริยาวลี แปลว่าแยกให้ชัดได้'),
      write('fill', 'เติม preposition หนึ่งคำ: Let’s listen again ___ the subtitles on.', ['with'], 'ตามด้วย the subtitles และสภาพ on', 'With + noun + on ระบุสิ่งที่เปิดไว้ระหว่างทำกิจกรรม'),
      write('repair', 'แก้รูปกริยาหลัง couldn’t: I couldn’t made out the name.', ['I couldn’t make out the name.'], 'couldn’t + V1', 'ใช้ make หลัง modal'),
      write('translate', 'ใช้ I heard เพื่อบอกว่าได้ยินชื่อสถานี แต่ฟังเลขไม่ออก ใช้ make out', ['I heard the station name, but I couldn’t make out the number.'], 'เชื่อมสองส่วนต่างกันด้วย but', 'Heard และ couldn’t make out แยกสิ่งที่จับได้กับสิ่งที่จับไม่ได้'),
    ],
    speaking: 'เลือกเสียงภาษาอังกฤษประมาณ 20 วินาที ฟังสองรอบโดยเปิดซับเฉพาะรอบสอง จากนั้นสรุปใจความหนึ่งประโยค แล้วบอกอีกประโยคว่ารอบสองช่วยให้เข้าใจอะไร',
    patterns: [
      pat('I got the gist of [speech or text].', 'ฉันจับใจความของ… ได้', 'listening', 'neutral', 'ใช้รายงานว่าเข้าใจสาระหลักของสิ่งที่ฟังหรืออ่าน', ex('I got the gist of the interview.', 'ฉันจับใจความการสัมภาษณ์ได้', 'Gist หมายถึงใจความโดยรวม'), ex('I got the gist of her explanation, even without the slides.', 'ฉันจับใจความที่เธออธิบายได้ แม้ไม่ได้ดูสไลด์', 'เติมแม้ไม่มีตัวช่วยเพื่อบอกสภาพที่ฟัง'), [slot('speech or text', 'วลีคำนามของสิ่งที่ฟังหรืออ่าน', 'the interview')], ['I got the main idea.']),
      pat('I couldn’t make out [detail].', 'ฉันฟังหรือมอง… ไม่ชัด', 'clarification', 'neutral', 'ระบุรายละเอียดที่รับรู้ไม่ชัด แทนการพูดกว้างว่าฟังไม่เข้าใจ', ex('I couldn’t make out the last word.', 'ฉันฟังคำสุดท้ายไม่ออก', 'Make out เน้นการแยกคำจากสิ่งที่ได้ยิน'), ex('I couldn’t make out the name over the music.', 'ฉันฟังชื่อไม่ออกเพราะเสียงเพลงดังอยู่', 'Over the music บอกว่าเสียงอื่นกลบรายละเอียด'), [slot('detail', 'วลีคำนามแทนคำหรือสิ่งที่แยกไม่ออก', 'the last word')]),
      pat('I heard [detail], but I missed [other detail].', 'ฉันได้ยิน… แต่พลาด…', 'listening', 'neutral', 'เปรียบเทียบสิ่งที่จับได้กับส่วนที่ต้องฟังซ้ำ', ex('I heard the station name, but I missed the number.', 'ฉันได้ยินชื่อสถานี แต่พลาดตัวเลข', 'But แสดงว่าผู้ฟังจับได้บางส่วนจึงขอเช็กเฉพาะที่ขาด'), ex('I heard the question, but I missed the answer.', 'ฉันได้ยินคำถาม แต่พลาดคำตอบ', 'ใช้กับช่วงที่ตามทันถึงจุดหนึ่งแล้วหลุด'), [slot('detail', 'คำนามระบุส่วนที่ได้ยิน', 'the question'), slot('other detail', 'คำนามระบุส่วนที่พลาด', 'the answer')]),
    ],
  },
  {
    id: 'm10-02', module: 10, titleEn: 'Break down a podcast sentence', titleTh: 'แยกหน้าที่คำจากประโยคพอดแคสต์',
    hook: 'คุณได้ยิน So, did you notice any changes? แล้วอยากใช้โครงเดียวกันถามเรื่องของคุณเอง',
    objective: 'แยก marker, auxiliary, subject, verb และ object แล้วเปลี่ยนเฉพาะส่วนที่เข้ากับเจตนาใหม่',
    concept: 'เริ่มจากแกน you notice changes แล้วดูว่าคำถามเกี่ยวกับอดีตจึงเติม did และใช้ notice รูปพื้นฐาน So เชื่อมกับช่วงก่อนหน้าของการสนทนา ส่วน any อยู่ในวลีกรรม ไม่ต้องยกทั้งประโยคไปใช้ถ้าเจตนาต่าง',
    formula: 'So (optional marker) + did (past auxiliary) + you (subject) + notice (base verb) + any changes (object)?',
    minutes: 13, prerequisites: ['m10-01'], tags: ['podcast', 'auxiliary', 'notice', 'วิเคราะห์ประโยค'],
    contrasts: [
      compare('Did you notice any changes?', 'Have you noticed any changes so far?', 'อันแรกถามในช่วงอดีตที่รู้ร่วมกัน อันหลังมองการสังเกตจนถึงตอนนี้'),
      compare('Did you notice any changes?', 'What did you notice?', 'อันแรกใช้เช็กว่ามีหรือไม่ อันหลังถามให้ระบุสิ่งที่สังเกต'),
    ],
    dialogue: [
      turn('I tried the new system for a week.', 'ฉันลองระบบใหม่หนึ่งสัปดาห์'),
      turn('So, did you notice any changes?', 'แล้วสังเกตเห็นอะไรเปลี่ยนแปลงบ้างไหม'),
      turn('Yes, it took less time to find old messages.', 'เห็น ใช้เวลาหาข้อความเก่าน้อยลง'),
    ],
    mistakes: [mistake('So, did you noticed any changes?', 'So, did you notice any changes?', 'Did บอกเวลาอดีตแล้ว หลังประธานใช้ notice รูปพื้นฐาน')],
    practice: [
      choice('ใน So, did you notice any changes? ส่วนไหนทำหน้าที่เกริ่นต่อจากเรื่องก่อนหน้า', ['did', 'any', 'So'], 2, 'So ใช้ต่อเทิร์นก่อนหน้า ส่วนโครงคำถามยังอยู่ได้เมื่อละ So', { did: 'Did ทำหน้าที่เป็นกริยาช่วยอดีต', any: 'Any เป็น determiner ในกลุ่มคำ any changes' }),
      order(['any changes', 'you', 'So', 'notice', 'did'], 'So, did you notice any changes?', 'Did อยู่หน้าประธานเพื่อสร้าง yes/no question'),
      write('fill', 'พิมพ์กริยารูปพื้นฐานของ noticed หลัง did: Did she ___ a difference?', ['notice'], 'ตัด -d ของรูปอดีตออก', 'ใช้ notice หลัง did'),
      write('repair', 'แก้กริยาหลักโดยคง did: Did you noticed the difference?', ['Did you notice the difference?'], 'กริยาช่วยรับเวลาอดีต', 'Did ทำให้ไม่ต้องผัน notice เป็น noticed'),
      write('translate', 'ถามว่าเมื่อวานสังเกตเห็นปัญหาอะไรไหม ใช้ So, did you notice', ['So, did you notice any problems yesterday?', 'So, did you notice any issues yesterday?'], 'ใช้กรรม any + คำนามพหูพจน์', 'Problems และ issues สื่อถึงปัญหาได้ทั้งคู่ในบริบทนี้'),
    ],
    speaking: 'ใช้กรอบ So, did you + V1 สร้างสามคำถามจากเรื่องที่คุณคุยได้จริง แล้วลองเปลี่ยนหนึ่งคำถามเป็น present perfect ที่โยงกับตอนนี้',
    patterns: [
      pat('So, did you notice any [plural noun]?', 'แล้วสังเกตเห็น… บ้างไหม', 'questions', 'neutral', 'ใช้ถามต่อในเหตุการณ์อดีตที่กำลังคุยกัน มี So ได้ตามจังหวะ', ex('So, did you notice any changes?', 'แล้วสังเกตเห็นการเปลี่ยนแปลงอะไรบ้างไหม', 'So รับเรื่องจากเทิร์นก่อน และ did รับเวลาอดีต'), ex('So, did you notice any problems yesterday?', 'แล้วเมื่อวานสังเกตเห็นปัญหาอะไรบ้างไหม', 'Yesterday ระบุอดีตที่ถาม ส่วน problems เป็นพหูพจน์หลัง any'), [slot('plural noun', 'คำนามนับได้พหูพจน์ของสิ่งที่อาจสังเกต', 'problems')], ['Did you notice any…?']),
      pat('Did anything [verb] while [event]?', 'มีอะไร… ไหมระหว่างที่…', 'questions', 'neutral', 'ถามว่ามีเหตุการณ์ใดเกิดขึ้นระหว่างช่วงที่รู้ร่วมกัน', ex('Did anything change while I was away?', 'มีอะไรเปลี่ยนไปไหมระหว่างที่ฉันไม่อยู่', 'Anything เป็นประธาน แต่เป็น yes/no question จึงใช้ did ได้'), ex('Did anything move while the motor was running?', 'มีอะไรขยับไหมตอนมอเตอร์กำลังทำงาน', 'ใช้ while ระบุฉากทับซ้อนกับสิ่งที่ถาม'), [slot('verb', 'กริยารูปพื้นฐาน', 'change'), slot('event', 'ประโยคที่บอกช่วงเกิดเหตุ', 'I was away')]),
      pat('The first thing I noticed was [detail].', 'อย่างแรกที่ฉันสังเกตคือ…', 'narrative', 'neutral', 'ใช้เปิดคำอธิบายจากรายละเอียดที่เด่นก่อน', ex('The first thing I noticed was the sound.', 'อย่างแรกที่ฉันสังเกตคือเสียง', 'The first thing I noticed เป็นกลุ่มประธาน ส่วน was เชื่อมกับรายละเอียด'), ex('The first thing I noticed was how fast it loaded.', 'อย่างแรกที่สังเกตคือมันโหลดเร็วแค่ไหน', 'เติม how-clause เพื่อรายงานลักษณะที่สังเกต'), [slot('detail', 'คำนามหรือส่วนเติมเต็มที่ระบุสิ่งที่สังเกต', 'the sound')]),
    ],
  },
  {
    id: 'm10-03', module: 10, titleEn: 'Hear and save reusable chunks', titleTh: 'สังเกตกลุ่มคำและนำกลับมาใช้',
    hook: 'คุณได้ยิน on the way to work เป็นกลุ่มเสียงเดียว แต่ลองประกอบเองกลับสลับคำ',
    objective: 'จับกลุ่มคำที่ทำหน้าที่ร่วมกัน บันทึกพร้อมบริบท และเปลี่ยนช่องที่ยืดหยุ่นได้',
    concept: 'Chunk คือกลุ่มคำที่ใช้ร่วมกันจนหยิบออกมาพูดได้ทีเดียว แยกส่วนคงที่ เช่น on the way to ออกจากช่องที่เปลี่ยนได้ เช่น work เก็บทั้งตัวอย่างเดิมและประโยคใหม่ของคุณเพื่อฝึกย้ายไปบริบทอื่น',
    formula: 'Hear a useful chunk → mark fixed words + variable slots → reuse it in a new context',
    minutes: 11, prerequisites: ['m10-02'], tags: ['chunk', 'collocation', 'listening', 'กลุ่มคำ'],
    contrasts: [
      compare('On the way to work', 'In the way', 'อย่างแรกบอกว่าอยู่ระหว่างทางไปทำงาน อย่างหลังบอกว่าขวางทาง'),
      compare('I recognized the phrase from the podcast.', 'I worked out the phrase from the context.', 'Recognize บอกว่าเคยเจอจึงจำได้ ส่วน work out ใช้เมื่ออาศัยบริบทคิดหาความหมาย'),
    ],
    dialogue: [
      turn('When did you hear the interview?', 'ได้ฟังบทสัมภาษณ์ตอนไหน'),
      turn('On the way to work. I picked up a useful phrase.', 'ระหว่างทางไปทำงาน ฉันจำวลีที่น่าใช้ได้วลีหนึ่ง'),
      turn('Can you use it in a new sentence?', 'ลองเอาไปใช้ในประโยคใหม่ได้ไหม'),
    ],
    mistakes: [mistake('I heard it on way to work.', 'I heard it on the way to work.', 'เก็บรูป on the way to เป็นชุด เพราะ the อยู่ในวลีนี้')],
    practice: [
      choice('อยากบอกว่าได้ฟังระหว่างเดินทางไปทำงาน เลือก chunk ตรงความหมาย', ['in the way', 'on the way to work', 'out of the way'], 1, 'On the way to ระบุช่วงที่กำลังเดินทางไปเป้าหมาย', { 'in the way': 'หมายถึงขวางทาง', 'out of the way': 'หมายถึงพ้นทางหรืออยู่นอกเส้นทางที่สะดวก' }),
      order(['the way', 'I heard it', 'to work', 'on'], 'I heard it on the way to work.', 'วลี on the way to work ทำหน้าที่บอกช่วงเวลา'),
      write('fill', 'เติม preposition ที่บอกแหล่งเดิม: I recognized the phrase ___ the podcast.', ['from'], 'นึกถึงว่าจำวลีนี้ได้มาจากไหน', 'From เชื่อมสิ่งที่จำได้กับแหล่งที่เคยพบ'),
      write('repair', 'เติมคำที่หายไปหนึ่งคำ: I heard it on way to work.', ['I heard it on the way to work.'], 'on ___ way to', 'The อยู่ระหว่าง on กับ way'),
      write('translate', 'ใช้ picked up เพื่อบอกว่าฉันจำวลีใหม่จากพอดแคสต์มาได้สองสามวลี', ['I picked up a few new phrases from the podcast.'], 'pick up เป็นรูปอดีต เติม from เพื่อบอกที่มา', 'Picked up ในบริบทนี้หมายถึงเรียนรู้จากการได้ยินหรือใช้จริง'),
    ],
    speaking: 'เลือก chunk จากประโยคที่ฟังหนึ่งชิ้น ออกเสียงให้เป็นกลุ่มเดียว แล้วเปลี่ยนช่องท้ายเพื่อเล่าเหตุการณ์จริงของคุณสามแบบ',
    patterns: [
      pat('On the way to [destination]', 'ระหว่างทางไป…', 'daily life', 'neutral', 'วางต้นหรือท้ายประโยคเพื่อบอกเวลาระหว่างเดินทาง', ex('I heard it on the way to work.', 'ฉันได้ยินตอนเดินทางไปทำงาน', 'ส่วนคงที่คือ on the way to และเติมจุดหมายท้ายวลี'), ex('On the way to the station, I stopped for coffee.', 'ระหว่างทางไปสถานี ฉันแวะซื้อกาแฟ', 'ย้ายวลีมาต้นประโยคเมื่ออยากตั้งฉากก่อน'), [slot('destination', 'ชื่อสถานที่หรือวลีบอกจุดหมาย', 'the station')], ['On my way to…']),
      pat('I picked up [word or habit] from [source].', 'ฉันเรียนรู้หรือได้… มาจาก…', 'experience', 'neutral', 'ใช้เล่าการเรียนรู้จากการเจอในชีวิตจริง', ex('I picked up a few new phrases from the podcast.', 'ฉันได้วลีใหม่สองสามวลีจากพอดแคสต์', 'Pick up ใช้พูดถึงการจำและเรียนรู้จากการฟังในบริบท'), ex('I picked up that habit from my roommate.', 'ฉันได้นิสัยนั้นมาจากเพื่อนร่วมห้อง', 'ใช้กับนิสัยได้ด้วยเมื่อมีคนหรือบริบทให้เลียนแบบ'), [slot('word or habit', 'วลีคำนามแทนสิ่งที่เรียนรู้', 'a few new phrases'), slot('source', 'คนหรือสื่อที่เป็นแหล่งที่มา', 'the podcast')]),
      pat('I recognized [word or phrase] from [earlier source].', 'ฉันจำ… ได้จาก… ที่เคยเจอ', 'listening', 'neutral', 'ใช้บอกว่าจำสิ่งที่ฟังได้และระบุว่าคุ้นจากไหน',
        ex('I recognized the phrase from the podcast.', 'ฉันจำวลีนี้ได้จากพอดแคสต์', 'Recognize คือรู้ว่าเคยเจอมาก่อน ต่อด้วย from เพื่อบอกแหล่งเดิม'),
        ex('I recognized that expression from an earlier interview.', 'ฉันจำสำนวนนั้นได้จากบทสัมภาษณ์ก่อนหน้านี้', 'ใช้ that expression ชี้ไปยังคำพูดที่เพิ่งได้ยิน'),
        [slot('word or phrase', 'วลีคำนามแทนคำหรือกลุ่มคำที่จำได้', 'that expression'), slot('earlier source', 'สิ่งที่เคยอ่านหรือฟังแล้วพบคำนี้', 'an earlier interview')],
        ['That phrase sounded familiar.']),
    ],
  },
  {
    id: 'm10-04', module: 10, titleEn: 'Recognize speech links and contractions', titleTh: 'ฟังเสียงเชื่อมและรูปย่อให้ออก',
    hook: 'ในซับเห็น Did you hear it? แต่ตอนฟังเหมือนได้ยิน didja hearit เป็นกลุ่มเดียว',
    objective: 'เชื่อมสิ่งที่ได้ยินกับรูปเขียนและไวยากรณ์ โดยรู้ว่าการออกเสียงต่างกันได้ตามสำเนียงและจังหวะ',
    concept: 'คนพูดมักออกเสียงคำสั้นติดกับคำถัดไป เช่น did you อาจฟังคล้าย didja ในบางจังหวะ มีทั้งรูปเขียนย่ออย่าง I’ll และเสียงเชื่อมที่ยังเขียนเป็นสองคำ จับความหมายก่อนแล้วฟังส่วนที่เบาหรือเชื่อมอีกครั้ง',
    formula: 'Hear the phrase → recover written chunks → recover tense and word roles → say it comfortably',
    minutes: 12, prerequisites: ['m10-03'], tags: ['connected speech', 'contractions', 'pronunciation', 'เสียงเชื่อม'],
    contrasts: [
      compare('Did you hear it?', 'Do you hear it?', 'แม้สองประโยคออกเสียงเร็วคล้ายกัน แต่ did ถามเหตุการณ์อดีต ส่วน do ถามว่าตอนนี้ได้ยินไหม'),
      compare('I’ll send it later.', 'I’d send it later.', 'I’ll คือ I will ส่วน I’d คือ I would ในตัวอย่างนี้เพราะตามด้วย send รูปพื้นฐาน'),
    ],
    dialogue: [
      turn('Did you get my message?', 'ได้รับข้อความฉันหรือยัง'),
      turn('Not yet. I’ll check when I get home.', 'ยังเลย เดี๋ยวเช็กตอนถึงบ้าน'),
      turn('I’ve sent it again, just in case.', 'ฉันส่งให้อีกครั้งเผื่อไว้'),
    ],
    mistakes: [mistake('I’ll to check when I get home.', 'I’ll check when I get home.', 'I’ll คือ I will และ will ตามด้วยกริยารูปพื้นฐาน')],
    practice: [
      choice('ในเสียงเร็วได้ยินประมาณ didja hear it ผู้พูดถามถึงอดีต เลือกรูปเขียนปกติ', ['Do you hear it?', 'Did you hear it?', 'Did you heard it?'], 1, 'Did you อาจออกเสียงเชื่อม แต่รูปเขียนปกติของคำถามนี้ยังเป็น did you', { 'Do you hear it?': 'Do you ถามว่าตอนนี้ได้ยินไหมตามบริบทนี้', 'Did you heard it?': 'Did บอกอดีตแล้ว ต้องคืน heard เป็น hear' }),
      order(['it', 'later', 'send', 'I’ll'], 'I’ll send it later.', 'I’ll รวมประธาน I กับ will'),
      write('fill', 'เขียนรูปเต็มสองคำของ I’ve', ['I have'], 'หลังจากนี้ตามด้วย V3 ได้', 'I’ve รวม I + have'),
      write('repair', 'แก้รูปกริยาโดยคง I’ll: I’ll to check when I get home.', ['I’ll check when I get home.'], 'หลัง will ใช้ V1', 'คำย่อยังคงหน้าที่ modal เดิม'),
      write('transform', 'เปลี่ยน I sent it again. ให้บอกว่าจะส่งอีกครั้ง โดยใช้ will หรือ I’ll', ['I’ll send it again.', 'I will send it again.'], 'I + will รวมเป็น I’ll ได้', 'หลัง will ใช้ send และรูปย่อใช้ได้ทั่วไปในบทสนทนา'),
    ],
    speaking: 'พูด Did you get my message? ช้าหนึ่งรอบและเร็วขึ้นเล็กน้อยหนึ่งรอบ แล้วเปรียบเทียบกับ I’ll check when I get home. ฟังว่าเสียงที่สั้นลงมาจากส่วนไหน',
    patterns: [
      pat('Did you get my [message]?', 'คุณได้รับ… ของฉันหรือยัง', 'questions', 'neutral', 'ใช้ถามว่าอีกฝ่ายได้รับสิ่งที่ส่งไปหรือไม่ Did you อาจเชื่อมเสียง', ex('Did you get my message?', 'ได้รับข้อความฉันไหม', 'Did you อาจฟังคล้าย didja ในบางสำเนียง ให้จับ get my message เป็นอีกกลุ่มหนึ่ง'), ex('Did you get my email?', 'ได้รับอีเมลฉันไหม', 'My email ระบุสิ่งที่ส่ง โดยคำถามยังใช้ get รูปพื้นฐาน'), [slot('message', 'สิ่งที่ส่งให้อีกฝ่าย', 'email')]),
      pat('I’ll [action] when I get [place].', 'ฉันจะ… เมื่อถึง…', 'plans', 'neutral', 'ใช้บอกแผนตามจังหวะที่จะถึงจุดหมาย', ex('I’ll check when I get home.', 'ฉันจะเช็กตอนถึงบ้าน', 'I’ll ออกเสียงเป็นกลุ่มเดียว ส่วน when I get เป็นอนุประโยคเวลารูป present'), ex('I’ll call you when I get there.', 'ฉันจะโทรหาเมื่อไปถึง', 'Get there ใช้แทนชื่อปลายทางที่รู้ร่วมกัน'), [slot('action', 'กริยารูปพื้นฐานและส่วนขยาย', 'call you'), slot('place', 'home, there หรือ to + สถานที่', 'home')]),
      pat('I’ve [V3] it again, just in case.', 'ฉัน… ให้อีกครั้งเผื่อไว้', 'result', 'neutral', 'ใช้บอกสิ่งที่ทำซ้ำแล้วเพื่อเตรียมเผื่อ', ex('I’ve sent it again, just in case.', 'ฉันส่งให้อีกครั้งเผื่อไว้', 'I’ve คือ I have แล้วตามด้วย V3 sent'), ex('I’ve printed it again, just in case.', 'ฉันพิมพ์ซ้ำอีกชุดเผื่อไว้', 'Just in case ท้ายประโยคอาศัยบริบทว่ากำลังเผื่อเรื่องอะไร'), [slot('V3', 'past participle ของกริยาที่รับ it ได้', 'printed')]),
    ],
  },
  {
    id: 'm10-05', module: 10, titleEn: 'Stress and shadowing', titleTh: 'ฝึกลงน้ำหนักและพูดตาม',
    hook: 'ประโยคเดียวกันฟังเหมือนตอบคนละคำถามเมื่อผู้พูดลงน้ำหนักต่างจุด',
    objective: 'ฟังจุดเน้น แบ่งกลุ่มความหมาย และฝึก shadowing สั้น ๆ ก่อนเปลี่ยนคำ',
    concept: 'ผู้พูดลงน้ำหนักเพื่อช่วยแยกข้อมูลใหม่ แก้สิ่งที่คนฟังเข้าใจ หรือเปรียบเทียบตัวเลือก ลองฟังซ้ำ เลือกคำที่เด่น พูดตามกลุ่มเสียง แล้วเปลี่ยนจุดเน้นตามคำถามจริง ตัวพิมพ์ใหญ่ในแบบฝึกแทนความเด่นของเสียงเท่านั้น',
    formula: 'Listen → notice stress + pauses → echo one phrase → change focus or personalize',
    minutes: 13, prerequisites: ['m10-04'], tags: ['stress', 'pronunciation', 'shadowing', 'ลงน้ำหนัก'],
    contrasts: [
      compare('I sent it on MONDAY.', 'I SENT it on Monday.', 'MONDAY แก้วันที่หรือบอกวันที่ใหม่ SENT เน้นการส่งจริง ตัวอย่างเช่น แก้ที่อีกฝ่ายคิดว่าคุณยังไม่ได้ส่ง'),
      compare('I asked MAYA to call.', 'I asked Maya to CALL.', 'อันแรกเน้นคนที่ถูกขอ อันหลังเน้นสิ่งที่ขอให้ทำ'),
    ],
    dialogue: [
      turn('Did you send it on Tuesday?', 'ส่งวันอังคารหรือ'),
      turn('No, I sent it on Monday.', 'ไม่ ฉันส่งวันจันทร์'),
      turn('Ah, I was looking at the wrong date.', 'อ๋อ ฉันดูผิดวัน'),
    ],
    mistakes: [mistake('I didn’t said Tuesday. I said Thursday.', 'I didn’t say Tuesday. I said Thursday.', 'ตอนแก้ข้อมูล ให้คง say รูปพื้นฐานหลัง didn’t และเน้น Tuesday/Thursday เพื่อให้ต่างกันชัด')],
    practice: [
      choice('คู่สนทนาคิดว่าคุณส่งวันอังคาร คุณแก้เป็นวันจันทร์ ควรให้น้ำหนักหลักที่คำไหน', ['I', 'it', 'Monday'], 2, 'วันคือข้อมูลที่ต่าง จึงเน้น Monday', { I: 'เน้น I เมื่อแก้ว่าใครเป็นคนส่ง', it: 'เน้น it เมื่อต้องแยกสิ่งที่ส่งจากอีกสิ่งหนึ่งในบางบริบท' }),
      order(['not', 'I said', 'Tuesday', 'Thursday'], 'I said Thursday, not Tuesday.', 'ใช้ not + ตัวเลือกเดิมชี้จุดแก้ และลงน้ำหนักที่สองวันที่เทียบกัน', 'เรียงคำเพื่อแก้ว่าพูดว่าวันพฤหัสบดี ไม่ใช่วันอังคาร'),
      write('fill', 'ประโยค We need the BLUE one. ถามให้เลือกว่าเป็นตัวไหนโดยใช้คำว่า which และคำว่า one 2 คำ', ['which one'], 'ใช้ WH word ตามด้วยตัวแทนสิ่งของ', 'Which one? ถามให้ระบุหนึ่งสิ่งจากตัวเลือกที่รู้ร่วมกัน'),
      write('repair', 'แก้รูปกริยาโดยคง didn’t: I didn’t said Tuesday. I said Thursday.', ['I didn’t say Tuesday. I said Thursday.'], 'didn’t + V1', 'ใช้ say หลัง didn’t แต่ใช้ said ในประโยคบอกเล่าอดีต'),
      write('translate', 'ใช้ I said เพื่อแก้ว่าพูดว่าวันพฤหัสบดี ไม่ใช่วันอังคาร', ['I said Thursday, not Tuesday.'], 'วางข้อมูลถูกก่อน แล้วตามด้วย not', 'พูดเน้น Thursday และ Tuesday เพื่อให้ได้ยินความต่างของสองตัวเลือก'),
    ],
    speaking: 'ฟังหรืออ่าน I said Thursday, not Tuesday. พูดตามกลุ่มแรกและกลุ่มหลังแยกกันหนึ่งรอบ แล้วพูดต่อกัน จากนั้นสลับเป็นวันที่หรือเลขที่คุณเคยได้ยินผิดจริง',
    patterns: [
      pat('I said [correct detail], not [other detail].', 'ฉันบอกว่า… ไม่ใช่…', 'repair', 'neutral', 'ใช้เมื่อแก้ข้อมูลที่ได้ยินคลาดเคลื่อน เน้นสองตัวเลือก', ex('I said Thursday, not Tuesday.', 'ฉันบอกว่าวันพฤหัสบดี ไม่ใช่วันอังคาร', 'เน้น THURSday และ TUESday ให้ได้ยินความต่าง'), ex('I said fifteen, not fifty.', 'ฉันบอกว่าสิบห้า ไม่ใช่ห้าสิบ', 'ลองพูดตัวเลขแยกให้ชัดและพักระหว่างตัวเลือก'), [slot('correct detail', 'ข้อมูลที่ตั้งใจพูด', 'Thursday'), slot('other detail', 'ข้อมูลที่เกิดความเข้าใจคลาดเคลื่อน', 'Tuesday')]),
      pat('It was [focused subject] who [past action].', 'คนที่… คือ…', 'clarification', 'neutral', 'ดึงชื่อคนหรือกลุ่มคนเป็นจุดเน้นเมื่อจำเป็นต้องระบุให้ชัด', ex('It was Maya who called me.', 'คนที่โทรหาฉันคือมายา', 'ลงน้ำหนักที่ MAYA เมื่อแก้ว่าใครเป็นคนโทร'), ex('It was the delivery team who found the package.', 'ทีมส่งของเป็นคนเจอกล่องพัสดุ', 'วางกลุ่มคนที่สำคัญก่อนส่วนที่คนฟังรู้อยู่แล้ว'), [slot('focused subject', 'คนหรือกลุ่มคนที่ต้องการเน้น', 'Maya'), slot('past action', 'กริยาอดีตและส่วนขยายของคนที่เน้น', 'called me')]),
      pat('Which [option] do you mean?', 'หมายถึง… อันไหน', 'clarification', 'neutral', 'ถามให้ระบุคำที่ควรเป็นจุดเน้นเมื่อมีตัวเลือก', ex('Which entrance do you mean?', 'หมายถึงทางเข้าไหน', 'ระบุชนิดของสิ่งที่มีหลายทางเลือกเพื่อให้คนตอบเน้นคำที่แก้ข้อสงสัย'), ex('Which blue one do you mean?', 'หมายถึงอันสีฟ้าอันไหน', 'ใส่สีในวลีเมื่อสองตัวเลือกยังมีสีเดียวกัน'), [slot('option', 'วลีคำนามที่มีตัวเลือกมากกว่าหนึ่ง', 'entrance')]),
    ],
  },
  {
    id: 'm10-06', module: 10, titleEn: 'Retell and personalize', titleTh: 'เล่าใหม่และเชื่อมกับชีวิตตัวเอง',
    hook: 'ฟังเรื่องคนลองงดแจ้งเตือนแล้วอยากเล่าให้เพื่อนฟังในสองสามประโยค',
    objective: 'แยกความคิดของผู้พูดจากตัวอย่างของคุณเอง และเล่าใจความด้วยคำที่พูดได้คล่อง',
    concept: 'การเล่าใหม่เก็บความสัมพันธ์ของเหตุการณ์ เช่น เขาเปลี่ยนอะไรและได้ผลอย่างไร เลือกคำง่ายที่สื่อสารรายละเอียดหลักและออกเสียงได้คล่อง พอจะโยงเข้าประสบการณ์ของคุณ ให้ส่งสัญญาณว่ากำลังพูดในมุมของตัวเอง',
    formula: 'Source + main idea → one supporting detail → personal link',
    minutes: 12, prerequisites: ['m10-05'], tags: ['retell', 'summary', 'experience', 'เล่าใหม่'],
    contrasts: [
      compare('She said it helped her focus.', 'I think it might help me focus.', 'อันแรกอ้างสิ่งที่เธอเล่า อันหลังเป็นการคาดของผู้พูดเอง'),
      compare('The episode was about sleep.', 'The speaker’s point was that habits matter more than one late night.', 'อันแรกบอกหัวข้อ อันหลังสรุปข้อหลักที่ผู้พูดเสนอ'),
    ],
    dialogue: [
      turn('What was the main point of the interview?', 'ใจความหลักของบทสัมภาษณ์คืออะไร'),
      turn('The speaker’s main point was that fewer interruptions helped her focus.', 'ข้อหลักของผู้พูดคือการถูกรบกวนน้อยลงช่วยให้เธอมีสมาธิ'),
      turn('That reminds me of when I turned off work alerts on Sundays.', 'ทำให้นึกถึงตอนที่ฉันปิดแจ้งเตือนงานวันอาทิตย์'),
    ],
    mistakes: [mistake('She explained me how it worked.', 'She explained how it worked to me.', 'Explain ตามด้วยสิ่งที่อธิบาย แล้วใช้ to ก่อนผู้ฟังเมื่ออยากระบุ')],
    practice: [
      choice('ประโยคไหนสรุปข้อหลักว่าอะไรช่วยให้ผู้พูดมีสมาธิ', ['It was about notifications.', 'The speaker’s main point was that fewer interruptions helped her focus.', 'I hate having my phone on.'], 1, 'ระบุความสัมพันธ์ที่ผู้พูดเสนอ คือการรบกวนน้อยลงช่วยให้มีสมาธิ', { 'It was about notifications.': 'บอกหัวข้อแต่ยังไม่บอกข้อสรุป', 'I hate having my phone on.': 'เป็นความเห็นของคนเล่าเอง ไม่ได้อ้างผู้พูดเดิม' }),
      order(['that shorter breaks', 'point was', 'worked better', 'The speaker’s main'], 'The speaker’s main point was that shorter breaks worked better.', 'That-clause เติมใจความที่สรุป'),
      write('fill', 'เติม preposition หนึ่งคำ: That reminds me ___ when I worked nights.', ['of'], 'ใช้ remind someone of something', 'Of เชื่อมกับความทรงจำที่คำก่อนหน้าชวนให้นึกถึง'),
      write('repair', 'แก้โดยคงคำผู้ฟัง to me: She explained me why it worked.', ['She explained why it worked to me.', 'She explained to me why it worked.'], 'วาง to me ก่อนหรือหลังส่วนที่เป็นใจความ', 'Explain ใช้ to me ระบุผู้ฟังได้'),
      write('translate', 'ใช้ In my case บอกว่าในกรณีของฉัน ปัญหาคือเสียงรบกวน', ['In my case, the problem was noise.', 'In my case, the issue was noise.', 'In my case, the problem was the noise.'], 'ทำให้ชัดว่ากำลังยกประสบการณ์ของตัวเอง', 'Noise เป็นคำนามนับไม่ได้ในความหมายนี้ ใช้ the ได้เมื่ออ้างเสียงที่รู้ร่วมกัน'),
    ],
    speaking: 'ฟังประโยคหรือคลิปสั้นหนึ่งชิ้น ปิดซับแล้วเล่าประเด็นหลักกับรายละเอียดหนึ่งอย่าง จากนั้นพูดอีกหนึ่งประโยคเชื่อมกับสิ่งที่เคยเกิดกับคุณ',
    patterns: [
      pat('The speaker’s main point was that [claim].', 'ประเด็นหลักที่ผู้พูดเสนอคือ…', 'narrative', 'neutral', 'ใช้ตอนเล่าใหม่เพื่อแยกข้อคิดของต้นทางจากคำของคุณ', ex('The speaker’s main point was that shorter breaks worked better.', 'ประเด็นหลักคือพักสั้น ๆ ได้ผลกว่า', 'That ตามด้วยประโยคที่สรุปความสัมพันธ์หรือข้อเสนอ'), ex('The speaker’s main point was that we learn more by trying.', 'ประเด็นหลักคือเราจะเรียนรู้มากขึ้นจากการลองทำ', 'ใช้ present หากกำลังเล่าข้อเสนอที่ผู้พูดมองว่ายังเป็นจริงทั่วไป'), [slot('claim', 'ประโยคเต็มของข้อหลักที่สรุป', 'shorter breaks worked better')]),
      pat('That reminds me of when [personal event].', 'ทำให้นึกถึงตอนที่…', 'transitions', 'neutral', 'โยงเรื่องที่ได้ฟังกับเหตุการณ์ที่คุณเคยเจอ', ex('That reminds me of when I turned off work alerts on Sundays.', 'ทำให้นึกถึงตอนที่ฉันปิดแจ้งเตือนงานวันอาทิตย์', 'That อ้างถึงปัจจัยหรือประสบการณ์ที่คล้ายกัน'), ex('That reminds me of when I worked nights.', 'ทำให้นึกถึงตอนที่ฉันทำงานกะดึก', 'When เปิดรายละเอียดของเหตุการณ์ส่วนตัว'), [slot('personal event', 'ประโยคบอกประสบการณ์ในอดีต', 'I worked nights')]),
      pat('In my case, [personal detail].', 'สำหรับกรณีของฉัน…', 'experience', 'neutral', 'ใช้แยกตัวอย่างของคุณจากข้อสรุปทั่วไป', ex('In my case, the problem was noise.', 'ในกรณีของฉัน ปัญหาคือเสียงรบกวน', 'In my case จำกัดข้อสังเกตเป็นประสบการณ์ของผู้พูด'), ex('In my case, turning off alerts made the biggest difference.', 'สำหรับฉัน การปิดแจ้งเตือนช่วยเปลี่ยนสถานการณ์ได้มากที่สุด', 'กลุ่ม V-ing เป็นประธานของประโยคเพื่อชี้สิ่งที่ทำจริง'), [slot('personal detail', 'ประโยคเต็มของประสบการณ์หรือเงื่อนไขเฉพาะตัว', 'the problem was noise')]),
    ],
  },
  {
    id: 'm10-07', module: 10, titleEn: 'Respond without scripting', titleTh: 'ตอบสดจากใจความที่ได้ฟัง',
    hook: 'ฟังจบแล้วมีคนถามว่าคุณจะลองทำตามไหม มีเวลาแค่ไม่กี่วินาทีให้คิด',
    objective: 'เลือกท่าทีหนึ่งอย่าง ตอบด้วยประโยคสั้น เพิ่มเหตุผลหรือข้อจำกัด และถามต่อได้',
    concept: 'เริ่มจากเจตนา เช่น อยากลอง ยังไม่แน่ใจ หรือมีประสบการณ์ใกล้กัน แล้วพูดใจความให้จบหนึ่งช่วงก่อนเติมรายละเอียด ถ้าคิดไม่ออกใช้วลีขอเวลาหรือบอกความไม่แน่ใจได้ตามธรรมชาติ',
    formula: 'Take a moment → direct response → optional reason, example, or follow-up',
    minutes: 13, prerequisites: ['m10-06'], tags: ['speaking', 'spontaneous', 'reaction', 'ตอบสด'],
    contrasts: [
      compare('I’d give it a try.', 'I’ll give it a try.', 'Would พูดถึงสิ่งที่คุณยินดีลองเมื่อมีโอกาส ส่วน will ฟังเหมือนตัดสินใจจะลองแล้วในบทสนทนานี้'),
      compare('I hadn’t thought of that.', 'I didn’t think it would work.', 'อันแรกเพิ่งนึกถึงความเป็นไปได้นั้น อันหลังบอกความคาดในอดีตว่าไม่น่าจะได้ผล'),
    ],
    dialogue: [
      turn('Would you try working without notifications for an hour?', 'คุณจะลองทำงานหนึ่งชั่วโมงโดยปิดแจ้งเตือนไหม'),
      turn('I’d give it a try if I could leave calls on.', 'ฉันอยากลองถ้ายังเปิดรับสายได้'),
      turn('Which alerts do you think you’d actually miss?', 'คิดว่าจะพลาดแจ้งเตือนแบบไหนที่สำคัญจริง'),
    ],
    mistakes: [mistake('I’d to give it a try.', 'I’d give it a try.', 'I’d ในประโยคนี้คือ I would ซึ่งตามด้วย V1 โดยไม่เติม to')],
    practice: [
      choice('คุณเพิ่งได้ยินไอเดียที่ไม่เคยนึกถึง อยากบอกปฏิกิริยานั้น', ['I hadn’t thought of that.', 'I didn’t think it would work.', 'I’d already tried it.'], 0, 'Hadn’t thought of ย้อนถึงก่อนที่อีกฝ่ายจะเสนอไอเดียนี้', { 'I didn’t think it would work.': 'บอกว่าเคยคิดว่าไม่ได้ผล แปลว่าเคยพิจารณามาบ้างแล้ว', 'I’d already tried it.': 'บอกว่าเคยลองจริงไปแล้ว' }),
      order(['give', 'a try', 'I’d', 'it'], 'I’d give it a try.', 'I would ตามด้วย give ซึ่งเป็น V1'),
      write('fill', 'เติม modal ที่แสดงความเป็นไปได้ในประโยค That ___ work for me. (ใช้ might)', ['might'], 'หลัง modal ใช้ work รูปเดิม', 'Might บอกว่าอาจเหมาะกับคุณ เปิดพื้นที่ไว้ให้เงื่อนไข'),
      write('repair', 'แก้โดยคง I’d: I’d to give it a try.', ['I’d give it a try.'], 'ตัด to หลัง I’d', 'Would ตามด้วยกริยารูปพื้นฐาน'),
      write('translate', 'ใช้ I’d give it a try if เพื่อบอกว่าจะลองถ้ายังเปิดรับสายได้', ['I’d give it a try if I could leave calls on.', 'I would give it a try if I could leave calls on.', 'I’d give it a try if I could keep calls on.'], 'ใช้ could กับกริยารูปพื้นฐานในเงื่อนไขสมมติ', 'Leave หรือ keep + calls + on บอกว่าเปิดรับสายไว้'),
    ],
    speaking: 'เลือกประโยคจากคลิปหนึ่งประโยค ฟังแล้วตอบทันที 30–60 วินาทีว่าเห็นด้วยไหม เคยพบอะไรคล้ายกัน หรืออยากถามอะไร จากนั้นลองตอบใหม่โดยเปลี่ยนท่าทีหนึ่งอย่าง',
    patterns: [
      pat('I’d give [idea] a try if [condition].', 'ฉันอยากลอง… ถ้า…', 'conditions', 'neutral', 'ตอบรับแบบเปิดไว้เมื่อมีเงื่อนไขสำคัญ', ex('I’d give it a try if I could leave calls on.', 'ฉันอยากลองถ้ายังเปิดรับสายได้', 'ใช้ would และ could จัดกรอบสถานการณ์ที่กำลังสมมติ'), ex('I’d give the new route a try if it got me there sooner.', 'ฉันจะลองเส้นทางใหม่ถ้าไปถึงเร็วกว่า', 'เปลี่ยน it เป็นโครงการหรือทางเลือกที่คุยอยู่ได้'), [slot('idea', 'it หรือวลีคำนามของสิ่งที่จะลอง', 'the new route'), slot('condition', 'ประโยคเงื่อนไขที่เข้ากับความหมายสมมติ', 'it got me there sooner')]),
      pat('I hadn’t thought of that.', 'ฉันยังไม่เคยนึกถึงมุมนั้น', 'reaction', 'neutral', 'ตอบทันทีเมื่อไอเดียใหม่เพิ่งถูกเสนอ', ex('I hadn’t thought of that. It might save us time.', 'ฉันยังไม่เคยนึกถึงมุมนั้น อาจช่วยประหยัดเวลาเราได้', 'Hadn’t thought of มองย้อนจากตอนที่เพิ่งได้ยินข้อเสนอ'), ex('Oh, I hadn’t thought of that. How would it work?', 'อ๋อ ฉันยังไม่เคยนึกถึง แล้วจะทำงานยังไง', 'ใช้ปฏิกิริยาสั้นเป็นฐานก่อนถามต่อ'), [], ['That hadn’t occurred to me.']),
      pat('That might work for [person], especially if [condition].', 'แบบนั้นอาจใช้ได้กับ… โดยเฉพาะถ้า…', 'uncertainty', 'neutral', 'ให้ความเห็นอย่างมีเงื่อนไขเมื่อยังไม่มั่นใจผล', ex('That might work for me, especially if the sessions are short.', 'แบบนั้นอาจจะเหมาะกับฉัน โดยเฉพาะถ้าแต่ละครั้งสั้น', 'Might ลดระดับความแน่ใจ และ especially if ระบุเงื่อนไขสำคัญ'), ex('That might work for our team, especially if we test it first.', 'แบบนั้นอาจใช้ได้กับทีมเรา โดยเฉพาะถ้าเราลองทดสอบก่อน', 'เชื่อมข้อเสนอเข้ากับคนหรือกลุ่มที่ต้องนำไปใช้'), [slot('person', 'คนหรือกลุ่มที่ผลจะเกิดกับเขา', 'our team'), slot('condition', 'ประโยคเงื่อนไขหลัง if', 'we test it first')]),
    ],
  },
]

const extraPatterns: Record<string, DraftPattern[]> = {
  'm9-06': [
    pat('It wasn’t until [milestone] that [past event].', 'กว่าจะ… ก็เมื่อ… แล้ว',
      'narrative', 'neutral', 'เน้นจุดที่เหตุการณ์เกิดช้ากว่าที่คาดก่อนบอกเหตุการณ์',
      ex('It wasn’t until midnight that we found a room.', 'กว่าจะเจอห้องพักก็เที่ยงคืนแล้ว', 'ย้ายเวลามาเป็นจุดเน้นและตาม that ด้วยประโยคบอกสิ่งที่เกิดขึ้น'),
      ex('It wasn’t until we got home that I noticed the scratch.', 'กว่าจะสังเกตเห็นรอยก็กลับถึงบ้านแล้ว', 'ใช้ทั้งประโยคอดีตระบุจุดเปลี่ยนหลัง until ได้'),
      [slot('milestone', 'เวลาหนึ่งจุดหรือประโยคอดีต', 'we got home'), slot('past event', 'ประโยคบอกสิ่งที่เพิ่งเกิดขึ้น ณ จุดนั้น', 'I noticed the scratch')]),
    pat('I went to [place] expecting to [plan], only to [surprise].', 'ฉันไป… คิดว่าจะ… แต่กลับ…',
      'narrative', 'neutral', 'วาง only to หลังเหตุการณ์แรกเพื่อเปิดเผยผลที่สวนกับความคาดหมาย',
      ex('I went to the station expecting to catch the last train, only to find the gates locked.', 'ฉันไปสถานีโดยคิดว่าจะขึ้นรถไฟเที่ยวสุดท้าย แต่กลับพบว่าประตูล็อกอยู่', 'Expecting to เก็บความตั้งใจเดิมไว้ก่อนเผยผลด้วย only to'),
      ex('I went to the shop expecting to buy a charger, only to learn they’d stopped selling that model.', 'ฉันไปร้านคิดว่าจะซื้อที่ชาร์จ แต่กลับได้รู้ว่าเขาเลิกขายรุ่นนั้นแล้ว', 'Only to เชื่อมสิ่งที่พบภายหลังและขัดกับความคาดหวัง'),
      [slot('place', 'สถานที่ที่เดินทางไป', 'the shop'), slot('plan', 'V1 ที่บอกสิ่งที่คิดจะทำ', 'buy a charger'), slot('surprise', 'V1 ที่บอกสิ่งที่เกิดขึ้นจริงและสวนความคาดหมาย', 'learn they’d stopped selling that model')]),
    pat('The next thing I knew, [sudden event].', 'รู้ตัวอีกที…',
      'narrative', 'informal', 'ข้ามจากฉากหนึ่งไปสู่เหตุการณ์ใหม่ที่เกิดเร็วหรือไม่คาดคิด',
      ex('The next thing I knew, everyone was singing.', 'รู้ตัวอีกทีทุกคนก็ร้องเพลงกันแล้ว', 'วลีแรกชวนให้รู้ว่าผู้เล่าตามการเปลี่ยนจังหวะแทบไม่ทัน'),
      ex('The next thing I knew, I was standing on stage.', 'รู้ตัวอีกทีฉันก็ยืนอยู่บนเวทีแล้ว', 'มักตามด้วยสิ่งที่เกิดขึ้นหรือสภาพที่ผู้เล่าเพิ่งรู้ตัว'),
      [slot('sudden event', 'ประโยคอดีตบอกเหตุการณ์ที่เปลี่ยนเร็ว', 'I was standing on stage')]),
    pat('What I didn’t realize at the time was [fact].', 'สิ่งที่ตอนนั้นฉันไม่รู้คือ…',
      'narrative', 'neutral', 'เปิดเผยข้อมูลที่เปลี่ยนความเข้าใจเมื่อมองย้อนกลับไป',
      ex('What I didn’t realize at the time was that we were at the wrong station.', 'ที่ตอนนั้นฉันไม่รู้คือเราอยู่ผิดสถานี', 'แยกสิ่งที่ผู้เล่ารู้ตอนนี้ออกจากสิ่งที่รู้ขณะเกิดเหตุ'),
      ex('What I didn’t realize at the time was how close we were to missing the bus.', 'ตอนนั้นฉันไม่รู้เลยว่าเราเกือบตกรถขนาดไหน', 'ใช้ how-clause ระบุระดับของสิ่งที่เพิ่งเข้าใจทีหลัง'),
      [slot('fact', 'that-clause หรือ how-clause ของข้อมูลที่เพิ่งเข้าใจ', 'that we were at the wrong station')]),
  ],
  'm9-08': [
    pat('Under the hood, [mechanism].', 'เบื้องหลังระบบ…',
      'technical explanations', 'informal', 'วางต้นประโยคเมื่อกำลังลงรายละเอียดการทำงานภายใน',
      ex('Under the hood, the app stores a copy of each lesson.', 'เบื้องหลังแอปเก็บสำเนาของแต่ละบทไว้', 'วลีนี้ชี้ว่ากำลังอธิบายสิ่งที่ระบบทำเองโดยผู้ใช้อาจมองไม่เห็น'),
      ex('Under the hood, the filter compares each word with the local index.', 'เบื้องหลังตัวกรองจะเทียบแต่ละคำกับดัชนีที่เก็บในเครื่อง', 'เหมาะกับคนที่ขอฟังวิธีทำงานภายในต่อจากผลที่เห็น'),
      [slot('mechanism', 'ประโยคเต็มอธิบายการทำงานภายในจริง', 'the app stores a copy of each lesson')],
      ['Internally, …']),
    pat('To put a number on it, [measurement].', 'ถ้าบอกเป็นตัวเลข…',
      'technical explanations', 'neutral', 'ใช้ต่อจากข้ออธิบายกว้างเพื่อระบุขนาดที่วัดได้',
      ex('To put a number on it, the search took about two seconds in our test.', 'ถ้าบอกเป็นตัวเลข ตอนทดสอบใช้ค้นหาประมาณสองวินาที', 'ใช้หลังพูดว่าการค้นหาเร็วหรือช้าเพื่อให้คนฟังเห็นช่วงเวลา'),
      ex('To put a number on it, we processed twelve files in one batch.', 'ถ้าอธิบายเป็นตัวเลข เราประมวลผลสิบสองไฟล์ในหนึ่งชุด', 'ตามด้วยตัวเลขที่มีหน่วยหรือกรอบการวัดเพื่อให้ตีความได้'),
      [slot('measurement', 'ประโยคเต็มที่มีผลวัดหรือขนาดพร้อมบริบท', 'we processed twelve files in one batch')]),
    pat('What this lets you do is [base verb phrase].', 'สิ่งที่วิธีนี้ช่วยให้คุณทำได้คือ…',
      'technical explanations', 'neutral', 'เน้นสิ่งที่ผู้ใช้ทำได้จากเหตุหรือความสามารถที่อธิบายไป',
      ex('What this lets you do is compare the two versions side by side.', 'สิ่งที่วิธีนี้ช่วยให้ทำได้คือเทียบสองรุ่นข้างกัน', 'สรุปผลในมุมผู้ใช้หลังพูดกลไกมาแล้ว'),
      ex('What this lets you do is open a lesson even when the train goes through a tunnel.', 'สิ่งที่วิธีนี้ช่วยให้ทำได้คือเปิดบทเรียนแม้รถไฟวิ่งเข้าอุโมงค์', 'ตาม is ด้วยกริยารูปพื้นฐานเพื่อระบุกิจกรรมที่ทำได้'),
      [slot('base verb phrase', 'V1 พร้อมส่วนขยายของความสามารถที่อธิบาย', 'compare the two versions side by side')]),
    pat('If [normal path] fails, [backup] kicks in.', 'ถ้า… ทำงานไม่ได้ … จะเริ่มทำงานแทน',
      'technical explanations', 'informal', 'พูดถึงกลไกสำรองที่เริ่มทำงานเมื่อเหตุการณ์หนึ่งเกิดขึ้น',
      ex('If the main connection fails, the backup connection kicks in.', 'ถ้าการเชื่อมต่อหลักล้ม การเชื่อมต่อสำรองจะเริ่มทำงาน', 'Kick in เน้นจังหวะที่กลไกเริ่มส่งผล โดยผัน kicks ตามประธานเอกพจน์'),
      ex('If the automatic check fails, the manual review step kicks in.', 'ถ้าตรวจอัตโนมัติไม่ผ่าน ขั้นตรวจด้วยคนจะเริ่มขึ้น', 'ใช้กับขั้นตอนสำรองได้ทั้งระบบอัตโนมัติและกระบวนการทำงาน'),
      [slot('normal path', 'ชื่อระบบหรือขั้นตอนหลักเอกพจน์', 'the automatic check'), slot('backup', 'สิ่งที่เริ่มทำงานแทนในรูปเอกพจน์', 'the manual review step')],
      ['The backup takes over.']),
  ],
  'm10-01': [
    pat('I heard it as [perceived phrase], but [speaker] said [actual phrase].',
      'ฉันได้ยินเป็น… แต่ผู้พูดพูดว่า…', 'listening', 'neutral', 'ใช้จดความต่างหลังเช็กเสียงกับซับหรือถามผู้พูด',
      ex('I heard it as “fifteen,” but she said “fifty.”', 'ฉันได้ยินเป็นสิบห้า แต่เธอพูดว่าห้าสิบ', 'As นำคำที่สมองตีความจากเสียง ส่วน said ใช้ยืนยันคำที่พูดจริง'),
      ex('I heard it as “we’d left,” but he said “we left.”', 'ฉันได้ยินเป็น we’d left แต่เขาพูดว่า we left', 'ใช้เทียบรูปย่อที่เปลี่ยนโครงสร้างกับรูปที่ออกเสียงจริง'),
      [slot('perceived phrase', 'ยกคำหรือกลุ่มคำที่คิดว่าได้ยิน', 'fifteen'), slot('speaker', 'ผู้พูดในต้นฉบับ', 'she'), slot('actual phrase', 'คำที่ตรวจแล้วว่าพูดจริง', 'fifty')]),
    pat('If I heard that correctly, [confirmation].', 'ถ้าฉันได้ยินถูก…',
      'listening', 'neutral', 'ใช้ทวนสิ่งที่ได้ยินเมื่อไม่แน่ใจว่าจับรายละเอียดครบ',
      ex('If I heard that correctly, the gate opens at six.', 'ถ้าฉันได้ยินถูก ประตูเปิดตอนหกโมง', 'วลี if จำกัดว่าข้อสรุปขึ้นกับการได้ยินและเปิดโอกาสให้แก้'),
      ex('If I heard that correctly, she wants to meet outside.', 'ถ้าฉันได้ยินถูก เธออยากเจอกันข้างนอก', 'ทวนรายละเอียดที่สำคัญต่อสิ่งที่จะทำต่อ'),
      [slot('confirmation', 'ประโยคเต็มสรุปสิ่งที่ได้ยิน', 'the gate opens at six')]),
  ],
  'm10-05': [
    pat('There’s a pause after [quoted word or phrase].', 'มีช่วงหยุดหลังคำหรือวลี…',
      'listening', 'neutral', 'บอกจุดแบ่งกลุ่มเสียงจากตัวอย่างที่กำลังฟังหรือฝึกพูดตาม',
      ex('There’s a pause after “actually.”', 'มีช่วงเว้นหลัง actually', 'There’s ใช้ชี้ว่ามีช่วงพักอยู่ตำแหน่งหนึ่ง และ after ระบุตำแหน่งนั้น'),
      ex('There’s a pause after “when we arrived.”', 'มีช่วงเว้นหลัง when we arrived', 'ฟังช่วงพักหลังวลีย่อยเพื่อหาแนวแบ่งกลุ่มความหมาย'),
      [slot('quoted word or phrase', 'ยกคำหรือวลีที่อยู่ก่อนจังหวะพัก', 'actually')]),
    pat('The bit I keep hearing is [quoted chunk].', 'ช่วงที่ฉันได้ยินซ้ำคือ…',
      'listening', 'informal', 'ใช้ชี้กลุ่มคำที่ได้ยินบ่อยหรือเด่นในช่วงที่กำลังฝึก',
      ex('The bit I keep hearing is “as long as.”', 'ช่วงที่ฉันได้ยินซ้ำคือ as long as', 'The bit ใช้อ้างถึงส่วนเล็ก ๆ ของเสียงหรือประโยคในภาษาแบบสนทนา'),
      ex('The bit I keep hearing is “did you notice.”', 'ช่วงที่ฉันได้ยินซ้ำคือ did you notice', 'Keep hearing ชี้ว่ากลุ่มคำนี้ได้ยินซ้ำหรือจำจากเสียงได้ซ้ำ'),
      [slot('quoted chunk', 'คำหรือกลุ่มคำที่ได้ยินและต้องการอ้างตรง ๆ', 'did you notice')]),
  ],
}

export const conversationPatterns: Pattern[] = drafts.flatMap((lesson) => [
  ...lesson.patterns.map((pattern, index) => ({
    ...pattern, id: `${lesson.id}-p${index + 1}`, lessons: [lesson.id], tags: lesson.tags,
  })),
  ...(extraPatterns[lesson.id] ?? []).map((pattern, index) => ({
    ...pattern, id: `${lesson.id}-extra${index + 1}`, lessons: [lesson.id], tags: lesson.tags,
  })),
])

export const conversationLessons: Lesson[] = drafts.map(({ patterns, practice, ...lesson }) => ({
  ...lesson,
  examples: patterns.flatMap((pattern) => pattern.examples),
  exercises: practice.map((exercise, index) => ({ ...exercise, id: `${lesson.id}-e${index + 1}` })),
  review: conversationPatterns.filter((pattern) => pattern.lessons.includes(lesson.id)).map(({ id }) => id),
}))
