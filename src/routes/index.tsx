import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { characterQueries } from '@/api/queries'
import { CharacterTable } from '@/components/CharacterTable'
import { Button } from '@/components/ui/button'

const HomePage = () => {
  const { data, isPending, isError, refetch } = useQuery(
    characterQueries.list(),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Rick &amp; Morty
      </h1>

      {isPending && (
        <p className="text-muted-foreground text-sm">Loading characters…</p>
      )}

      {isError && (
        <div className="space-y-3">
          <p className="text-sm">Could not load the characters.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && <CharacterTable characters={data.results} />}
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
