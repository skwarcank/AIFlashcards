"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cardSchema, type CardValues } from "@/lib/validations";

interface ManualAddProps {
  onAdd: (front: string, back: string) => Promise<void> | void;
}

export function ManualAdd({ onAdd }: ManualAddProps) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CardValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: { front: "", back: "" },
  });

  const onSubmit = useCallback(
    async (values: CardValues) => {
      await onAdd(values.front, values.back);
      reset({ front: "", back: "" });
      setFocus("front");
    },
    [onAdd, reset, setFocus],
  );

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="card-front">Front</Label>
        <Input id="card-front" {...register("front")} />
        {errors.front ? <p className="text-sm text-red-300" role="alert">{errors.front.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-back">Back</Label>
        <Input id="card-back" {...register("back")} />
        {errors.back ? <p className="text-sm text-red-300" role="alert">{errors.back.message}</p> : null}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isSubmitting ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
