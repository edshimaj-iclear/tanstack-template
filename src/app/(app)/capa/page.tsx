import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import { CAPA_STATUS_LABELS, CAPA_SOURCE_LABELS, capaStatusTone } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { createCapa } from "./actions";

export default async function CapaPage() {
  const [capas, openCases] = await Promise.all([
    prisma.capa.findMany({ orderBy: { openedAt: "desc" }, include: { owner: true, case: true } }),
    prisma.case.findMany({ orderBy: { createdAt: "desc" }, take: 50, select: { id: true, caseNumber: true } }),
  ]);

  const open = capas.filter((c) => c.status !== "CLOSED").length;
  const closed = capas.length - open;

  return (
    <>
      <PageHeader
        eyebrow="Moduli 7 · CAPA"
        title="Veprime Korrigjuese & Parandaluese"
        subtitle="Nga ankesa/auditim te shkaku rrënjësor, veprimi korrigjues, parandalues dhe verifikimi — deri në mbyllje."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="CAPA aktive" value={open} tone={open ? "hold" : "pass"} />
        <Stat label="Mbyllur" value={closed} tone="pass" />
        <Stat label="Total" value={capas.length} />
      </div>

      <details className="card p-0 mb-4 group">
        <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
          <span className="font-display font-semibold text-sm">+ Hap CAPA të re</span>
          <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
        </summary>
        <form action={createCapa} className="px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-3 border-t border-line">
          <div>
            <label className="label">Burimi</label>
            <select name="source" className="input mt-1">
              {Object.entries(CAPA_SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Rast i lidhur (opsional)</label>
            <select name="caseId" className="input mt-1">
              <option value="">— asnjë —</option>
              {openCases.map((c) => <option key={c.id} value={c.id}>{c.caseNumber}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Përshkrimi i problemit</label>
            <textarea name="description" rows={3} required className="input mt-1" placeholder="Çfarë ndodhi, ku dhe çfarë ndikimi pati…" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button className="btn-primary">Krijo CAPA</button>
          </div>
        </form>
      </details>

      {capas.length === 0 ? (
        <EmptyState title="Asnjë CAPA" hint="Hap CAPA-n e parë kur shfaqet një defekt ose ankesë." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas border-b border-line">
              <tr>
                <th className="th">Nr.</th><th className="th">Burimi</th><th className="th">Përshkrimi</th>
                <th className="th">Rasti</th><th className="th">Pronar</th><th className="th">Hapur</th><th className="th">Statusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {capas.map((c) => (
                <tr key={c.id} className="hover:bg-canvas/60">
                  <td className="td"><Link href={`/capa/${c.id}`} className="code text-clinic-600 hover:underline">{c.capaNumber}</Link></td>
                  <td className="td text-muted text-[13px]">{CAPA_SOURCE_LABELS[c.source] ?? c.source}</td>
                  <td className="td max-w-sm truncate">{c.description}</td>
                  <td className="td">{c.case ? <span className="code text-muted">{c.case.caseNumber}</span> : "—"}</td>
                  <td className="td text-muted text-[13px]">{c.owner?.name ?? "—"}</td>
                  <td className="td text-muted text-[13px]">{fmtDate(c.openedAt)}</td>
                  <td className="td"><StatusPill label={CAPA_STATUS_LABELS[c.status] ?? c.status} tone={capaStatusTone(c.status)} dot={false} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
