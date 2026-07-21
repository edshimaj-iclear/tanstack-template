import * as React from "react";
import { cn } from "../../lib/utils";

/** Compact label/value pair for detail panels and metadata grids. */
export function LabeledValue({
  label,
  value,
  className,
  mono,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 text-sm font-medium text-fg",
          mono && "font-mono text-[13px]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function MetaGrid({
  children,
  cols = 3,
  className,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-4",
        cols === 2 && "grid-cols-2",
        cols === 3 && "grid-cols-2 sm:grid-cols-3",
        cols === 4 && "grid-cols-2 sm:grid-cols-4",
        className,
      )}
    >
      {children}
    </dl>
  );
}
