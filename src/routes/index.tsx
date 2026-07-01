import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
  Building2,
  Users,
  Target,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import { CrmShell, ConvexNotice } from "../components/crm/CrmShell";
import { Card, StatCard, PrimaryButton, Badge } from "../components/crm/ui";
import {
  isConvexAvailable,
  accountTypeLabel,
  accountStatusLabel,
  statusColor,
  formatCurrency,
} from "../crm/constants";

function Dashboard() {
  const accountStats = isConvexAvailable
    ? useQuery(api.accounts.stats)
    : undefined;
  const dealStats = isConvexAvailable ? useQuery(api.deals.stats) : undefined;
  const accounts = isConvexAvailable
    ? useQuery(api.accounts.list, {})
    : undefined;

  const recent = (accounts ?? []).slice(0, 6);

  return (
    <CrmShell
      title="Paneli kryesor"
      subtitle="Vështrim i përgjithshëm i aktivitetit komercial"
      actions={
        <Link to="/accounts">
          <PrimaryButton>
            <Plus className="h-4 w-4" /> Llogari e re
          </PrimaryButton>
        </Link>
      }
    >
      <ConvexNotice />

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Llogari gjithsej"
          value={accountStats?.total ?? "—"}
          hint={`${accountStats?.active ?? 0} aktive · ${accountStats?.prospects ?? 0} potenciale`}
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          label="Marrëveshje të hapura"
          value={dealStats?.openCount ?? "—"}
          hint={`${formatCurrency(dealStats?.openValue)} në pipeline`}
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Forecast (i ponderuar)"
          value={formatCurrency(dealStats?.forecast)}
          hint="Vlerë × probabilitet"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Potenciali vjetor"
          value={formatCurrency(accountStats?.totalPotential)}
          hint="Shuma e të gjitha llogarive"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Llogaritë e fundit */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Llogaritë e fundit
          </h2>
          <Link
            to="/accounts"
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Shiko të gjitha <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <Card className="p-8 text-center text-sm text-gray-500">
            {isConvexAvailable
              ? "Ende nuk ka llogari. Shko te 'Llogaritë' për të shtuar të parën."
              : "Konfiguro Convex për të parë të dhënat reale."}
          </Card>
        ) : (
          <Card className="divide-y divide-gray-100">
            {recent.map((a) => (
              <Link
                key={a._id}
                to="/accounts/$accountId"
                params={{ accountId: a._id }}
                className="flex items-center justify-between px-5 py-3 transition hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-500">
                    {accountTypeLabel(a.type)}
                    {a.city ? ` · ${a.city}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-sm text-gray-500 sm:inline">
                    {formatCurrency(a.annualPotential)}
                  </span>
                  <Badge className={statusColor(a.status)}>
                    {accountStatusLabel(a.status)}
                  </Badge>
                </div>
              </Link>
            ))}
          </Card>
        )}
      </div>
    </CrmShell>
  );
}

export const Route = createFileRoute("/")({
  component: Dashboard,
});
