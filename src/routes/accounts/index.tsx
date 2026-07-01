import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "convex/react";
import { Plus, Search, Building2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { CrmShell, ConvexNotice } from "../../components/crm/CrmShell";
import { Card, Badge, PrimaryButton, EmptyState } from "../../components/crm/ui";
import { AccountFormModal } from "../../components/crm/AccountFormModal";
import {
  isConvexAvailable,
  ACCOUNT_TYPES,
  type AccountType,
  accountTypeLabel,
  accountStatusLabel,
  statusColor,
  scoreColor,
  formatCurrency,
} from "../../crm/constants";

function AccountsList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const accounts = isConvexAvailable
    ? useQuery(
        api.accounts.list,
        typeFilter ? { type: typeFilter as AccountType } : {},
      )
    : undefined;

  const filtered = (accounts ?? []).filter((a) =>
    search ? a.name.toLowerCase().includes(search.toLowerCase()) : true,
  );

  return (
    <CrmShell
      title="Llogaritë"
      subtitle="Klinika, spitale, laboratorë, distributorë"
      actions={
        isConvexAvailable && (
          <PrimaryButton onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Llogari e re
          </PrimaryButton>
        )
      }
    >
      <ConvexNotice />

      {/* Filtra */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko sipas emrit…"
            className="w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Të gjitha llojet</option>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{filtered.length} rezultate</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nuk ka llogari për të shfaqur"
          description={
            isConvexAvailable
              ? "Shto llogarinë tënde të parë për të nisur."
              : "Konfiguro Convex që të dhënat të ruhen dhe shfaqen këtu."
          }
          action={
            isConvexAvailable && (
              <PrimaryButton onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" /> Llogari e re
              </PrimaryButton>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Emri</th>
                <th className="px-5 py-3 font-medium">Lloji</th>
                <th className="px-5 py-3 font-medium">Vendndodhja</th>
                <th className="px-5 py-3 font-medium">Përgjegjësi</th>
                <th className="px-5 py-3 text-right font-medium">Potenciali</th>
                <th className="px-5 py-3 text-center font-medium">Shëndeti</th>
                <th className="px-5 py-3 font-medium">Statusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => (
                <tr key={a._id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link
                      to="/accounts/$accountId"
                      params={{ accountId: a._id }}
                      className="flex items-center gap-2 font-medium text-gray-900 hover:text-indigo-600"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                        <Building2 className="h-4 w-4" />
                      </span>
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {accountTypeLabel(a.type)}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {a.city || "—"}
                    {a.country ? `, ${a.country}` : ""}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {a.assignedRep || "—"}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-700">
                    {formatCurrency(a.annualPotential)}
                  </td>
                  <td
                    className={`px-5 py-3 text-center font-semibold ${scoreColor(
                      a.scores?.relationshipHealth,
                    )}`}
                  >
                    {a.scores?.relationshipHealth ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={statusColor(a.status)}>
                      {accountStatusLabel(a.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {isConvexAvailable && (
        <AccountFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </CrmShell>
  );
}

export const Route = createFileRoute("/accounts/")({
  component: AccountsList,
});
