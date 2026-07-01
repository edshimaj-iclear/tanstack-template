import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  Cpu,
  Target,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { CrmShell, ConvexNotice } from "../../components/crm/CrmShell";
import { Card, Badge, PrimaryButton, ScoreBar } from "../../components/crm/ui";
import { AccountFormModal } from "../../components/crm/AccountFormModal";
import { ContactFormModal } from "../../components/crm/ContactFormModal";
import { DealFormModal } from "../../components/crm/DealFormModal";
import {
  isConvexAvailable,
  accountTypeLabel,
  accountStatusLabel,
  statusColor,
  dealStageLabel,
  formatCurrency,
  scoreColor,
  SCORE_LABELS,
} from "../../crm/constants";

function AccountDetail() {
  const { accountId } = Route.useParams();
  const id = accountId as Id<"accounts">;

  const account = isConvexAvailable ? useQuery(api.accounts.get, { id }) : undefined;
  const contacts = isConvexAvailable
    ? useQuery(api.contacts.list, { accountId: id })
    : undefined;
  const deals = isConvexAvailable
    ? useQuery(api.deals.list, { accountId: id })
    : undefined;

  const [editOpen, setEditOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [dealOpen, setDealOpen] = useState(false);

  if (!isConvexAvailable) {
    return (
      <CrmShell title="Detaji i llogarisë">
        <ConvexNotice />
        <Link to="/accounts" className="text-sm text-indigo-600">
          ← Kthehu te llogaritë
        </Link>
      </CrmShell>
    );
  }

  if (account === undefined) {
    return (
      <CrmShell title="Duke ngarkuar…">
        <div className="text-sm text-gray-500">Duke ngarkuar të dhënat…</div>
      </CrmShell>
    );
  }

  if (account === null) {
    return (
      <CrmShell title="Nuk u gjet">
        <p className="text-sm text-gray-500">Kjo llogari nuk ekziston.</p>
        <Link to="/accounts" className="mt-2 inline-block text-sm text-indigo-600">
          ← Kthehu te llogaritë
        </Link>
      </CrmShell>
    );
  }

  const scores = account.scores ?? {};

  return (
    <CrmShell
      title={account.name}
      subtitle={`${accountTypeLabel(account.type)}${account.city ? ` · ${account.city}` : ""}`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/accounts"
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" /> Mbrapa
          </Link>
          <PrimaryButton onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" /> Redakto
          </PrimaryButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolona kryesore */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profili */}
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Profili</h2>
              <Badge className={statusColor(account.status)}>
                {accountStatusLabel(account.status)}
              </Badge>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Info icon={<MapPin className="h-4 w-4" />} label="Vendndodhja">
                {account.address || account.city || "—"}
                {account.country ? `, ${account.country}` : ""}
              </Info>
              <Info icon={<Phone className="h-4 w-4" />} label="Telefon">
                {account.phone || "—"}
              </Info>
              <Info icon={<Mail className="h-4 w-4" />} label="Email">
                {account.email || "—"}
              </Info>
              <Info icon={<Target className="h-4 w-4" />} label="Potenciali vjetor">
                {formatCurrency(account.annualPotential)}
              </Info>
              <Info label="Pronari">{account.ownerName || "—"}</Info>
              <Info label="Përgjegjësi i shitjeve">
                {account.assignedRep || "—"}
              </Info>
            </dl>

            {(account.specialties?.length || account.equipment?.length) && (
              <div className="mt-5 grid grid-cols-2 gap-4">
                {account.specialties?.length ? (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <Stethoscope className="h-3.5 w-3.5" /> Specialitete
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {account.specialties.map((s) => (
                        <Badge key={s} className="bg-indigo-50 text-indigo-700">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
                {account.equipment?.length ? (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <Cpu className="h-3.5 w-3.5" /> Pajisje
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {account.equipment.map((s) => (
                        <Badge key={s} className="bg-gray-100 text-gray-700">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {account.notes && (
              <p className="mt-5 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                {account.notes}
              </p>
            )}
          </Card>

          {/* Kontaktet */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Kontaktet ({contacts?.length ?? 0})
              </h2>
              <button
                onClick={() => setContactOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="h-4 w-4" /> Shto
              </button>
            </div>
            {contacts && contacts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {contacts.map((c) => (
                  <div key={c._id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-medium text-gray-900">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {c.title || "—"}
                        {c.email ? ` · ${c.email}` : ""}
                      </p>
                    </div>
                    {c.decisionPower != null && (
                      <span className="text-xs text-gray-500">
                        Vendimmarrje:{" "}
                        <span className={`font-semibold ${scoreColor(c.decisionPower)}`}>
                          {c.decisionPower}%
                        </span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">
                Ende pa kontakte.
              </p>
            )}
          </Card>

          {/* Marrëveshjet */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Marrëveshjet ({deals?.length ?? 0})
              </h2>
              <button
                onClick={() => setDealOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="h-4 w-4" /> Shto
              </button>
            </div>
            {deals && deals.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {deals.map((d) => (
                  <div key={d._id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-medium text-gray-900">{d.title}</p>
                      <p className="text-xs text-gray-500">
                        {dealStageLabel(d.stage)}
                        {d.probability != null ? ` · ${d.probability}%` : ""}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(d.value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">
                Ende pa marrëveshje.
              </p>
            )}
          </Card>
        </div>

        {/* Anësore — Scores */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Indekset e marrëdhënies
            </h2>
            <div className="space-y-3">
              {SCORE_LABELS.map((s) => (
                <ScoreBar
                  key={s.key}
                  label={s.label}
                  value={(scores as Record<string, number | undefined>)[s.key]}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Këto indekse do të llogariten automatikisht nga AI në fazat e
              ardhshme (porositë, edukimi, komunikimi).
            </p>
          </Card>
        </div>
      </div>

      <AccountFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={{
          _id: account._id,
          name: account.name,
          type: account.type,
          status: account.status,
          city: account.city,
          country: account.country,
          phone: account.phone,
          email: account.email,
          ownerName: account.ownerName,
          assignedRep: account.assignedRep,
          annualPotential: account.annualPotential,
          notes: account.notes,
        }}
      />
      <ContactFormModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        accountId={id}
      />
      <DealFormModal
        open={dealOpen}
        onClose={() => setDealOpen(false)}
        accountId={id}
      />
    </CrmShell>
  );
}

function Info({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 text-gray-900">{children}</dd>
    </div>
  );
}

export const Route = createFileRoute("/accounts/$accountId")({
  component: AccountDetail,
});
