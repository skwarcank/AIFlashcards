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
import type { Card as Flashcard } from "@/lib/types";
import { cardSchema, type CardValues } from "@/lib/validations";

interface EditCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Flashcard | null;
  onSave: (front: string, back: string) => Promise<void> | void;
}

export function EditCardModal({ open, onOpenChange, card, onSave }: EditCardModalProps) {
  const { t } = useI18n();
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: { front: card?.front ?? "", back: card?.back ?? "" },
  });

  useEffect(() => {
    reset({ front: card?.front ?? "", back: card?.back ?? "" });
  }, [card, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("cards.editCard")}</DialogTitle>
          <DialogDescription>{t("cards.updateDescription")}</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            setIsSaving(true);
            try {
              await onSave(values.front, values.back);
              onOpenChange(false);
            } finally {
              setIsSaving(false);
            }
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="edit-card-front">{t("cards.front")}</Label>
            <Input id="edit-card-front" {...register("front")} />
            {errors.front ? <p className="text-sm text-red-400" role="alert">{errors.front.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-card-back">{t("cards.back")}</Label>
            <Input id="edit-card-back" {...register("back")} />
            {errors.back ? <p className="text-sm text-red-400" role="alert">{errors.back.message}</p> : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSaving ? t("cards.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
