import { createServer } from 'node:http'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join, resolve } from 'node:path'
import { test, expect } from '@playwright/test'
import { build } from 'vite'

const mime: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

test('accepts a waiting service worker update and preserves progress', async ({ page }) => {
  const upgraded = await mkdtemp(join(tmpdir(), 'fluent-blocks-update-'))
  await build({
    logLevel: 'silent',
    build: { outDir: upgraded },
    plugins: [{
      name: 'test-release-marker',
      transformIndexHtml: (html) => html.replace('</head>', '<meta name="test-release" content="2"></head>'),
    }],
  })
  let directory = resolve('dist')
  const server = createServer(async (request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost')
    const extension = extname(pathname)
    const filename = extension ? resolve(directory, pathname.slice(1)) : resolve(directory, 'index.html')
    try {
      if (!filename.startsWith(`${directory}/`)) throw new Error('Invalid path')
      const data = await readFile(filename)
      response.setHeader('Content-Type', mime[extension || '.html'] ?? 'application/octet-stream')
      response.setHeader('Cache-Control', 'no-store')
      response.end(data)
    } catch {
      response.writeHead(404).end()
    }
  })
  await new Promise<void>((resolve) => server.listen(0, 'localhost', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('No preview address')
  try {
    await page.goto(`http://localhost:${address.port}/learn/m2-07`)
    await expect(page.getByText('บทเรียนพร้อมใช้ออฟไลน์')).toBeVisible()
    await page.getByRole('button', { name: 'บุ๊กมาร์ก', exact: true }).click()
    await expect(page.getByRole('button', { name: 'บุ๊กมาร์กแล้ว' })).toBeVisible()
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
    directory = upgraded
    await page.evaluate(async () => { await (await navigator.serviceWorker.ready).update() })
    const accept = page.getByRole('button', { name: 'อัปเดตและโหลดใหม่' })
    await expect(accept).toBeVisible()
    await Promise.all([page.waitForEvent('load'), accept.click()])
    await expect(page.locator('meta[name=test-release]')).toHaveAttribute('content', '2')
    await expect(accept).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'บุ๊กมาร์กแล้ว' })).toBeVisible()
  } finally {
    server.closeAllConnections()
    await new Promise<void>((resolve) => server.close(() => resolve()))
    await rm(upgraded, { recursive: true, force: true })
  }
})
