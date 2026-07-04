import { test, expect } from '@playwright/test'

test('目次がハンバーガーボタンで開くドロワーになっている', async ({ page }) => {
  await page.goto('/')
  const drawerToggle = page.locator('button:has-text("☰ 目次")')
  await expect(drawerToggle).toBeVisible()

  const drawer = page.locator('.fixed.inset-0')
  await expect(drawer).toHaveCount(0)

  await drawerToggle.click()
  await expect(drawer).toBeVisible()

  const list = drawer.locator('ul')
  await expect(list.getByRole('button', { name: 'Fixture Tournament A' })).toBeVisible()
  await expect(list.getByRole('button', { name: 'Fixture Tournament B' })).toBeVisible()
  await expect(list.getByRole('button', { name: 'Fixture Tournament C' })).toBeVisible()

  await list.getByRole('button', { name: 'Fixture Tournament C' }).click()
  await expect(drawer).toHaveCount(0)
  await expect(page.locator('#fixture-tournament-c')).toBeInViewport()
})
