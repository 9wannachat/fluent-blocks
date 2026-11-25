import { authorLesson } from './authoring'

const a = authorLesson(
  'm5-01', 'Frequency adverbs', 'วางคำบอกความถี่', 'นัดเจอเพื่อนได้ง่ายขึ้นเมื่อบอกว่าปกติว่างตอนไหน',
  'วางคำบอกความถี่ในประโยคที่มี be กริยาทั่วไป และกริยาช่วย',
  'Usually หรือ often มักอยู่ก่อนกริยาทั่วไป แต่อยู่หลัง be เมื่อ be เป็นกริยาหลัก เมื่อมีกริยาช่วย มักอยู่หลังตัวแรก คำอย่าง sometimes ย้ายไปต้นหรือท้ายได้เพื่อปรับจังหวะ ส่วน always มักอยู่กลางประโยค',
  'subject + frequency + lexical verb | subject + be + frequency + complement | auxiliary + frequency + main verb',
  [
    ['I usually walk to work.', 'ปกติฉันเดินไปทำงาน', 'usually อยู่ก่อน walk'],
    ['She’s often early.', 'เธอมักมาก่อนเวลา', 'often อยู่หลัง is'],
    ['I’ve never tried it.', 'ฉันยังไม่เคยลอง', 'never อยู่ระหว่าง have กับ tried'],
    ['We don’t usually eat this late.', 'ปกติเราไม่กินดึกขนาดนี้', 'don’t usually คือปกติไม่ได้ทำ'],
    ['Sometimes I work from home.', 'บางครั้งฉันทำงานจากบ้าน', 'เปิดด้วย sometimes เพื่อเกริ่นความถี่'],
  ],
  [['I’m usually free.', 'I usually finish early.', 'free ตามหลัง be ส่วน finish เป็นกริยาที่ usually ขยาย'], ['I don’t always call.', 'I always forget to call.', 'don’t always คือโทรบ้าง ส่วน always forget บอกว่าลืมตลอด']],
  [['Do you usually drive?', 'ปกติคุณขับรถมาไหม'], ['Not really. I often take the bus.', 'ไม่ค่อยนะ ฉันมักขึ้นรถเมล์']],
  [['She is late often to class.', 'She is often late to class.', 'วาง often หลัง is เพื่อให้ late to class อยู่ด้วยกันในประโยคนี้']],
  [
    ['เลือกประโยคที่บอกว่าปกติเขาโทรหลังอาหารเย็น', 'He usually calls after dinner.', 'โทรเป็นกริยาทั่วไป', 'usually วางก่อน calls', ['He calls usually after dinner.', 'He usually calls after dinner.', 'He is usually calls after dinner.']],
    ['They’re ___ tired on Mondays. เติมคำว่า “บ่อย”', 'often', 'อยู่หลัง are ในรูปย่อ', 'often ขยายว่าความเหนื่อยเกิดบ่อย'],
    ['เติม never ใน I’ve seen snow.', 'I’ve never seen snow.', 'หากริยาช่วย have ก่อน', 'never อยู่ระหว่าง have และ seen'],
    ['แปล “บางครั้งฉันกินข้าวที่โต๊ะทำงาน” โดยใช้ sometimes', ['Sometimes I eat at my desk.', 'I sometimes eat at my desk.', 'I eat at my desk sometimes.'], 'sometimes อยู่ได้หลายตำแหน่ง', 'ทั้งต้น กลาง และท้ายล้วนสื่อความถี่ในบริบทนี้'],
    ['แก้ประโยค She usually is works late. โดยเก็บ usually', 'She usually works late.', 'works มีกริยาของตัวเองแล้ว', 'วาง usually ก่อน works และเอา is ออก'],
  ], 'อธิบายสัปดาห์ปกติของคุณด้วย usually, sometimes และ never แล้วลองถามความถี่ของอีกคน',
  [
    ['I tend to + base verb', 'ฉันมักจะ…', 'daily life', 'base verb', 'บอกแนวโน้มส่วนตัว ใช้กริยารูป base หลัง to', ['I tend to wake up early.', 'ฉันมักตื่นเช้า', 'เล่ากิจวัตร'], ['I tend to talk fast when I’m nervous.', 'ฉันมักพูดเร็วเวลาประหม่า', 'เล่าพฤติกรรมตัวเอง'], 'tend to อยู่ก่อนกิจกรรม', 'neutral', 'I usually… ใช้บอกความถี่ได้ตรงกว่า'],
    ['Most of the time, + clause', 'ส่วนใหญ่แล้ว…', 'daily life', 'clause', 'บอกสิ่งที่เกิดเป็นส่วนใหญ่แต่มีข้อยกเว้น', ['Most of the time, I cook at home.', 'ส่วนใหญ่ฉันทำอาหารที่บ้าน', 'เล่านิสัยการกิน'], ['Most of the time, the trains run on schedule.', 'ส่วนใหญ่รถไฟมาตรงเวลา', 'อธิบายการเดินทาง'], 'วางต้นประโยคเมื่อต้องตั้งกรอบความถี่'],
    ['I hardly ever + base verb', 'ฉันแทบไม่เคย…', 'daily life', 'base verb', 'hardly ever มีความหมายเชิงปฏิเสธในตัวอยู่แล้ว', ['I hardly ever buy coffee on weekdays.', 'วันธรรมดาฉันแทบไม่ซื้อกาแฟ', 'คุยเรื่องค่าใช้จ่าย'], ['I hardly ever watch TV these days.', 'ช่วงนี้ฉันแทบไม่ดูทีวี', 'คุยเรื่องเวลาว่าง'], 'วางหน้า buy หรือ watch'],
  ], ['m2-06'],
)

