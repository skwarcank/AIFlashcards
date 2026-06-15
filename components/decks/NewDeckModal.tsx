"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { deckSchema, type DeckValues } from "@/lib/validations";

interface NewDeckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DeckValues) => Promise<void> | void;
}

export function NewDeckModal({ open, onOpenChange, onSubmit }: NewDeckModalProps) {
  const { t } = useI18n();
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeckValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (!open) {
      reset({ name: "", description: "" });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("decks.new")}</DialogTitle>
          <DialogDescription>{t("decks.createDescription")}</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            setIsSaving(true);
            try {
              await onSubmit(values);
              onOpenChange(false);
            } finally {
              setIsSaving(false);
            }
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="deck-name">{t("decks.name")}</Label>
            <Input id="deck-name" placeholder={t("decks.namePlaceholder")} {...register("name")} />
            {errors.name ? <p className="text-sm text-red-400" role="alert">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deck-description">{t("decks.description")}</Label>
            <Input id="deck-description" placeholder={t("decks.descriptionPlaceholder")} {...register("description")} />
            {errors.description ? <p className="text-sm text-red-400" role="alert">{errors.description.message}</p> : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSaving ? t("decks.creating") : t("decks.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
