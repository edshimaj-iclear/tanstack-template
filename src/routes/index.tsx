import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import { Logo } from "../components/layout/Logo";
import { Button } from "../components/ui/button";
import { Input, Label } from "../components/ui/input";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("edshimaj@iclear.al");
  const [password, setPassword] = useState("••••••••••");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 650);
  };

  return (
    <div className="flex min-h-screen bg-app">
      {/* Left brand panel */}
      <div className="relative hidden w-[46%] overflow-hidden bg-ink-950 lg:flex lg:flex-col">
        <div className="absolute inset-0 grid-dots opacity-40" />
        <div className="absolute -left-24 top-1/4 size-[420px] rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 size-[360px] rounded-full bg-brand-400/10 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col p-12">
          <Logo onDark />

          <div className="my-auto max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-brand-300">
              <Sparkles className="size-3.5" /> MDR · ISO 13485 · IVDR ready
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
              Quality is not a department.
            </h1>
            <p className="mt-3 text-2xl font-light leading-snug text-brand-200">
              It is the system behind every smile.
            </p>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-slate-400">
              The unified quality &amp; regulatory platform for iClear medical
              devices — from technical documentation and risk management to
              post-market surveillance and production traceability.
            </p>

            <div className="mt-10 flex items-center gap-8">
              {[
                { label: "QMS Health", value: "87%" },
                { label: "MDR Readiness", value: "82%" },
                { label: "ISO 13485", value: "91%" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="size-4 text-emerald-400" />
            Certified Body CE 2797 · Data hosted in EU · SOC 2 Type II
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-fg">
            Sign in to iClear QMS
          </h2>
          <p className="mt-1.5 text-sm text-fg-secondary">
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="you@iclear.al"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--border-base)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-app px-3 text-xs text-fg-muted">or</span>
              </div>
            </div>

            <Button type="button" variant="outline" size="lg" className="w-full">
              <Fingerprint className="size-4" />
              Continue with SSO
            </Button>
          </form>

          <p className="mt-8 flex items-start gap-2 rounded-lg bg-subtle px-3 py-2.5 text-xs text-fg-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            This is a validated GxP system. All access is logged for audit trail
            purposes under 21 CFR Part 11 and EU Annex 11.
          </p>

          <p className="mt-6 text-center text-xs text-fg-muted">
            Prototype ·{" "}
            <Link to="/dashboard" className="font-medium text-brand-600 hover:underline">
              Skip to dashboard →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
