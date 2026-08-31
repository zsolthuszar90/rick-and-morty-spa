import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'

export const renderWithRouter = async (ui: ReactNode, at = '/') => {
  const rootRoute = createRootRoute()

  const routeTree = rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => ui,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/character/$id',
      component: () => null,
    }),
  ])

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [at] }),
  })

  await router.load()

  return render(<RouterProvider router={router} />)
}
