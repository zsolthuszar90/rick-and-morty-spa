import type { Character, CharacterStatus } from '@/api/types'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const STATUS_DOT: Record<CharacterStatus, string> = {
  Alive: 'bg-emerald-500',
  Dead: 'bg-rose-500',
  unknown: 'bg-muted-foreground',
}

interface CharacterTableProps {
  characters: Character[]
}

export const CharacterTable = ({ characters }: CharacterTableProps) => (
  <Table>
    <TableCaption className="sr-only">Rick and Morty characters</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-20">Avatar</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Species</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {characters.map((character) => (
        <TableRow key={character.id}>
          <TableCell>
            <CharacterAvatar src={character.image} />
          </TableCell>
          <TableCell className="min-w-32 font-medium wrap-break-word whitespace-normal">
            {character.name}
          </TableCell>
          <TableCell className="wrap-break-word whitespace-normal">
            {character.species}
          </TableCell>
          <TableCell>
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  STATUS_DOT[character.status],
                )}
              />
              {character.status}
            </span>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
