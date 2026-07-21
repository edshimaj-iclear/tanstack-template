import * as React from "react";
import { cn } from "../../lib/utils";

type Tone = "brand" | "success" | "warning" | "danger" | "info" | "regulatory";

const toneBar: Record<Tone, string> = {
  brand: "bg-brand-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  regulatory: "bg-violet-500",
};

export function toneForScore(value: number): Tone {
  if (value >= 85) return "success";
  if (value >= 70) return "brand";
  if (value >= 50) return "warning";
  return "danger";
}

export function Progress({
  value,
  tone,
  className,
  barClassName,
  size = "md",
}: {
  value: number;
  tone?: Tone;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md" | "lg";
}) {
  const t = tone ?? toneForScore(value);
  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-subtle",
        h,
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700 ease-out",
          toneBar[t],
          barClassName,
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
