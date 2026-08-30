import { Link } from '@tanstack/react-router'

import type { Character } from '@/api/types'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { StatusIndicator } from '@/components/StatusIndicator'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type CharacterTableProps = {
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
            <Link
              to="/character/$id"
              params={{ id: character.id }}
              className="hover:text-primary rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {character.name}
            </Link>
          </TableCell>
          <TableCell className="wrap-break-word whitespace-normal">
            {character.species}
          </TableCell>
          <TableCell>
            <StatusIndicator status={character.status} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
