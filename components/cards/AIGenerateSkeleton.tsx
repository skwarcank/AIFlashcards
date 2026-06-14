export function AIGenerateSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-2xl bg-[#2d1b4e]" />
      ))}
    </div>
  );
}
