"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import type { Deck } from "@/lib/types";
import { deckSchema, type DeckValues } from "@/lib/validations";

interface RenameDeckFormProps {
  deck: Deck;
  onRename: (name: string) => Promise<void> | void;
}

export function RenameDeckForm({ deck, onRename }: RenameDeckFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeckValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: { name: deck.name, description: deck.description ?? "" },
  });

  useEffect(() => {
    reset({ name: deck.name, description: deck.description ?? "" });
  }, [deck.description, deck.name, reset]);

  if (!isEditing) {
    return (
      <button className="inline-flex items-center gap-2 text-left" type="button" onClick={() => setIsEditing(true)}>
        <span className="text-3xl font-semibold text-white">{deck.name}</span>
        <Pencil className="size-4 text-white/60" />
      </button>
    );
  }

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row sm:items-start"
      onSubmit={handleSubmit(async (values) => {
        await onRename(values.name);
        setIsEditing(false);
      })}
    >
      <div className="space-y-1">
        <Input className="max-w-md bg-[#2d1b4e]" {...register("name")} />
        {errors.name ? <p className="text-sm text-red-300" role="alert">{errors.name.message}</p> : null}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>{t("common.save")}</Button>
        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
