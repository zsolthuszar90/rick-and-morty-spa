import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { TriangleAlert } from 'lucide-react'

import { characterQueries } from '@/api/queries'
import { CharacterTable } from '@/components/CharacterTable'
import { CharacterTableSkeleton } from '@/components/CharacterTableSkeleton'
import { Alert, AlertAction, AlertTitle } from '@/components/ui/alert'
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

      {data && <CharacterTable characters={data.results} />}
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
