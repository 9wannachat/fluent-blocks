import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const lab = '/practice/everyday'
const pour = `${lab}/words/everyday-word-pour`

test('finds a contextual word, records learning and reviews it', async ({ page }) => {
  await page.goto('/practice')
  await page.getByRole('link', { name: 'คำศัพท์ในชีวิตประจำวัน' }).click()
  await page.getByRole('link', { name: 'สำรวจคำศัพท์' }).click()
  await page.getByRole('searchbox').fill('ริน')
  await page.getByLabel('หมวด').selectOption('cooking')
  await page.getByRole('link', { name: /pour/i }).first().click()
  await expect(page.getByRole('heading', { name: 'pour', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'สำรวจคำศัพท์' }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('ริน')
  await expect(page.getByLabel('หมวด')).toHaveValue('cooking')
  await page.getByRole('link', { name: /pour/i }).first().click()
  await page.getByRole('button', { name: 'รูปคำที่ใช้บ่อย' }).click()
  await expect(page.getByText('poured', { exact: true }).first()).toBeVisible()
  await page.getByRole('button', { name: 'บันทึกว่าเรียนแล้ว' }).click()
  await expect(page.getByRole('button', { name: 'เรียนแล้ว', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'เพิ่มในคิวทบทวน' }).click()
  await page.getByRole('link', { name: 'เปิดคิวทบทวน' }).click()
  await page.getByRole('button', { name: 'ดูคำตอบและตัวอย่าง' }).click()
  await page.getByRole('button', { name: 'พอจำได้' }).click()
  await expect(page.getByRole('heading', { name: 'วันนี้ไม่มีคำหรือวลีถึงกำหนด' })).toBeVisible()
  await page.goto(pour)
  await expect(page.getByRole('button', { name: 'เรียนแล้ว', exact: true })).toHaveAttribute('aria-pressed', 'true')
})

test('renders lab, detail and exercise on narrow mobile and wide screens', async ({ page }, info) => {
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [lab, pour, `${lab}/phrases`, `${lab}/exercises`, `${lab}/exercises?workshop=pour`]) {
      await page.goto(path)
      await expect(page.locator('main h1')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      await page.evaluate(() => document.fonts.ready.then(() => undefined))
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(result.violations.flatMap(({ id, nodes }) => nodes.map((node) => ({ id, target: node.target, summary: node.failureSummary }))), `${path} at ${width}px`).toEqual([])
      if (path === pour) await page.screenshot({ path: info.outputPath(`everyday-pour-${width}.png`) })
    }
  }
})

test('works offline with a vocabulary deep link', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByText('บทเรียนพร้อมใช้ออฟไลน์')).toBeVisible()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true)
  await page.goto(pour)
  await expect(page.getByRole('heading', { name: 'pour', exact: true })).toBeVisible()
})

test('finds take off by base verb and explains pronoun placement', async ({ page }) => {
  await page.goto(`${lab}/phrases`)
  await page.getByLabel('กริยาหลัก').selectOption('take')
  await page.getByRole('searchbox').fill('take off')
  await page.getByRole('link', { name: /take off/i }).first().click()
  await expect(page.getByRole('heading', { name: 'take off', exact: true })).toBeVisible()
  await expect(page.getByText(/take them off/i).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'ตำแหน่งกรรม' }).first()).toBeVisible()
})

test('persists a graded word-form attempt after reload', async ({ page }) => {
  await page.goto(pour)
  const form = page.locator('form').first()
  const answer = form.getByRole('textbox', { name: 'คำตอบของคุณ' })
  await answer.fill('poured')
  await form.getByRole('button', { name: 'ตรวจคำตอบ' }).click()
  await expect(form.getByText(/ยังไม่ถูก/)).toBeVisible()
  await answer.fill('pouring')
  await form.getByRole('button', { name: 'ตรวจอีกครั้ง' }).click()
  await expect(form.getByText('ถูกต้อง', { exact: true })).toBeVisible()
  await page.reload()
  await expect(form.getByText('ครั้งก่อนตอบถูกแล้ว')).toBeVisible()
})

