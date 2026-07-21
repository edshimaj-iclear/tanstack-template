import {
  Bell,
  AlertTriangle,
  ClipboardCheck,
  FileWarning,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";

const NOTIFICATIONS = [
  {
    icon: AlertTriangle,
    tone: "danger",
    title: "CAPA-2026-021 is overdue",
    meta: "Effectiveness check due 3 days ago",
    time: "2h",
  },
  {
    icon: FileWarning,
    tone: "warning",
    title: "SOP-QMS-005 review due this week",
    meta: "Assigned to Quality Manager",
    time: "5h",
  },
  {
    icon: ClipboardCheck,
    tone: "brand",
    title: "New complaint CMP-2026-104 assigned",
    meta: "Fit issue · iClear Aligners",
    time: "1d",
  },
  {
    icon: CalendarClock,
    tone: "regulatory",
    title: "PSUR review starts in 12 days",
    meta: "iClear Aligners for Adults",
    time: "1d",
  },
  {
    icon: CheckCircle2,
    tone: "success",
    title: "Internal audit AUD-2026-005 closed",
    meta: "All findings resolved",
    time: "2d",
  },
];

const toneMap: Record<string, string> = {
  danger: "bg-red-50 text-red-600",
  warning: "bg-amber-50 text-amber-600",
  brand: "bg-brand-50 text-brand-600",
  regulatory: "bg-violet-50 text-violet-600",
  success: "bg-emerald-50 text-emerald-600",
};

export function NotificationPanel() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-[18px]" />
          <span className="absolute right-1.5 top-1.5 flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-[var(--border-base)] px-4 py-3">
          <p className="text-sm font-semibold text-fg">Notifications</p>
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
            5 new
          </span>
        </div>
        <ul className="max-h-[380px] overflow-y-auto py-1">
          {NOTIFICATIONS.map((n, i) => (
            <li
              key={i}
              className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-subtle"
            >
              <div
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                  toneMap[n.tone],
                )}
              >
                <n.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">{n.title}</p>
                <p className="text-xs text-fg-muted">{n.meta}</p>
              </div>
              <span className="shrink-0 text-xs text-fg-muted">{n.time}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--border-base)] p-2">
          <Button variant="ghost" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
