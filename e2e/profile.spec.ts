import { expect, test } from './fixtures'

test.describe('character profile', () => {
  test('opens a profile from the table and returns with Back', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Rick Sanchez' }).click()

    await expect(page).toHaveURL(/\/character\/1$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Rick Sanchez' }),
    ).toBeVisible()
    await expect(page.getByText('Earth (C-137)')).toBeVisible()

    await page.getByRole('button', { name: 'Back' }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('keeps the search and page when returning from a profile', async ({
    page,
  }) => {
    await page.goto('/?q=beth&page=1')
    await page.getByRole('link', { name: 'Beth Smith' }).first().click()

    await expect(page).toHaveURL(/\/character\/\d+$/)

    await page.getByRole('button', { name: 'Back' }).click()

    await expect(page).toHaveURL(/\?q=beth/)
    await expect(page.getByRole('searchbox')).toHaveValue('beth')
  })

  test('Back reaches the list even when the profile was opened directly', async ({
    page,
  }) => {
    await page.goto('/character/2')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Morty Smith' }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Back' }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('reports a character that does not exist', async ({ page }) => {
    await page.goto('/character/999999')

    await expect(page.getByText(/does not exist/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Back' })).toBeVisible()
  })
})
