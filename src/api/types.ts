export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown'

export interface CharacterPlace {
  name: string
  url: string
}

export interface Character {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: CharacterGender
  origin: CharacterPlace
  location: CharacterPlace
  image: string
  episode: string[]
  url: string
  created: string
}

export interface PageInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface CharacterPage {
  info: PageInfo
  results: Character[]
}

export interface CharacterQuery {
  page?: number
  name?: string
}
