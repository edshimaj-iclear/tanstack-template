import { useCountUp } from "../../hooks/use-count-up";
import { cn } from "../../lib/utils";

type Tone = "brand" | "success" | "warning" | "danger";

const strokes: Record<Tone, string> = {
  brand: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
};

function toneFor(v: number): Tone {
  if (v >= 85) return "success";
  if (v >= 70) return "brand";
  if (v >= 50) return "warning";
  return "danger";
}

export function ProgressRing({
  value,
  size = 180,
  strokeWidth = 14,
  tone,
  label,
  sublabel,
  className,
  animate = true,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: Tone;
  label?: string;
  sublabel?: string;
  className?: string;
  animate?: boolean;
}) {
  const animated = useCountUp(value, 1100, 0);
  const shown = animate ? animated : value;
  const t = tone ?? toneFor(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (shown / 100) * circumference;
  const gradId = `ring-${t}-${size}`;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokes[t]} stopOpacity="0.7" />
            <stop offset="100%" stopColor={strokes[t]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-[var(--bg-subtle)]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={`url(#${gradId})`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.2s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums text-fg">
          {Math.round(shown)}
          <span className="text-xl text-fg-muted">%</span>
        </span>
        {label && (
          <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-fg-muted">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-xs text-fg-muted">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
