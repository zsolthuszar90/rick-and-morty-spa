import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, TriangleAlert, X } from 'lucide-react'

import { characterQueries } from '@/api/queries'
import { CharacterPagination } from '@/components/CharacterPagination'
import { CharacterTable } from '@/components/CharacterTable'
import { CharacterTableSkeleton } from '@/components/CharacterTableSkeleton'
import { Alert, AlertAction, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApiRetryToast } from '@/hooks/useApiRetryToast'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const SEARCH_DELAY_MS = 300

type HomeSearch = {
  q?: string
  page?: number
}

const HomePage = () => {
  const { q = '', page = 1 } = Route.useSearch()
  const navigate = Route.useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebouncedValue(q, SEARCH_DELAY_MS)

  const { data, isPending, isError, refetch, failureCount, failureReason } =
    useQuery(characterQueries.list({ name: debouncedQuery, page }))

  useApiRetryToast(failureCount, failureReason)

  useDocumentMeta({
    title: q ? `Search: ${q}` : page > 1 ? `Page ${page}` : undefined,
    description: 'Browse Rick & Morty characters and their profiles.',
  })

  const noResults = data?.results.length === 0
  const pageOutOfRange = noResults && !debouncedQuery

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 sm:gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Rick &amp; Morty
        </h1>

        <div className="relative sm:w-72">
          <Search
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            ref={searchRef}
            type="search"
            value={q}
            aria-label="Search characters by name"
            placeholder="Search by name…"
            className="px-9"
            onChange={(event) =>
              navigate({
                search: { q: event.target.value || undefined, page: undefined },
                replace: true,
              })
            }
          />
          {q && (
            <button
              type="button"
              aria-label="Clear search"
              className="hover:bg-accent focus-visible:ring-ring absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-sm p-1 focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => {
                navigate({ search: {}, replace: true })
                searchRef.current?.focus()
              }}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </header>

      {isError && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Could not load the characters.</AlertTitle>
          <AlertAction>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertAction>
        </Alert>
      )}

      {data && !noResults && (
        <p className="text-muted-foreground -mt-2 text-sm">
          {debouncedQuery
            ? `${data.info.count} matching “${debouncedQuery}”`
            : `${data.info.count} characters`}
        </p>
      )}

      {isPending && <CharacterTableSkeleton />}

      {noResults &&
        (pageOutOfRange ? (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">Page {page} doesn’t exist.</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/" search={{}}>
                Back to the first page
              </Link>
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No characters match “{debouncedQuery}”.
          </p>
        ))}

      {data && !noResults && (
        <>
          <CharacterTable characters={data.results} scrollKey={page} />
          <CharacterPagination page={page} totalPages={data.info.pages} />
        </>
      )}
    </div>
  )
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const page = Number(search.page)

    return {
      q: typeof search.q === 'string' && search.q !== '' ? search.q : undefined,
      page: Number.isInteger(page) && page > 1 ? page : undefined,
    }
  },
  component: HomePage,
})
