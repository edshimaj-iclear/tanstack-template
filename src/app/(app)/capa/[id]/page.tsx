import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, CrumbLink } from "@/components/ui";
import { CAPA_STATUS_LABELS, CAPA_SOURCE_LABELS, capaStatusTone, CAPA_FLOW } from "@/lib/constants";
import { fmtDateTime } from "@/lib/utils";
import { updateCapa } from "../actions";

export default async function CapaDetail({ params }: { params: { id: string } }) {
  const c = await prisma.capa.findUnique({
    where: { id: params.id },
    include: { owner: true, case: true, complaints: true },
  });
  if (!c) notFound();

  const save = updateCapa.bind(null, c.id);
  const flowIndex = CAPA_FLOW.indexOf(c.status as (typeof CAPA_FLOW)[number]);

  return (
    <>
      <div className="text-sm text-muted mb-2"><CrumbLink href="/capa">CAPA</CrumbLink> / {c.capaNumber}</div>
      <PageHeader
        eyebrow={`Burimi · ${CAPA_SOURCE_LABELS[c.source] ?? c.source}`}
        title={c.capaNumber}
        subtitle={c.case ? `I lidhur me rastin ${c.case.caseNumber}` : "I pavarur nga rasti"}
        action={<StatusPill label={CAPA_STATUS_LABELS[c.status] ?? c.status} tone={capaStatusTone(c.status)} />}
      />

      {/* Workflow progress */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {CAPA_FLOW.map((st, i) => {
            const done = i < flowIndex, cur = i === flowIndex;
            return (
              <div key={st} className="flex items-center gap-1 shrink-0">
                <div className={`rounded-lg px-2.5 py-1.5 text-[12px] whitespace-nowrap ${cur ? "bg-clinic-500 text-white font-medium" : done ? "bg-clinic-50 text-clinic-700" : "bg-canvas text-faint"}`}>
                  <span className="font-mono text-[10px] opacity-70 mr-1">{String(i + 1).padStart(2, "0")}</span>
                  {CAPA_STATUS_LABELS[st]}
                </div>
                {i < CAPA_FLOW.length - 1 && <span className={`h-px w-3 ${done ? "bg-clinic-300" : "bg-line"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <form action={save} className="card p-5 lg:col-span-2 space-y-4">
          <div>
            <label className="label">Përshkrimi i problemit</label>
            <p className="text-sm mt-1 text-ink">{c.description}</p>
          </div>
          <div>
            <label className="label">Shkaku rrënjësor (Root Cause)</label>
            <textarea name="rootCause" rows={2} defaultValue={c.rootCause ?? ""} className="input mt-1" placeholder="Analizë 5-Why / fishbone…" />
          </div>
          <div>
            <label className="label">Veprimi korrigjues</label>
            <textarea name="correctiveAction" rows={2} defaultValue={c.correctiveAction ?? ""} className="input mt-1" placeholder="Çfarë rregullohet tani…" />
          </div>
          <div>
            <label className="label">Veprimi parandalues</label>
            <textarea name="preventiveAction" rows={2} defaultValue={c.preventiveAction ?? ""} className="input mt-1" placeholder="Si parandalohet përsëritja…" />
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 max-w-[220px]">
              <label className="label">Statusi</label>
              <select name="status" defaultValue={c.status} className="input mt-1">
                {CAPA_FLOW.map((s) => <option key={s} value={s}>{CAPA_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <button className="btn-primary">Ruaj CAPA</button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-display font-semibold mb-3">Detaje</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-faint">Pronar</dt><dd>{c.owner?.name ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-faint">Hapur</dt><dd>{fmtDateTime(c.openedAt)}</dd></div>
              <div className="flex justify-between"><dt className="text-faint">Mbyllur</dt><dd>{c.closedAt ? fmtDateTime(c.closedAt) : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-faint">Ankesa të lidhura</dt><dd className="code">{c.complaints.length}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
