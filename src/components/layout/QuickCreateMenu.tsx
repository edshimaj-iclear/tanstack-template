import { useNavigate } from "@tanstack/react-router";
import {
  Plus,
  ClipboardCheck,
  MessageSquareWarning,
  FileText,
  ShieldAlert,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ITEMS = [
  { label: "New CAPA", icon: ClipboardCheck, to: "/capa" },
  { label: "New Complaint", icon: MessageSquareWarning, to: "/complaints" },
  { label: "New Nonconformity", icon: MessageSquareWarning, to: "/nonconformities" },
  { label: "New Document", icon: FileText, to: "/documents" },
  { label: "New Risk", icon: ShieldAlert, to: "/risk" },
  { label: "New Audit", icon: ClipboardList, to: "/audits" },
  { label: "New Training Assignment", icon: GraduationCap, to: "/training" },
];

export function QuickCreateMenu() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick create</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ITEMS.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={() => navigate({ to: item.to })}>
            <item.icon />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
