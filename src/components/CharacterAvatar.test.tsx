import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CharacterAvatar } from '@/components/CharacterAvatar'

const SRC = 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'

const renderAvatar = () => {
  const { container } = render(<CharacterAvatar src={SRC} />)

  return {
    image: () => screen.getByRole('presentation', { hidden: true }),
    placeholder: container.firstElementChild,
  }
}

const wait = (ms: number) => act(() => void vi.advanceTimersByTime(ms))

describe('CharacterAvatar', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('hides the image and shows a placeholder before it loads', () => {
    const { image, placeholder } = renderAvatar()

    expect(image()).toHaveClass('opacity-0')
    expect(placeholder).toHaveClass('animate-pulse')
  })

  it('reveals the image once it has loaded', () => {
    const { image, placeholder } = renderAvatar()

    fireEvent.load(image())

    expect(image()).toHaveClass('opacity-100')
    expect(placeholder).not.toHaveClass('animate-pulse')
  })

  it('tries again when an image fails to load', () => {
    const { image, placeholder } = renderAvatar()

    fireEvent.error(image())
    wait(2_000)

    expect(placeholder).toHaveClass('animate-pulse')

    fireEvent.load(image())

    expect(image()).toHaveClass('opacity-100')
  })

  it('gives up after the retries are exhausted', () => {
    const { image, placeholder } = renderAvatar()

    fireEvent.error(image())
    wait(2_000)
    fireEvent.error(image())
    wait(9_000)
    fireEvent.error(image())

    expect(placeholder).not.toHaveClass('animate-pulse')
    expect(image()).toHaveClass('opacity-0')
  })
})