const b = authorLesson(
  'm5-02', 'Degree and really', 'บอกระดับด้วย really', 'หนังดีอยู่แล้ว แต่ถ้าจะบอกว่าประทับใจมากจะวาง really ตรงไหน',
  'แยก really ที่ขยายระดับออกจาก really ที่ใช้ถามเพื่อยืนยัน',
  'Really ขยาย adjective หรือกริยาได้ Very มักขยาย adjective หรือ adverb เช่น very quiet และ very slowly เมื่อเติม not ตำแหน่งของ really ส่งผลต่อความหมาย not really มักเป็นการปฏิเสธเบา ๆ ส่วน really not เพิ่มน้ำหนักให้การปฏิเสธ',
  'really + adjective/verb | very + adjective/adverb | not really + verb/adjective',
  [
    ['It’s really quiet here.', 'ที่นี่เงียบมาก', 'เพิ่มระดับของ quiet'],
    ['I really like this place.', 'ฉันชอบที่นี่มาก', 'เน้นความชอบ'],
    ['She spoke very slowly.', 'เธอพูดช้ามาก', 'very ขยาย adverb slowly'],
    ['I don’t really mind.', 'ฉันไม่ค่อยถือสาอะไร', 'ลดน้ำหนักคำปฏิเสธ'],
    ['Really? I didn’t know that.', 'จริงเหรอ ฉันไม่รู้เลย', 'ใช้ alone เพื่อแสดงความประหลาดใจ'],
  ],
  [['I’m not really hungry.', 'I’m really not hungry.', 'แบบแรกหิวไม่ค่อยมาก แบบหลังย้ำว่าไม่ได้หิวจริง ๆ'], ['I very much enjoyed it.', 'I really enjoyed it.', 'ทั้งคู่ขยาย enjoyed โดย very much มีน้ำเสียงค่อนข้างเป็นทางการ']],
  [['Do you like it?', 'คุณชอบไหม'], ['Yeah, it’s really good.', 'ชอบ ดีมากเลย']],
  [['I very like it.', 'I really like it.', 'very ตัวเดียวไม่ขยาย like โดยตรง']],
  [
    ['เลือกข้อความที่ใช้ very ขยายคำถูกตำแหน่ง', 'It’s very useful.', 'หา adjective', 'very ขยาย useful', ['I very enjoy it.', 'It’s very useful.', 'She very knows me.']],
    ['I ___ enjoyed the talk. เติม really หรือ very', 'really', 'enjoyed เป็นกริยา', 'really อยู่ก่อน enjoyed'],
    ['เติม really ใน I’m not upset. ให้ฟังเป็นการย้ำว่าไม่ได้โกรธ', 'I’m really not upset.', 'ให้ really ขยาย not upset ทั้งกลุ่ม', 'really not ย้ำการปฏิเสธมากกว่า not really'],
    ['แปล “ฉันชอบเพลงนี้มาก” โดยใช้ really', 'I really like this song.', 'like เป็นกริยาทั่วไป', 'วาง really ก่อน like'],
    ['แก้ I very miss the beach. โดยใช้ really', 'I really miss the beach.', 'miss เป็นกริยา', 'really ขยาย miss ได้'],
  ], 'เลือกสิ่งที่คุณชอบและสิ่งที่ไม่ค่อยชอบ พูดอย่างละประโยคด้วย really หรือ not really',
  [
    ['I really appreciate + noun', 'ฉันซาบซึ้งหรือขอบคุณมากสำหรับ…', 'agreement', 'noun phrase', 'ใช้ขอบคุณอย่างจริงใจ เมื่อระบุสิ่งที่คนอื่นทำให้', ['I really appreciate your help.', 'ขอบคุณมากที่ช่วย', 'เพื่อนร่วมงานช่วยแก้ปัญหา'], ['I really appreciate the feedback.', 'ขอบคุณมากสำหรับคำติชม', 'ได้รับความเห็นหลังนำเสนอ'], 'really อยู่ก่อน appreciate'],
    ['I’m not particularly + adjective', 'ฉันไม่ได้…เป็นพิเศษ', 'opinion', 'adjective', 'ปฏิเสธระดับความรู้สึกแบบนุ่มนวล', ['I’m not particularly worried.', 'ฉันไม่ได้กังวลเป็นพิเศษ', 'คุยเรื่องแผนที่ยังไม่แน่นอน'], ['I’m not particularly keen on seafood.', 'ฉันไม่ได้ชอบอาหารทะเลเป็นพิเศษ', 'เลือกเมนูกับเพื่อน'], 'particularly อยู่หลัง not'],
    ['That’s quite + adjective', 'นั่นค่อนข้าง…', 'opinion', 'adjective', 'quite ขยายระดับ ความหนักเบาขึ้นกับ adjective และสำเนียง', ['That’s quite common here.', 'ที่นี่พบแบบนั้นค่อนข้างบ่อย', 'อธิบายธรรมเนียม'], ['That’s quite expensive for a weekday.', 'ราคาค่อนข้างแพงสำหรับวันธรรมดา', 'ดูที่พัก'], 'quite อยู่ก่อน adjective'],
  ],
)

