import Link from "next/link";
import type { Tone } from "@/lib/constants";

const toneMap: Record<Tone, string> = {
  pass: "bg-passbg text-pass",
  hold: "bg-holdbg text-hold",
  fail: "bg-failbg text-fail",
  info: "bg-infobg text-info",
  neutral: "bg-canvas text-muted border border-line",
};

const dotMap: Record<Tone, string> = {
  pass: "bg-pass",
  hold: "bg-hold",
  fail: "bg-fail",
  info: "bg-info",
  neutral: "bg-faint",
};

export function StatusPill({ label, tone = "neutral", dot = true }: { label: string; tone?: Tone; dot?: boolean }) {
  return (
    <span className={`pill ${toneMap[tone]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotMap[tone]}`} />}
      {label}
    </span>
  );
}

export function PageHeader({
  eyebrow, title, subtitle, action,
}: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {eyebrow && <div className="label mb-1.5">{eyebrow}</div>}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: React.ReactNode; hint?: string; tone?: Tone }) {
  const color = tone === "pass" ? "text-pass" : tone === "fail" ? "text-fail" : tone === "hold" ? "text-hold" : "text-ink";
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className={`font-display text-2xl font-semibold mt-1.5 ${color}`}>{value}</div>
      {hint && <div className="text-[12px] text-faint mt-0.5">{hint}</div>}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="card p-10 text-center">
      <div className="font-display text-lg text-ink">{title}</div>
      {hint && <div className="text-sm text-muted mt-1">{hint}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function CrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="text-clinic-500 hover:text-clinic-600 hover:underline">{children}</Link>;
}
