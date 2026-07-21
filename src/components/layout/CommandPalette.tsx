import { useEffect } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  Plus,
  ClipboardCheck,
  MessageSquareWarning,
  FileText,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { ALL_NAV_ITEMS } from "../../lib/navigation";
import { Dialog, DialogContent } from "../ui/dialog";

const QUICK_ACTIONS = [
  { label: "New CAPA", icon: ClipboardCheck, to: "/capa" },
  { label: "New Complaint", icon: MessageSquareWarning, to: "/complaints" },
  { label: "New Nonconformity", icon: MessageSquareWarning, to: "/nonconformities" },
  { label: "New Document", icon: FileText, to: "/documents" },
  { label: "New Risk", icon: ShieldAlert, to: "/risk" },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-xl p-0 overflow-hidden">
        <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-fg-muted">
          <div className="flex items-center gap-2.5 border-b border-[var(--border-base)] px-4">
            <Search className="size-4 text-fg-muted" />
            <Command.Input
              autoFocus
              placeholder="Search modules, records, actions…"
              className="h-12 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
            />
            <kbd className="rounded border border-[var(--border-base)] bg-subtle px-1.5 py-0.5 text-[10px] font-medium text-fg-muted">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[380px] overflow-y-auto p-2">
            <Command.Empty className="py-10 text-center text-sm text-fg-muted">
              No results found.
            </Command.Empty>

            <Command.Group heading="Quick create">
              {QUICK_ACTIONS.map((a) => (
                <Command.Item
                  key={a.label}
                  value={a.label}
                  onSelect={() => go(a.to)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-secondary data-[selected=true]:bg-subtle data-[selected=true]:text-fg"
                >
                  <span className="flex size-7 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <Plus className="size-3.5" />
                  </span>
                  {a.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Navigate">
              {ALL_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.to}
                    value={item.label}
                    onSelect={() => go(item.to)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-secondary data-[selected=true]:bg-subtle data-[selected=true]:text-fg"
                  >
                    <Icon className="size-4 text-fg-muted" />
                    <span className="flex-1">{item.label}</span>
                    <ArrowRight className="size-3.5 text-fg-muted opacity-0 data-[selected=true]:opacity-100" />
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
