import type { BadgeProps } from "../components/ui/badge";

type Tone = NonNullable<BadgeProps["tone"]>;

/**
 * Central mapping of every status string used across the QMS to a badge tone.
 * Keeps status colors consistent across all modules.
 */
const STATUS_TONE: Record<string, Tone> = {
  // generic
  approved: "success",
  effective: "success",
  active: "success",
  released: "success",
  compliant: "success",
  qualified: "success",
  closed: "success",
  operational: "success",
  passed: "success",
  complete: "success",
  completed: "success",
  released_ok: "success",
  low: "success",
  green: "success",

  // in progress / neutral
  draft: "neutral",
  "in review": "info",
  "in progress": "info",
  investigation: "info",
  "under review": "info",
  "under qualification": "info",
  open: "info",
  assigned: "info",
  scheduled: "info",
  planned: "info",
  development: "info",
  concept: "info",
  medium: "warning",

  // warning
  warning: "warning",
  "maintenance due": "warning",
  "calibration due": "warning",
  pending: "warning",
  "due soon": "warning",
  expiring: "warning",
  monitor: "warning",
  refinement: "warning",
  amber: "warning",
  major: "warning",

  // danger
  overdue: "danger",
  critical: "danger",
  high: "danger",
  suspended: "danger",
  "out of service": "danger",
  rejected: "danger",
  failed: "danger",
  serious: "danger",
  reportable: "danger",
  nonconforming: "danger",
  red: "danger",
  expired: "danger",

  // superseded / obsolete
  superseded: "neutral",
  obsolete: "neutral",

  // regulatory
  "regulatory review": "regulatory",
  regulatory: "regulatory",
  observation: "regulatory",
  minor: "info",
};

export function statusTone(status: string): Tone {
  return STATUS_TONE[status.toLowerCase().trim()] ?? "neutral";
}

/** Risk / severity level → tone. */
export function riskTone(score: number): Tone {
  if (score >= 15) return "danger";
  if (score >= 8) return "warning";
  if (score >= 4) return "info";
  return "success";
}

export function riskLabel(score: number): string {
  if (score >= 15) return "High";
  if (score >= 8) return "Medium";
  if (score >= 4) return "Low";
  return "Negligible";
}
