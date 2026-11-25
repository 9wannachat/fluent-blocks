// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Podcast } from '../podcast/Podcast'
import { Vocabulary } from '../reference/Vocabulary'
import { Settings } from './Settings'
import { db, exportBackup, saveSettings, StudyDatabase } from '../../storage'

afterEach(async () => {
  cleanup()
  await Promise.all(db.tables.map((table) => table.clear()))
})

describe('learner notebooks', () => {
  it('saves, reloads, edits and removes a podcast excerpt', async () => {
    const mount = () => render(<MemoryRouter><Podcast /></MemoryRouter>)
    const first = mount()
    await screen.findByText('ประโยคที่บันทึกจากแบบฟอร์มด้านบนจะปรากฏที่นี่')
    fireEvent.click(screen.getByRole('button', { name: 'ลองจากตัวอย่าง' }))
    fireEvent.change(screen.getByLabelText('URL ต้นทาง (ถ้ามี)'), { target: { value: 'https://youtu.be/example' } })
    fireEvent.change(screen.getByLabelText('เวลาต้นทาง (ถ้ามี)'), { target: { value: '12:30' } })
    fireEvent.click(screen.getByRole('button', { name: 'บันทึกประโยค' }))
    await screen.findByText('บันทึกประโยคแล้ว')
    first.unmount()

    mount()
    const card = await screen.findByRole('article')
    expect(within(card).getByRole('link', { name: 'เปิดต้นทาง' }).getAttribute('href')).toBe('https://youtu.be/example?t=750s')
    fireEvent.click(within(card).getByRole('link', { name: 'แก้ไข' }))
    fireEvent.change(screen.getByLabelText('ความหมายภาษาไทย'), { target: { value: 'เห็นอะไรเปลี่ยนไหม' } })
    fireEvent.click(screen.getByRole('button', { name: 'บันทึกประโยค' }))
    expect(await within(card).findByText('เห็นอะไรเปลี่ยนไหม')).toBeTruthy()
    fireEvent.click(within(card).getByRole('button', { name: 'ลบ' }))
    fireEvent.click(within(card).getByRole('button', { name: 'ยืนยันการลบ' }))
    await waitFor(() => expect(screen.queryByRole('article')).toBeNull())
  })

  it('retains a vocabulary example as text and makes it searchable', async () => {
    render(<MemoryRouter><Vocabulary /></MemoryRouter>)
    await screen.findByText('คำหรือวลีที่บันทึกจากแบบฟอร์มด้านบนจะปรากฏที่นี่')
    fireEvent.change(screen.getByLabelText('คำหรือวลี'), { target: { value: 'effort' } })
    fireEvent.change(screen.getByLabelText('ความหมายภาษาไทย'), { target: { value: 'ความพยายาม' } })
    fireEvent.change(screen.getByLabelText('ประโยคตัวอย่าง'), { target: { value: '<img src=invalid onerror=alert(1)>' } })
    fireEvent.click(screen.getByRole('button', { name: 'บันทึกคำศัพท์' }))
    const card = await screen.findByRole('article')
    expect(within(card).getByText('<img src=invalid onerror=alert(1)>')).toBeTruthy()
    expect(within(card).queryByRole('img')).toBeNull()
    fireEvent.change(screen.getByLabelText('ค้นในสมุดคำศัพท์'), { target: { value: 'other' } })
    expect(screen.queryByRole('article')).toBeNull()
    fireEvent.change(screen.getByLabelText('ค้นในสมุดคำศัพท์'), { target: { value: 'ความพยายาม' } })
    expect(screen.getByRole('article')).toBeTruthy()
  })
})

it('previews a backup and requires confirmation before replacing settings', async () => {
  await saveSettings({ routineMinutes: [5, 8, 7, 5, 5] })
  const remote = new StudyDatabase(crypto.randomUUID())
  try {
    await saveSettings({ routineMinutes: [12, 8, 7, 5, 5] }, remote)
    const json = await exportBackup(remote)
    const file = Object.assign(new File([json], 'fluent-blocks.json', { type: 'application/json' }), {
      text: async () => json,
    })
    render(<MemoryRouter><Settings /></MemoryRouter>)
    const retrieval = await screen.findByRole<HTMLInputElement>('spinbutton', { name: 'ทบทวนจากความจำ (นาที)' })
    expect(retrieval.value).toBe('5')
    fireEvent.change(screen.getByLabelText('เลือกไฟล์สำรอง JSON'), { target: { files: [file] } })
    const replace = await screen.findByRole<HTMLButtonElement>('button', { name: 'แทนที่ทั้งหมด' })
    expect(replace.disabled).toBe(true)
    fireEvent.click(screen.getByRole('checkbox', { name: 'ยืนยันว่าต้องการแทนที่ข้อมูลในเครื่อง' }))
    fireEvent.click(replace)
    await screen.findByText('แทนที่ข้อมูลแล้ว ดาวน์โหลดข้อมูลเดิมได้จากสำเนากู้คืน')
    expect(await screen.findByRole('button', { name: 'ดาวน์โหลดสำเนาก่อนแทนที่' })).toBeTruthy()
    await waitFor(() => expect(screen.getByRole<HTMLInputElement>('spinbutton', { name: 'ทบทวนจากความจำ (นาที)' }).value).toBe('12'))
  } finally {
    await remote.delete()
  }
})
