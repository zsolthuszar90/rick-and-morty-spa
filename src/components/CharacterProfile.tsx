import type { ReactNode } from 'react'

import type { Character } from '@/api/types'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { StatusIndicator } from '@/components/StatusIndicator'

type DetailProps = {
  label: string
  children: ReactNode
}

const Detail = ({ label, children }: DetailProps) => (
  <div className="space-y-1">
    <dt className="text-muted-foreground text-xs tracking-wide uppercase">
      {label}
    </dt>
    <dd className="wrap-break-word">{children}</dd>
  </div>
)

type CharacterProfileProps = {
  character: Character
}

export const CharacterProfile = ({ character }: CharacterProfileProps) => (
  <article className="space-y-8">
    <header className="flex items-start gap-4">
      <CharacterAvatar
        src={character.image}
        className="size-24 rounded-lg sm:size-32"
      />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight wrap-break-word">
          {character.name}
        </h1>
        <div className="text-sm">
          <StatusIndicator status={character.status} />
        </div>
      </div>
    </header>

    <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
      <Detail label="Species">{character.species}</Detail>
      <Detail label="Type">{character.type || '—'}</Detail>
      <Detail label="Gender">{character.gender}</Detail>
      <Detail label="Origin">{character.origin.name}</Detail>
      <Detail label="Last known location">{character.location.name}</Detail>
      <Detail label="Episodes">{character.episode.length}</Detail>
    </dl>
  </article>
)
