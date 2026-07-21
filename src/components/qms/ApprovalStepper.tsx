import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export type StepState = "done" | "current" | "upcoming";

export interface Step {
  label: string;
  state: StepState;
  meta?: string;
}

/** Horizontal workflow stepper (Author → Review → Approval → Effective …). */
export function ApprovalStepper({
  steps,
  className,
}: {
  steps: Step[];
  className?: string;
}) {
  return (
    <div className={cn("flex w-full items-start overflow-x-auto pb-1", className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <div key={step.label} className="flex min-w-0 flex-1 items-start">
            <div className="flex min-w-[92px] flex-col items-center text-center">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  step.state === "done" &&
                    "border-brand-500 bg-brand-500 text-white",
                  step.state === "current" &&
                    "border-brand-500 bg-brand-50 text-brand-700 ring-4 ring-brand-500/15",
                  step.state === "upcoming" &&
                    "border-[var(--border-strong)] bg-[var(--bg-surface)] text-fg-muted",
                )}
              >
                {step.state === "done" ? (
                  <Check className="size-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium leading-tight",
                  step.state === "upcoming" ? "text-fg-muted" : "text-fg",
                )}
              >
                {step.label}
              </span>
              {step.meta && (
                <span className="mt-0.5 text-[11px] text-fg-muted">
                  {step.meta}
                </span>
              )}
            </div>
            {!last && (
              <div
                className={cn(
                  "mt-4 h-0.5 flex-1 rounded-full",
                  step.state === "done" ? "bg-brand-500" : "bg-[var(--border-base)]",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
