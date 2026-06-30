import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader, StatusPill, CrumbLink } from "@/components/ui";
import {
  STAGE_LABELS, CASE_STATUS_LABELS, caseStatusTone, STEP_STATUS_LABELS,
  STAGES, nextStage,
} from "@/lib/constants";
import { fmtDateTime } from "@/lib/utils";
import { advanceStage, toggleHold } from "../actions";

function stepTone(status: string) {
  if (status === "PASSED") return "pass" as const;
  if (status === "FAILED") return "fail" as const;
  if (status === "HOLD") return "hold" as const;
  if (status === "IN_PROGRESS") return "info" as const;
  return "neutral" as const;
}

export default async function CaseDetail({ params }: { params: { id: string } }) {
  const user = await getSession();
  const c = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      createdBy: true,
      steps: {
        orderBy: { createdAt: "asc" },
        include: { operator: true, equipment: true, materialLot: { include: { material: true } } },
      },
      inspections: { include: { inspector: true }, orderBy: { signedAt: "desc" } },
      shipment: { include: { releasedBy: true } },
    },
  });
  if (!c) notFound();

  const next = nextStage(c.stage);
  const stageIndex = STAGES.indexOf(c.stage as (typeof STAGES)[number]);
  const onHold = c.status === "ON_HOLD";

  const advance = advanceStage.bind(null, c.id);
  const hold = toggleHold.bind(null, c.id, "Pezulluar manualisht");

  // Traceability chain (Module 5)
  const lastPrint = c.steps.find((s) => s.stage === "PRINTING");
  const chain = [
    { k: "Pacient", v: c.patientRef },
    { k: "Mjeku", v: c.doctorName },
    { k: "STL", v: c.stlVersion ?? "—" },
    { k: "Krijuar nga", v: c.createdBy.name },
    { k: "Printer", v: lastPrint?.equipment?.code ?? "—" },
    { k: "Resin Lot", v: lastPrint?.materialLot?.lotNumber ?? "—" },
    { k: "Dërgesë", v: c.shipment?.trackingNumber ?? "—" },
  ];

  return (
    <>
      <div className="text-sm text-muted mb-2"><CrumbLink href="/cases">Rastet</CrumbLink> / {c.caseNumber}</div>
      <PageHeader
        eyebrow={`Mjeku · ${c.doctorName}`}
        title={c.caseNumber}
        subtitle={`Pacient ref ${c.patientRef} · ${c.alignerCount || "—"} aligner`}
        action={
          <div className="flex items-center gap-2">
            <StatusPill label={CASE_STATUS_LABELS[c.status] ?? c.status} tone={caseStatusTone(c.status)} />
          </div>
        }
      />

      {onHold && (
        <div className="rounded-lg bg-holdbg text-hold text-sm px-4 py-3 mb-4 flex items-center justify-between">
          <span>Rasti është në <b>Case Hold</b>{c.holdReason ? ` — ${c.holdReason}` : ""}.</span>
        </div>
      )}

      {/* Stage progress (the 11-step flow) */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold">Rrjedha e prodhimit</h2>
          <div className="flex items-center gap-2">
            <form action={hold}>
              <button className="btn-ghost btn-sm">{onHold ? "Hiq pezullimin" : "Pezullo (Hold)"}</button>
            </form>
            {c.status !== "COMPLETED" && c.status !== "SHIPPED" && !onHold && (
              <form action={advance}>
                <button className="btn-primary btn-sm">
                  {next ? `→ ${STAGE_LABELS[next]}` : "Përfundo"}
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STAGES.map((st, i) => {
            const done = i < stageIndex;
            const current = i === stageIndex;
            return (
              <div key={st} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] whitespace-nowrap ${
                  current ? "bg-clinic-500 text-white font-medium"
                  : done ? "bg-clinic-50 text-clinic-700"
                  : "bg-canvas text-faint"
                }`}>
                  <span className="font-mono text-[10px] opacity-70">{String(i + 1).padStart(2, "0")}</span>
                  {STAGE_LABELS[st]}
                </div>
                {i < STAGES.length - 1 && <span className={`h-px w-3 ${done ? "bg-clinic-300" : "bg-line"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* DHR timeline */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display font-semibold mb-4">Historiku i rastit (DHR)</h2>
          <ol className="relative border-l border-line ml-2 space-y-5">
            {c.steps.map((s) => (
              <li key={s.id} className="ml-5">
                <span className={`absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-surface ${
                  s.status === "PASSED" ? "bg-pass" : s.status === "FAILED" ? "bg-fail" : s.status === "HOLD" ? "bg-hold" : s.status === "IN_PROGRESS" ? "bg-info" : "bg-faint"
                }`} />
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-sm">{STAGE_LABELS[s.stage] ?? s.stage}</div>
                  <StatusPill label={STEP_STATUS_LABELS[s.status] ?? s.status} tone={stepTone(s.status)} dot={false} />
                </div>
                <div className="text-[12px] text-faint mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
                  {s.operator && <span>Operator: {s.operator.name}</span>}
                  {s.equipment && <span>Pajisje: <span className="font-mono">{s.equipment.code}</span></span>}
                  {s.materialLot && <span>Lot: <span className="font-mono">{s.materialLot.lotNumber}</span></span>}
                  <span>{fmtDateTime(s.completedAt ?? s.startedAt ?? s.createdAt)}</span>
                </div>
                {s.notes && <div className="text-[12px] text-muted mt-1">{s.notes}</div>}
              </li>
            ))}
          </ol>
        </div>

        {/* Traceability + inspections */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-display font-semibold mb-3">Zinxhiri i gjurmueshmërisë</h2>
            <dl className="space-y-2">
              {chain.map((row) => (
                <div key={row.k} className="flex items-center justify-between gap-3">
                  <dt className="text-[12px] text-faint">{row.k}</dt>
                  <dd className="code text-right">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold mb-3">Inspektimet QC</h2>
            <div className="space-y-3">
              {c.inspections.map((q) => (
                <div key={q.id} className="border-b border-line pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono uppercase text-faint">{q.type}</span>
                    <StatusPill
                      label={q.result}
                      tone={q.result === "PASS" ? "pass" : q.result === "FAIL" ? "fail" : "hold"}
                      dot={false}
                    />
                  </div>
                  <div className="text-[12px] text-muted mt-1">{q.inspector.name} · {fmtDateTime(q.signedAt)}</div>
                </div>
              ))}
              {c.inspections.length === 0 && <div className="text-sm text-faint">Asnjë inspektim ende.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
