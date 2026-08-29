import type { Character, CharacterPage, PageInfo } from '@/api/types'

export const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth (C-137)',
    url: 'https://rickandmortyapi.com/api/location/1',
  },
  location: {
    name: 'Citadel of Ricks',
    url: 'https://rickandmortyapi.com/api/location/3',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
}

export const morty: Character = {
  ...rick,
  id: 2,
  name: 'Morty Smith',
  url: 'https://rickandmortyapi.com/api/character/2',
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
}

export const characterPage = (
  results: Character[],
  info: Partial<PageInfo> = {},
): CharacterPage => ({
  info: {
    count: results.length,
    pages: 1,
    next: null,
    prev: null,
    ...info,
  },
  results,
})