const c = authorLesson(
  'm5-03', 'Negation and probability', 'วางคำบอกความเป็นไปได้และการปฏิเสธ', 'การบอกว่าน่าจะไม่ได้ไป ช่วยให้เพื่อนเข้าใจว่าคุณยังไม่ได้ตัดสินใจแน่นอน',
  'บอกการคาดการณ์ทั้งบวกและลบด้วย probably และเลือกระดับความแน่ใจ',
  'Probably บอกว่าสิ่งนั้นค่อนข้างน่าจะเป็นไปได้ ในประโยคบวกมักตาม be หรือกริยาช่วย แล้วตามด้วยส่วนสำคัญ ถ้าคาดว่าบางอย่างไม่เกิด รูป probably won’t และ probably isn’t พบบ่อยเพราะ probably ครอบใจความเชิงลบ',
  'subject + auxiliary + probably + verb | subject + probably + negative auxiliary + verb',
  [
    ['She’ll probably call later.', 'เธอน่าจะโทรมาทีหลัง', 'probably ตาม will'],
    ['She probably won’t call tonight.', 'คืนนี้เธอน่าจะไม่โทรมา', 'คาดว่าเหตุการณ์ไม่เกิด'],
    ['He’s probably at home.', 'เขาน่าจะอยู่บ้าน', 'probably อยู่หลัง be'],
    ['They probably haven’t heard.', 'พวกเขาน่าจะยังไม่ได้ข่าว', 'probably ครอบ haven’t heard'],
    ['Maybe I’ll come by later.', 'เดี๋ยวฉันอาจแวะไป', 'maybe เปิดประโยคและเว้นความแน่ใจไว้มากกว่า'],
  ],
  [['I probably won’t go.', 'Maybe I won’t go.', 'probably ให้ความเป็นไปได้ทางหนึ่งมากกว่า maybe'], ['She probably isn’t home.', 'She’s definitely not home.', 'probably เป็นการคาด ส่วน definitely เป็นการยืนยัน']],
  [['Will you be there by six?', 'คุณจะไปถึงก่อนหกโมงไหม'], ['Probably not. Traffic’s bad.', 'คงไม่ทัน รถติดมาก']],
  [['I probably will not probably come.', 'I probably won’t come.', 'ใช้ probably ตำแหน่งเดียวให้ครอบการคาดการณ์ทั้งประโยค']],
  [
    ['เลือกคำตอบที่บอกว่าเขาคงไม่อยู่บ้าน', 'He probably isn’t home.', 'ครอบใจความว่าไม่อยู่ด้วย probably', 'คาดว่าไม่อยู่จริง', ['He probably is home.', 'He probably isn’t home.', 'He is probably not probably home.']],
    ['We’ll ___ finish tomorrow. เติม “น่าจะ” ด้วยคำเดียว', 'probably', 'อยู่หลัง will', 'probably ขยายการคาดการณ์'],
    ['เปลี่ยน She’ll probably come. ให้คาดว่าเธอจะไม่มา', ['She probably won’t come.', 'She probably will not come.', 'She will probably not come.', 'She’ll probably not come.'], 'เลือก won’t หรือ will not', 'มีได้หลายตำแหน่งที่ทำให้ probably ครอบผลลบชัดเจน'],
    ['ตอบสั้น ๆ ว่า “คงไม่” โดยใช้ probably', 'Probably not.', 'ใช้เป็น fragment ได้เมื่อบริบทชัด', 'ละใจความที่ถามไว้แล้ว'],
    ['แก้ He probably at work. โดยเก็บ probably', ['He’s probably at work.', 'He is probably at work.'], 'ต้องมี be เชื่อมสถานที่', 'วาง probably ตาม be ในรูปที่พบบ่อย'],
  ], 'สมมติเพื่อนชวนพรุ่งนี้ บอกสิ่งที่น่าจะทำและสิ่งที่น่าจะทำไม่ได้ แล้วตอบสั้นให้เป็นธรรมชาติ',
  [
    ['Chances are + clause', 'มีแนวโน้มว่า…', 'uncertainty', 'clause', 'เสนอข้อคาดการณ์จากข้อมูลที่มี ไม่ต้องใส่ that', ['Chances are we’ll miss the last train.', 'เราน่าจะไม่ทันรถไฟเที่ยวสุดท้าย', 'คำนวณเวลาที่เหลือ'], ['Chances are she’s already on her way.', 'เธอน่าจะออกเดินทางมาแล้ว', 'รอเพื่อน'], 'อยู่หน้าประโยคที่เป็นข้อคาดการณ์', 'informal'],
    ['I doubt + clause', 'ฉันสงสัยว่า…คงไม่เกิด', 'uncertainty', 'clause', 'ใจความหลัง doubt คือสิ่งที่ผู้พูดเห็นว่าไม่น่าเป็นจริง', ['I doubt he’ll finish today.', 'ฉันว่าเขาคงทำไม่เสร็จวันนี้', 'คุยเรื่องกำหนดส่ง'], ['I doubt it’s still open.', 'ฉันว่ายังเปิดอยู่ไม่น่าใช่', 'ดูร้านช่วงค่ำ'], 'that หลัง doubt ละได้ในบทสนทนา'],
    ['Probably not.', 'คงไม่', 'uncertainty', '', 'เป็นคำตอบเต็มในบทสนทนาเมื่อผู้ฟังรู้ว่า not แทนใจความใด', ['Are you staying late? Probably not.', 'จะอยู่ดึกไหม คงไม่', 'ตอบเพื่อนร่วมงาน'], ['Will it rain? Probably not.', 'ฝนจะตกไหม คงไม่', 'ตัดสินใจจะออกไปข้างนอก'], 'ตอบหลังคำถามหรือความเห็นที่มีบริบทชัด'],
  ],
)

