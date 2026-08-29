import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type AvatarState = 'loading' | 'loaded' | 'failed'

interface CharacterAvatarProps {
  src: string
}

export const CharacterAvatar = ({ src }: CharacterAvatarProps) => {
  const [state, setState] = useState<AvatarState>('loading')
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const image = imageRef.current
    if (!image?.complete) return
    setState(image.naturalWidth > 0 ? 'loaded' : 'failed')
  }, [])

  return (
    <div
      className={cn(
        'bg-muted size-10 overflow-hidden rounded-full',
        state === 'loading' && 'animate-pulse',
      )}
    >
      <img
        ref={imageRef}
        src={src}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        onLoad={() => setState('loaded')}
        onError={() => setState('failed')}
        className={cn(
          'size-full object-cover transition-opacity duration-300',
          state === 'loaded' ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}
