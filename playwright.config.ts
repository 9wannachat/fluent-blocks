import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'WebKit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run preview -- --host localhost --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
