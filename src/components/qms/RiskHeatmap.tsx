import { Fragment } from "react";
import { cn } from "../../lib/utils";

export interface HeatCell {
  severity: number; // 1-5 (x)
  probability: number; // 1-5 (y)
  ids?: string[];
}

/** 5×5 probability × severity matrix. */
export function RiskHeatmap({
  cells,
  onCellClick,
  selected,
  className,
}: {
  cells: HeatCell[];
  onCellClick?: (severity: number, probability: number) => void;
  selected?: { severity: number; probability: number } | null;
  className?: string;
}) {
  const lookup = new Map(
    cells.map((c) => [`${c.severity}-${c.probability}`, c]),
  );

  const cellColor = (score: number) => {
    if (score >= 15) return "bg-red-500/85 hover:bg-red-500 text-white";
    if (score >= 10) return "bg-orange-400/80 hover:bg-orange-400 text-white";
    if (score >= 5) return "bg-amber-300/80 hover:bg-amber-300 text-amber-950";
    return "bg-emerald-300/70 hover:bg-emerald-300 text-emerald-950";
  };

  const sevLabels = ["Negligible", "Minor", "Serious", "Critical", "Catastrophic"];
  const probLabels = ["Improbable", "Remote", "Occasional", "Probable", "Frequent"];

  return (
    <div className={cn("flex gap-3", className)}>
      {/* Y axis label */}
      <div className="flex items-center">
        <span className="rotate-180 whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-fg-muted [writing-mode:vertical-lr]">
          Probability →
        </span>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1.5">
          {[5, 4, 3, 2, 1].map((prob) => (
            <Fragment key={`row-${prob}`}>
              <div
                className="flex items-center justify-end pr-1 text-[10px] font-medium text-fg-muted"
              >
                {probLabels[prob - 1]}
              </div>
              {[1, 2, 3, 4, 5].map((sev) => {
                const score = sev * prob;
                const cell = lookup.get(`${sev}-${prob}`);
                const count = cell?.ids?.length ?? 0;
                const isSel =
                  selected?.severity === sev && selected?.probability === prob;
                return (
                  <button
                    key={`${sev}-${prob}`}
                    type="button"
                    onClick={() => onCellClick?.(sev, prob)}
                    className={cn(
                      "group relative flex aspect-[4/3] flex-col items-center justify-center rounded-lg text-center transition-all",
                      cellColor(score),
                      onCellClick && "cursor-pointer",
                      isSel && "ring-2 ring-brand-600 ring-offset-2 ring-offset-[var(--bg-surface)]",
                    )}
                    title={`Severity ${sev} × Probability ${prob} = ${score}`}
                  >
                    <span className="text-xs font-bold tabular-nums">{score}</span>
                    {count > 0 && (
                      <span className="mt-0.5 rounded-full bg-black/25 px-1.5 text-[10px] font-semibold">
                        {count} risk{count > 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                );
              })}
            </Fragment>
          ))}
          {/* X axis labels */}
          <div />
          {sevLabels.map((l) => (
            <div
              key={l}
              className="pt-1 text-center text-[10px] font-medium text-fg-muted"
            >
              {l}
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-[11px] font-semibold uppercase tracking-widest text-fg-muted">
          Severity →
        </div>
      </div>
    </div>
  );
}
