import { test, expect } from '@playwright/test'

test('目次がハンバーガーボタンで開くドロワーになっている', async ({ page }) => {
  await page.goto('/')
  const drawerToggle = page.getByRole('button', { name: '目次を開く' })
  await expect(drawerToggle).toBeVisible()

  const drawerNav = page.locator('nav.shadow-lg')
  await expect(drawerNav).toHaveClass(/-translate-x-full/)

  await drawerToggle.click()
  await expect(drawerNav).toHaveClass(/translate-x-0/)

  const list = drawerNav.locator('ul')
  await expect(list.getByRole('button', { name: 'Fixture Tournament A' })).toBeVisible()
  await expect(list.getByRole('button', { name: 'Fixture Tournament B' })).toBeVisible()
  await expect(list.getByRole('button', { name: 'Fixture Tournament C' })).toBeVisible()

  await list.getByRole('button', { name: 'Fixture Tournament C' }).click()
  await expect(drawerNav).toHaveClass(/-translate-x-full/)
  await expect(page.locator('#fixture-tournament-c')).toBeInViewport()
})
