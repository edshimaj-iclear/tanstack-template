import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import { AUDIT_AREA_LABELS, AUDIT_STATUS_LABELS } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { createAudit, closeAudit } from "./actions";

export default async function AuditsPage() {
  const audits = await prisma.audit.findMany({ orderBy: { date: "desc" }, include: { auditor: true } });
  const open = audits.filter((a) => a.status === "OPEN").length;

  return (
    <>
      <PageHeader
        eyebrow="Moduli 16 · Auditimet e Brendshme"
        title="Auditimet"
        subtitle="Auditim mujor i fushave kryesore: shitje, prodhim, QC, dërgesa, dokumentacion, gjurmueshmëri dhe trajnim."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Auditime të hapura" value={open} tone={open ? "hold" : "pass"} />
        <Stat label="Total" value={audits.length} />
        <Stat label="Fusha të mbuluara" value={new Set(audits.map((a) => a.area)).size} />
      </div>

      <details className="card p-0 mb-4 group">
        <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
          <span className="font-display font-semibold text-sm">+ Auditim i ri</span>
          <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
        </summary>
        <form action={createAudit} className="px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-3 border-t border-line">
          <div>
            <label className="label">Fusha</label>
            <select name="area" className="input mt-1">
              {Object.entries(AUDIT_AREA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Gjetjet</label>
            <textarea name="findings" rows={3} className="input mt-1" placeholder="Mospërputhje, observime, rekomandime…" />
          </div>
          <div className="sm:col-span-2 flex justify-end"><button className="btn-primary">Regjistro auditimin</button></div>
        </form>
      </details>

      {audits.length === 0 ? (
        <EmptyState title="Asnjë auditim" hint="Planifiko auditimin e parë të brendshëm." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas border-b border-line">
              <tr><th className="th">Nr.</th><th className="th">Fusha</th><th className="th">Audituesi</th><th className="th">Data</th><th className="th">Gjetjet</th><th className="th">Statusi</th><th className="th text-right">—</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {audits.map((a) => {
                const close = closeAudit.bind(null, a.id);
                return (
                  <tr key={a.id} className="hover:bg-canvas/60">
                    <td className="td"><span className="code text-clinic-600">{a.auditNumber}</span></td>
                    <td className="td font-medium">{AUDIT_AREA_LABELS[a.area] ?? a.area}</td>
                    <td className="td text-[13px] text-muted">{a.auditor?.name ?? "—"}</td>
                    <td className="td text-[13px] text-muted">{fmtDate(a.date)}</td>
                    <td className="td text-[13px] text-muted max-w-sm truncate">{a.findings ?? "—"}</td>
                    <td className="td"><StatusPill label={AUDIT_STATUS_LABELS[a.status] ?? a.status} tone={a.status === "CLOSED" ? "pass" : "hold"} dot={false} /></td>
                    <td className="td text-right">{a.status === "OPEN" && <form action={close}><button className="btn-ghost btn-sm">Mbyll</button></form>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
