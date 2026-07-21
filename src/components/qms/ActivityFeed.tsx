import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

type Tone = "brand" | "success" | "warning" | "danger" | "info" | "regulatory";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
  regulatory: "bg-violet-50 text-violet-600",
};

export interface ActivityItem {
  id: string;
  icon: LucideIcon;
  tone: Tone;
  title: React.ReactNode;
  meta?: string;
  time: string;
}

export function ActivityFeed({
  items,
  className,
}: {
  items: ActivityItem[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-subtle"
          >
            <div
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                tones[item.tone],
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-fg">{item.title}</p>
              {item.meta && (
                <p className="text-xs text-fg-muted">{item.meta}</p>
              )}
            </div>
            <span className="shrink-0 whitespace-nowrap text-xs text-fg-muted">
              {item.time}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
