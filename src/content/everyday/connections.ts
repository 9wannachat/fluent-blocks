import type { EverydayConnection, EverydayWorkshop } from '../../domain/everyday'

export const connections: EverydayConnection[] = [
  { itemId: 'everyday-word-pour', senseId: 'everyday-use', relatedIds: ['everyday-compare-pour-spill', 'everyday-collocation-pour-into', 'everyday-pattern-careful-not-to', 'everyday-activity-say-coffee-spilled'], workshopId: 'pour' },
  { itemId: 'everyday-word-wear', senseId: 'everyday-use', relatedIds: ['everyday-compare-wear-put-on', 'everyday-phrase-put-on'], workshopId: 'wear' },
  { itemId: 'everyday-phrase-take-off', senseId: 'clothing', relatedIds: ['everyday-compare-take-off-remove', 'everyday-word-take-off'], workshopId: 'take-off' },
  { itemId: 'everyday-word-take-off', senseId: 'everyday-use', relatedIds: ['everyday-compare-take-off-remove', 'everyday-phrase-take-off'], workshopId: 'take-off' },
  { itemId: 'everyday-word-take-off', senseId: 'leave-the-ground', relatedIds: ['everyday-phrase-take-off:flight'] },
  { itemId: 'everyday-phrase-take-off', senseId: 'flight', relatedIds: ['everyday-word-take-off:leave-the-ground'] },
  { itemId: 'everyday-word-grab', senseId: 'get-food-casually', relatedIds: ['everyday-collocation-grab-a-bite'] },
  { itemId: 'everyday-word-spill', senseId: 'everyday-use', relatedIds: ['everyday-compare-pour-spill', 'everyday-compare-spill-overflow', 'everyday-collocation-spill-coffee', 'everyday-activity-say-coffee-spilled'] },
  { itemId: 'everyday-word-wipe', senseId: 'everyday-use', relatedIds: ['everyday-collocation-wipe-the-counter', 'everyday-activity-describe-cleanup'] },
  { itemId: 'everyday-word-rinse', senseId: 'everyday-use', relatedIds: ['everyday-collocation-rinse-with-water', 'everyday-activity-describe-cleanup'] },
  { itemId: 'everyday-word-fold', senseId: 'everyday-use', relatedIds: ['everyday-collocation-fold-the-laundry'] },
  { itemId: 'everyday-word-annoyed', senseId: 'everyday-use', relatedIds: ['everyday-compare-annoyed-angry', 'everyday-pattern-feel-adjective-when'] },
  { itemId: 'everyday-word-confused', senseId: 'everyday-use', relatedIds: ['everyday-compare-confusing-confused', 'everyday-pattern-find-something-confusing'] },
  { itemId: 'everyday-phrase-run-out', senseId: 'run-out-of', relatedIds: ['everyday-collocation-run-out-of-time', 'everyday-pattern-in-case-purpose'] },
]

