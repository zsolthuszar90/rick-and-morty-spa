import type { RequestHandler } from 'msw'

/**
 * Default MSW handlers, applied to every test run.
 *
 * Keep these to the happy path only. Tests that need an error, an empty result
 * or a specific page should override per-test with `server.use(...)`.
 */
export const handlers: RequestHandler[] = []
