"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Invalid credentials.");
      }
      const next = searchParams.get("next") ?? "/admin";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="store-atmosphere flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="brand-shell w-full max-w-sm rounded-[2rem] p-8"
      >
        <div className="mb-5 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-mascot.png"
            alt=""
            className="mb-2 h-16 w-auto object-contain"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wordmark.png"
            alt="Mundo Bubble Tea"
            className="h-10 w-auto object-contain"
          />
        </div>
        <h1 className="mb-1 font-display text-xl font-semibold text-ink">
          Admin
        </h1>
        <p className="mb-6 text-sm text-neutral-500">Sign in to manage the menu and orders.</p>

        <label className="mb-4 block text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">Username</span>
          <input
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="mb-6 block text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          />
        </label>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-accent-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-accent-500 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-accent-600 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
