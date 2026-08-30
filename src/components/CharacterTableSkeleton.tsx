import { CharacterTableShell } from '@/components/CharacterTableShell'
import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

type CharacterTableSkeletonProps = {
  rows?: number
}

export const CharacterTableSkeleton = ({
  rows = 20,
}: CharacterTableSkeletonProps) => (
  <CharacterTableShell caption="Loading characters">
    <TableBody>
      {Array.from({ length: rows }, (_, row) => (
        <TableRow key={row}>
          <TableCell>
            <Skeleton className="size-10 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </CharacterTableShell>
)
