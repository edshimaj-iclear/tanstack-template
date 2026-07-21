import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with thousands separators. */
export function formatNumber(value: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", opts).format(value);
}

/** Format a percentage value (0–100). */
export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

/** Format an ISO date string into a readable label. */
export function formatDate(
  value: string | Date,
  opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" },
) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", opts).format(d);
}

/** Relative day difference vs. a fixed "today" (2026-07-21) for deterministic demos. */
export const DEMO_TODAY = new Date("2026-07-21T09:00:00Z");

export function daysUntil(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return Math.round((d.getTime() - DEMO_TODAY.getTime()) / 86_400_000);
}

export function relativeDeadline(value: string | Date) {
  const days = daysUntil(value);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days < 30) return `in ${days}d`;
  const months = Math.round(days / 30);
  return `in ${months}mo`;
}

/** Deterministic initials from a name. */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
