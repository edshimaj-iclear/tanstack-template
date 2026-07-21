import {
  LayoutDashboard,
  Package,
  FileText,
  FolderKanban,
  ShieldAlert,
  ClipboardCheck,
  MessageSquareWarning,
  Activity,
  Truck,
  GraduationCap,
  ClipboardList,
  Users,
  Boxes,
  Wrench,
  CalendarClock,
  BarChart3,
  Settings,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
  badgeTone?: "danger" | "warning" | "brand";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Product & Documentation",
    items: [
      { label: "Products", to: "/products", icon: Package },
      { label: "Technical Documentation", to: "/technical-documentation", icon: FileText },
      { label: "Document Control", to: "/documents", icon: FolderKanban, badge: 7, badgeTone: "warning" },
    ],
  },
  {
    label: "Quality & Compliance",
    items: [
      { label: "Risk Management", to: "/risk", icon: ShieldAlert },
      { label: "CAPA", to: "/capa", icon: ClipboardCheck, badge: 3, badgeTone: "danger" },
      { label: "Nonconformities", to: "/nonconformities", icon: MessageSquareWarning, badge: 14, badgeTone: "warning" },
      { label: "Complaints", to: "/complaints", icon: MessageSquareWarning },
      { label: "PMS & PMCF", to: "/pms", icon: Activity },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Suppliers", to: "/suppliers", icon: Truck },
      { label: "Training", to: "/training", icon: GraduationCap, badge: 9, badgeTone: "warning" },
      { label: "Audits", to: "/audits", icon: ClipboardList },
      { label: "Management Review", to: "/management-review", icon: Users },
      { label: "Production Traceability", to: "/production", icon: Boxes },
      { label: "Equipment", to: "/equipment", icon: Wrench, badge: 4, badgeTone: "warning" },
    ],
  },
  {
    label: "Planning & Insight",
    items: [
      { label: "Regulatory Calendar", to: "/calendar", icon: CalendarClock },
      { label: "Reports", to: "/reports", icon: FileBarChart },
      { label: "Administration", to: "/administration", icon: Settings },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export { BarChart3 };
