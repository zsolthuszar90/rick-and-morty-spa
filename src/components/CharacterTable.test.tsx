import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Character } from '@/api/types'
import { CharacterTable } from '@/components/CharacterTable'
import { morty, rick } from '@/test/fixtures'

const renderTable = (characters: Character[]) =>
  render(<CharacterTable characters={characters} />)

describe('CharacterTable', () => {
  it('labels every column', () => {
    renderTable([])

    const headers = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent)

    expect(headers).toEqual(['Avatar', 'Name', 'Species', 'Status'])
  })

  it('renders one row per character', () => {
    renderTable([rick, morty])

    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('shows the name, species and status of a character', () => {
    renderTable([rick])

    const row = screen.getByRole('row', { name: /Rick Sanchez/ })

    expect(within(row).getByText('Rick Sanchez')).toBeVisible()
    expect(within(row).getByText('Human')).toBeVisible()
    expect(within(row).getByText('Alive')).toBeVisible()
  })

  it('renders the avatar from the character image', () => {
    const { container } = renderTable([rick])

    const avatar = container.querySelector('img')

    expect(avatar).toHaveAttribute('src', rick.image)
  })

  it('renders only the header row when there are no characters', () => {
    renderTable([])

    expect(screen.getAllByRole('row')).toHaveLength(1)
  })
})
