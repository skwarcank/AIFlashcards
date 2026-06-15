"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterValues } from "@/lib/validations";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (values: RegisterValues) => {
      setSubmitError(null);
      setSuccessMessage(null);

      const { error, data } = await supabase.auth.signUp(values).catch(() => ({
        data: null,
        error: { message: t("auth.supabaseUnavailable") },
      }));

      if (error) {
        setSubmitError(error.message);
        return;
      }

      setSuccessMessage(
        data.user
          ? t("auth.success.confirmEmail")
          : t("auth.success.signInNow"),
      );

      router.refresh();
    },
    [router, supabase, t],
  );

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="register-email">{t("auth.email")}</Label>
        <Input id="register-email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <p className="text-sm text-red-300" role="alert">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">{t("auth.password")}</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password ? <p className="text-sm text-red-300" role="alert">{errors.password.message}</p> : null}
        <p className="text-xs text-white/60">{t("auth.passwordHint")}</p>
      </div>

      {submitError ? <p className="text-sm text-red-300" role="alert">{submitError}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-300" role="status">{successMessage}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isSubmitting ? t("auth.createAccountLoading") : t("auth.createAccount")}
      </Button>

      {onSwitchToLogin ? (
        <button type="button" className="text-sm text-[#7c3aed] hover:underline" onClick={onSwitchToLogin}>
          {t("auth.signInSwitch")}
        </button>
      ) : null}
    </form>
  );
}
