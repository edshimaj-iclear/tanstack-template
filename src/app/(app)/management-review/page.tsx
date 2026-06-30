import { prisma } from "@/lib/db";
import { PageHeader, Stat, EmptyState } from "@/components/ui";
import { fmtDate, fmtDateTime } from "@/lib/utils";
import { createReview } from "./actions";

export default async function ManagementReviewPage() {
  const [reviews, total, shipped, complaints, capasOpen, defects, audits] = await Promise.all([
    prisma.managementReview.findMany({ orderBy: { date: "desc" }, take: 12 }),
    prisma.case.count(),
    prisma.case.count({ where: { status: "SHIPPED" } }),
    prisma.complaint.count(),
    prisma.capa.count({ where: { status: { not: "CLOSED" } } }),
    prisma.qcInspection.count({ where: { result: "FAIL" } }),
    prisma.audit.count({ where: { status: "OPEN" } }),
  ]);

  const complaintRate = total ? ((complaints / total) * 100).toFixed(1) : "0.0";

  return (
    <>
      <PageHeader
        eyebrow="Moduli 17 · Rishikimi i Menaxhimit"
        title="Rishikimi i Menaxhimit"
        subtitle="Mbledhja periodike e drejtimit: analizë e KPI-ve, ankesave, CAPA-ve dhe vendimet për muajin pasardhës. Çdo rishikim fotografon KPI-të e momentit."
      />

      <h2 className="font-display font-semibold mb-3">Treguesit aktualë</h2>
      <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Stat label="Raste total" value={total} />
        <Stat label="Dërguar" value={shipped} tone="pass" />
        <Stat label="Ankesa" value={complaints} />
        <Stat label="Raporti ankesave" value={`${complaintRate}%`} tone={parseFloat(complaintRate) < 0.5 ? "pass" : "hold"} />
        <Stat label="CAPA aktive" value={capasOpen} tone={capasOpen ? "hold" : "pass"} />
        <Stat label="Auditime hapur" value={audits} tone={audits ? "hold" : "pass"} />
      </div>

      <details className="card p-0 mb-6 group">
        <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
          <span className="font-display font-semibold text-sm">+ Regjistro rishikim</span>
          <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
        </summary>
        <form action={createReview} className="px-5 pb-5 pt-1 grid gap-3 border-t border-line">
          <div>
            <label className="label">Pjesëmarrësit</label>
            <input name="attendees" className="input mt-1" placeholder="CEO, Drejtor Teknik, Quality Manager, Shitje…" />
          </div>
          <div>
            <label className="label">Vendimet</label>
            <textarea name="decisions" rows={2} className="input mt-1" placeholder="Vendimet kryesore të marra…" />
          </div>
          <div>
            <label className="label">Veprimet për muajin pasardhës</label>
            <textarea name="actions" rows={2} className="input mt-1" placeholder="Objektivat & veprimet…" />
          </div>
          <div className="max-w-[220px]">
            <label className="label">Rishikimi i radhës</label>
            <input name="nextReviewDate" type="date" className="input mt-1" />
          </div>
          <div className="flex justify-end"><button className="btn-primary">Ruaj rishikimin</button></div>
        </form>
      </details>

      <h2 className="font-display font-semibold mb-3">Historiku i rishikimeve</h2>
      {reviews.length === 0 ? (
        <EmptyState title="Asnjë rishikim" hint="Regjistro rishikimin e parë të menaxhimit." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            let kpi: Record<string, unknown> = {};
            try { kpi = r.kpiSnapshot ? JSON.parse(r.kpiSnapshot) : {}; } catch { kpi = {}; }
            return (
              <div key={r.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{fmtDateTime(r.date)}</div>
                  {r.nextReviewDate && <div className="text-[12px] text-faint">Radhës: {fmtDate(r.nextReviewDate)}</div>}
                </div>
                {r.attendees && <div className="text-[13px] text-muted mt-1">👥 {r.attendees}</div>}
                {r.decisions && <div className="text-sm mt-2"><span className="label">Vendimet</span><div className="mt-0.5">{r.decisions}</div></div>}
                {r.actions && <div className="text-sm mt-2"><span className="label">Veprimet</span><div className="mt-0.5">{r.actions}</div></div>}
                <div className="mt-3 pt-3 border-t border-line flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted font-mono">
                  <span>raste: {String(kpi.total ?? "—")}</span>
                  <span>dërguar: {String(kpi.shipped ?? "—")}</span>
                  <span>ankesa: {String(kpi.complaints ?? "—")}</span>
                  <span>CAPA: {String(kpi.capasOpen ?? "—")}</span>
                  <span>defekte: {String(kpi.defects ?? "—")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
