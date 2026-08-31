import { expect, test } from './fixtures'

test.describe('character list', () => {
  test('lists characters under the four required columns', async ({ page }) => {
    await page.goto('/')

    const headers = page.getByRole('columnheader')
    await expect(headers).toHaveText(['Avatar', 'Name', 'Species', 'Status'])

    const rows = page.getByRole('row')
    await expect(rows).toHaveCount(21)

    const first = rows.nth(1)
    await expect(
      first.getByRole('link', { name: 'Rick Sanchez' }),
    ).toBeVisible()
    await expect(first).toContainText('Human')
    await expect(first).toContainText('Alive')

    await expect(page.getByText(/\d+ characters/)).toBeVisible()
  })

  test('clears the search from the input', async ({ page }) => {
    await page.goto('/?q=beth')
    await expect(
      page.getByRole('link', { name: 'Beth Smith' }).first(),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Clear search' }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('searchbox')).toHaveValue('')
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeVisible()
  })

  test('offers a way back from an address that matches no route', async ({
    page,
  }) => {
    await page.goto('/nonsense')

    await expect(
      page.getByRole('heading', { name: 'Page not found' }),
    ).toBeVisible()

    await page.getByRole('link', { name: /Back to the characters/ }).click()

    await expect(page.getByRole('table')).toBeVisible()
  })

  test('filters by name as the user types', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeVisible()

    await page.getByRole('searchbox').fill('beth')

    await expect(page).toHaveURL(/\?q=beth$/)
    await expect(
      page.getByRole('link', { name: 'Beth Smith' }).first(),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeHidden()
  })

  test('explains when a search matches nothing', async ({ page }) => {
    await page.goto('/?q=notacharactername')

    await expect(page.getByText(/No characters match/)).toBeVisible()
    await expect(page.getByRole('table')).toBeHidden()
  })

  test('moves between pages and keeps the page in the url', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeVisible()

    await page.getByRole('link', { name: 'Page 2' }).click()

    await expect(page).toHaveURL(/\?page=2$/)
    await expect(page.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeHidden()
  })

  test('starts a new search from the first page', async ({ page }) => {
    await page.goto('/?page=3')
    await expect(page.getByRole('link', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await page.getByRole('searchbox').fill('beth')

    await expect(page).toHaveURL(/\?q=beth$/)
  })

  test('offers a way back from a page that does not exist', async ({
    page,
  }) => {
    await page.goto('/?page=999')

    await expect(page.getByText(/Page 999 doesn.t exist/)).toBeVisible()

    await page.getByRole('link', { name: /first page/i }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeVisible()
  })
})
