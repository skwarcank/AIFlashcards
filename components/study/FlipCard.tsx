"use client";

import { useCallback } from "react";

import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ front, back, isFlipped, onFlip }: FlipCardProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onFlip();
      }
    },
    [onFlip],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Show front of card" : "Show back of card"}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      className="group mx-auto w-full max-w-3xl cursor-pointer outline-none"
    >
      <div className="[perspective:1400px]">
        <div
          className={cn(
            "relative min-h-[22rem] rounded-3xl border border-purple-900/50 bg-[#2d1b4e] p-6 text-white shadow-2xl shadow-black/30 transition-transform duration-500 [transform-style:preserve-3d]",
            isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center p-6 [backface-visibility:hidden]",
              isFlipped ? "opacity-0" : "opacity-100",
            )}
          >
            <p className="text-center text-3xl font-semibold leading-tight">{front}</p>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]",
              isFlipped ? "opacity-100" : "opacity-0",
            )}
          >
            <p className="text-center text-2xl leading-relaxed text-white/90">{back}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
