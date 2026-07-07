import { test, expect } from '@playwright/test'

test('目次がハンバーガーボタンで開くドロワーになっている', async ({ page }) => {
  await page.goto('/')
  const drawerToggle = page.getByRole('button', { name: '目次を開く' })
  await expect(drawerToggle).toBeVisible()

  // MUI's modal-backed drawer exposes role="dialog" (the standard modal-drawer
  // pattern, since it traps focus behind a backdrop) and only mounts while open,
  // so this also covers the closed state (no matching element counts as hidden).
  const drawerNav = page.getByRole('dialog')
  await expect(drawerNav).toBeHidden()

  await drawerToggle.click()
  await expect(drawerNav.getByRole('button', { name: 'Fixture Tournament A' })).toBeVisible()
  await expect(drawerNav.getByRole('button', { name: 'Fixture Tournament B' })).toBeVisible()
  await expect(drawerNav.getByRole('button', { name: 'Fixture Tournament C' })).toBeVisible()

  await drawerNav.getByRole('button', { name: 'Fixture Tournament C' }).click()
  await expect(drawerNav).toBeHidden()
  await expect(page.locator('#fixture-tournament-c')).toBeInViewport()
})
