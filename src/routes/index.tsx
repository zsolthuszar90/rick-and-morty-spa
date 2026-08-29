import { createFileRoute } from '@tanstack/react-router'

const HomePage = () => {
  return (
    <h1 className="text-2xl font-semibold tracking-tight">Rick &amp; Morty</h1>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
