import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import { STAGE_LABELS, STAGES } from "@/lib/constants";
import { logStep } from "./actions";

// Stages handled on the production line (design → packaging; final QC has its own module)
const LINE_STAGES = ["DESIGN", "PLAN_APPROVAL", "PRINTING", "POST_PROCESS", "THERMOFORMING", "TRIMMING", "LASER_MARKING"];

// Which parameter fields matter per stage
const STAGE_PARAMS: Record<string, { key: string; label: string }[]> = {
  PRINTING: [
    { key: "layerHeight", label: "Layer height (µm)" },
    { key: "exposure", label: "Exposure (s)" },
    { key: "temperature", label: "Temperatura (°C)" },
  ],
  THERMOFORMING: [
    { key: "heatingTime", label: "Kohë ngrohjeje (s)" },
    { key: "vacuum", label: "Vakuum (bar)" },
    { key: "coolingTime", label: "Kohë ftohjeje (s)" },
  ],
  POST_PROCESS: [{ key: "temperature", label: "Post-cure (°C)" }],
};

export default async function ProductionPage() {
  const [cases, equipment, lots] = await Promise.all([
    prisma.case.findMany({
      where: { stage: { in: LINE_STAGES }, status: { not: "SHIPPED" } },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
    }),
    prisma.equipment.findMany({ where: { status: "OPERATIONAL" }, orderBy: { code: "asc" } }),
    prisma.materialLot.findMany({ where: { status: "ACCEPTED" }, include: { material: true }, orderBy: { receivedAt: "desc" } }),
  ]);

  const byStage = LINE_STAGES.map((st) => ({ stage: st, items: cases.filter((c) => c.stage === st) }));
  const onHold = cases.filter((c) => c.status === "ON_HOLD").length;

  return (
    <>
      <PageHeader
        eyebrow="Moduli 2 · Linja e Prodhimit"
        title="Linja e Prodhimit"
        subtitle="Pamje e dyshemesë së prodhimit. Regjistro parametrat (printer, lot resine, ekspozim, vakuum…) dhe kalo rastin në fazën tjetër."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Në prodhim aktiv" value={cases.length} />
        <Stat label="Në Hold" value={onHold} tone={onHold ? "fail" : "pass"} />
        <Stat label="Pajisje operacionale" value={equipment.length} tone="pass" />
      </div>

      {cases.length === 0 ? (
        <EmptyState title="Linja është bosh" hint="Krijo një rast ose avanco nga pranimi për të ushqyer linjën." action={<Link href="/cases/new" className="btn-primary">+ Rast i ri</Link>} />
      ) : (
        <div className="space-y-6">
          {byStage.filter((g) => g.items.length > 0).map((g) => (
            <div key={g.stage}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] text-faint">{String(STAGES.indexOf(g.stage as (typeof STAGES)[number]) + 1).padStart(2, "0")}</span>
                <h2 className="font-display font-semibold">{STAGE_LABELS[g.stage]}</h2>
                <span className="code text-faint text-[12px]">· {g.items.length}</span>
              </div>
              <div className="space-y-2">
                {g.items.map((c) => {
                  const log = logStep.bind(null, c.id);
                  const fields = STAGE_PARAMS[g.stage] ?? [];
                  const needsLot = g.stage === "PRINTING" || g.stage === "THERMOFORMING";
                  return (
                    <details key={c.id} className="card p-0 group">
                      <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between hover:bg-canvas/60">
                        <div className="flex items-center gap-3">
                          <Link href={`/cases/${c.id}`} className="code text-clinic-600 hover:underline">{c.caseNumber}</Link>
                          <span className="text-sm text-muted">{c.doctorName}</span>
                          {c.priority === "RUSH" && <StatusPill label="Urgjent" tone="hold" dot={false} />}
                          {c.status === "ON_HOLD" && <StatusPill label="Hold" tone="fail" dot={false} />}
                        </div>
                        <span className="btn-ghost btn-sm pointer-events-none">Regjistro hapin</span>
                      </summary>
                      <form action={log} className="px-4 pb-4 pt-2 border-t border-line grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="label">Pajisja</label>
                          <select name="equipmentId" className="input mt-1">
                            <option value="">—</option>
                            {equipment.map((e) => <option key={e.id} value={e.id}>{e.code} · {e.name}</option>)}
                          </select>
                        </div>
                        {needsLot && (
                          <div>
                            <label className="label">Lot materiali</label>
                            <select name="materialLotId" className="input mt-1">
                              <option value="">—</option>
                              {lots.map((l) => <option key={l.id} value={l.id}>{l.lotNumber} · {l.material.name}</option>)}
                            </select>
                          </div>
                        )}
                        {fields.map((f) => (
                          <div key={f.key}>
                            <label className="label">{f.label}</label>
                            <input name={f.key} className="input mt-1" />
                          </div>
                        ))}
                        <div className="sm:col-span-3">
                          <label className="label">Shënime</label>
                          <input name="notes" className="input mt-1" placeholder="Vërejtje opsionale për këtë hap" />
                        </div>
                        <div className="sm:col-span-3 flex items-center justify-between">
                          <span className="text-[12px] text-faint">Regjistrimi firmoset automatikisht me operatorin aktual dhe kalon rastin përpara.</span>
                          <button className="btn-primary btn-sm" disabled={c.status === "ON_HOLD"}>Ruaj & avanco →</button>
                        </div>
                      </form>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
