import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { TriangleAlert } from 'lucide-react'

import { characterQueries } from '@/api/queries'
import { CharacterPagination } from '@/components/CharacterPagination'
import { CharacterTable } from '@/components/CharacterTable'
import { CharacterTableSkeleton } from '@/components/CharacterTableSkeleton'
import { Alert, AlertAction, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApiRetryToast } from '@/hooks/useApiRetryToast'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

const SEARCH_DELAY_MS = 300

type HomeSearch = {
  q?: string
  page?: number
}

const HomePage = () => {
  const { q = '', page = 1 } = Route.useSearch()
  const navigate = Route.useNavigate()
  const debouncedQuery = useDebouncedValue(q, SEARCH_DELAY_MS)

  const { data, isPending, isError, refetch, failureCount, failureReason } =
    useQuery(characterQueries.list({ name: debouncedQuery, page }))

  useApiRetryToast(failureCount, failureReason)

  const noResults = data?.results.length === 0
  const pageOutOfRange = noResults && !debouncedQuery

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Rick &amp; Morty
        </h1>

        <Input
          type="search"
          value={q}
          aria-label="Search characters by name"
          placeholder="Search by name…"
          className="sm:max-w-xs"
          onChange={(event) =>
            navigate({
              search: { q: event.target.value || undefined, page: undefined },
              replace: true,
            })
          }
        />
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
          <CharacterTable characters={data.results} />
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