const d = authorLesson(
  'm5-04', 'Still, yet, already and just', 'ยังอยู่ ยังไม่ แล้ว และเพิ่ง', 'ส่งข้อความตามงานโดยบอกให้ชัดว่ายังทำอยู่หรือเสร็จแล้ว',
  'แยกสิ่งที่ยังดำเนิน สิ่งที่รอให้เกิด และสิ่งที่เกิดเร็วกว่าที่คิด',
  'Still มองจากสิ่งที่ดำเนินอยู่หรือค้างอยู่นาน Yet มองไปยังสิ่งที่คาดว่าจะเกิด มักอยู่ท้ายคำถามหรือปฏิเสธ Already บอกว่าเกิดขึ้นแล้ว และอาจเร็วกว่าที่คาด Just เน้นว่าเพิ่งเกิดในบริบทเวลา',
  'still + lexical verb | be + still | have + already/just + V3 | clause + yet',
  [
    ['I still remember her voice.', 'ฉันยังจำเสียงเธอได้', 'still อยู่ก่อน remember'],
    ['I’m still here.', 'ฉันยังอยู่ที่นี่', 'still อยู่หลัง be'],
    ['I still haven’t finished.', 'ฉันก็ยังทำไม่เสร็จ', 'เน้นความล่าช้าหรือสภาพค้าง'],
    ['Have you eaten yet?', 'กินข้าวหรือยัง', 'yet มองไปที่เหตุการณ์ที่รอให้เกิด'],
    ['I’ve already eaten, but I’ve just made some tea.', 'ฉันกินข้าวแล้ว แต่เพิ่งชงชา', 'already กับ just อยู่หลัง have'],
  ],
  [['I haven’t finished yet.', 'I still haven’t finished.', 'ทั้งคู่ยังไม่เสร็จ แบบ still เน้นว่าคงค้างมาถึงตอนนี้'], ['I’ve already called her.', 'I’ve just called her.', 'already เน้นว่าโทรแล้ว ส่วน just เน้นว่าเพิ่งโทร']],
  [['Has the parcel arrived yet?', 'พัสดุมาหรือยัง'], ['Not yet. I’m still waiting.', 'ยังเลย ฉันยังรออยู่']],
  [['I still am wait.', 'I’m still waiting.', 'กำลังรอจึงใช้ be + waiting แล้ววาง still หลัง be']],
  [
    ['เลือกคำตอบที่บอกว่าเพิ่งส่งเมื่อครู่', 'I’ve just sent it.', 'เพิ่งเกิด', 'just ชี้ว่าเกิดใกล้ตอนนี้', ['I haven’t sent it yet.', 'I’ve just sent it.', 'I’m still sending it.']],
    ['I ___ remember your first lesson. เติมคำว่า “ยัง”', 'still', 'ความจำยังอยู่', 'still อยู่ก่อน remember'],
    ['เติม yet ใน Has Mia called?', 'Has Mia called yet?', 'ถามว่าถึงตอนนี้โทรมาหรือยัง', 'yet มักอยู่ท้ายคำถาม'],
    ['แปล “ฉันทำเสร็จแล้ว” ด้วย already และ present perfect', ['I’ve already finished.', 'I have already finished.', 'I’ve finished already.', 'I have finished already.'], 'ใช้ have + V3', 'already อยู่กลางหรือท้ายได้'],
    ['แก้ I have yet eaten not. ให้ใช้ yet ท้ายประโยค', ['I haven’t eaten yet.', 'I have not eaten yet.'], 'ปฏิเสธด้วย have not', 'yet อยู่หลัง eaten'],
  ], 'สมมติเพื่อนถามว่างานเป็นอย่างไร ตอบสามแบบว่ายังทำอยู่ ยังไม่เสร็จ หรือเพิ่งเสร็จ',
  [
    ['I’m still waiting for + noun', 'ฉันยังรอ…อยู่', 'daily life', 'noun phrase', 'ระบุสิ่งที่รอและยังไม่ได้รับ', ['I’m still waiting for a reply.', 'ฉันยังรอคำตอบอยู่', 'ติดตามอีเมล'], ['I’m still waiting for the bus.', 'ฉันยังรอรถเมล์อยู่', 'บอกเพื่อนว่าจะสาย'], 'still อยู่หลัง am ก่อน waiting'],
    ['I haven’t got around to + noun/-ing + yet', 'ฉันยังหาเวลาทำ…ไม่ได้', 'plans', 'noun or -ing', 'ใช้เมื่องานอยู่ในแผนแต่ยังไม่ได้ลงมือ', ['I haven’t got around to reading it yet.', 'ฉันยังไม่ได้หาเวลาอ่านเลย', 'พูดถึงบทความที่เพื่อนส่ง'], ['I haven’t got around to the paperwork yet.', 'ฉันยังไม่ได้ลงมือทำเอกสารเลย', 'อัปเดตงาน'], 'to ใน get around to รับ noun หรือ -ing', 'informal', 'I haven’t gotten around to… พบใน American English'],
    ['I’ve just found out + clause', 'ฉันเพิ่งรู้ว่า…', 'change', 'clause', 'ใช้เมื่อเพิ่งทราบข้อมูลที่มีผลต่อบทสนทนา', ['I’ve just found out that the café is closed.', 'ฉันเพิ่งรู้ว่าร้านกาแฟปิด', 'แผนกินกาแฟเปลี่ยน'], ['I’ve just found out who’s moving upstairs.', 'ฉันเพิ่งรู้ว่าใครจะย้ายมาอยู่ชั้นบน', 'คุยกับเพื่อนบ้าน'], 'just อยู่ระหว่าง have และ found'],
  ],
)

