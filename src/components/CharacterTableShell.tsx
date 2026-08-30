import type { ReactNode } from 'react'

import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type CharacterTableShellProps = {
  caption: string
  children: ReactNode
}

export const CharacterTableShell = ({
  caption,
  children,
}: CharacterTableShellProps) => (
  <Table containerClassName="min-h-0 flex-1">
    <TableCaption className="sr-only">{caption}</TableCaption>
    <TableHeader className="bg-background sticky top-0 z-10">
      <TableRow>
        <TableHead className="w-20">Avatar</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Species</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    {children}
  </Table>
)
