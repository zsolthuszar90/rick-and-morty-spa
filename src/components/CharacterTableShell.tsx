import { useEffect, useRef, type ReactNode } from 'react'

import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAtScrollEnd } from '@/hooks/useAtScrollEnd'
import { cn } from '@/lib/utils'

type CharacterTableShellProps = {
  caption: string
  scrollKey?: unknown
  children: ReactNode
}

export const CharacterTableShell = ({
  caption,
  scrollKey,
  children,
}: CharacterTableShellProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const atEnd = useAtScrollEnd(scrollRef)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [scrollKey])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <Table
        className="table-fixed text-xs sm:text-sm"
        containerClassName="min-h-0 flex-1"
        containerRef={scrollRef}
      >
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-14 sm:w-20">Avatar</TableHead>
            <TableHead className="w-[36%] sm:w-[45%]">Name</TableHead>
            <TableHead className="w-[20%] sm:w-[25%]">Species</TableHead>
            <TableHead className="w-[26%] sm:w-[20%]">Status</TableHead>
          </TableRow>
        </TableHeader>
        {children}
      </Table>

      <div
        aria-hidden
        className={cn(
          'from-background pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent transition-opacity duration-200',
          atEnd && 'opacity-0',
        )}
      />
    </div>
  )
}
