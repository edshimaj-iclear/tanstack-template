import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession, canRelease } from "@/lib/auth";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import { FINAL_QC_CHECKS, FINAL_QC_LABELS, qcResultTone, QC_TYPE_LABELS } from "@/lib/constants";
import { fmtDateTime } from "@/lib/utils";
import { finalInspect } from "./actions";

export default async function QcPage() {
  const user = await getSession();
  const release = canRelease(user?.role ?? "");

  const [queue, recent] = await Promise.all([
    prisma.case.findMany({
      where: { stage: "FINAL_QC", status: { not: "ON_HOLD" } },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.qcInspection.findMany({
      where: { type: "FINAL" }, orderBy: { signedAt: "desc" }, take: 8,
      include: { inspector: true, case: true },
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Modulet 13–14 · QC në Proces & Lëshim Final"
        title="Kontroll Cilësie"
        subtitle="Asnjë produkt nuk kalon pa aprovim. Lëshimi final (SOP-010) kërkon nënshkrim elektronik nga personi i autorizuar."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Në radhë për QC Final" value={queue.length} tone={queue.length ? "hold" : "pass"} />
        <Stat label="Lëshime sot" value={recent.filter((r) => new Date(r.signedAt).toDateString() === new Date().toDateString()).length} />
        <Stat label="Roli juaj" value={release ? "I autorizuar" : "Pa lëshim"} tone={release ? "pass" : "neutral"} />
      </div>

      {!release && (
        <div className="rounded-lg bg-holdbg text-hold text-sm px-4 py-3 mb-4">
          Roli juaj nuk ka të drejtë lëshimi. Vetëm <b>Drejtori Teknik</b>, <b>Quality Manager</b> ose <b>CEO</b> mund të firmosin QC Final.
        </div>
      )}

      <h2 className="font-display font-semibold mb-3">Radha e lëshimit</h2>
      {queue.length === 0 ? (
        <EmptyState title="Asnjë rast në pritje të QC Final" hint="Rastet shfaqen këtu kur arrijnë fazën QC Final." />
      ) : (
        <div className="space-y-3 mb-8">
          {queue.map((c) => {
            const inspect = finalInspect.bind(null, c.id);
            return (
              <details key={c.id} className="card p-0 group">
                <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
                  <div className="flex items-center gap-3">
                    <Link href={`/cases/${c.id}`} className="code text-clinic-600 hover:underline">{c.caseNumber}</Link>
                    <span className="text-sm text-muted">{c.doctorName}</span>
                    <span className="code text-faint text-[12px]">{c.alignerCount} aligner</span>
                  </div>
                  <span className="btn-primary btn-sm pointer-events-none">Inspekto</span>
                </summary>
                <form action={inspect} className="px-5 pb-5 pt-2 border-t border-line">
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                    {FINAL_QC_CHECKS.map((k) => (
                      <label key={k} className="flex items-center justify-between gap-3 py-1.5 border-b border-line/60">
                        <span className="text-sm">{FINAL_QC_LABELS[k]}</span>
                        <input type="checkbox" name={`chk_${k}`} value="ok" defaultChecked disabled={!release}
                          className="h-4 w-4 accent-clinic-500" />
                      </label>
                    ))}
                  </div>
                  <div className="mb-3">
                    <label className="label">Shënime / foto (referencë)</label>
                    <input name="photoNotes" disabled={!release} className="input mt-1" placeholder="P.sh. foto #IMG-2026-… , vërejtje vizuale" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-faint">Çdo kuti e pazgjedhur → rasti kalon në <b>Hold</b>.</span>
                    <button disabled={!release} className="btn-primary">Firmos & lësho</button>
                  </div>
                </form>
              </details>
            );
          })}
        </div>
      )}

      <h2 className="font-display font-semibold mb-3">Inspektimet e fundit</h2>
      {recent.length === 0 ? (
        <div className="text-sm text-faint">Asnjë inspektim final ende.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas border-b border-line">
              <tr><th className="th">Rasti</th><th className="th">Lloji</th><th className="th">Inspektori</th><th className="th">Firma</th><th className="th">Rezultati</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.map((r) => (
                <tr key={r.id} className="hover:bg-canvas/60">
                  <td className="td">{r.case ? <Link href={`/cases/${r.caseId}`} className="code text-clinic-600 hover:underline">{r.case.caseNumber}</Link> : "—"}</td>
                  <td className="td text-muted text-[13px]">{QC_TYPE_LABELS[r.type] ?? r.type}</td>
                  <td className="td text-[13px]">{r.inspector.name}</td>
                  <td className="td text-[12px] text-faint font-mono">{fmtDateTime(r.signedAt)}</td>
                  <td className="td"><StatusPill label={r.result} tone={qcResultTone(r.result)} dot={false} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
