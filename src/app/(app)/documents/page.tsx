import { prisma } from "@/lib/db";
import { PageHeader, StatusPill, EmptyState } from "@/components/ui";
import { DOC_TYPE_LABELS, DOC_STATUS_LABELS, docStatusTone } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { createDocument, setDocStatus, reviseDocument } from "./actions";

export default async function DocumentsPage({ searchParams }: { searchParams: { type?: string } }) {
  const where: Record<string, unknown> = {};
  if (searchParams.type && searchParams.type !== "ALL") where.type = searchParams.type;

  const docs = await prisma.document.findMany({
    where,
    orderBy: [{ code: "asc" }, { version: "desc" }],
    include: { owner: true },
  });

  const types = ["ALL", "QM", "SOP", "WI", "FRM", "REC", "POL"];
  const active = searchParams.type || "ALL";
  const approved = docs.filter((d) => d.status === "APPROVED").length;

  return (
    <>
      <PageHeader
        eyebrow="Moduli 4 · Kontroll Dokumentesh"
        title="Dokumentet"
        subtitle="Regjistër i kontrolluar i QM, SOP, WI, FRM, REC dhe POL — me versionim dhe statuse aprovimi."
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {types.map((t) => (
          <a key={t} href={t === "ALL" ? "/documents" : `/documents?type=${t}`}
            className={`btn-sm rounded-lg border ${active === t ? "bg-clinic-50 border-clinic-200 text-clinic-700" : "border-line bg-surface text-muted hover:bg-canvas"}`}>
            {t === "ALL" ? "Të gjitha" : t}
          </a>
        ))}
        <span className="ml-auto text-[12px] text-faint font-mono">{approved}/{docs.length} aprovuar</span>
      </div>

      <details className="card p-0 mb-4 group">
        <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between hover:bg-canvas/60">
          <span className="font-display font-semibold text-sm">+ Dokument i ri</span>
          <span className="text-faint text-xs font-mono group-open:hidden">hap</span>
        </summary>
        <form action={createDocument} className="px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-3 border-t border-line">
          <div>
            <label className="label">Kodi</label>
            <input name="code" required placeholder="SOP-012" className="input mt-1" />
          </div>
          <div>
            <label className="label">Lloji</label>
            <select name="type" className="input mt-1">
              {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Titulli</label>
            <input name="title" required placeholder="P.sh. Kontrolli i Termoformimit" className="input mt-1" />
          </div>
          <div>
            <label className="label">Versioni</label>
            <input name="version" defaultValue="1.0" className="input mt-1" />
          </div>
          <div>
            <label className="label">Statusi</label>
            <select name="status" className="input mt-1">
              {Object.entries(DOC_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Përmbledhje / Përmbajtje</label>
            <textarea name="content" rows={3} className="input mt-1" placeholder="Qëllimi, fushëveprimi, hapat kryesorë…" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button className="btn-primary">Ruaj dokumentin</button>
          </div>
        </form>
      </details>

      {docs.length === 0 ? (
        <EmptyState title="Asnjë dokument" hint="Shto SOP-në ose Quality Manual e parë." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas border-b border-line">
              <tr>
                <th className="th">Kodi</th><th className="th">Titulli</th><th className="th">Lloji</th>
                <th className="th">Ver.</th><th className="th">Pronar</th><th className="th">Efektiv</th>
                <th className="th">Statusi</th><th className="th text-right">Veprime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {docs.map((d) => {
                const obsolete = d.status === "OBSOLETE";
                const approve = setDocStatus.bind(null, d.id, "APPROVED");
                const revise = reviseDocument.bind(null, d.id);
                return (
                  <tr key={d.id} className={`hover:bg-canvas/60 ${obsolete ? "opacity-55" : ""}`}>
                    <td className="td"><span className="code text-clinic-600">{d.code}</span></td>
                    <td className="td">{d.title}</td>
                    <td className="td text-muted text-[13px]">{DOC_TYPE_LABELS[d.type] ?? d.type}</td>
                    <td className="td"><span className="code">{d.version}</span></td>
                    <td className="td text-muted text-[13px]">{d.owner?.name ?? "—"}</td>
                    <td className="td text-muted text-[13px]">{fmtDate(d.effectiveDate)}</td>
                    <td className="td"><StatusPill label={DOC_STATUS_LABELS[d.status] ?? d.status} tone={docStatusTone(d.status)} dot={false} /></td>
                    <td className="td">
                      <div className="flex items-center justify-end gap-1.5">
                        {d.status !== "APPROVED" && !obsolete && (
                          <form action={approve}><button className="btn-ghost btn-sm">Aprovo</button></form>
                        )}
                        {d.status === "APPROVED" && (
                          <form action={revise}><button className="btn-ghost btn-sm">Rivizo</button></form>
                        )}
                      </div>
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
