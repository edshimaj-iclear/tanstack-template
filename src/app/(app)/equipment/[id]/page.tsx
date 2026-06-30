import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, CrumbLink } from "@/components/ui";
import { EQUIPMENT_TYPE_LABELS, EQUIPMENT_STATUS_LABELS, equipmentTone, EQUIPMENT_EVENT_LABELS } from "@/lib/constants";
import { fmtDate, fmtDateTime } from "@/lib/utils";
import { addEvent, setEquipmentStatus } from "../actions";

export default async function EquipmentDetail({ params }: { params: { id: string } }) {
  const e = await prisma.equipment.findUnique({
    where: { id: params.id },
    include: { events: { orderBy: { date: "desc" }, include: { performedBy: true } } },
  });
  if (!e) notFound();

  const add = addEvent.bind(null, e.id);
  const setDown = setEquipmentStatus.bind(null, e.id, "DOWN");
  const setOp = setEquipmentStatus.bind(null, e.id, "OPERATIONAL");

  const has = (t: string) => e.events.some((ev) => ev.type === t);
  const quals = ["IQ", "OQ", "PQ"];

  return (
    <>
      <div className="text-sm text-muted mb-2"><CrumbLink href="/equipment">Pajisjet</CrumbLink> / {e.code}</div>
      <PageHeader
        eyebrow={EQUIPMENT_TYPE_LABELS[e.type] ?? e.type}
        title={`${e.code} · ${e.name}`}
        subtitle={`Vendndodhja: ${e.location ?? "—"} · Instaluar: ${fmtDate(e.installedAt)}`}
        action={
          <div className="flex items-center gap-2">
            <StatusPill label={EQUIPMENT_STATUS_LABELS[e.status] ?? e.status} tone={equipmentTone(e.status)} />
            {e.status === "OPERATIONAL"
              ? <form action={setDown}><button className="btn-ghost btn-sm">Shëno jashtë pune</button></form>
              : <form action={setOp}><button className="btn-ghost btn-sm">Kthe në punë</button></form>}
          </div>
        }
      />

      {/* Qualification status IQ/OQ/PQ */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {quals.map((q) => (
          <div key={q} className={`card p-4 ${has(q) ? "" : "opacity-70"}`}>
            <div className="label">{EQUIPMENT_EVENT_LABELS[q]}</div>
            <div className={`font-display text-lg font-semibold mt-1 ${has(q) ? "text-pass" : "text-faint"}`}>
              {has(q) ? "✓ Kryer" : "Pa kryer"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display font-semibold mb-4">Historiku i pajisjes</h2>
          {e.events.length === 0 ? (
            <div className="text-sm text-faint">Asnjë ngjarje ende. Shto IQ/OQ/PQ ose mirëmbajtje.</div>
          ) : (
            <ol className="relative border-l border-line ml-2 space-y-5">
              {e.events.map((ev) => (
                <li key={ev.id} className="ml-5">
                  <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-surface bg-clinic-400" />
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm">{EQUIPMENT_EVENT_LABELS[ev.type] ?? ev.type}</div>
                    <span className="text-[12px] text-faint">{fmtDateTime(ev.date)}</span>
                  </div>
                  <div className="text-[12px] text-muted mt-0.5 flex flex-wrap gap-x-4">
                    {ev.performedBy && <span>Nga: {ev.performedBy.name}</span>}
                    {ev.nextDue && <span>Afati i radhës: {fmtDate(ev.nextDue)}</span>}
                  </div>
                  {ev.notes && <div className="text-[12px] text-muted mt-1">{ev.notes}</div>}
                </li>
              ))}
            </ol>
          )}
        </div>

        <form action={add} className="card p-5 space-y-3 self-start">
          <h2 className="font-display font-semibold">Shto ngjarje</h2>
          <div>
            <label className="label">Lloji</label>
            <select name="type" className="input mt-1">
              {Object.entries(EQUIPMENT_EVENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Shënime</label>
            <textarea name="notes" rows={2} className="input mt-1" placeholder="Detaje të kryerjes…" />
          </div>
          <div>
            <label className="label">Afati i radhës (opsional)</label>
            <input name="nextDue" type="date" className="input mt-1" />
          </div>
          <div className="flex justify-end"><button className="btn-primary btn-sm">Regjistro</button></div>
        </form>
      </div>
    </>
  );
}
