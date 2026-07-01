import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "convex/react";
import { Search, User } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { CrmShell, ConvexNotice } from "../../components/crm/CrmShell";
import { Card, EmptyState } from "../../components/crm/ui";
import { isConvexAvailable, scoreColor } from "../../crm/constants";

function ContactsList() {
  const [search, setSearch] = useState("");
  const contacts = isConvexAvailable ? useQuery(api.contacts.list, {}) : undefined;
  const accounts = isConvexAvailable ? useQuery(api.accounts.list, {}) : undefined;

  const accountName = (id?: string) =>
    accounts?.find((a) => a._id === id)?.name;

  const filtered = (contacts ?? []).filter((c) => {
    if (!search) return true;
    const full = `${c.firstName} ${c.lastName ?? ""}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  return (
    <CrmShell
      title="Kontaktet"
      subtitle="Vendimmarrësit dhe personat kyç në çdo llogari"
    >
      <ConvexNotice />

      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko kontakt…"
            className="w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <span className="text-sm text-gray-500">{filtered.length} kontakte</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nuk ka kontakte"
          description="Kontaktet shtohen nga faqja e një llogarie."
        />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Emri</th>
                <th className="px-5 py-3 font-medium">Roli</th>
                <th className="px-5 py-3 font-medium">Llogaria</th>
                <th className="px-5 py-3 font-medium">Kontakt</th>
                <th className="px-5 py-3 text-center font-medium">Vendimmarrja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c._id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <User className="h-4 w-4" />
                      </span>
                      {c.firstName} {c.lastName}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{c.title || "—"}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {c.accountId ? (
                      <Link
                        to="/accounts/$accountId"
                        params={{ accountId: c.accountId }}
                        className="text-indigo-600 hover:underline"
                      >
                        {accountName(c.accountId) || "Llogari"}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {c.email || c.phone || "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {c.decisionPower != null ? (
                      <span className={`font-semibold ${scoreColor(c.decisionPower)}`}>
                        {c.decisionPower}%
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </CrmShell>
  );
}

export const Route = createFileRoute("/contacts/")({
  component: ContactsList,
});
