import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { pageRange } from '@/lib/pageRange'
import { cn } from '@/lib/utils'

const toSearch = (target: number) => (prev: { q?: string }) => ({
  ...prev,
  page: target === 1 ? undefined : target,
})

const stepClass = cn(buttonVariants({ variant: 'ghost' }), 'gap-1')

const ACTIVE_EXACT = { exact: true, includeSearch: true } as const

type StepProps = {
  to: number
  label: string
  disabled: boolean
  children: ReactNode
}

const Step = ({ to, label, disabled, children }: StepProps) => (
  <PaginationItem>
    {disabled ? (
      <span aria-disabled className={cn(stepClass, 'opacity-50')}>
        {children}
      </span>
    ) : (
      <Link
        to="/"
        search={toSearch(to)}
        activeOptions={ACTIVE_EXACT}
        aria-label={label}
        className={stepClass}
      >
        {children}
      </Link>
    )}
  </PaginationItem>
)

type CharacterPaginationProps = {
  page: number
  totalPages: number
}

export const CharacterPagination = ({
  page,
  totalPages,
}: CharacterPaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent>
        <Step to={page - 1} label="Previous page" disabled={page <= 1}>
          <ChevronLeft />
          <span className="hidden sm:inline">Previous</span>
        </Step>

        {pageRange(page, totalPages).map((slot, index) =>
          slot === 'ellipsis' ? (
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={slot}>
              <Link
                to="/"
                search={toSearch(slot)}
                activeOptions={ACTIVE_EXACT}
                aria-label={`Page ${slot}`}
                className={buttonVariants({
                  variant: slot === page ? 'default' : 'ghost',
                  size: 'icon',
                })}
              >
                {slot}
              </Link>
            </PaginationItem>
          ),
        )}

        <Step to={page + 1} label="Next page" disabled={page >= totalPages}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight />
        </Step>
      </PaginationContent>
    </Pagination>
  )
}
