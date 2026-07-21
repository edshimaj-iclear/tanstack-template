import * as React from "react";
import { cn } from "../../lib/utils";

type Tone = "brand" | "success" | "warning" | "danger" | "info" | "regulatory" | "neutral";

const dotTones: Record<Tone, string> = {
  brand: "bg-brand-500 ring-brand-500/15",
  success: "bg-emerald-500 ring-emerald-500/15",
  warning: "bg-amber-500 ring-amber-500/15",
  danger: "bg-red-500 ring-red-500/15",
  info: "bg-blue-500 ring-blue-500/15",
  regulatory: "bg-violet-500 ring-violet-500/15",
  neutral: "bg-ink-300 ring-ink-300/15",
};

export interface TimelineItem {
  title: React.ReactNode;
  time?: string;
  description?: React.ReactNode;
  actor?: string;
  tone?: Tone;
  icon?: React.ReactNode;
}

/** Vertical timeline used for audit trails, CAPA workflow, case history. */
export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span className="absolute left-[11px] top-6 h-full w-px bg-[var(--border-base)]" />
            )}
            <span
              className={cn(
                "relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full ring-4",
                dotTones[item.tone ?? "brand"],
              )}
            >
              {item.icon ? (
                <span className="text-white [&_svg]:size-3">{item.icon}</span>
              ) : (
                <span className="size-2 rounded-full bg-white/90" />
              )}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-medium text-fg">{item.title}</p>
                {item.time && (
                  <span className="text-xs text-fg-muted">{item.time}</span>
                )}
              </div>
              {item.description && (
                <p className="mt-0.5 text-sm text-fg-secondary">
                  {item.description}
                </p>
              )}
              {item.actor && (
                <p className="mt-1 text-xs text-fg-muted">by {item.actor}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
