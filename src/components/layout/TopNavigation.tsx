import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Command as CommandIcon,
  Sun,
  Moon,
  HelpCircle,
  Globe,
  ChevronDown,
  ShieldCheck,
  LogOut,
  UserCog,
  Building2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar } from "../ui/misc";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NotificationPanel } from "./NotificationPanel";
import { QuickCreateMenu } from "./QuickCreateMenu";

export function TopNavigation({
  onOpenCommand,
  theme,
  onToggleTheme,
  mobileNav,
}: {
  onOpenCommand: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  mobileNav?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--border-base)] bg-[color-mix(in_srgb,var(--bg-surface)_82%,transparent)] px-4 backdrop-blur-md lg:px-6">
      {mobileNav}
      {/* Search / command trigger */}
      <button
        type="button"
        onClick={onOpenCommand}
        className="group flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 text-sm text-fg-muted transition-colors hover:border-brand-300 sm:max-w-md"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">
          Search products, CAPAs, documents…
        </span>
        <kbd className="hidden items-center gap-0.5 rounded border border-[var(--border-base)] bg-subtle px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
          <CommandIcon className="size-2.5" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Workspace */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden gap-2 md:inline-flex">
              <Building2 className="size-4 text-brand-600" />
              <span className="font-medium">iClear Albania</span>
              <ChevronDown className="size-3.5 text-fg-muted" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Building2 /> iClear Albania
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Building2 /> iClear Kosovo
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Building2 /> iClear North Macedonia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Regulatory status */}
        <Badge tone="success" dot className="hidden lg:inline-flex">
          <ShieldCheck className="size-3.5" /> MDR Compliant
        </Badge>

        <QuickCreateMenu />

        <div className="mx-1 hidden h-6 w-px bg-[var(--border-base)] sm:block" />

        <NotificationPanel />

        <Button variant="ghost" size="icon" onClick={onToggleTheme} title="Toggle theme">
          {theme === "light" ? (
            <Moon className="size-[18px]" />
          ) : (
            <Sun className="size-[18px]" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="hidden sm:inline-flex" title="Help">
          <HelpCircle className="size-[18px]" />
        </Button>

        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Globe className="size-[18px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>🇬🇧 English</DropdownMenuItem>
            <DropdownMenuItem>🇦🇱 Shqip</DropdownMenuItem>
            <DropdownMenuItem>🇩🇪 Deutsch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-lg p-0.5 transition-colors hover:bg-subtle">
              <Avatar name="Edison Shimaj" size="sm" />
              <div className="hidden text-left leading-tight lg:block">
                <p className="text-sm font-semibold text-fg">Edison Shimaj</p>
                <p className="text-[11px] text-fg-muted">CEO</p>
              </div>
              <ChevronDown className="mr-1 hidden size-3.5 text-fg-muted lg:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-3 px-2.5 py-2">
              <Avatar name="Edison Shimaj" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-fg">Edison Shimaj</p>
                <p className="text-xs text-fg-muted">edshimaj@iclear.al</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCog /> Profile & role
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/administration">
                <ShieldCheck /> Administration
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/">
                <LogOut /> Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
