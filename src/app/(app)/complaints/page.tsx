import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import { COMPLAINT_STATUS_LABELS, complaintStatusTone } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { createComplaint, updateComplaint, escalateToCapa } from "./actions";

export default async function ComplaintsPage() {
  const [complaints, cases] = await Promise.all([
    prisma.complaint.findMany({ orderBy: { openedAt: "desc" }, include: { case: true, capa: true } }),
    prisma.case.findMany({ orderBy: { createdAt: "desc" }, take: 50, select: { id: true, caseNumber: true } }),
  ]);

  const open = complaints.filter((c) => c.status !== "CLOSED").length;

  return (
    <>
      <PageHeader
        eyebrow="Moduli 15 · Menaxhimi i Ankesave"
        title="Ankesat e Mjekëve"
        subtitle="Çdo ankesë hapet, hetohet kundrejt historisë së prodhimit dhe mund të përshkallëzohet në CAPA."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Ankesa aktive" value={open} tone={open ? "hold" : "pass"} />
        <Stat label="Total" value={complaints.length} />
        <Stat label="Me CAPA" value={complaints.filter((c) => c.capaId).length} />
      </div>

      <details className="card p-0 mb-4 group">
        <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
          <span className="font-display font-semibold text-sm">+ Regjistro ankesë</span>
          <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
        </summary>
        <form action={createComplaint} className="px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-3 border-t border-line">
          <div>
            <label className="label">Mjeku</label>
            <input name="doctorName" required placeholder="Dr. …" className="input mt-1" />
          </div>
          <div>
            <label className="label">Rasti i lidhur</label>
            <select name="caseId" className="input mt-1">
              <option value="">— asnjë —</option>
              {cases.map((c) => <option key={c.id} value={c.id}>{c.caseNumber}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Përshkrimi i ankesës</label>
            <textarea name="description" rows={3} required className="input mt-1" placeholder="P.sh. adaptim i dobët, plasaritje, transparencë…" />
          </div>
          <div className="sm:col-span-2 flex justify-end"><button className="btn-primary">Ruaj ankesën</button></div>
        </form>
      </details>

      {complaints.length === 0 ? (
        <EmptyState title="Asnjë ankesë" hint="Mirë — asnjë ankesë e regjistruar." />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => {
            const save = updateComplaint.bind(null, c.id);
            const escalate = escalateToCapa.bind(null, c.id);
            return (
              <div key={c.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="code text-clinic-600">{c.complaintNumber}</span>
                      <StatusPill label={COMPLAINT_STATUS_LABELS[c.status] ?? c.status} tone={complaintStatusTone(c.status)} dot={false} />
                      {c.case && <span className="code text-faint text-[12px]">{c.case.caseNumber}</span>}
                    </div>
                    <div className="text-sm font-medium mt-1">{c.doctorName}</div>
                    <div className="text-sm text-muted mt-0.5 max-w-2xl">{c.description}</div>
                  </div>
                  <div className="text-[12px] text-faint shrink-0">{fmtDate(c.openedAt)}</div>
                </div>

                <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-line pt-3">
                  <form action={save} className="flex flex-wrap items-end gap-2 flex-1">
                    <div className="flex-1 min-w-[200px]">
                      <label className="label">Vendimi</label>
                      <input name="decision" defaultValue={c.decision ?? ""} placeholder="P.sh. Zëvendësim falas + CAPA" className="input mt-1" />
                    </div>
                    <div className="w-40">
                      <label className="label">Statusi</label>
                      <select name="status" defaultValue={c.status} className="input mt-1">
                        {Object.entries(COMPLAINT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <button className="btn-ghost btn-sm">Ruaj</button>
                  </form>
                  {c.capa ? (
                    <Link href={`/capa/${c.capaId}`} className="btn-ghost btn-sm">→ {c.capa.capaNumber}</Link>
                  ) : (
                    <form action={escalate}><button className="btn-primary btn-sm">Përshkallëzo në CAPA</button></form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
