import type { Expansion } from '../../domain/everyday'

export const practicalWorkshops: Record<string, Expansion> = {
  'practical-travel-airport': {
    base: 'Could I have a seat?', meaning: 'ขอที่นั่งได้ไหม',
    steps: [
      { id: 'seat', title: 'เลือกที่นั่งที่ต้องการ', choices: [
        { id: 'aisle', label: 'ริมทางเดิน', fragments: { replace: { from: 'a seat', to: 'an aisle seat' } }, explanation: 'ใช้ an หน้า aisle เพราะขึ้นต้นด้วยเสียงสระ' },
        { id: 'window', label: 'ริมหน้าต่าง', fragments: { replace: { from: 'a seat', to: 'a window seat' } }, explanation: 'window อยู่หน้า seat เพื่อระบุประเภทที่นั่ง' },
      ] },
      { id: 'tone', title: 'เลือกถ้อยคำเสริมให้เหมาะกับจังหวะ', choices: [
        { id: 'open', label: 'เรียกพนักงานก่อน', fragments: { before: 'Excuse me,' }, explanation: 'ขึ้นต้นด้วย Excuse me เพื่อเรียกความสนใจก่อนถาม' },
        { id: 'please', label: 'ปิดคำขอด้วย please', fragments: { after: ', please' }, explanation: 'เติม please ท้ายคำขอได้เมื่อคุยกับพนักงานอยู่แล้ว' },
      ] },
    ],
  },
  'practical-dining-reservations': {
    base: 'I’d like to make a reservation.', meaning: 'ฉันอยากจองโต๊ะ',
    steps: [
      { id: 'people', title: 'ระบุจำนวนคน', choices: [
        { id: 'two', label: 'สองคน', fragments: { after: 'for two' }, explanation: 'for นำจำนวนคนที่มาทาน' },
        { id: 'four', label: 'สี่คน', fragments: { after: 'for four' }, explanation: 'for four ใช้ได้เมื่อคนฟังรู้อยู่แล้วว่าหมายถึงลูกค้าสี่คน' },
      ] },
      { id: 'time', title: 'เลือกรอบที่ต้องการ', choices: [
        { id: 'tonight', label: 'คืนนี้หกโมง', fragments: { after: 'at six tonight' }, explanation: 'ใช้ at กับเวลาที่ระบุเป็นชั่วโมง แล้วเติม tonight' },
        { id: 'friday', label: 'วันศุกร์หนึ่งทุ่ม', fragments: { after: 'at seven on Friday' }, explanation: 'at ระบุเวลา ส่วน on Friday ระบุวัน' },
      ] },
    ],
  },
  'practical-shopping-try-on': {
    base: 'Could I try the jacket on?', meaning: 'ขอลองแจ็กเก็ตได้ไหม',
    steps: [
      { id: 'which', title: 'บอกว่าหมายถึงชิ้นไหน', choices: [
        { id: 'blue', label: 'แจ็กเก็ตสีน้ำเงิน', fragments: { replace: { from: 'the jacket', to: 'the blue jacket' } }, explanation: 'คำบอกสีอยู่หน้าคำนาม' },
        { id: 'it', label: 'ใช้ it เมื่อคุยถึงตัวเดิม', fragments: { replace: { from: 'the jacket', to: 'it' } }, explanation: 'เมื่อใช้ it ให้คั่นระหว่าง try กับ on' },
      ] },
      { id: 'tone', title: 'เติมสำนวนขอความช่วยเหลือ', choices: [
        { id: 'open', label: 'เรียกพนักงานก่อน', fragments: { before: 'Excuse me,' }, explanation: 'ใช้ขึ้นต้นเพื่อเรียกคนที่ยังไม่ได้คุยกับเรา' },
        { id: 'please', label: 'เติม please ท้ายคำขอ', fragments: { after: ', please' }, explanation: 'please ทำให้คำขอฟังสุภาพขึ้น' },
      ] },
    ],
  },
  'practical-problems-luggage': {
    base: 'My suitcase hasn’t arrived.', meaning: 'กระเป๋าล้อลากของฉันยังมาไม่ถึง',
    steps: [
      { id: 'description', title: 'เพิ่มสีของกระเป๋า', choices: [
        { id: 'black', label: 'ใบสีดำ', fragments: { replace: { from: 'My suitcase', to: 'My black suitcase' } }, explanation: 'black อยู่หน้า suitcase เพื่อแยกจากกระเป๋าใบอื่น' },
        { id: 'blue', label: 'ใบสีน้ำเงิน', fragments: { replace: { from: 'My suitcase', to: 'My blue suitcase' } }, explanation: 'blue เพิ่มข้อมูลให้เจ้าหน้าที่ใช้ค้นหา' },
      ] },
      { id: 'status', title: 'เน้นว่ายังรอหรือระบุจุดรับ', choices: [
        { id: 'yet', label: 'ยังไม่มาเลย', fragments: { after: 'yet' }, explanation: 'yet ท้ายประโยคปฏิเสธบอกว่ายังรอให้มาถึง' },
        { id: 'belt', label: 'ยังไม่ถึงสายพาน', fragments: { after: 'at the baggage carousel' }, explanation: 'at ระบุจุดที่คาดว่ากระเป๋าจะมาถึง' },
      ] },
    ],
  },
}
