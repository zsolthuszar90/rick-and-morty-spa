import { useEffect } from 'react'
import { toast } from 'sonner'

const TOAST_ID = 'api-retrying'

// Throttling usually takes 9s - 10s
const RETRY_TOAST_MS = 12_000

export const useApiRetryToast = (failureCount: number) => {
  useEffect(() => {
    if (failureCount === 0) {
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
  }, [failureCount])
}
