export function CardListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-2xl bg-[#2d1b4e]" />
      ))}
    </div>
  );
}
