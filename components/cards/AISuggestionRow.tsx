"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Suggestion {
  front: string;
  back: string;
}

interface AISuggestionRowProps {
  suggestion: Suggestion;
  index: number;
  onDiscard: (index: number) => void;
  onEdit: (index: number, suggestion: Suggestion) => void;
}

export function AISuggestionRow({ suggestion, index, onDiscard, onEdit }: AISuggestionRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [front, setFront] = useState(suggestion.front);
  const [back, setBack] = useState(suggestion.back);

  return (
    <div className="rounded-2xl border border-purple-900/50 bg-[#2d1b4e] p-4">
      {isEditing ? (
        <div className="space-y-3">
          <Input value={front} onChange={(event) => setFront(event.target.value)} />
          <Input value={back} onChange={(event) => setBack(event.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onEdit(index, { front, back });
                setIsEditing(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-medium text-white">{suggestion.front}</p>
            <p className="text-sm text-white/70">{suggestion.back}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Discard suggestion" onClick={() => onDiscard(index)}>
              <X className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Edit suggestion" onClick={() => setIsEditing(true)}>
              <Pencil className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
