import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Preset skeletons for common components
export const SkeletonPresets = {
  // Text skeletons
  text: {
    className: "h-4 w-full",
  },
  title: {
    className: "h-8 w-3/4",
  },
  subtitle: {
    className: "h-6 w-1/2",
  },
  caption: {
    className: "h-3 w-1/4",
  },
  
  // Avatar skeletons
  avatar: {
    className: "h-10 w-10 rounded-full",
  },
  avatarLarge: {
    className: "h-16 w-16 rounded-full",
  },
  
  // Card skeletons
  card: {
    className: "h-48 w-full rounded-lg",
  },
  cardSmall: {
    className: "h-32 w-full rounded-lg",
  },
  
  // Button skeletons
  button: {
    className: "h-10 w-24 rounded-md",
  },
  buttonLarge: {
    className: "h-12 w-32 rounded-md",
  },
  
  // Form skeletons
  input: {
    className: "h-10 w-full rounded-md",
  },
  textarea: {
    className: "h-24 w-full rounded-md",
  },
  
  // Table skeletons
  tableRow: {
    className: "h-12 w-full",
  },
  tableCell: {
    className: "h-4 w-full",
  },
  
  // Chart skeletons
  chart: {
    className: "h-64 w-full rounded-lg",
  },
  chartSmall: {
    className: "h-32 w-full rounded-lg",
  },
} as const

// Preset skeleton component
interface PresetSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  preset: keyof typeof SkeletonPresets
}

export function PresetSkeleton({ preset, className, ...props }: PresetSkeletonProps) {
  const presetConfig = SkeletonPresets[preset]
  
  return (
    <Skeleton
      {...presetConfig}
      {...props}
      className={cn(presetConfig.className, className)}
    />
  )
}

// Complex skeleton components
export function CardSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      {/* Table */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <TableSkeleton rows={8} />
      </div>
    </div>
  )
}

export { Skeleton }