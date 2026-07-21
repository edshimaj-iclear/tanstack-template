import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { TooltipProvider } from "../ui/tooltip";
import { AppSidebar } from "./AppSidebar";
import { TopNavigation } from "./TopNavigation";
import { CommandPalette } from "./CommandPalette";
import { MobileNav } from "./MobileNav";
import { useTheme } from "../../hooks/use-theme";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen bg-app">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavigation
            onOpenCommand={() => setCmdOpen(true)}
            theme={theme}
            onToggleTheme={toggle}
            mobileNav={<MobileNav />}
          />
          <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <div className="animate-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </TooltipProvider>
  );
}
