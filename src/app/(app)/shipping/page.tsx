import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession, canRelease } from "@/lib/auth";
import { PageHeader, StatusPill, Stat, EmptyState } from "@/components/ui";
import { fmtDateTime } from "@/lib/utils";
import { shipCase } from "./actions";

export default async function ShippingPage() {
  const user = await getSession();
  const release = canRelease(user?.role ?? "");

  const [ready, shipped] = await Promise.all([
    prisma.case.findMany({
      where: { stage: "PACKAGING", status: { in: ["IN_PRODUCTION", "COMPLETED"] } },
      orderBy: { dueDate: "asc" },
    }),
    prisma.shipment.findMany({
      where: { shippedAt: { not: null } }, orderBy: { shippedAt: "desc" }, take: 12,
      include: { case: true, releasedBy: true },
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Dërgesat & Gjurmimi"
        title="Dërgesat"
        subtitle="Rastet e paketuara lëshohen për dërgesë me numër gjurmimi. Lëshimi mbyll DHR-në e rastit."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Gati për dërgesë" value={ready.length} tone={ready.length ? "hold" : "pass"} />
        <Stat label="Dërguar (të fundit)" value={shipped.length} tone="pass" />
        <Stat label="Roli juaj" value={release ? "I autorizuar" : "Pa lëshim"} tone={release ? "pass" : "neutral"} />
      </div>

      <h2 className="font-display font-semibold mb-3">Gati për dërgesë</h2>
      {ready.length === 0 ? (
        <EmptyState title="Asnjë rast gati" hint="Rastet shfaqen pasi kalojnë QC Final dhe paketimin." />
      ) : (
        <div className="space-y-3 mb-8">
          {ready.map((c) => {
            const ship = shipCase.bind(null, c.id);
            return (
              <div key={c.id} className="card p-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/cases/${c.id}`} className="code text-clinic-600 hover:underline">{c.caseNumber}</Link>
                    <span className="text-sm text-muted">{c.doctorName}</span>
                  </div>
                  <div className="text-[12px] text-faint mt-0.5">{c.doctorClinic ?? "—"} · {c.alignerCount} aligner</div>
                </div>
                <form action={ship} className="flex flex-wrap items-end gap-2">
                  <div><label className="label">Transportuesi</label><input name="carrier" disabled={!release} placeholder="DHL / Posta" className="input mt-1 w-36" /></div>
                  <div><label className="label">Nr. gjurmimi</label><input name="trackingNumber" disabled={!release} placeholder="TRK…" className="input mt-1 w-44" /></div>
                  <button disabled={!release} className="btn-primary btn-sm">Lësho dërgesën</button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="font-display font-semibold mb-3">Dërgesat e fundit</h2>
      {shipped.length === 0 ? (
        <div className="text-sm text-faint">Asnjë dërgesë ende.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas border-b border-line">
              <tr><th className="th">Rasti</th><th className="th">Transportuesi</th><th className="th">Nr. gjurmimi</th><th className="th">Lëshoi</th><th className="th">Data</th><th className="th">Statusi</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shipped.map((s) => (
                <tr key={s.id} className="hover:bg-canvas/60">
                  <td className="td">{s.case ? <Link href={`/cases/${s.caseId}`} className="code text-clinic-600 hover:underline">{s.case.caseNumber}</Link> : "—"}</td>
                  <td className="td text-[13px]">{s.carrier ?? "—"}</td>
                  <td className="td"><span className="code">{s.trackingNumber ?? "—"}</span></td>
                  <td className="td text-[13px] text-muted">{s.releasedBy?.name ?? "—"}</td>
                  <td className="td text-[12px] text-faint font-mono">{fmtDateTime(s.shippedAt)}</td>
                  <td className="td"><StatusPill label="Dërguar" tone="pass" dot={false} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