const e = authorLesson(
  'm5-05', 'Even and focus', 'เน้นสิ่งที่คาดไม่ถึงด้วย even', 'เมื่อคุณพูดว่า “แม้แต่ฉันก็เห็น” คุณกำลังเทียบกับสิ่งที่อีกฝ่ายคาดไว้',
  'ระบุว่า even เน้นใคร การกระทำใด หรือระดับใด และแยกจาก very',
  'Even ชี้บางสิ่งบนมาตรวัดความคาดหมาย เช่น คนที่ไม่น่าจะสังเกตเห็น หรือขั้นที่ต่ำที่สุดที่ยังไม่เกิด ตำแหน่งช่วยชี้สิ่งที่ถูกเน้น แต่บริบทและการลงเสียงอาจกำหนดขอบเขตกว้างหรือแคบกว่าคำถัดไป Very บอกระดับสูงของคุณสมบัติ',
  'even + focused element | not + even + verb | even + comparative',
  [
    ['Even I noticed the change.', 'แม้แต่ฉันยังสังเกตเห็นความเปลี่ยนแปลง', 'เน้นคนที่คาดไม่ถึง'],
    ['I didn’t even notice the sign.', 'ฉันไม่ได้สังเกตเห็นป้ายด้วยซ้ำ', 'สื่อว่าอย่างน้อยก็น่าจะเห็นป้าย'],
    ['The second version is even better.', 'รุ่นที่สองยิ่งดีกว่าเดิม', 'เพิ่มน้ำหนักให้คำเปรียบเทียบ better'],
    ['She can even fix the screen herself.', 'เธอซ่อมหน้าจอเองได้ด้วย', 'เติมความสามารถที่เกินคาด'],
    ['I even called on Sunday.', 'ฉันถึงกับโทรวันอาทิตย์', 'ถ้าลงเสียง Sunday วันอาทิตย์อาจเป็นจุดเน้น แม้ even จะอยู่ก่อน called'],
  ],
  [['It’s even colder today.', 'It’s very cold today.', 'even colder เทียบกับวันที่หนาวอยู่แล้ว ส่วน very cold บอกระดับของวันนี้'], ['Even Tom helped.', 'Tom even helped with the dishes.', 'แบบแรกเน้นคน แบบหลังเน้นสิ่งที่ Tom ทำเกินคาด']],
  [['Did the kids like the curry?', 'เด็ก ๆ ชอบแกงไหม'], ['Even Noah asked for seconds.', 'แม้แต่โนอาห์ยังขอเติมเลย']],
  [['It’s very better.', 'It’s even better.', 'ใช้ even ขยาย comparative เพื่อเน้นว่าดีกว่าเดิมอีก']],
  [
    ['เลือกแบบที่เน้นผู้ร่วมงานซึ่งคาดว่าจะไม่มา', 'Even Pat came.', 'Pat เป็นจุดเน้น', 'วาง even หน้า Pat ชัดที่สุด', ['Even Pat came.', 'Pat even came early.', 'Pat came very early.']],
    ['This one is ___ better. เติม even หรือ very', 'even', 'better เป็น comparative', 'even เพิ่มความต่างจากเดิม'],
    ['เติม even ใน I didn’t read the title. ให้หมายถึง “ไม่ได้อ่านแม้แต่ชื่อเรื่อง”', 'I didn’t even read the title.', 'ใช้หลัง didn’t', 'บริบทอาจเน้น the title ซึ่งเป็นส่วนที่อยู่ถัดออกไป'],
    ['แปล “แม้แต่ลูกฉันยังสังเกตเห็น” ด้วย even', 'Even my child noticed.', 'เน้น my child', 'วาง even หน้าประธานที่คาดไม่ถึง'],
    ['แก้ This room is very quieter. โดยใช้ even', 'This room is even quieter.', 'quieter เปรียบเทียบ', 'ใช้ even ขยาย quieter'],
  ], 'เล่าความเปลี่ยนแปลงที่เห็นวันนี้ ใช้ even ครั้งหนึ่งเน้นคน และอีกครั้งเน้นความต่างจากเดิม',
  [
    ['It’s even more + adjective', 'มันยิ่ง…ขึ้นอีก', 'comparison', 'adjective', 'เทียบกับมาตรฐานเดิมซึ่งผู้ฟังรู้จากบริบท', ['It’s even more useful on a small screen.', 'มันยิ่งมีประโยชน์บนจอเล็ก', 'คุยเรื่องเครื่องมือ'], ['It’s even more crowded on Fridays.', 'วันศุกร์ยิ่งคนแน่นขึ้นอีก', 'วางแผนไปตลาด'], 'even อยู่ก่อน more'],
    ['I didn’t even get to + base verb', 'ฉันยังไม่ได้มีโอกาส…ด้วยซ้ำ', 'experience', 'base verb', 'กิจกรรมหลัง get to คือโอกาสขั้นต่ำที่ยังมาไม่ถึง', ['I didn’t even get to thank her.', 'ฉันยังไม่ได้ขอบคุณเธอด้วยซ้ำ', 'เธอรีบออกไป'], ['I didn’t even get to see the sea.', 'ฉันยังไม่ทันได้เห็นทะเลด้วยซ้ำ', 'ทริปถูกตัดสั้น'], 'even อยู่ระหว่าง didn’t และ get'],
    ['Even so, + clause', 'ถึงอย่างนั้นก็…', 'agreement', 'clause', 'ยอมรับข้อเท็จจริงก่อนหน้าแล้วตามด้วยสิ่งที่ยังจริงอีกด้าน', ['It costs more. Even so, I’d buy it again.', 'แพงกว่า ถึงอย่างนั้นฉันก็จะซื้ออีก', 'รีวิวสินค้า'], ['We were tired. Even so, we kept walking.', 'เราเหนื่อย ถึงอย่างนั้นก็เดินต่อ', 'เล่าเหตุการณ์'], 'วางต้นประโยคใหม่และเว้นจังหวะ'],
  ],
)

