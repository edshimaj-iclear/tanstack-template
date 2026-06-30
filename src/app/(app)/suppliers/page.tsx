import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import {
  SUPPLIER_STATUS_LABELS, supplierTone, LOT_STATUS_LABELS, lotTone,
} from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { createSupplier, setSupplierStatus, createLot, inspectLot } from "./actions";

export default async function SuppliersPage() {
  const [suppliers, materials, lots] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { code: "asc" }, include: { _count: { select: { lots: true } } } }),
    prisma.material.findMany({ orderBy: { code: "asc" }, include: { supplier: true } }),
    prisma.materialLot.findMany({ orderBy: { receivedAt: "desc" }, include: { material: true, supplier: true } }),
  ]);

  const approved = suppliers.filter((s) => s.status === "APPROVED").length;
  const quarantine = lots.filter((l) => l.status === "QUARANTINE").length;

  return (
    <>
      <PageHeader
        eyebrow="Modulet 11–12 · Furnitorë & Materiale"
        title="Furnitorët & Lot-et"
        subtitle="Cilësia e furnitorit, materialet dhe inspektimi i pranimit për çdo lot resine/filmi para se të hyjë në prodhim."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Furnitorë të aprovuar" value={`${approved}/${suppliers.length}`} tone="pass" />
        <Stat label="Lot-e në karantinë" value={quarantine} tone={quarantine ? "hold" : "pass"} />
        <Stat label="Materiale aktive" value={materials.length} />
      </div>

      {/* SUPPLIERS */}
      <h2 className="font-display font-semibold mb-3">Furnitorët</h2>
      <details className="card p-0 mb-4 group">
        <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
          <span className="font-display font-semibold text-sm">+ Furnitor i ri</span>
          <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
        </summary>
        <form action={createSupplier} className="px-5 pb-5 pt-1 grid sm:grid-cols-4 gap-3 border-t border-line">
          <div><label className="label">Kodi</label><input name="code" required placeholder="SUP-003" className="input mt-1" /></div>
          <div className="sm:col-span-2"><label className="label">Emri</label><input name="name" required className="input mt-1" /></div>
          <div>
            <label className="label">Lloji</label>
            <select name="type" className="input mt-1">
              <option value="RESIN">Resinë</option><option value="FILM">Film</option>
              <option value="PACKAGING">Paketim</option><option value="OTHER">Tjetër</option>
            </select>
          </div>
          <div><label className="label">Score (0–100)</label><input name="score" type="number" min={0} max={100} className="input mt-1" /></div>
          <div className="sm:col-span-4 flex justify-end"><button className="btn-primary">Shto furnitorin</button></div>
        </form>
      </details>

      <div className="card overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-canvas border-b border-line">
            <tr><th className="th">Kodi</th><th className="th">Emri</th><th className="th">Lloji</th><th className="th">Score</th><th className="th">Lot-e</th><th className="th">Statusi</th><th className="th text-right">—</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {suppliers.map((s) => {
              const approve = setSupplierStatus.bind(null, s.id, "APPROVED");
              const suspend = setSupplierStatus.bind(null, s.id, "SUSPENDED");
              return (
                <tr key={s.id} className="hover:bg-canvas/60">
                  <td className="td"><span className="code text-clinic-600">{s.code}</span></td>
                  <td className="td font-medium">{s.name}</td>
                  <td className="td text-muted text-[13px]">{s.type}</td>
                  <td className="td"><span className="code">{s.score ?? "—"}</span></td>
                  <td className="td"><span className="code text-muted">{s._count.lots}</span></td>
                  <td className="td"><StatusPill label={SUPPLIER_STATUS_LABELS[s.status] ?? s.status} tone={supplierTone(s.status)} dot={false} /></td>
                  <td className="td text-right">
                    <div className="flex justify-end gap-1.5">
                      {s.status !== "APPROVED" && <form action={approve}><button className="btn-ghost btn-sm">Aprovo</button></form>}
                      {s.status === "APPROVED" && <form action={suspend}><button className="btn-ghost btn-sm">Pezullo</button></form>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {suppliers.length === 0 && <tr><td colSpan={7} className="td text-center text-faint py-6">Asnjë furnitor</td></tr>}
          </tbody>
        </table>
      </div>

      {/* LOTS + incoming inspection */}
      <h2 className="font-display font-semibold mb-3">Lot-et e materialeve & Inspektimi i pranimit</h2>
      <details className="card p-0 mb-4 group">
        <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
          <span className="font-display font-semibold text-sm">+ Regjistro lot të ri</span>
          <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
        </summary>
        <form action={createLot} className="px-5 pb-5 pt-1 grid sm:grid-cols-4 gap-3 border-t border-line">
          <div className="sm:col-span-2"><label className="label">Nr. Loti</label><input name="lotNumber" required placeholder="RES-2026-0149" className="input mt-1" /></div>
          <div className="sm:col-span-2">
            <label className="label">Materiali</label>
            <select name="materialId" required className="input mt-1">
              <option value="">— zgjidh —</option>
              {materials.map((m) => <option key={m.id} value={m.id}>{m.code} · {m.name}</option>)}
            </select>
          </div>
          <div><label className="label">Sasia</label><input name="quantity" type="number" step="0.01" className="input mt-1" /></div>
          <div><label className="label">Skadenca</label><input name="expiryDate" type="date" className="input mt-1" /></div>
          <div className="sm:col-span-4 flex justify-end"><button className="btn-primary">Regjistro lotin</button></div>
        </form>
      </details>

      {lots.length === 0 ? (
        <EmptyState title="Asnjë lot" hint="Regjistro lot-et e resinës dhe filmit kur mbërrijnë." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas border-b border-line">
              <tr><th className="th">Nr. Loti</th><th className="th">Materiali</th><th className="th">Furnitori</th><th className="th">Pranuar</th><th className="th">Skadenca</th><th className="th">Statusi</th><th className="th text-right">Inspektim</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {lots.map((l) => {
                const accept = inspectLot.bind(null, l.id, "ACCEPTED");
                const reject = inspectLot.bind(null, l.id, "REJECTED");
                const expired = l.expiryDate && new Date(l.expiryDate) < new Date();
                return (
                  <tr key={l.id} className="hover:bg-canvas/60">
                    <td className="td"><span className="code text-clinic-600">{l.lotNumber}</span></td>
                    <td className="td">{l.material.name}</td>
                    <td className="td text-muted text-[13px]">{l.supplier?.name ?? "—"}</td>
                    <td className="td text-muted text-[13px]">{fmtDate(l.receivedAt)}</td>
                    <td className={`td text-[13px] ${expired ? "text-fail font-medium" : "text-muted"}`}>{fmtDate(l.expiryDate)}</td>
                    <td className="td"><StatusPill label={LOT_STATUS_LABELS[l.status] ?? l.status} tone={lotTone(l.status)} dot={false} /></td>
                    <td className="td text-right">
                      {l.status === "QUARANTINE" ? (
                        <div className="flex justify-end gap-1.5">
                          <form action={accept}><button className="btn-ghost btn-sm text-pass">Prano</button></form>
                          <form action={reject}><button className="btn-ghost btn-sm text-fail">Refuzo</button></form>
                        </div>
                      ) : <span className="text-faint text-[12px]">—</span>}
                    </td>
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
