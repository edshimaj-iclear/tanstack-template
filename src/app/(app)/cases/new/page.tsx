import Link from "next/link";
import { PageHeader, CrumbLink } from "@/components/ui";
import { createCase } from "../actions";

const CHECKS: { key: string; label: string; hint: string }[] = [
  { key: "stl_opens", label: "STL hapet", hint: "Skedari hapet pa gabime" },
  { key: "missing_teeth", label: "Missing teeth", hint: "Asnjë dhëmb mungesë" },
  { key: "artifacts", label: "Artifacts", hint: "Pa zhurmë/artefakte skanimi" },
  { key: "scan_quality", label: "Scan quality", hint: "Cilësi e mjaftueshme" },
  { key: "margin", label: "Margin", hint: "Kufijtë e qartë" },
];

export default function NewCasePage() {
  return (
    <>
      <div className="text-sm text-muted mb-2"><CrumbLink href="/cases">Rastet</CrumbLink> / Rast i ri</div>
      <PageHeader
        eyebrow="Moduli 1 · SOP-001 Pranim"
        title="Rast i ri"
        subtitle="Plotëso të dhënat e rastit dhe kontrollin e pranimit të STL. Nëse ndonjë kontroll dështon, rasti kalon automatikisht në Case Hold."
      />

      <form action={createCase} className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="font-display font-semibold">Të dhënat e rastit</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label block mb-1.5">Referenca e pacientit *</label>
                <input name="patientRef" required className="input" placeholder="p.sh. PT-0042" />
                <p className="text-[11px] text-faint mt-1">Pa të dhëna personale — vetëm referencë.</p>
              </div>
              <div>
                <label className="label block mb-1.5">Mjeku *</label>
                <input name="doctorName" required className="input" placeholder="Dr. Emri Mbiemri" />
              </div>
              <div>
                <label className="label block mb-1.5">Klinika</label>
                <input name="doctorClinic" className="input" placeholder="Emri i klinikës" />
              </div>
              <div>
                <label className="label block mb-1.5">Versioni STL</label>
                <input name="stlVersion" className="input" placeholder="v1.0" />
              </div>
              <div>
                <label className="label block mb-1.5">Numri i aligner-ve</label>
                <input name="alignerCount" type="number" min="0" className="input" placeholder="0" />
              </div>
              <div>
                <label className="label block mb-1.5">Afati</label>
                <input name="dueDate" type="date" className="input" />
              </div>
            </div>
            <div>
              <label className="label block mb-1.5">Prioriteti</label>
              <select name="priority" className="input">
                <option value="NORMAL">Normal</option>
                <option value="RUSH">Urgjent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display font-semibold">Kontrolli i pranimit</h2>
              <span className="label">SOP-001</span>
            </div>
            <p className="text-[12px] text-muted mb-4">Hiq shenjën nëse një kontroll dështon.</p>
            <div className="space-y-2.5">
              {CHECKS.map((c) => (
                <label key={c.key} className="flex items-start gap-3 rounded-lg border border-line p-2.5 cursor-pointer hover:bg-canvas">
                  <input
                    type="checkbox"
                    name={`chk_${c.key}`}
                    value="ok"
                    defaultChecked
                    className="mt-0.5 h-4 w-4 accent-clinic-500"
                  />
                  <span>
                    <span className="text-sm font-medium text-ink block">{c.label}</span>
                    <span className="text-[11px] text-faint">{c.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">Krijo rastin</button>
          <Link href="/cases" className="btn-ghost w-full">Anulo</Link>
        </div>
      </form>
    </>
  );
}
