import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import { EQUIPMENT_TYPE_LABELS, EQUIPMENT_STATUS_LABELS, equipmentTone } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { createEquipment } from "./actions";

export default async function EquipmentPage() {
  const equipment = await prisma.equipment.findMany({
    orderBy: { code: "asc" },
    include: { events: { orderBy: { date: "desc" } }, _count: { select: { steps: true } } },
  });

  const operational = equipment.filter((e) => e.status === "OPERATIONAL").length;
  const dueSoon = equipment.filter((e) => {
    const next = e.events.map((ev) => ev.nextDue).filter(Boolean).sort()[0];
    return next && new Date(next) < new Date(Date.now() + 30 * 864e5);
  }).length;

  return (
    <>
      <PageHeader
        eyebrow="Moduli 10 · Menaxhimi i Pajisjeve"
        title="Pajisjet"
        subtitle="Çdo pajisje me historikun e plotë: IQ/OQ/PQ, kalibrim dhe mirëmbajtje — me afatet e radhës."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Operacionale" value={`${operational}/${equipment.length}`} tone="pass" />
        <Stat label="Afat brenda 30 ditësh" value={dueSoon} tone={dueSoon ? "hold" : "pass"} />
        <Stat label="Total pajisje" value={equipment.length} />
      </div>

      <details className="card p-0 mb-4 group">
        <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
          <span className="font-display font-semibold text-sm">+ Pajisje e re</span>
          <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
        </summary>
        <form action={createEquipment} className="px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-3 border-t border-line">
          <div><label className="label">Kodi</label><input name="code" required placeholder="RF881" className="input mt-1" /></div>
          <div>
            <label className="label">Lloji</label>
            <select name="type" className="input mt-1">
              {Object.entries(EQUIPMENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div><label className="label">Emri</label><input name="name" required placeholder="Printer 3D RF881" className="input mt-1" /></div>
          <div><label className="label">Vendndodhja</label><input name="location" placeholder="Lab A" className="input mt-1" /></div>
          <div className="sm:col-span-2 flex justify-end"><button className="btn-primary">Shto pajisjen</button></div>
        </form>
      </details>

      {equipment.length === 0 ? (
        <EmptyState title="Asnjë pajisje" hint="Regjistro printerët, termoformuesit dhe lazerin." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {equipment.map((e) => {
            const lastEvent = e.events[0];
            const next = e.events.map((ev) => ev.nextDue).filter(Boolean).sort()[0];
            return (
              <Link key={e.id} href={`/equipment/${e.id}`} className="card p-4 hover:border-clinic-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="code text-clinic-600">{e.code}</span>
                  <StatusPill label={EQUIPMENT_STATUS_LABELS[e.status] ?? e.status} tone={equipmentTone(e.status)} dot={false} />
                </div>
                <div className="font-medium text-sm mt-2">{e.name}</div>
                <div className="text-[12px] text-faint">{EQUIPMENT_TYPE_LABELS[e.type] ?? e.type} · {e.location ?? "—"}</div>
                <div className="mt-3 pt-3 border-t border-line text-[12px] text-muted flex justify-between">
                  <span>{e._count.steps} hapa prodhimi</span>
                  <span>Afati: {next ? fmtDate(next) : "—"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
