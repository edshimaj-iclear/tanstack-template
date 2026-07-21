import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/card";
import { useCountUp } from "../../hooks/use-count-up";
import { cn } from "../../lib/utils";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info" | "regulatory";

const iconTones: Record<Tone, string> = {
  neutral: "bg-subtle text-fg-secondary",
  brand: "bg-brand-50 text-brand-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
  regulatory: "bg-violet-50 text-violet-600",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  suffix,
  delta,
  deltaLabel,
  invertDelta = false,
  hint,
  onClick,
  className,
}: {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  tone?: Tone;
  suffix?: string;
  /** positive/negative percentage change */
  delta?: number;
  deltaLabel?: string;
  /** when true, a positive delta is treated as "bad" (e.g. overdue rising) */
  invertDelta?: boolean;
  hint?: string;
  onClick?: () => void;
  className?: string;
}) {
  const numeric = typeof value === "number";
  const counted = useCountUp(numeric ? (value as number) : 0);
  const display = numeric ? counted : value;

  const deltaPositive = (delta ?? 0) >= 0;
  const deltaGood = invertDelta ? !deltaPositive : deltaPositive;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden p-5 transition-all",
        onClick &&
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-elevated hover:border-[var(--border-strong)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-fg-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-fg">
            {display}
            {suffix && (
              <span className="ml-0.5 text-lg font-semibold text-fg-muted">
                {suffix}
              </span>
            )}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              iconTones[tone],
            )}
          >
            <Icon className="size-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold",
              deltaGood ? "text-emerald-600" : "text-red-500",
            )}
          >
            {deltaPositive ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
        {(deltaLabel || hint) && (
          <span className="truncate text-fg-muted">{deltaLabel ?? hint}</span>
        )}
      </div>
    </Card>
  );
}
