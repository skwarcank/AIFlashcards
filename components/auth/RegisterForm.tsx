"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterValues } from "@/lib/validations";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
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

      const { error, data } = await supabase.auth.signUp(values);

      if (error) {
        setSubmitError(error.message);
        return;
      }

      setSuccessMessage(
        data.user
          ? "Account created. Check your email to confirm your sign up."
          : "Account created. You can now sign in.",
      );

      router.refresh();
    },
    [router, supabase],
  );

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input id="register-email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <p className="text-sm text-red-300" role="alert">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password ? <p className="text-sm text-red-300" role="alert">{errors.password.message}</p> : null}
        <p className="text-xs text-white/60">At least 6 characters, with letters and at least one number.</p>
      </div>

      {submitError ? <p className="text-sm text-red-300" role="alert">{submitError}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-300" role="status">{successMessage}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      {onSwitchToLogin ? (
        <button type="button" className="text-sm text-[#7c3aed] hover:underline" onClick={onSwitchToLogin}>
          Already have an account? Login
        </button>
      ) : null}
    </form>
  );
}
