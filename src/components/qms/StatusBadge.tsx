import { Badge } from "../ui/badge";
import { statusTone, riskTone, riskLabel } from "../../lib/status";
import { cn } from "../../lib/utils";

export function StatusBadge({
  status,
  className,
  dot = true,
}: {
  status: string;
  className?: string;
  dot?: boolean;
}) {
  return (
    <Badge tone={statusTone(status)} dot={dot} className={cn("capitalize", className)}>
      {status}
    </Badge>
  );
}

export function RiskBadge({
  score,
  showScore = true,
  className,
}: {
  score: number;
  showScore?: boolean;
  className?: string;
}) {
  return (
    <Badge tone={riskTone(score)} className={cn("font-semibold", className)}>
      {riskLabel(score)}
      {showScore && <span className="opacity-70">· {score}</span>}
    </Badge>
  );
}
