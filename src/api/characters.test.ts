import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { characterPage, morty, rick } from '@/test/fixtures'
import { server } from '@/test/msw/server'

import {
  ApiError,
  EMPTY_PAGE,
  fetchCharacter,
  fetchCharacters,
} from './characters'

const CHARACTERS_URL = 'https://rickandmortyapi.com/api/character'
const CHARACTER_URL = 'https://rickandmortyapi.com/api/character/:id'

const captureSearch = () => {
  const captured: { params: URLSearchParams | null } = { params: null }

  server.use(
    http.get(CHARACTERS_URL, ({ request }) => {
      captured.params = new URL(request.url).searchParams
      return HttpResponse.json(characterPage([rick]))
    }),
  )

  return captured
}

describe('fetchCharacters', () => {
  it('returns the page of results', async () => {
    server.use(
      http.get(CHARACTERS_URL, () =>
        HttpResponse.json(characterPage([rick, morty])),
      ),
    )

    const page = await fetchCharacters()

    expect(page.results).toHaveLength(2)
    expect(page.results[0].name).toBe('Rick Sanchez')
  })

  it('defaults to the first page', async () => {
    const captured = captureSearch()

    await fetchCharacters()

    expect(captured.params?.get('page')).toBe('1')
  })

  it('sends the requested page and name', async () => {
    const captured = captureSearch()

    await fetchCharacters({ page: 3, name: 'rick' })

    expect(captured.params?.get('page')).toBe('3')
    expect(captured.params?.get('name')).toBe('rick')
  })

  it('trims the name before sending it', async () => {
    const captured = captureSearch()

    await fetchCharacters({ name: '  rick  ' })

    expect(captured.params?.get('name')).toBe('rick')
  })

  it('omits the name when it is blank', async () => {
    const captured = captureSearch()

    await fetchCharacters({ name: '   ' })

    expect(captured.params?.has('name')).toBe(false)
  })

  it('turns a 404 into an empty page, since a search that matches nothing is not an error', async () => {
    server.use(
      http.get(CHARACTERS_URL, () =>
        HttpResponse.json({ error: 'There is nothing here' }, { status: 404 }),
      ),
    )

    await expect(fetchCharacters({ name: 'zzzz' })).resolves.toEqual(EMPTY_PAGE)
  })

  it('throws on any other error status', async () => {
    server.use(
      http.get(CHARACTERS_URL, () => new HttpResponse(null, { status: 500 })),
    )

    await expect(fetchCharacters()).rejects.toThrow(ApiError)
  })
})

describe('fetchCharacter', () => {
  it('returns a single character', async () => {
    server.use(http.get(CHARACTER_URL, () => HttpResponse.json(rick)))

    await expect(fetchCharacter(1)).resolves.toEqual(rick)
  })

  it('requests the given id', async () => {
    let requestedId: string | undefined

    server.use(
      http.get(CHARACTER_URL, ({ params }) => {
        requestedId = params.id as string
        return HttpResponse.json(morty)
      }),
    )

    await fetchCharacter(2)

    expect(requestedId).toBe('2')
  })

  it('throws a 404 ApiError for an unknown id, unlike a search', async () => {
    server.use(
      http.get(CHARACTER_URL, () =>
        HttpResponse.json({ error: 'Character not found' }, { status: 404 }),
      ),
    )

    await expect(fetchCharacter(999999)).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
    })
  })
})