const f = authorLesson(
  'm5-06', 'Time at the edge of a clause', 'จัดตำแหน่งคำบอกเวลา', 'บอกว่ากำลังคุยได้ไหม หรือขอให้โทรกลับอีกสิบนาที',
  'วางเวลาต้นประโยคเพื่อจัดกรอบหรือท้ายประโยคเพื่อเพิ่มรายละเอียด',
  'ช่วงเวลาอย่าง right now และ later มักอยู่ท้ายข้อความหลักเพื่อให้ใจความมาก่อน เมื่อย้ายไปต้นประโยค ผู้ฟังจะได้กรอบเวลาก่อนคำอธิบาย ใช้ ago กับเวลาที่นับย้อนจากตอนนี้ และ in + ช่วงเวลาเมื่อหมายถึงอีกเท่าไรจากตอนนี้',
  'time phrase, + clause | clause + time phrase | duration + ago | in + duration',
  [
    ['I’m working right now.', 'ตอนนี้ฉันกำลังทำงาน', 'right now ขยายช่วงเกิดเหตุการณ์'],
    ['Right now, I need a break.', 'ตอนนี้สิ่งที่ฉันต้องการคือพัก', 'ตั้งกรอบก่อนพูด'],
    ['I’ll call you in ten minutes.', 'ฉันจะโทรหาอีกสิบนาที', 'in นับไปข้างหน้า'],
    ['I moved here ten years ago.', 'ฉันย้ายมาที่นี่เมื่อสิบปีก่อน', 'ago อยู่หลังช่วงเวลา'],
    ['This afternoon, I have two meetings.', 'บ่ายนี้ฉันมีประชุมสองนัด', 'ใช้ช่วงเวลาขึ้นต้นเพื่อจัดตาราง'],
  ],
  [['I’m working right now.', 'I usually work from home.', 'ตอนนี้กำลังทำ เทียบกับกิจวัตร'], ['I left ten minutes ago.', 'I’ll leave in ten minutes.', 'ago ย้อนกลับ ส่วน in นับไปข้างหน้า']],
  [['Can you talk right now?', 'ตอนนี้คุยได้ไหม'], ['I’m in a meeting. I’ll call you in ten minutes.', 'ฉันประชุมอยู่ เดี๋ยวอีกสิบนาทีโทรหา']],
  [['I arrived ago two hours.', 'I arrived two hours ago.', 'วาง ago หลังระยะเวลา']],
  [
    ['เลือกประโยคที่หมายถึงอีกห้านาที', 'I’ll be there in five minutes.', 'นับไปข้างหน้า', 'in + ระยะเวลา', ['I was there five minutes ago.', 'I’ll be there in five minutes.', 'I’ll be there five minutes ago.']],
    ['I last saw her three months ___. เติม “ที่แล้ว”', 'ago', 'ช่วงเวลาย้อนจากตอนนี้', 'ago วางท้ายระยะเวลา'],
    ['ย้าย right now ไปต้นประโยค I can’t talk right now.', 'Right now, I can’t talk.', 'ใช้ right now เป็นกรอบ', 'พักจังหวะหลังคำบอกเวลา'],
    ['แปล “ฉันกำลังกินข้าวอยู่ตอนนี้” ให้ใช้ right now', ['I’m eating right now.', 'I am eating right now.', 'Right now, I’m eating.', 'Right now, I am eating.'], 'ใช้ be + eating', 'วาง right now ได้สองตำแหน่ง'],
    ['แก้ I’ll call you ten minutes ago. ให้หมายถึงอีกสิบนาที', ['I’ll call you in ten minutes.', 'I will call you in ten minutes.'], 'เหตุการณ์อยู่ข้างหน้า', 'เปลี่ยน ago เป็น in ก่อนระยะเวลา'],
  ], 'บอกว่าตอนนี้กำลังทำอะไร ทำอะไรเมื่อชั่วโมงที่แล้ว และจะทำอะไรในอีกสิบนาที',
  [
    ['For now, let’s + base verb', 'ตอนนี้เอาแบบ…ไปก่อน', 'plans', 'base verb', 'ใช้เสนอแผนชั่วคราวที่เปลี่ยนทีหลังได้', ['For now, let’s meet online.', 'ตอนนี้นัดออนไลน์ไปก่อน', 'กำหนดนัดช่วงสถานที่ปิด'], ['For now, let’s leave the settings as they are.', 'ตอนนี้คงการตั้งค่าเดิมไปก่อน', 'แก้ระบบทีละส่วน'], 'for now เปิดกรอบของข้อเสนอ'],
    ['It’s been + duration + since + clause', 'เป็นเวลา…แล้วตั้งแต่…', 'experience', 'duration / past clause', 'วัดเวลาย้อนจากเหตุการณ์ที่บอกหลัง since', ['It’s been two weeks since I last saw her.', 'สองสัปดาห์แล้วตั้งแต่ฉันเจอเธอครั้งสุดท้าย', 'ถามข่าวเพื่อน'], ['It’s been a year since we moved in.', 'ปีหนึ่งแล้วตั้งแต่เราย้ายเข้ามา', 'เล่าว่าตั้งหลักแล้ว'], 'duration คั่นระหว่าง been และ since'],
    ['By + time, I should be able to + base verb', 'ภายใน…ฉันน่าจะทำ…ได้', 'plans', 'time / base verb', 'คาดว่าจะมีความพร้อมก่อนหรือเมื่อถึงเวลาที่กำหนด', ['By Friday, I should be able to send a draft.', 'ภายในวันศุกร์ฉันน่าจะส่งร่างได้', 'อัปเดตงาน'], ['By six, I should be able to leave.', 'ภายในหกโมงฉันน่าจะออกได้', 'วางแผนนัด'], 'วาง by + เวลาไว้ต้นหรือท้าย'],
  ],
)

