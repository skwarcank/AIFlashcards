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
import { loginSchema, type LoginValues } from "@/lib/validations";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (values: LoginValues) => {
      setSubmitError(null);

      const { error } = await supabase.auth.signInWithPassword(values);

      if (error) {
        setSubmitError(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    },
    [router, supabase],
  );

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <p className="text-sm text-red-300" role="alert">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password ? <p className="text-sm text-red-300" role="alert">{errors.password.message}</p> : null}
      </div>

      {submitError ? <p className="text-sm text-red-300" role="alert">{submitError}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      {onSwitchToRegister ? (
        <button type="button" className="text-sm text-[#7c3aed] hover:underline" onClick={onSwitchToRegister}>
          Don&apos;t have an account? Register
        </button>
      ) : null}
    </form>
  );
}
