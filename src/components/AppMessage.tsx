import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

type AppMessageProps = {
  title: string
  description: string
  children?: ReactNode
}

export const AppMessage = ({
  title,
  description,
  children,
}: AppMessageProps) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>

    <div className="flex gap-2">
      {children}
      <Button asChild variant="outline">
        <Link to="/" search={{}}>
          Back to the characters
        </Link>
      </Button>
    </div>
  </div>
)
