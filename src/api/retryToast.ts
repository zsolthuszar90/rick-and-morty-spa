import type { QueryCache } from '@tanstack/react-query'
import { toast } from 'sonner'

import { isRetryableError } from './characters'

const TOAST_ID = 'api-retrying'

// Throttling usually takes 9s - 10s
const RETRY_TOAST_MS = 12_000

const MESSAGE =
  'Too many requests. API blocked us for a few seconds. Will retry automatically.'

export const notifyWhileRetrying = (queryCache: QueryCache) =>
  queryCache.subscribe((event) => {
    const retrying = queryCache
      .getAll()
      .some(
        ({ state }) =>
          state.fetchStatus === 'fetching' &&
          state.fetchFailureCount > 0 &&
          isRetryableError(state.fetchFailureReason),
      )

    if (retrying) {
      toast.info(MESSAGE, {
        id: TOAST_ID,
        duration: RETRY_TOAST_MS,
        closeButton: false,
      })
      return
    }

    if (event.type === 'updated' && event.action.type === 'success') {
      toast.dismiss(TOAST_ID)
    }
  })
