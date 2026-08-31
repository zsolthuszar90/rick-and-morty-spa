import { useEffect } from 'react'
import { toast } from 'sonner'

import { isRetryableError } from '@/api/characters'

const TOAST_ID = 'api-retrying'

// Throttling usually takes 9s - 10s
const RETRY_TOAST_MS = 12_000

export const useApiRetryToast = (failureCount: number, reason: unknown) => {
  const retrying = failureCount > 0 && isRetryableError(reason)

  useEffect(() => {
    if (!retrying) {
      toast.dismiss(TOAST_ID)
      return
    }

    toast.info(
      'Too many requests. API blocked us for a few seconds. Will retry automatically.',
      {
        id: TOAST_ID,
        duration: RETRY_TOAST_MS,
        closeButton: false,
      },
    )
  }, [retrying])
}
