import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NAV_GROUPS } from "../../lib/navigation";
import { cn } from "../../lib/utils";
import { Logo } from "./Logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function MobileNav() {
  const { location } = useRouterState();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" widthClassName="w-[280px]" className="p-0">
        <div
          className="flex h-full flex-col"
          style={{ backgroundColor: "var(--sidebar-bg)" }}
        >
          <div className="flex h-16 items-center px-4">
            <Logo onDark />
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-2">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-4">
                <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active =
                      location.pathname === item.to ||
                      location.pathname.startsWith(item.to + "/");
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            active
                              ? "bg-white/10 text-white"
                              : "text-slate-400 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <Icon className={cn("size-[18px]", active && "text-brand-400")} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
