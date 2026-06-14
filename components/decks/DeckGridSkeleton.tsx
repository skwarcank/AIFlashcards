export function DeckGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-[160px] animate-pulse rounded-2xl bg-[#2d1b4e]" />
      ))}
    </div>
  );
}
