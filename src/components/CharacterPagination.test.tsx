import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CharacterPagination } from '@/components/CharacterPagination'
import { renderWithRouter } from '@/test/render'

describe('CharacterPagination', () => {
  it('renders nothing when there is only one page', async () => {
    const { container } = await renderWithRouter(
      <CharacterPagination page={1} totalPages={1} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('marks the current page for assistive technology', async () => {
    await renderWithRouter(<CharacterPagination page={3} totalPages={42} />)

    expect(screen.getByRole('link', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Page 2' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('omits the page number from the first page link', async () => {
    await renderWithRouter(<CharacterPagination page={3} totalPages={42} />)

    expect(screen.getByRole('link', { name: 'Page 1' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '/?page=2',
    )
  })

  it('disables Previous on the first page', async () => {
    await renderWithRouter(<CharacterPagination page={1} totalPages={42} />)

    expect(
      screen.queryByRole('link', { name: 'Previous page' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next page' })).toBeVisible()
  })

  it('disables Next on the last page', async () => {
    await renderWithRouter(<CharacterPagination page={42} totalPages={42} />)

    expect(
      screen.queryByRole('link', { name: 'Next page' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Previous page' })).toBeVisible()
  })
})
