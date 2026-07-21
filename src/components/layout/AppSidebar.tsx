import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { NAV_GROUPS } from "../../lib/navigation";
import { cn } from "../../lib/utils";
import { Logo } from "./Logo";
import { Tooltip, TooltipProvider } from "../ui/tooltip";

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const badgeColor = (tone?: string) =>
    tone === "danger"
      ? "bg-red-500 text-white"
      : tone === "warning"
        ? "bg-amber-500 text-white"
        : "bg-brand-500 text-white";

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-white/5 lg:flex transition-[width] duration-300",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-4">
          {collapsed ? (
            <Logo showText={false} onDark className="mx-auto" />
          ) : (
            <Logo onDark />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {group.label}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.to || pathname.startsWith(item.to + "/");
                  const Icon = item.icon;
                  const link = (
                    <Link
                      to={item.to}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        active
                          ? "text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5",
                        collapsed && "justify-center px-0",
                      )}
                      style={
                        active
                          ? { backgroundColor: "var(--sidebar-active)" }
                          : undefined
                      }
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-400" />
                      )}
                      <Icon
                        className={cn(
                          "size-[18px] shrink-0",
                          active ? "text-brand-400" : "",
                        )}
                      />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                            badgeColor(item.badgeTone),
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {collapsed && item.badge && (
                        <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
                      )}
                    </Link>
                  );
                  return (
                    <li key={item.to}>
                      {collapsed ? (
                        <Tooltip content={item.label} side="right">
                          {link}
                        </Tooltip>
                      ) : (
                        link
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer status */}
        <div className="border-t border-white/5 p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5",
              collapsed && "justify-center px-0",
            )}
          >
            <ShieldCheck className="size-5 shrink-0 text-emerald-400" />
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-semibold text-white">MDR Certified</p>
                <p className="truncate text-[11px] text-slate-400">
                  CE 2797 · valid to 2027
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white",
              collapsed && "justify-center px-0",
            )}
          >
            <ChevronLeft
              className={cn("size-4 transition-transform", collapsed && "rotate-180")}
            />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
