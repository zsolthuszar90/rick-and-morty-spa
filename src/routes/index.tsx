import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { TriangleAlert } from 'lucide-react'

import { characterQueries } from '@/api/queries'
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
}

const HomePage = () => {
  const { q = '' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const debouncedQuery = useDebouncedValue(q, SEARCH_DELAY_MS)

  const { data, isPending, isError, refetch, failureCount } = useQuery(
    characterQueries.list({ name: debouncedQuery }),
  )

  useApiRetryToast(failureCount)

  const noMatches = data?.results.length === 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Rick &amp; Morty
      </h1>

      <Input
        type="search"
        value={q}
        aria-label="Search characters by name"
        placeholder="Search by name…"
        className="max-w-sm"
        onChange={(event) =>
          navigate({
            search: { q: event.target.value || undefined },
            replace: true,
          })
        }
      />

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

      {noMatches && (
        <p className="text-muted-foreground text-sm">
          No characters match “{debouncedQuery}”.
        </p>
      )}

      {data && !noMatches && <CharacterTable characters={data.results} />}
    </div>
  )
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    q: typeof search.q === 'string' && search.q !== '' ? search.q : undefined,
  }),
  component: HomePage,
})