const g = authorLesson(
  'm5-07', 'Enough and too', 'บอกว่าพอหรือเกินด้วย enough และ too', 'ถ้ากล่องใส่เครื่องไม่ลง คุณจะอธิบายโดยเริ่มจากขนาดกล่องหรือขนาดเครื่องก็ได้',
  'เลือก enough หรือ too ตามมุมมองและวางตำแหน่งตามชนิดคำ',
  'Enough บอกว่าถึงเกณฑ์ ใช้ก่อน noun แต่หลัง adjective/adverb ส่วน too + adjective บอกว่าเกินเกณฑ์ในบริบทหนึ่ง จึงอาจขัดกับสิ่งที่ต้องการทำ Too much ตามด้วย noun นับไม่ได้ และ too many ตามด้วย noun พหูพจน์',
  'enough + noun | adjective/adverb + enough | too + adjective | too much/many + noun',
  [
    ['We have enough time.', 'เรามีเวลาพอ', 'enough อยู่ก่อน noun'],
    ['The table isn’t big enough.', 'โต๊ะไม่ใหญ่พอ', 'enough อยู่หลัง big'],
    ['You’re speaking too quickly for me.', 'คุณพูดเร็วเกินที่ฉันจะตามทัน', 'too อยู่ก่อน quickly'],
    ['I’m too tired to cook.', 'ฉันเหนื่อยเกินกว่าจะทำอาหาร', 'to บอกสิ่งที่เหนื่อยจนทำไม่ไหว'],
    ['There are too many people in here.', 'ในนี้คนเยอะเกินไป', 'people เป็นพหูพจน์'],
  ],
  [['It’s very hot.', 'It’s too hot to drink.', 'very บอกระดับสูง ส่วน too บอกว่าเกินเกณฑ์ที่จะดื่ม'], ['We have enough chairs.', 'These chairs aren’t strong enough.', 'before noun แต่ after adjective']],
  [['Can we walk there?', 'เดินไปที่นั่นได้ไหม'], ['It’s too far. We don’t have enough time.', 'ไกลเกินไป เรามีเวลาไม่พอ']],
  [['It isn’t enough big.', 'It isn’t big enough.', 'enough อยู่หลัง adjective']],
  [
    ['เลือกประโยคที่บอกว่ามีที่พอ', 'We have enough room.', 'room หมายถึงพื้นที่', 'วาง enough ก่อน noun', ['We have room enough it.', 'We have enough room.', 'We are enough roomy it.']],
    ['This box isn’t large ___. เติมคำว่า “พอ”', 'enough', 'large เป็น adjective', 'วาง enough หลัง large'],
    ['เปลี่ยน It’s very hot. ให้หมายถึงร้อนเกินกว่าจะจับ โดยใช้ handle', ['It’s too hot to handle.', 'It is too hot to handle.'], 'ใช้ too + hot + to', 'too hot ชี้ว่าความร้อนขัดกับการจับ'],
    ['แปล “ฉันทำงานมากเกินไป” โดยใช้ too much', 'I work too much.', 'ขยายปริมาณการทำงาน', 'วาง too much หลัง work ในประโยคนี้'],
    ['แก้ There are too much people.', 'There are too many people.', 'people นับเป็นคนได้', 'ใช้ too many กับ noun พหูพจน์'],
  ], 'เลือกของหนึ่งชิ้นและเกณฑ์ที่ต้องการ บอกด้วย too และ enough อย่างละประโยค',
  [
    ['It’s not + adjective + enough for + noun', 'มัน…ไม่พอสำหรับ…', 'comparison', 'adjective / noun phrase', 'เปรียบคุณสมบัติกับเกณฑ์ที่คนหรือสิ่งหนึ่งต้องการ', ['It’s not quiet enough for a recording.', 'มันเงียบไม่พอสำหรับอัดเสียง', 'หาห้องอัด'], ['It’s not warm enough for the baby.', 'มันอุ่นไม่พอสำหรับเด็กทารก', 'เลือกผ้าห่ม'], 'enough ตาม adjective แล้วจึงระบุเกณฑ์ด้วย for'],
    ['There’s too much + uncountable noun', 'มี…มากเกินไป', 'daily life', 'uncountable noun', 'บอกปริมาณสิ่งที่ไม่ได้นับเป็นชิ้นในบริบทนั้น', ['There’s too much noise outside.', 'ข้างนอกเสียงดังเกินไป', 'อยากเปิดหน้าต่าง'], ['There’s too much salt in the soup.', 'ในซุปใส่เกลือมากไป', 'ชิมอาหาร'], 'too much อยู่หลัง is ก่อน noun'],
    ['I’m + adjective + enough to + base verb', 'ฉัน…พอที่จะ…', 'plans', 'adjective / base verb', 'ใช้เมื่อสภาพของผู้พูดถึงระดับทำกิจกรรมได้', ['I’m well enough to go back to work.', 'ฉันหายดีพอจะกลับไปทำงาน', 'พักฟื้นแล้ว'], ['I’m close enough to walk there.', 'ฉันอยู่ใกล้พอที่จะเดินไป', 'เปรียบเทียบวิธีเดินทาง'], 'enough วางระหว่าง adjective และ to'],
  ],
)

