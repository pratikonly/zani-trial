export function AnimeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-[#151b3d] animate-pulse">
      <div className="aspect-[2/3] relative bg-gray-700" />
      <div className="p-3">
        <div className="h-4 bg-gray-700 rounded mb-2" />
        <div className="h-3 bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  );
}

export function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 aspect-[2/3] bg-gray-700 rounded-lg" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-2/3" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-700 rounded w-20" />
            <div className="h-6 bg-gray-700 rounded w-20" />
            <div className="h-6 bg-gray-700 rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
