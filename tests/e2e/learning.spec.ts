import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('learn, practice, reference and reload from a deep link', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('จากฟังเข้าใจ สู่พูดได้ด้วยตัวเอง')
  await page.screenshot({ path: testInfo.outputPath('home.png') })
  await page.goto('/learn/m2-07')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('button', { name: 'บุ๊กมาร์ก', exact: true }).click()
  await expect(page.getByRole('button', { name: 'บุ๊กมาร์กแล้ว' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('tab', { name: 'ลองฝึก', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'ลองใช้โครงสร้าง' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'ลองใช้โครงสร้าง' })).toBeVisible()
  await page.getByRole('tab', { name: 'หลักและเหตุผล', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'คิดจากสิ่งที่อยากพูด' })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('lesson.png') })
  await page.goto('/practice/builder')
  await expect(page.locator('.builder-sentence').first()).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('builder.png') })
  await page.goto('/practice')
  await expect(page.getByRole('link', { name: 'สร้างประโยค', exact: true })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('practice.png') })
  await page.goto('/reference')
  await page.getByRole('searchbox').fill('does')
  await expect(page.getByRole('link', { name: /does/i }).first()).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('reference.png') })
  expect(errors).toEqual([])
})

for (const width of [320, 375, 390, 768, 1200]) {
  test(`navigation and builder fit ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 850 })
    await page.goto('/practice/builder')
    await expect(page.locator('.builder-sentence').first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab')
    await expect(page.getByText('ข้ามไปเนื้อหา')).toBeFocused()
    if (width === 390 || width === 1200) {
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations.map(({ id }) => id)).toEqual([])
    }
  })
}

test('opens a lesson offline after precache', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByText('บทเรียนพร้อมใช้ออฟไลน์')).toBeVisible()
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true)
  await page.goto('/learn/m2-07')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText(/ออฟไลน์ ·/)).toBeVisible()
})

test('diagnostic recommends missed objectives and can be taken again', async ({ page }) => {
  await page.goto('/learn/diagnostic')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('สำรวจทักษะที่อยากฝึก')
  for (let i = 0; i < 18; i++) {
    await page.getByRole('radiogroup', { name: 'ตัวเลือกคำตอบ' }).getByRole('radio').nth(i === 0 ? 1 : (3 - (i % 3)) % 3).click()
    await page.getByRole('button', { name: 'ตรวจคำตอบ' }).click()
    await page.getByRole('button', { name: i === 17 ? 'ดูบทที่แนะนำ' : 'ข้อต่อไป' }).click()
  }
  await expect(page.getByRole('heading', { name: 'บทที่แนะนำ' })).toBeVisible()
  await expect(page.locator('a[href="/learn/m2-03"]')).toBeVisible()
  await page.getByRole('button', { name: 'ทำใหม่' }).click()
  await expect(page.getByRole('heading', { name: /ข้อ 1\/18/ })).toBeVisible()
})

test('pattern retrieval and rating update the due queue', async ({ page }) => {
  await page.goto('/reference?q=Does')
  await page.locator('a[href^="/reference/pattern/"]').first().click()
  await page.getByRole('button', { name: 'เพิ่มในคิวทบทวน' }).click()
  await page.getByRole('link', { name: 'เปิดคิว' }).click()
  await page.getByRole('button', { name: 'ดูรูปประโยค' }).click()
  await page.getByRole('button', { name: 'พอจำได้' }).click()
  await expect(page.getByRole('heading', { name: 'วันนี้ไม่มีรายการถึงกำหนด' })).toBeVisible()
})

test('dashboard stays dark and accessible across desktop and mobile', async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  await expect(page.getByRole('link', { name: 'ภาพรวม Overview' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByText('ยังไม่มีผลการฝึก')).toBeVisible()
  await expect(page.getByText(/ความคืบหน้าจะเริ่มนับที่นี่/)).toBeVisible()
  const start = page.getByRole('link', { name: 'เริ่มบทเรียน' })
  await expect(start).toHaveAttribute('href', '/learn/m2-06')
  await page.screenshot({ path: testInfo.outputPath('dashboard-desktop.png') })
  await start.click()
  await page.getByRole('tab', { name: 'ลองฝึก', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'ลองใช้โครงสร้าง' })).toBeVisible()
  await page.getByRole('link', { name: 'ภาพรวม Overview' }).click()
  await expect(page.getByRole('link', { name: 'กลับไปเรียนต่อ' })).toHaveAttribute('href', '/learn/m2-06')
  await expect(page.getByRole('progressbar', { name: 'ตำแหน่งในบทเรียนปัจจุบัน' })).toHaveAttribute('aria-valuenow', '75')
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 960 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations.map(({ id }) => id)).toEqual([])
  }
})

test('theme switcher applies light, system and dark and survives reload', async ({ page }) => {
  await page.goto('/settings')
  const html = page.locator('html')
  await expect(html).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('radiogroup', { name: 'ธีม' }).first().getByRole('radio', { name: 'สว่าง' }).click()
  await expect(html).toHaveAttribute('data-theme', 'light')
  await expect(html).toHaveCSS('color-scheme', 'light')
  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'light')
  for (const path of ['/', '/learn', '/learn/m2-06', '/learn/diagnostic', '/practice', '/practice/builder', '/practice/decision', '/practice/connectors', '/practice/conversation', '/practice/conversation/clarification', '/practice/podcast', '/reference', '/reference/notebook', '/reference/pattern/p-does-she-like', '/review', '/settings']) {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations.map(({ id }) => id)).toEqual([])
  }
  await page.goto('/settings')
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.getByRole('radiogroup', { name: 'ธีม' }).first().getByRole('radio', { name: 'ตามระบบ' }).click()
  await expect(html).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(html).toHaveAttribute('data-theme', 'light')
})

test('mobile navigation reaches the overview and keeps lesson sections on one row', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/learn/m2-06')
  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveCount(4)
  const tops = await tabs.evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)))
  expect(new Set(tops).size).toBe(1)
  await expect(page.getByRole('tab', { name: 'ตัวอย่างและบทสนทนา', exact: true })).toBeVisible()
  const bottom = page.locator('.bottom-nav')
  await bottom.getByRole('link', { name: 'ภาพรวม Overview' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(bottom.getByRole('link', { name: 'ภาพรวม Overview' })).toHaveAttribute('aria-current', 'page')
  await expect(bottom.getByRole('link', { name: 'เรียน Learn' })).not.toHaveAttribute('aria-current', 'page')
})

test('gets targeted feedback, retries and builds a natural expansion', async ({ page }) => {
  await page.goto('/practice/decision')
  await page.getByRole('button', { name: 'ความชอบหรือกิจวัตร' }).click()
  await page.getByRole('radio', { name: 'Does she likes you?' }).click()
  await page.getByRole('button', { name: 'ตรวจคำตอบ' }).click()
  await expect(page.getByRole('status').filter({ hasText: /ยังไม่ถูก.*คืน likes เป็น like/ })).toBeVisible()
  await page.getByRole('radio', { name: 'Does she like you?', exact: true }).click()
  await page.getByRole('button', { name: 'ตรวจอีกครั้ง' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'ถูกต้อง' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'ลองใหม่' })).toBeVisible()
  await page.goto('/practice/connectors')
  for (let step = 0; step < 5; step++) await page.getByRole('button', { name: 'เติมอีกหนึ่งส่วน' }).click()
  await expect(page.getByText('So, I guess it’s kind of difficult right now, but it’ll get easier over time.', { exact: true })).toBeVisible()
  await page.getByLabel('คำตอบของคุณ').fill('I’m still practising, but it feels easier today.')
  await page.getByRole('button', { name: 'ส่งคำตอบของฉัน' }).click()
  await page.getByRole('button', { name: 'ดูตัวอย่างและประเมินตนเอง' }).click()
  await page.getByRole('button', { name: 'บันทึกว่าประเมินตนเองแล้ว' }).click()
  await expect(page.getByRole('button', { name: 'ประเมินตนเองแล้ว' })).toBeDisabled()
})

test('shared components fit the mobile notebook and settings pages', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  for (const path of ['/practice/podcast', '/reference/notebook', '/settings']) {
    await page.goto(path)
    await expect(page.locator('main h1')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(axe.violations.map(({ id }) => id)).toEqual([])
  }
})
