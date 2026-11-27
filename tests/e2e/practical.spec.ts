import { expect, test } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import { practical, practicalLessonById, practicalLessonPath, practicalModules, practicalPath } from '../../src/content/practical'

const first = practical.lessons.find((lesson) => lesson.moduleId === 'travel')!
const dining = practical.lessons.find((lesson) => lesson.moduleId === 'dining' && lesson.vocabulary.some(({ term }) => term.toLowerCase() === 'contain'))!

test('opens the four practical labs, records completion and queues a review', async ({ page }) => {
  await page.goto('/learn')
  await page.getByRole('link', { name: /ภาษาอังกฤษตามสถานการณ์/ }).click()
  for (const module of practicalModules) await expect(page.getByRole('link', { name: new RegExp(module.title) })).toBeVisible()
  await page.getByRole('link', { name: /Travel English Lab/ }).click()
  await page.locator(`a[href="${practicalLessonPath(first)}"]`).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(first.titleTh)
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  await page.getByRole('tab', { name: 'ลองฝึก' }).click()
  await page.getByRole('button', { name: 'ริมทางเดิน', exact: true }).click()
  await page.getByRole('button', { name: 'ปิดคำขอด้วย please' }).click()
  await expect(page.getByText('Could I have an aisle seat, please?', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'บันทึกว่าอ่านจบ' }).click()
  await page.getByRole('button', { name: 'เพิ่มในคิวทบทวน' }).click()
  await expect(page.getByRole('link', { name: 'เปิดคิวทบทวน' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'อ่านจบแล้ว' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('link', { name: 'เปิดคิวทบทวน' }).click()
  await page.getByRole('button', { name: 'ดูคำตอบและตัวอย่าง' }).click()
  await expect(page.getByRole('link', { name: 'เปิดความหมายที่กำลังทบทวน' })).toHaveAttribute('href', practicalLessonPath(first))
})

test('continues from a practical lesson into a typed roleplay and back', async ({ page }) => {
  const scenario = practical.scenarios.find((item) => item.branches[0].exercise.kind === 'translate' && !item.branches[0].exercise.options)!
  const lesson = practicalLessonById.get(scenario.objectiveId)!
  const branch = scenario.branches[0]
  await page.goto(practicalLessonPath(lesson))
  await page.getByRole('tab', { name: 'บทบาทสมมติ' }).click()
  await page.getByRole('link', { name: 'เปิดบทสนทนาโต้ตอบ' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(scenario.title)
  await page.getByRole('button', { name: branch.intent, exact: true }).click()
  await page.getByRole('button', { name: 'ฟังคำถามต่อ' }).click()
  await page.getByRole('button', { name: 'ลองตอบคำถามต่อ' }).click()
  const response = page.locator('form').filter({ hasText: branch.exercise.prompt })
  const field = response.getByRole('textbox')
  const [incorrect, explanation] = Object.entries(branch.exercise.feedback ?? {})[0]
  await field.fill(incorrect)
  await response.getByRole('button', { name: 'ตรวจคำตอบ' }).click()
  await expect(response.getByText(explanation, { exact: true })).toBeVisible()
  await field.fill(branch.exercise.answers[0])
  await response.getByRole('button', { name: 'ตรวจอีกครั้ง' }).click()
  await expect(response.getByText('ถูกต้อง', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'เปิดบทเรียนและคำศัพท์ของสถานการณ์นี้' }).click()
  await expect(page).toHaveURL(practicalLessonPath(lesson))
})

test('supports the ingredient Builder and offline practical lesson deep links', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByText('บทเรียนพร้อมใช้ออฟไลน์')).toBeVisible()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true)
  await page.goto(practicalLessonPath(dining))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(dining.titleTh)
  await page.getByRole('link', { name: 'ลองสร้างคำถามเรื่องส่วนผสม' }).click()
  await expect(page.locator('.builder-sentence').first()).toHaveText('Does it contain peanuts?')
})

test('practical pages fit narrow mobile and desktop with accessible controls', async ({ page }, info) => {
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [practicalPath, practicalLessonPath(dining), `${practicalPath}/dining/review`]) {
      await page.goto(path)
      await expect(page.locator('main h1')).toBeVisible()
      await page.evaluate(() => document.fonts.ready.then(() => undefined))
      expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBeLessThanOrEqual(width)
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(result.violations.flatMap(({ id, nodes }) => nodes.map(({ target }) => ({ id, target }))), path).toEqual([])
      if (path === practicalLessonPath(dining)) await page.screenshot({ path: info.outputPath(`practical-dining-${width}.png`) })
    }
  }
})
