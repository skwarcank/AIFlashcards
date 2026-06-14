import { Button } from "@/components/ui/button";

interface StudySummaryProps {
  reviewedCount: number;
  onBackToDeck: () => void;
}

export function StudySummary({ reviewedCount, onBackToDeck }: StudySummaryProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-purple-900/50 bg-[#2d1b4e] px-6 py-12 text-center text-white">
      <h2 className="text-3xl font-semibold">Done! Reviewed {reviewedCount} cards</h2>
      <Button onClick={onBackToDeck}>Back to Deck</Button>
    </div>
  );
}
