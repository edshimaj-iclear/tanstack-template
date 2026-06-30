import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  KanbanSquare,
  Bot,
  Stethoscope,
} from "lucide-react";
import { isConvexAvailable } from "../../crm/constants";

const NAV = [
  { to: "/", label: "Paneli", icon: LayoutDashboard, exact: true },
  { to: "/accounts", label: "Llogaritë", icon: Building2 },
  { to: "/contacts", label: "Kontaktet", icon: Users },
  { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/assistant", label: "Asistenti AI", icon: Bot },
];

export function CrmShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-gray-800 bg-gray-900 text-gray-300">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="rounded-lg bg-indigo-600 p-1.5 text-white">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">HCIP</p>
            <p className="text-[10px] text-gray-400">Healthcare CRM</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: !!exact }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-800 hover:text-white [&.active]:bg-indigo-600 [&.active]:text-white"
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-4 text-[10px] text-gray-500">
          {isConvexAvailable ? (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Convex i lidhur
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Convex i pakonfiguruar
            </span>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions}
        </header>
        <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
      </div>
    </div>
  );
}

// Banderolë kur Convex nuk është konfiguruar — të dhënat nuk ruhen ende
export function ConvexNotice() {
  if (isConvexAvailable) return null;
  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <strong>Convex nuk është konfiguruar.</strong> Vendos{" "}
      <code className="rounded bg-amber-100 px-1">VITE_CONVEX_URL</code> në{" "}
      <code className="rounded bg-amber-100 px-1">.env</code> dhe nis{" "}
      <code className="rounded bg-amber-100 px-1">npx convex dev</code> që të
      dhënat të ruhen e të shfaqen.
    </div>
  );
}
