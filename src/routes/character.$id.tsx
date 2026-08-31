import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { ArrowLeft, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { ApiError } from '@/api/characters'
import { characterQueries } from '@/api/queries'
import { CharacterProfile } from '@/components/CharacterProfile'
import { CharacterProfileSkeleton } from '@/components/CharacterProfileSkeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useApiRetryToast } from '@/hooks/useApiRetryToast'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const parseId = (value: string) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) {
    throw new Error(`"${value}" is not a valid character id`)
  }
  return id
}

const NOT_FOUND = {
  title: 'That character does not exist.',
  description: 'Check the address, or go back to the character list.',
}

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
    {children}
  </div>
)

const CharacterProfileError = () => (
  <Layout>
    <Button asChild variant="ghost" size="sm" className="-ml-2 self-start">
      <Link to="/" search={{}}>
        <ArrowLeft />
        Back
      </Link>
    </Button>

    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>{NOT_FOUND.title}</AlertTitle>
      <AlertDescription>{NOT_FOUND.description}</AlertDescription>
    </Alert>
  </Layout>
)

const CharacterProfilePage = () => {
  const { id } = Route.useParams()
  const router = useRouter()
  const navigate = useNavigate()

  const { data, isPending, isError, error, failureCount, failureReason } =
    useQuery(characterQueries.detail(id))

  useApiRetryToast(failureCount, failureReason)

  useDocumentMeta({
    title: data?.name,
    description: data
      ? `${data.name}: ${data.species}, ${data.status}, from ${data.origin.name}.`
      : 'A Rick & Morty character profile.',
    image: data?.image,
  })

  const goBack = () => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }
    navigate({ to: '/', search: {} })
  }

  const notFound = error instanceof ApiError && error.status === 404

  return (
    <Layout>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 self-start"
        onClick={goBack}
      >
        <ArrowLeft />
        Back
      </Button>

      {isPending && <CharacterProfileSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            {notFound ? NOT_FOUND.title : 'Could not load this character.'}
          </AlertTitle>
          <AlertDescription>
            {notFound
              ? NOT_FOUND.description
              : 'Something went wrong while loading this character.'}
          </AlertDescription>
        </Alert>
      )}

      {data && <CharacterProfile character={data} />}
    </Layout>
  )
}

export const Route = createFileRoute('/character/$id')({
  params: {
    parse: ({ id }) => ({ id: parseId(id) }),
    stringify: ({ id }) => ({ id: String(id) }),
  },
  errorComponent: CharacterProfileError,
  component: CharacterProfilePage,
})
