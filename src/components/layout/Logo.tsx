import { cn } from "../../lib/utils";

export function Logo({
  className,
  showText = true,
  onDark = false,
}: {
  className?: string;
  showText?: boolean;
  onDark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-md shadow-brand-600/25">
        <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none">
          {/* stylized aligner arch */}
          <path
            d="M4 8c2.5 3 5.5 4.5 8 4.5S17.5 11 20 8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M5 13c2 2.5 4.5 4 7 4s5-1.5 7-4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
      {showText && (
        <div className="leading-tight">
          <div
            className={cn(
              "text-[15px] font-bold tracking-tight",
              onDark ? "text-white" : "text-fg",
            )}
          >
            iClear <span className="text-brand-400">QMS</span>
          </div>
          <div
            className={cn(
              "text-[10px] font-medium",
              onDark ? "text-slate-400" : "text-fg-muted",
            )}
          >
            Quality & Compliance
          </div>
        </div>
      )}
    </div>
  );
}
