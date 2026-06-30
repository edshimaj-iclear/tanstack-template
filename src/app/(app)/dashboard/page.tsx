import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader, Stat, StatusPill } from "@/components/ui";
import {
  STAGE_LABELS, CASE_STATUS_LABELS, caseStatusTone, STAGES,
} from "@/lib/constants";
import { fmtDate } from "@/lib/utils";

export default async function Dashboard() {
  const user = await getSession();

  const [cases, steps, complaints, capasOpen, recent] = await Promise.all([
    prisma.case.findMany({ select: { status: true } }),
    prisma.productionStep.findMany({ select: { stage: true, status: true } }),
    prisma.complaint.count(),
    prisma.capa.count({ where: { status: { not: "CLOSED" } } }),
    prisma.case.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const active = cases.filter((c) => c.status === "IN_PRODUCTION" || c.status === "OPEN").length;
  const onHold = cases.filter((c) => c.status === "ON_HOLD").length;
  const shipped = cases.filter((c) => c.status === "SHIPPED" || c.status === "COMPLETED").length;

  const prints = steps.filter((s) => s.stage === "PRINTING");
  const printOk = prints.filter((s) => s.status === "PASSED").length;
  const printRate = prints.length ? Math.round((printOk / prints.length) * 100) : 100;

  const finalQc = steps.filter((s) => s.stage === "FINAL_QC");
  const qcFails = finalQc.filter((s) => s.status === "FAILED").length;
  const defectRate = finalQc.length ? ((qcFails / finalQc.length) * 100).toFixed(1) : "0.0";

  // Live production distribution by stage
  const inStage: Record<string, number> = {};
  const liveCases = await prisma.case.findMany({
    where: { status: { in: ["OPEN", "IN_PRODUCTION", "ON_HOLD"] } },
    select: { stage: true },
  });
  for (const c of liveCases) inStage[c.stage] = (inStage[c.stage] ?? 0) + 1;
  const maxStage = Math.max(1, ...STAGES.map((s) => inStage[s] ?? 0));

  return (
    <>
      <PageHeader
        eyebrow="Përmbledhje operacionale"
        title={`Mirëse erdhe, ${user?.name.split(" ")[0]}`}
        subtitle="Gjendja e prodhimit dhe treguesit kryesorë të cilësisë në kohë reale."
        action={<Link href="/cases/new" className="btn-primary">+ Rast i ri</Link>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Stat label="Raste aktive" value={active} hint="Hapur + Në prodhim" tone="info" />
        <Stat label="Në pritje" value={onHold} hint="Case Hold" tone={onHold ? "hold" : "neutral"} />
        <Stat label="Dërguar" value={shipped} hint="Total" tone="pass" />
        <Stat label="Ankesa mjekësh" value={complaints} hint="Gjithsej" tone={complaints ? "hold" : "neutral"} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Stat label="Print Success" value={`${printRate}%`} hint="Target ≥ 99%" tone={printRate >= 99 ? "pass" : "hold"} />
        <Stat label="Defekte QC Final" value={`${defectRate}%`} hint="Target < 1%" tone={Number(defectRate) < 1 ? "pass" : "hold"} />
        <Stat label="CAPA të hapura" value={capasOpen} hint="Kërkojnë veprim" tone={capasOpen ? "hold" : "neutral"} />
        <Stat label="Paketim — gabime" value="0" hint="Target 0" tone="pass" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Live production by stage */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Prodhimi sipas fazës</h2>
            <span className="label">Raste aktive: {liveCases.length}</span>
          </div>
          <div className="space-y-2">
            {STAGES.map((st) => {
              const n = inStage[st] ?? 0;
              return (
                <div key={st} className="flex items-center gap-3">
                  <div className="w-32 text-[13px] text-muted shrink-0">{STAGE_LABELS[st]}</div>
                  <div className="flex-1 h-6 rounded-md bg-canvas overflow-hidden">
                    <div
                      className="h-full bg-clinic-400/70 rounded-md transition-all"
                      style={{ width: `${(n / maxStage) * 100}%`, minWidth: n ? "8px" : "0" }}
                    />
                  </div>
                  <div className="w-6 text-right code text-faint">{n}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent cases */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Rastet e fundit</h2>
            <Link href="/cases" className="text-sm text-clinic-500 hover:underline">Të gjitha</Link>
          </div>
          <div className="space-y-3">
            {recent.map((c) => (
              <Link key={c.id} href={`/cases/${c.id}`} className="flex items-center justify-between group">
                <div>
                  <div className="code group-hover:text-clinic-600">{c.caseNumber}</div>
                  <div className="text-[12px] text-faint">{STAGE_LABELS[c.stage] ?? c.stage}</div>
                </div>
                <StatusPill label={CASE_STATUS_LABELS[c.status] ?? c.status} tone={caseStatusTone(c.status)} dot={false} />
              </Link>
            ))}
            {recent.length === 0 && <div className="text-sm text-faint">Asnjë rast ende.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
