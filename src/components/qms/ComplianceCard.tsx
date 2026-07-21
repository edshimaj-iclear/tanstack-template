import type { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Progress, toneForScore } from "../ui/progress";
import { useCountUp } from "../../hooks/use-count-up";
import { cn } from "../../lib/utils";

export function ComplianceCard({
  label,
  value,
  icon: Icon,
  target = 90,
  className,
}: {
  label: string;
  value: number;
  icon?: LucideIcon;
  target?: number;
  className?: string;
}) {
  const counted = useCountUp(value);
  const tone = toneForScore(value);
  const onTarget = value >= target;
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="flex size-8 items-center justify-center rounded-lg bg-subtle text-fg-secondary">
            <Icon className="size-4" />
          </div>
        )}
        <span className="flex-1 text-sm font-medium text-fg-secondary">
          {label}
        </span>
        <span className="text-lg font-bold tabular-nums text-fg">
          {Math.round(counted)}%
        </span>
      </div>
      <Progress value={value} tone={tone} size="sm" className="mt-3" />
      <p className="mt-2 text-[11px] text-fg-muted">
        Target {target}% ·{" "}
        <span className={onTarget ? "text-emerald-600" : "text-amber-600"}>
          {onTarget ? "On target" : `${target - value}% to go`}
        </span>
      </p>
    </Card>
  );
}
