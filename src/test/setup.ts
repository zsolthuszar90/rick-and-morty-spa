import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import { server } from './msw/server'

vi.stubGlobal('scrollTo', vi.fn())
Element.prototype.scrollTo = vi.fn()

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)

// `error` means an unhandled request fails the test instead of silently hitting
// the real API — that is the whole reason MSW is here.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => server.close())
