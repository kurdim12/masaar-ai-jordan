import { Skeleton } from "@/components/ui/skeleton";

export const MapSkeleton = ({ height = 320 }: { height?: number }) => (
  <div className="relative overflow-hidden rounded-2xl skeleton" style={{ height }}>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="material-symbols-outlined text-muted-foreground/40" style={{ fontSize: 48 }}>map</span>
    </div>
  </div>
);

export const ChartSkeleton = ({ height = 180 }: { height?: number }) => (
  <div className="space-y-2">
    <div className="flex items-end gap-2" style={{ height }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1"
          style={{ height: `${30 + ((i * 17) % 60)}%` }}
        />
      ))}
    </div>
    <div className="flex justify-between">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-2 w-8" />
      ))}
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="card-clean space-y-3">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
  </div>
);
