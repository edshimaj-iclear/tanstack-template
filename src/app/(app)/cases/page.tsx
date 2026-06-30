import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, EmptyState } from "@/components/ui";
import {
  STAGE_LABELS, CASE_STATUS_LABELS, caseStatusTone, PRIORITY_LABELS,
} from "@/lib/constants";
import { fmtDate } from "@/lib/utils";

export default async function CasesPage({ searchParams }: { searchParams: { status?: string; q?: string } }) {
  const where: Record<string, unknown> = {};
  if (searchParams.status && searchParams.status !== "ALL") where.status = searchParams.status;
  if (searchParams.q) {
    where.OR = [
      { caseNumber: { contains: searchParams.q } },
      { doctorName: { contains: searchParams.q } },
      { patientRef: { contains: searchParams.q } },
    ];
  }

  const cases = await prisma.case.findMany({ where, orderBy: { createdAt: "desc" } });

  const filters = ["ALL", "OPEN", "IN_PRODUCTION", "ON_HOLD", "COMPLETED", "SHIPPED"];
  const activeFilter = searchParams.status || "ALL";

  return (
    <>
      <PageHeader
        eyebrow="Moduli 1 · Pranim"
        title="Rastet"
        subtitle="Çdo rast hyn këtu me kontrollin e pranimit SOP-001 dhe ndjek rrjedhën deri te dërgesa."
        action={<Link href="/cases/new" className="btn-primary">+ Rast i ri</Link>}
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "ALL" ? "/cases" : `/cases?status=${f}`}
            className={`btn-sm rounded-lg border ${
              activeFilter === f ? "bg-clinic-50 border-clinic-200 text-clinic-700" : "border-line bg-surface text-muted hover:bg-canvas"
            }`}
          >
            {f === "ALL" ? "Të gjitha" : CASE_STATUS_LABELS[f]}
          </Link>
        ))}
        <form className="ml-auto" action="/cases">
          <input name="q" defaultValue={searchParams.q} placeholder="Kërko nr./mjek/pacient…" className="input w-64" />
        </form>
      </div>

      {cases.length === 0 ? (
        <EmptyState
          title="Asnjë rast"
          hint="Krijo rastin e parë për të nisur rrjedhën e prodhimit."
          action={<Link href="/cases/new" className="btn-primary">+ Rast i ri</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas border-b border-line">
              <tr>
                <th className="th">Nr. Rasti</th>
                <th className="th">Mjeku</th>
                <th className="th">Pacient (ref)</th>
                <th className="th">Faza</th>
                <th className="th">Aligner</th>
                <th className="th">Prioritet</th>
                <th className="th">Afati</th>
                <th className="th">Statusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-canvas/60 transition-colors">
                  <td className="td">
                    <Link href={`/cases/${c.id}`} className="code text-clinic-600 hover:underline">{c.caseNumber}</Link>
                  </td>
                  <td className="td">{c.doctorName}</td>
                  <td className="td"><span className="code text-muted">{c.patientRef}</span></td>
                  <td className="td text-muted">{STAGE_LABELS[c.stage] ?? c.stage}</td>
                  <td className="td"><span className="code">{c.alignerCount || "—"}</span></td>
                  <td className="td">
                    {c.priority === "RUSH"
                      ? <StatusPill label={PRIORITY_LABELS.RUSH} tone="hold" dot={false} />
                      : <span className="text-faint text-sm">{PRIORITY_LABELS.NORMAL}</span>}
                  </td>
                  <td className="td text-muted">{fmtDate(c.dueDate)}</td>
                  <td className="td"><StatusPill label={CASE_STATUS_LABELS[c.status] ?? c.status} tone={caseStatusTone(c.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
