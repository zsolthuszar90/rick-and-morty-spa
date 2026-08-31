import type { CharacterStatus } from '@/api/types'
import { cn } from '@/lib/utils'

const STATUS_DOT: Record<CharacterStatus, string> = {
  Alive: 'bg-emerald-500',
  Dead: 'bg-rose-500',
  unknown: 'bg-muted-foreground',
}

type StatusIndicatorProps = {
  status: CharacterStatus
}

export const StatusIndicator = ({ status }: StatusIndicatorProps) => (
  <span className="flex items-center gap-1.5 sm:gap-2">
    <span className={cn('size-2 shrink-0 rounded-full', STATUS_DOT[status])} />
    {status}
  </span>
)
