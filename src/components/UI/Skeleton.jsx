// Skeleton shimmer primitives — compose these to match the layout being loaded

function Shimmer({ className = '', style }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`}
      style={style}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Shimmer className="h-3 w-24 rounded-md" />
          <Shimmer className="h-7 w-32 rounded-lg" />
        </div>
        <Shimmer className="w-10 h-10 rounded-xl shrink-0" />
      </div>
      <Shimmer className="h-3 w-28 rounded-md" />
    </div>
  )
}

export function ChartSkeleton({ height = 240 }) {
  return (
    <div className="card p-5 space-y-4">
      <div className="space-y-1.5">
        <Shimmer className="h-4 w-36 rounded-md" />
        <Shimmer className="h-3 w-48 rounded-md" />
      </div>
      <Shimmer className={`w-full rounded-xl`} style={{ height }} />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
      <Shimmer className="w-16 h-3 rounded-md shrink-0" />
      <Shimmer className="flex-1 h-3 rounded-md" />
      <Shimmer className="w-20 h-3 rounded-md" />
      <Shimmer className="w-14 h-5 rounded-md" />
      <Shimmer className="w-16 h-3 rounded-md ml-auto" />
    </div>
  )
}

export function TransactionsSkeleton() {
  return (
    <div className="card overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  )
}
