import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type AvatarState = 'loading' | 'loaded' | 'failed'

// The API rate-limits for around ten seconds, so the second attempt waits it out.
const RETRY_DELAYS_MS = [2_000, 9_000]

type CharacterAvatarProps = {
  src: string
  className?: string
}

export const CharacterAvatar = ({ src, className }: CharacterAvatarProps) => {
  const [state, setState] = useState<AvatarState>('loading')
  const [attempt, setAttempt] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const retryTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const image = imageRef.current
    if (image?.complete) setState(image.naturalWidth > 0 ? 'loaded' : 'failed')

    return () => clearTimeout(retryTimer.current)
  }, [])

  const retryOrGiveUp = () => {
    const delay = RETRY_DELAYS_MS[attempt]

    if (delay === undefined) {
      setState('failed')
      return
    }

    retryTimer.current = setTimeout(() => {
      setState('loading')
      setAttempt((previous) => previous + 1)
    }, delay)
  }

  return (
    <div
      className={cn(
        'bg-muted size-10 shrink-0 overflow-hidden rounded-full',
        state === 'loading' && 'animate-pulse',
        className,
      )}
    >
      <img
        key={attempt}
        ref={imageRef}
        src={src}
        alt=""
        loading="lazy"
        onLoad={() => setState('loaded')}
        onError={retryOrGiveUp}
        className={cn(
          'size-full object-cover transition-opacity duration-300',
          state === 'loaded' ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}
