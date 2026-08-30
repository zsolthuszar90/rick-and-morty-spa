import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeft, TriangleAlert } from 'lucide-react'

import { ApiError } from '@/api/characters'
import { characterQueries } from '@/api/queries'
import { CharacterProfile } from '@/components/CharacterProfile'
import { CharacterProfileSkeleton } from '@/components/CharacterProfileSkeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const parseId = (value: string) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) {
    throw new Error(`"${value}" is not a valid character id`)
  }
  return id
}

const CharacterProfilePage = () => {
  const { id } = Route.useParams()
  const router = useRouter()
  const navigate = useNavigate()

  const { data, isPending, isError, error } = useQuery(
    characterQueries.detail(id),
  )

  const goBack = () => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }
    navigate({ to: '/' })
  }

  const notFound = error instanceof ApiError && error.status === 404

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" onClick={goBack}>
        <ArrowLeft />
        Back
      </Button>

      {isPending && <CharacterProfileSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            {notFound
              ? 'That character does not exist.'
              : 'Could not load this character.'}
          </AlertTitle>
          <AlertDescription>
            {notFound
              ? 'Check the address, or go back to the character list.'
              : 'Something went wrong while loading this character.'}
          </AlertDescription>
        </Alert>
      )}

      {data && <CharacterProfile character={data} />}
    </div>
  )
}

export const Route = createFileRoute('/character/$id')({
  params: {
    parse: ({ id }) => ({ id: parseId(id) }),
    stringify: ({ id }) => ({ id: String(id) }),
  },
  component: CharacterProfilePage,
})
