export const scenarioFeedback: Record<string, Record<string, Record<string, string>>> = {
  airport: {
    'one-bag': { 'A aisle seat, please.': 'ใช้ an หน้า aisle เพราะขึ้นต้นด้วยเสียงสระ' },
    'carry-on': { 'Which gate does my flight leaves from?': 'หลัง does ใช้ leave รูปฐาน คำถามนี้คง from ไว้เพื่อถามประตูที่เที่ยวบินออก' },
  },
  hotel: {
    booked: { 'Could you to hold my bags until the room is ready?': 'หลัง could ใช้ hold ได้ทันที และ until บอกระยะเวลาที่อยากฝาก' },
    'walk-in': { 'Does that includes breakfast?': 'does ผันให้ประธาน that แล้ว จึงใช้ include รูปฐาน' },
  },
  directions: {
    walking: { 'I turn to left at the lights after I pass the bank?': 'ใช้ turn left โดยไม่ต้องใส่ to เมื่อต้องการบอกทิศที่เลี้ยว' },
    bus: { 'Is the bus stop across the library?': 'ใช้ across from เพื่อบอกว่าอยู่ตรงข้ามอาคาร ส่วน across the street บอกว่าข้ามฝั่งถนน' },
  },
  'shopping-clothes': {
    try: { 'It’s too tightly around the shoulders.': 'หลัง It is ใช้ adjective tight เพื่อบอกสภาพเสื้อ ส่วน tightly เป็น adverb' },
    size: { 'Yes, please. Where the fitting room is?': 'คำถามตรงใช้ Where is the fitting room? วาง is ก่อน the fitting room' },
  },
  'shopping-refund': {
    refund: { 'It won’t turns on.': 'หลัง will หรือ won’t ใช้ turn รูปฐาน อย่าลืม on เพื่อบอกว่าเปิดเครื่อง' },
    proof: { 'I’d prefer refund, please.': 'เติม a หน้า refund เมื่อขอการคืนเงินหนึ่งรายการ' },
  },
  'shopping-delivery': {
    tracking: { 'Yes, I’ve check the front desk.': 'หลัง have ใน present perfect ใช้ V3 ซึ่งคือ checked' },
    place: { 'I has the tracking number here.': 'กับประธาน I ใช้ have เพื่อบอกว่ามีเลขพร้อมให้' },
  },
  'dining-order': {
    main: { 'I’ll to have rice, please.': 'หลัง will ใช้ have รูปฐานโดยไม่มี to' },
    drink: { 'I’d likes still water, please.': 'หลัง would หรือ ’d ใช้ like รูปฐาน ส่วน still water หมายถึงน้ำไม่อัดก๊าซ' },
  },
  'dining-ingredients': {
    direct: { 'I’m allergic with peanuts.': 'ใช้ allergic to ตามด้วยชื่อสิ่งที่แพ้' },
    'ask-kitchen': { 'Could you ask whether does the sauce contain peanuts?': 'หลัง whether ในคำถามซ้อนใช้ลำดับประธานก่อนกริยา และผัน contains ตาม the sauce' },
  },
  'dining-bill': {
    bill: { 'Please splits it evenly.': 'คำขอที่ขึ้นต้นด้วย please ใช้ split รูปฐาน และ evenly บอกว่าแบ่งเท่า ๆ กัน' },
    check: { 'We’d like to pay separate.': 'ใช้ separately ขยายกริยา pay' },
  },
  'lost-luggage': {
    missing: { 'It’s black suitcase with a red tag.': 'เติม a หน้า black suitcase เพราะกำลังระบุกระเป๋าหนึ่งใบ' },
    tag: { 'I was in flight 214.': 'ใช้ on กับเที่ยวบินที่โดยสาร เช่น on flight 214' },
  },
  'hotel-booking': {
    confirmation: { 'The booking reference it is AB241.': 'The booking reference เป็นประธานอยู่แล้ว ตัด it ที่ซ้ำออก' },
    spell: { 'The last name are Lee, spelled L-E-E.': 'the last name เป็นประธานเอกพจน์ จึงใช้ is ก่อนชื่อ Lee' },
  },
  'medical-assistance': {
    doctor: { 'I feel dizzy and nausea.': 'ใช้ nauseous เป็นคำคุณศัพท์คู่กับ dizzy หรือใช้ I feel dizzy and I have nausea' },
    interpreter: { 'My headache start this morning.': 'ใช้ started เมื่อเล่าว่าอาการเริ่มไปแล้วเมื่อเช้า' },
  },
}
