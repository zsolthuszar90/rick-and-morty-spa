import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Character } from '@/api/types'
import { CharacterTable } from '@/components/CharacterTable'
import { renderWithRouter } from '@/test/render'
import { morty, rick } from '@/test/fixtures'

const renderTable = (characters: Character[]) =>
  renderWithRouter(<CharacterTable characters={characters} />)

describe('CharacterTable', () => {
  it('labels every column', async () => {
    await renderTable([])

    const headers = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent)

    expect(headers).toEqual(['Avatar', 'Name', 'Species', 'Status'])
  })

  it('renders one row per character', async () => {
    await renderTable([rick, morty])

    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('shows the name, species and status of a character', async () => {
    await renderTable([rick])

    const row = screen.getByRole('row', { name: /Rick Sanchez/ })

    expect(within(row).getByText('Rick Sanchez')).toBeVisible()
    expect(within(row).getByText('Human')).toBeVisible()
    expect(within(row).getByText('Alive')).toBeVisible()
  })

  it('links each name to that character profile', async () => {
    await renderTable([rick, morty])

    expect(screen.getByRole('link', { name: 'Rick Sanchez' })).toHaveAttribute(
      'href',
      '/character/1',
    )
    expect(screen.getByRole('link', { name: 'Morty Smith' })).toHaveAttribute(
      'href',
      '/character/2',
    )
  })

  it('renders the avatar from the character image', async () => {
    const { container } = await renderTable([rick])

    expect(container.querySelector('img')).toHaveAttribute('src', rick.image)
  })

  it('renders only the header row when there are no characters', async () => {
    await renderTable([])

    expect(screen.getAllByRole('row')).toHaveLength(1)
  })
})
