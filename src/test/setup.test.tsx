import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/button'

import { server } from './msw/server'

/**
 * Toolchain smoke tests. These assert that the *setup* works — jsdom renders,
 * the `@/` alias resolves, jest-dom matchers are loaded and MSW intercepts
 * requests. They are deliberately trivial; real tests arrive with the features.
 */
describe('test toolchain', () => {
  it('renders a component into jsdom', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button', { name: 'Click me' })).toBeVisible()
  })

  it('intercepts network requests with MSW', async () => {
    server.use(
      http.get('https://example.test/ping', () =>
        HttpResponse.json({ pong: true }),
      ),
    )

    const response = await fetch('https://example.test/ping')

    expect(await response.json()).toEqual({ pong: true })
  })
})
