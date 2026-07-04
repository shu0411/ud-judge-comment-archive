import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Launching multiple browsers concurrently can time out in constrained
  // sandboxed environments, so keep this at 1.
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5199',
  },
  webServer: {
    command: 'npm run dev -- --mode e2e --port 5199 --strictPort',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop',
      testMatch: /desktop\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile',
      testMatch: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
  ],
})
