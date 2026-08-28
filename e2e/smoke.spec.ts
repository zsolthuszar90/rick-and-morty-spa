import { expect, test } from '@playwright/test'

test('the app boots and renders the home route', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Rick & Morty' }),
  ).toBeVisible()
})
