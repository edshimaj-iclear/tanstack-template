import { Fragment } from "react";
import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import { RISK_STATUS_LABELS, riskTone, riskLevel } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { createRisk, setRiskStatus } from "./actions";

export default async function RiskPage() {
  const risks = await prisma.risk.findMany({ orderBy: [{ status: "asc" }, { riskScore: "desc" }] });

  const open = risks.filter((r) => r.status === "OPEN");
  const high = risks.filter((r) => r.riskScore >= 15 && r.status !== "MITIGATED").length;
  const avg = risks.length ? Math.round(risks.reduce((s, r) => s + r.riskScore, 0) / risks.length) : 0;

  // 5x5 matrix counts (probability rows desc 5..1, severity cols 1..5)
  const cell: Record<string, number> = {};
  for (const r of risks) cell[`${r.probability}-${r.severity}`] = (cell[`${r.probability}-${r.severity}`] || 0) + 1;
  const cellColor = (p: number, s: number) => {
    const v = p * s;
    if (v >= 15) return "bg-failbg text-fail";
    if (v >= 8) return "bg-holdbg text-hold";
    return "bg-passbg text-pass";
  };

  return (
    <>
      <PageHeader
        eyebrow="Moduli 8 · Menaxhimi i Riskut"
        title="Regjistri i Riskut"
        subtitle="Vlerësim Probabilitet × Pasojë për çdo proces. Risk ≥ 15 kërkon veprim të menjëhershëm (ISO 14971)."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Rreziqe aktive" value={open.length} />
        <Stat label="Risk i lartë (≥15)" value={high} tone={high ? "fail" : "pass"} />
        <Stat label="Risk mesatar" value={avg} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="card p-5 lg:col-span-1">
          <h2 className="font-display font-semibold mb-3">Matrica 5×5</h2>
          <div className="grid grid-cols-6 gap-1 text-[11px]">
            <div />
            {[1, 2, 3, 4, 5].map((s) => <div key={s} className="text-center font-mono text-faint">{s}</div>)}
            {[5, 4, 3, 2, 1].map((p) => (
              <Fragment key={`row-${p}`}>
                <div className="font-mono text-faint flex items-center justify-end pr-1">{p}</div>
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={`${p}-${s}`} className={`aspect-square rounded grid place-items-center font-mono font-semibold ${cellColor(p, s)}`}>
                    {cell[`${p}-${s}`] || ""}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
          <div className="text-[11px] text-faint mt-3 font-mono">↑ Probabilitet · → Pasojë</div>
        </div>

        <details className="card p-0 lg:col-span-2 group self-start w-full">
          <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
            <span className="font-display font-semibold text-sm">+ Rrezik i ri</span>
            <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
          </summary>
          <form action={createRisk} className="px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-3 border-t border-line">
            <div className="sm:col-span-2">
              <label className="label">Procesi</label>
              <input name="process" required placeholder="P.sh. Printim 3D" className="input mt-1" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Rreziku / Hazardi</label>
              <input name="hazard" required placeholder="P.sh. Dështim printeri gjatë cikleve gjatë" className="input mt-1" />
            </div>
            <div>
              <label className="label">Probabiliteti (1–5)</label>
              <input name="probability" type="number" min={1} max={5} defaultValue={1} className="input mt-1" />
            </div>
            <div>
              <label className="label">Pasoja (1–5)</label>
              <input name="severity" type="number" min={1} max={5} defaultValue={1} className="input mt-1" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Veprimi zbutës</label>
              <input name="action" placeholder="P.sh. Mirëmbajtje javore + skanim barkodi" className="input mt-1" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Pronari</label>
              <input name="owner" placeholder="Përgjegjësi" className="input mt-1" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button className="btn-primary">Shto rrezikun</button>
            </div>
          </form>
        </details>
      </div>

      {risks.length === 0 ? (
        <EmptyState title="Asnjë rrezik i regjistruar" hint="Fillo regjistrin e riskut për proceset kryesore." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas border-b border-line">
              <tr>
                <th className="th">Procesi</th><th className="th">Rreziku</th><th className="th">P</th><th className="th">S</th>
                <th className="th">Risk</th><th className="th">Veprimi</th><th className="th">Statusi</th><th className="th text-right">—</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {risks.map((r) => {
                const mitigate = setRiskStatus.bind(null, r.id, "MITIGATED");
                return (
                  <tr key={r.id} className={`hover:bg-canvas/60 ${r.status === "MITIGATED" ? "opacity-60" : ""}`}>
                    <td className="td font-medium">{r.process}</td>
                    <td className="td text-muted text-[13px] max-w-xs">{r.hazard}</td>
                    <td className="td"><span className="code">{r.probability}</span></td>
                    <td className="td"><span className="code">{r.severity}</span></td>
                    <td className="td">
                      <StatusPill label={`${r.riskScore} · ${riskLevel(r.riskScore)}`} tone={riskTone(r.riskScore)} dot={false} />
                    </td>
                    <td className="td text-muted text-[13px]">{r.action ?? "—"}</td>
                    <td className="td">{RISK_STATUS_LABELS[r.status] ?? r.status}<div className="text-[11px] text-faint">{r.reviewDate ? fmtDate(r.reviewDate) : ""}</div></td>
                    <td className="td text-right">
                      {r.status === "OPEN" && <form action={mitigate}><button className="btn-ghost btn-sm">Shëno zbutur</button></form>}
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
