import { Skeleton } from '@/components/ui/skeleton'

export const CharacterProfileSkeleton = () => (
  <div className="space-y-8">
    <div className="flex items-start gap-4">
      <Skeleton className="size-24 shrink-0 rounded-lg sm:size-32" />
      <div className="space-y-3 pt-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {Array.from({ length: 6 }, (_, detail) => (
        <div key={detail} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  </div>
)
