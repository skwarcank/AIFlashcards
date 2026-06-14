"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a0a2e] px-4 py-8 text-white">
      <Card className="w-full max-w-md border border-purple-900/50 bg-[#2d1b4e] text-white shadow-2xl shadow-black/20">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-semibold">AIFlashcards</CardTitle>
          <CardDescription className="text-white/70">{mode === "login" ? "Sign in to continue" : "Create your account"}</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "login" ? (
            <LoginForm onSwitchToRegister={() => setMode("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode("login")} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
