import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CharacterProfile } from '@/components/CharacterProfile'
import { rick } from '@/test/fixtures'

describe('CharacterProfile', () => {
  it('shows the character name as the page heading', () => {
    render(<CharacterProfile character={rick} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Rick Sanchez' }),
    ).toBeVisible()
  })

  it('lists the character details', () => {
    render(<CharacterProfile character={rick} />)

    expect(screen.getByText('Male')).toBeVisible()
    expect(screen.getByText('Earth (C-137)')).toBeVisible()
    expect(screen.getByText('Citadel of Ricks')).toBeVisible()
  })

  it('shows the number of episodes rather than the raw urls', () => {
    render(<CharacterProfile character={rick} />)

    expect(screen.getByText(String(rick.episode.length))).toBeVisible()
  })

  it('falls back to a dash when the character has no type', () => {
    render(<CharacterProfile character={{ ...rick, type: '' }} />)

    expect(screen.getByText('—')).toBeVisible()
  })
})
