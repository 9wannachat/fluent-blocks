// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { db } from '../../storage'
import { Exercise } from './Exercise'

afterEach(async () => {
  cleanup()
  await db.attempts.clear()
})

const fill = {
  id: 'test-fill', kind: 'fill' as const, prompt: 'เติม Are หรือ Do: ___ you ready?', answers: ['Are'],
  hint: 'ready เป็นคำบอกสภาพ', explanation: 'ใช้ be กับ adjective',
}

it('marks a wrong answer without revealing it and keeps the single-line field editable', async () => {
  const user = userEvent.setup()
  render(<Exercise item={fill} objective="m2-06" />)
  const field = screen.getByLabelText('คำตอบของคุณ') as HTMLInputElement
  expect(field.tagName).toBe('INPUT')
  await user.type(field, 'Do{Enter}')
  expect(await screen.findByText('ยังไม่ถูก')).toBeTruthy()
  expect(field.getAttribute('aria-invalid')).toBe('true')
  expect(field.disabled).toBe(false)
  expect(screen.queryByText('Are', { exact: true })).toBeNull()
  expect(screen.getByRole('button', { name: 'ตรวจอีกครั้ง' })).toBeTruthy()
  expect(await db.attempts.count()).toBe(1)
})

it('explains an empty submit and locks after a correct retry', async () => {
  const user = userEvent.setup()
  render(<Exercise item={fill} objective="m2-06" />)
  await user.click(screen.getByRole('button', { name: 'ตรวจคำตอบ' }))
  expect(screen.getByText('พิมพ์คำตอบก่อนตรวจ')).toBeTruthy()
  expect(await db.attempts.count()).toBe(0)
  const field = screen.getByLabelText('คำตอบของคุณ') as HTMLInputElement
  await user.type(field, 'Do{Enter}')
  await screen.findByText('ยังไม่ถูก')
  await user.clear(field)
  await user.type(field, 'are{Enter}')
  expect(await screen.findByText('ถูกต้อง')).toBeTruthy()
  expect(field.disabled).toBe(true)
  expect(screen.getByRole('button', { name: 'ดูคำอธิบาย' })).toBeTruthy()
})
