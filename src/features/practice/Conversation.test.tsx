// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, expect, it } from 'vitest'
import { db } from '../../storage'
import { Conversation } from './Conversation'

afterEach(async () => {
  cleanup()
  await db.attempts.clear()
})

it('follows the selected clarification branch and records speaking as self-assessed', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={['/practice/conversation/clarification']}>
      <Routes>
        <Route path="/practice/conversation/:scenarioId" element={<Conversation />} />
      </Routes>
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('ถามให้เข้าใจตรงกัน')
  expect(screen.queryByText('Actually, twenty guests. I forgot to count the three volunteers.')).toBeNull()

  await user.click(screen.getByRole('button', { name: 'ถามตรง ๆ ว่าตัวเลขรวมใครบ้าง' }))
  expect(screen.getByText('Does that include the volunteers, or is it twenty guests plus the volunteers?')).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'ฟังคำถามต่อ' }))
  expect(screen.getByText('It includes the volunteers, but two people can’t eat eggs.')).toBeTruthy()
  expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'คู่สนทนาถามต่อ' }))

  await user.click(screen.getByRole('button', { name: 'เริ่มสถานการณ์นี้ใหม่' }))
  await user.click(screen.getByRole('button', { name: 'พูดทวนสิ่งที่เข้าใจก่อนให้เขายืนยัน' }))
  await user.click(screen.getByRole('button', { name: 'ฟังคำถามต่อ' }))
  expect(screen.getByText('Actually, twenty guests. I forgot to count the three volunteers.')).toBeTruthy()

  await user.click(screen.getByRole('button', { name: 'ไปที่งานพูด' }))
  await user.click(screen.getByLabelText('คนฟังจับใจความหลักได้'))
  await user.click(screen.getByRole('button', { name: 'บันทึกว่าประเมินตนเองแล้ว' }))
  await screen.findByText('บันทึกการฝึกพูดแล้ว')
  expect(await db.attempts.toArray()).toMatchObject([
    { exerciseId: 'conversation-clarification-speaking', objectiveId: 'm9-04', outcome: 'self-assessed' },
  ])
})