export const workshops: EverydayWorkshop[] = [
  {
    id: 'pour', title: 'รินน้ำให้เพื่อน', situation: 'คุณกำลังรินน้ำอยู่หรือรินเสร็จแล้ว เลือกสิ่งที่อยากบอกเพื่อน',
    builderPreset: 'pour',
    expansion: {
      base: 'I’m pouring water.', meaning: 'ฉันกำลังรินน้ำ',
      steps: [
        { id: 'time', title: 'อยากบอกว่ากำลังทำหรือทำเสร็จแล้ว', choices: [
          { id: 'now', label: 'กำลังริน', fragments: { replace: { from: 'I’m pouring', to: 'I’m still pouring' } }, explanation: 'still อยู่หลัง am เพื่อบอกว่ายังทำอยู่ ส่วน pouring เป็นรูป -ing' },
          { id: 'done', label: 'รินเสร็จแล้ว', fragments: { replace: { from: 'I’m pouring', to: 'I’ve already poured' } }, explanation: 'have + poured เชื่อมผลกับตอนนี้ วาง already ระหว่าง have กับ V3' },
        ] },
        { id: 'destination', title: 'น้ำไหลไปที่ไหน', choices: [
          { id: 'glass', label: 'into the glass', fragments: { after: 'into the glass' }, explanation: 'ใช้ into เพื่อบอกว่าน้ำไหลเข้าไปในแก้ว' },
          { id: 'jug', label: 'into the jug', fragments: { after: 'into the jug' }, explanation: 'กลุ่ม into + ภาชนะ แสดงปลายทางของน้ำ' },
        ] },
      ],
    },
    exercise: {
      id: 'everyday-workshop-pour-production', kind: 'translate',
      prompt: 'บอกเพื่อนว่า “ฉันรินน้ำใส่แก้วแล้ว” ให้ใช้ present perfect',
      answers: ['I’ve poured water into the glass.', 'I have poured water into the glass.', 'I’ve already poured water into the glass.', 'I have already poured water into the glass.'],
      hint: 'have + V3 แล้วระบุภาชนะด้วย into',
      explanation: 'poured ตามหลัง have ส่วน into ชี้ว่าน้ำเข้าไปในแก้ว',
      feedback: { 'I’ve pouring water into the glass.': 'หลัง have ใน present perfect ใช้ V3 ส่วน pouring ใช้ตามหลัง be เมื่อบอกว่ากำลังริน' },
      selfCheck: ['ใช้ have หรือ I’ve แล้วตามด้วย poured', 'ระบุว่าน้ำไหลเข้าไปในแก้วด้วย into'],
    },
  },
  {
    id: 'wear', title: 'บอกว่าใส่อะไรอยู่', situation: 'เพื่อนถามว่าคุณใส่แว่นเป็นประจำหรือใส่อยู่ตอนนี้',
    builderPreset: 'wear',
    expansion: {
      base: 'I wear glasses.', meaning: 'ฉันใส่แว่นเป็นประจำ',
      steps: [
        { id: 'time', title: 'เลือกความหมายที่อยากบอก', choices: [
          { id: 'habit', label: 'ปกติใส่แว่น', fragments: { replace: { from: 'wear', to: 'usually wear' } }, explanation: 'usually อยู่หน้ากริยาหลัก wear เมื่อต้องการบอกกิจวัตร' },
          { id: 'now', label: 'กำลังใส่แว่นอยู่', fragments: { replace: { from: 'I wear', to: 'I’m wearing' } }, explanation: 'am + wearing บอกสิ่งที่สวมอยู่ตอนนี้' },
        ] },
        { id: 'place', title: 'เติมสถานที่', choices: [
          { id: 'work', label: 'at work', fragments: { after: 'at work' }, explanation: 'เติม at work ท้ายประโยคเพื่อบอกว่าใส่แว่นที่ทำงาน' },
          { id: 'home', label: 'at home', fragments: { after: 'at home' }, explanation: 'เติมสถานที่หลังสิ่งที่สวมอยู่' },
        ] },
      ],
    },
    exercise: {
      id: 'everyday-workshop-wear-production', kind: 'translate',
      prompt: 'เขียนคำตอบให้เพื่อนว่า “ตอนนี้ฉันใส่แว่นอยู่”',
      answers: ['I’m wearing glasses now.', 'I am wearing glasses now.', 'I’m wearing my glasses right now.', 'I am wearing my glasses right now.', 'I’m wearing glasses.'],
      hint: 'ใช้ am + wearing เพื่อบอกสิ่งที่สวมอยู่',
      explanation: 'wearing บอกสภาพที่กำลังสวมอยู่ ส่วน putting on หมายถึงกำลังเอาแว่นขึ้นมาสวม',
      feedback: { 'I’m putting on my glasses now.': 'ประโยคนี้ใช้ได้เมื่อกำลังเอาแว่นขึ้นมาสวม โจทย์ถามว่าใส่อยู่แล้วหรือเปล่า' },
      selfCheck: ['ให้คนฟังเข้าใจว่าคุณสวมแว่นอยู่แล้ว', 'ใช้ am + wearing เพื่อเน้นเวลาตอนนี้'],
    },
  },
  {
    id: 'take-off', title: 'ขอให้ถอดรองเท้า', situation: 'รองเท้าเปียกและเพื่อนรู้แล้วว่าคุณพูดถึงรองเท้าคู่นั้น',
    expansion: {
      base: 'Take off your shoes.', meaning: 'ถอดรองเท้า',
      steps: [
        { id: 'object', title: 'จะเรียกชื่อสิ่งของหรือใช้สรรพนาม', choices: [
          { id: 'noun', label: 'วาง your shoes ตรงกลาง', fragments: { replace: { from: 'off your shoes', to: 'your shoes off' } }, explanation: 'คำนามเต็มอย่าง your shoes วางหลัง off หรือคั่น take กับ off ได้' },
          { id: 'pronoun', label: 'ใช้ them', fragments: { replace: { from: 'off your shoes', to: 'them off' } }, explanation: 'them แทนรองเท้าและต้องอยู่ระหว่าง take กับ off ในความหมายถอด' },
        ] },
        { id: 'place', title: 'ระบุจุดที่ให้ถอด', choices: [
          { id: 'door', label: 'at the door', fragments: { after: 'at the door' }, explanation: 'วางกลุ่มบอกสถานที่ต่อท้ายวลี take … off' },
          { id: 'outside', label: 'outside', fragments: { after: 'outside' }, explanation: 'outside เติมท้ายประโยคเพื่อระบุให้ถอดข้างนอก' },
        ] },
      ],
    },
    exercise: {
      id: 'everyday-workshop-take-off-production', kind: 'translate',
      prompt: 'ขอให้เพื่อนถอดรองเท้าตรงประตู โดยใช้ them แทนรองเท้า',
      answers: ['Take them off at the door.', 'Please take them off at the door.', 'Can you take them off at the door?', 'Could you take them off at the door?'],
      hint: 'วาง them ระหว่างกริยากับ particle',
      explanation: 'them เป็นสรรพนามกรรม จึงใช้ take them off ส่วน at the door ขยายสถานที่',
      feedback: { 'Take off them at the door.': 'เมื่อใช้สรรพนามกรรม them ต้องวางระหว่าง take กับ off' },
      selfCheck: ['ให้ them อ้างถึงรองเท้าที่คุยกันอยู่', 'คั่น them ระหว่าง take กับ off ก่อนเติมสถานที่'],
    },
  },
]
