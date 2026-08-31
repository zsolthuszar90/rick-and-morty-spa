import type { Character, CharacterPage, CharacterQuery } from './types'

const BASE_URL = 'https://rickandmortyapi.com/api'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const isRetryableError = (error: unknown) =>
  !(error instanceof ApiError && error.status < 500)

export const EMPTY_PAGE: CharacterPage = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

const request = async <T>(path: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, { signal })

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
    )
  }

  return response.json() as Promise<T>
}

export const fetchCharacters = async (
  { page = 1, name = '' }: CharacterQuery = {},
  signal?: AbortSignal,
): Promise<CharacterPage> => {
  const search = new URLSearchParams({ page: String(page) })
  const trimmedName = name.trim()
  if (trimmedName) search.set('name', trimmedName)

  try {
    return await request<CharacterPage>(`/character?${search}`, signal)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return EMPTY_PAGE
    throw error
  }
}

export const fetchCharacter = (
  id: number,
  signal?: AbortSignal,
): Promise<Character> => request<Character>(`/character/${id}`, signal)
