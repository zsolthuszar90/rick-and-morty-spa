import { QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from './characters'
import { notifyWhileRetrying } from './retryToast'

vi.mock('sonner', () => ({
  toast: { info: vi.fn(), dismiss: vi.fn() },
}))

const setup = () => {
  const queryCache = new QueryCache()
  const unsubscribe = notifyWhileRetrying(queryCache)
  const client = new QueryClient({ queryCache })

  return { queryCache, client, unsubscribe }
}

const run = async (
  client: QueryClient,
  queryFn: () => Promise<unknown>,
  retry: number | boolean = false,
) => {
  await client
    .fetchQuery({ queryKey: ['characters', Math.random()], queryFn, retry })
    .catch(() => {})
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('notifyWhileRetrying', () => {
  it('says nothing while requests succeed', async () => {
    const { client, unsubscribe } = setup()

    await run(client, async () => 'ok')

    expect(toast.info).not.toHaveBeenCalled()
    unsubscribe()
  })

  it('warns while a request is being retried', async () => {
    const { client, unsubscribe } = setup()

    await run(
      client,
      async () => {
        throw new TypeError('Failed to fetch')
      },
      1,
    )

    expect(toast.info).toHaveBeenCalled()
    unsubscribe()
  })

  it('stays quiet for an error that will not be retried', async () => {
    const { client, unsubscribe } = setup()

    await run(client, async () => {
      throw new ApiError('missing', 404)
    })

    expect(toast.info).not.toHaveBeenCalled()
    unsubscribe()
  })

  it('dismisses once a request succeeds again', async () => {
    const { client, unsubscribe } = setup()

    await run(
      client,
      async () => {
        throw new TypeError('Failed to fetch')
      },
      1,
    )
    expect(toast.info).toHaveBeenCalled()

    await run(client, async () => 'ok')

    expect(toast.dismiss).toHaveBeenCalled()
    unsubscribe()
  })
})
