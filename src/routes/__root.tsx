import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => {
  return (
    <div className="bg-background text-foreground flex h-svh flex-col overflow-hidden">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-3 py-6 sm:px-4 sm:py-10">
        <Outlet />
      </main>

      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </>
      )}
    </div>
  )
}

/**
 * Root route. Everything the app renders is nested inside this layout.
 *
 * `createRootRouteWithContext` lets us hand the QueryClient down to every route,
 * so route loaders can prefetch into the same cache the components read from.
 */
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootLayout,
  },
)
