import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type CharacterTableSkeletonProps = {
  rows?: number
}

export const CharacterTableSkeleton = ({
  rows = 20,
}: CharacterTableSkeletonProps) => (
  <Table>
    <TableCaption className="sr-only">Loading characters</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-20">Avatar</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Species</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
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
  </Table>
)
