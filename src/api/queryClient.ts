import { QueryCache, QueryClient } from '@tanstack/react-query'

import { isRetryableError } from './characters'
import { notifyWhileRetrying } from './retryToast'

const BLIP_RETRY_MS = 1_000
const PAST_RATE_LIMIT_MS = 10_000

export const createQueryClient = () => {
  const queryCache = new QueryCache()
  notifyWhileRetrying(queryCache)

  return new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        // The Rick & Morty dataset is static, so cached pages stay valid for a while.
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) =>
          isRetryableError(error) && failureCount < 3,
        retryDelay: (failureCount) =>
          failureCount === 0 ? BLIP_RETRY_MS : PAST_RATE_LIMIT_MS,
      },
    },
  })
}
