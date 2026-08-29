import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CharacterAvatar } from '@/components/CharacterAvatar'

const SRC = 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'

const renderAvatar = () => {
  const { container } = render(<CharacterAvatar src={SRC} />)
  const image = screen.getByRole('presentation', { hidden: true })

  return { image, placeholder: container.firstElementChild }
}

describe('CharacterAvatar', () => {
  it('hides the image and shows a placeholder before it loads', () => {
    const { image, placeholder } = renderAvatar()

    expect(image).toHaveClass('opacity-0')
    expect(placeholder).toHaveClass('animate-pulse')
  })

  it('reveals the image once it has loaded', () => {
    const { image, placeholder } = renderAvatar()

    fireEvent.load(image)

    expect(image).toHaveClass('opacity-100')
    expect(placeholder).not.toHaveClass('animate-pulse')
  })

  it('keeps a broken image hidden so only the placeholder circle shows', () => {
    const { placeholder, image } = renderAvatar()

    fireEvent.error(image)

    expect(placeholder).not.toHaveClass('animate-pulse')
    expect(image).toHaveClass('opacity-0')
  })
})
