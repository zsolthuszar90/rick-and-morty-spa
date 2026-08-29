import { queryOptions } from '@tanstack/react-query'

import { fetchCharacter, fetchCharacters } from './characters'
import type { CharacterQuery } from './types'

export const characterQueries = {
  list: (query: CharacterQuery = {}) =>
    queryOptions({
      queryKey: ['characters', query],
      queryFn: ({ signal }) => fetchCharacters(query, signal),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ['character', id],
      queryFn: ({ signal }) => fetchCharacter(id, signal),
    }),
}