test('adds degree, stance and reason to a sentence interactively', async ({ page }) => {
  await page.goto(`${lab}/exercises`)
  await expect(page.getByRole('heading', { name: 'ต่อประโยคจากความหมาย' })).toBeVisible()
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  await page.getByRole('button', { name: 'really', exact: true }).click()
  await expect(page.getByText('I really like coffee.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'ข้ามขั้นนี้' }).click()
  await page.getByRole('button', { name: 'I think', exact: true }).click()
  await page.getByRole('button', { name: 'because it helps me relax' }).click()
  await expect(page.getByText('I think I really like coffee because it helps me relax.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'ย้อนหนึ่งขั้น' }).click()
  await expect(page.getByText('I think I really like coffee.', { exact: true })).toBeVisible()
})

test('accepts production variants and gives a reason for a known error', async ({ page }) => {
  await page.goto(`${lab}/exercises?activity=everyday-activity-say-coffee-spilled`)
  const field = page.getByRole('textbox', { name: 'คำตอบของคุณ' })
  await field.fill('I spill coffee on my shirt this morning.')
  await page.getByRole('button', { name: 'ตรวจคำตอบ' }).click()
  await expect(page.getByText(/จึงต้องใช้รูปอดีต/)).toBeVisible()
  await field.fill('This morning, I spilt coffee on my shirt.')
  await page.getByRole('button', { name: 'ตรวจอีกครั้ง' }).click()
  await expect(page.getByText('ถูกต้อง', { exact: true })).toBeVisible()
})

test('opens a matching secondary sense and reviews that meaning', async ({ page }) => {
  await page.goto(`${lab}/phrases`)
  await page.getByRole('searchbox').fill('เครื่องบินออกจากพื้น')
  const result = page.getByRole('link', { name: /take off.*เครื่องบินออกจากพื้น/i })
  await expect(result).toBeVisible()
  await result.click()
  await expect(page).toHaveURL(/sense=flight/)
  await expect(page.getByRole('button', { name: 'เครื่องบินออกจากพื้น', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'เพิ่มในคิวทบทวน' }).click()
  await page.getByRole('link', { name: 'เปิดคิวทบทวน' }).click()
  await expect(page.getByRole('heading', { name: 'เครื่องบินออกจากพื้น', exact: true })).toBeVisible()
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  await page.getByRole('button', { name: 'ดูคำตอบและตัวอย่าง' }).click()
  await expect(page.getByRole('link', { name: 'เปิดความหมายที่กำลังทบทวน' })).toHaveAttribute('href', /sense=flight/)
})

test('connects vocabulary to contextual production and the grammar builder', async ({ page }) => {
  await page.goto(pour)
  await expect(page.getByRole('link', { name: 'Pour vs Spill' })).toBeVisible()
  await page.getByRole('link', { name: 'สร้างประโยคจากความหมายนี้' }).click()
  await page.getByRole('button', { name: 'รินเสร็จแล้ว' }).click()
  await page.getByRole('button', { name: 'into the glass' }).click()
  await expect(page.getByText('I’ve already poured water into the glass.', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: /Sentence Builder/ }).click()
  await expect(page.locator('.builder-sentence').first()).toHaveText('I am pouring water.')

  await page.goto(`${lab}/words/everyday-word-wear`)
  await page.getByRole('link', { name: 'สร้างประโยคจากความหมายนี้' }).click()
  await page.getByRole('button', { name: 'กำลังใส่แว่นอยู่' }).click()
  await expect(page.getByText('I’m wearing glasses.', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: /Sentence Builder/ }).click()
  await expect(page.locator('.builder-sentence').first()).toHaveText('I wear glasses.')

  await page.goto(`${lab}/phrases/everyday-phrase-take-off?sense=clothing`)
  await page.getByRole('link', { name: 'สร้างประโยคจากความหมายนี้' }).click()
  await page.getByRole('button', { name: 'ใช้ them' }).click()
  await expect(page.getByText('Take them off.', { exact: true })).toBeVisible()
})
