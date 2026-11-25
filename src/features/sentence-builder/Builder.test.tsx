// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { Builder } from './Builder'

afterEach(cleanup)

function chip(group: string, value: string) {
  const option = within(screen.getByRole('radiogroup', { name: group })).getAllByRole('radio')
    .find((item) => item.getAttribute('value') === value)
  if (!option) throw new Error(`Missing ${value} in ${group}`)
  return option
}

it('builds meaning-first questions from the visible controls', async () => {
  const user = userEvent.setup()
  render(<Builder />)

  await user.click(chip('กริยาหรือส่วนเติมเต็ม', 'likeYou'))
  await user.click(chip('ชนิดประโยค', 'yesNo'))
  expect(chip('ชนิดประโยค', 'yesNo').getAttribute('aria-checked')).toBe('true')
  expect(screen.getByText('Does she like you?', { exact: true })).toBeTruthy()
  expect(screen.getByText(/กริยาหลักจึงใช้รูปเดิม like/)).toBeTruthy()

  await user.selectOptions(screen.getByLabelText('เจตนา'), 'relevant')
  await user.click(chip('ประธาน', 'you'))
  await user.click(chip('กริยาหรือส่วนเติมเต็ม', 'eat'))
  await user.click(chip('คำขยาย', 'yet'))
  expect(screen.getByText('Have you eaten yet?', { exact: true })).toBeTruthy()
  expect(screen.getByText('Did you eat yet?', { exact: true })).toBeTruthy()
})