const h = authorLesson(
  'm5-08', 'Scope and flexible positions', 'ย้ายคำแล้วความหมายไปเน้นตรงไหน', 'ประโยคที่มี only อาจพูดถึงคนละข้อ แม้ใส่คำชุดเดียวกัน',
  'จับคู่ตำแหน่งและการลงเสียงกับส่วนที่ต้องการเน้น',
  'Only จำกัดสิ่งที่เป็นไปได้ เช่น คน สิ่งของ หรือการกระทำ ตำแหน่งที่ติดส่วนที่ต้องการจำกัดมักชัดเมื่อเขียน ภาษาพูดอาจวาง only หน้า verb แล้วใช้เสียงเน้นส่วนถัดไป คำอย่าง honestly ที่ต้นประโยคให้ท่าทีต่อทั้งประโยค ส่วนท้ายประโยคอาจฟังเหมือนพูดเสริม',
  'only + focused element | stance marker, + clause | clause, + stance marker',
  [
    ['Only Mina called me.', 'มีแค่มินาที่โทรหาฉัน', 'จำกัดคนโทร'],
    ['Mina called only me.', 'มินาโทรหาฉันคนเดียว', 'จำกัดคนรับโทรศัพท์'],
    ['I only asked for tea.', 'ฉันขอแค่ชา', 'ลงเสียง tea ได้เมื่อเน้นสิ่งที่ขอ'],
    ['Honestly, I don’t know.', 'พูดตรง ๆ ฉันไม่รู้', 'ตั้งท่าทีไว้ก่อน'],
    ['It’s fine, honestly.', 'มันโอเคจริง ๆ นะ', 'เสริมให้ความมั่นใจท้ายประโยค'],
  ],
  [['I only invited Ana.', 'Only I invited Ana.', 'แบบหลังจำกัดคนชวน แบบแรกมักจำกัดคนถูกชวนหรือการกระทำตามเสียงเน้น'], ['I almost fell.', 'I fell. Almost.', 'แบบหลังใช้จังหวะหักมุมในบทสนทนา แบบแรกตรงไปตรงมา']],
  [['Did everyone call you?', 'ทุกคนโทรหาคุณหรือเปล่า'], ['No, only Mina did.', 'เปล่า มีแค่มินาที่โทร']],
  [['I want tea only coffee.', 'I only want tea.', 'ใช้ only กับสิ่งที่ต้องการจำกัด แล้วตัด coffee หากไม่ได้ตั้งใจเปรียบคู่']],
  [
    ['เลือกประโยคที่หมายถึง “คนมามีแค่เลโอ”', 'Only Leo came.', 'จำกัดประธาน', 'only อยู่หน้า Leo', ['Leo only came for an hour.', 'Only Leo came.', 'Leo came only on Monday.']],
    ['___, I don’t remember. เติมคำว่า “พูดตรง ๆ”', 'Honestly', 'เปิดด้วยท่าที', 'honestly ที่ต้นประโยคบอกความตรงไปตรงมาของข้อความทั้งหมด'],
    ['ปรับ Leo called Maya. ให้หมายถึง “เลโอโทรหามายาคนเดียว” โดยวาง only ติด Maya', 'Leo called only Maya.', 'จำกัดกรรม', 'วาง only หน้า Maya โดยตรง'],
    ['แปล “ฉันเกือบลืม” ด้วย almost', 'I almost forgot.', 'เหตุการณ์ไม่ถึงขั้นเกิดจริง', 'almost วางก่อน forgot'],
    ['แก้ Only Maya invited I. ให้หมายถึงมีแค่มายาที่ชวนฉัน', 'Only Maya invited me.', 'หลัง invited ต้องใช้รูปกรรม', 'me เป็น object form และ only จำกัดประธาน'],
  ], 'พูดสองประโยคโดยย้าย only ให้ครั้งหนึ่งเน้นคนและอีกครั้งเน้นสิ่งของ ลองฟังว่าความหมายเปลี่ยนอย่างไร',
  [
    ['All I wanted was + noun', 'สิ่งเดียวที่ฉันต้องการคือ…', 'clarification', 'noun phrase', 'เน้นว่าสิ่งที่ขอมีเพียงอย่างเดียว มักใช้เมื่อแก้ความเข้าใจคลาดเคลื่อน', ['All I wanted was a quiet evening.', 'ฉันอยากได้แค่ช่วงเย็นเงียบ ๆ', 'อธิบายว่าทำไมไม่ออกไปเที่ยว'], ['All I wanted was a clear answer.', 'ฉันอยากได้แค่คำตอบที่ชัด', 'อธิบายเหตุผลที่ถามซ้ำ'], 'วางสิ่งที่ต้องการหลัง was'],
    ['I was only trying to + base verb', 'ฉันแค่พยายามจะ…', 'repair', 'base verb', 'จำกัดเจตนาว่าต้องการทำเพียงเรื่องนี้ เมื่อต้องอธิบายความเข้าใจคลาดเคลื่อน', ['I was only trying to help.', 'ฉันแค่พยายามจะช่วย', 'อธิบายหลังอีกฝ่ายไม่พอใจ'], ['I was only trying to make sure we had enough time.', 'ฉันแค่พยายามเช็กให้แน่ใจว่ามีเวลาพอ', 'อธิบายเหตุที่ถามซ้ำ'], 'วาง only หน้า trying เพื่อจำกัดความหมายที่ตามมา'],
    ['Honestly, + clause', 'พูดตรง ๆ นะ…', 'opinion', 'clause', 'ใช้ส่งสัญญาณว่ากำลังจะพูดท่าทีตรง ๆ ควรปรับน้ำเสียงตามความสัมพันธ์', ['Honestly, I wasn’t expecting that.', 'พูดตรง ๆ ฉันไม่คิดว่าจะเป็นแบบนั้น', 'เล่าความประหลาดใจ'], ['Honestly, I think we need more time.', 'พูดตรง ๆ ฉันคิดว่าเราต้องการเวลาเพิ่ม', 'คุยเรื่องกำหนดส่ง'], 'ต้นประโยคมีผลต่อทั้งใจความ'],
  ],
)

const entries = [a, b, c, d, e, f, g, h]
export const wordLessons = entries.map(({ lesson }) => lesson)
export const wordPatterns = entries.flatMap(({ patterns }) => patterns)
