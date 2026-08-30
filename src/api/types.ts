export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown'

export type CharacterPlace = {
  name: string
  url: string
}

export type Character = {
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

export type PageInfo = {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export type CharacterPage = {
  info: PageInfo
  results: Character[]
}

export type CharacterQuery = {
  page?: number
  name?: string
}
