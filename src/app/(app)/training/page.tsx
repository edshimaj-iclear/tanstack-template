import { prisma } from "@/lib/db";
import { PageHeader, Stat } from "@/components/ui";
import { COMPETENCIES, COMPETENCY_LABELS, TRAINING_LEVEL_LABELS, ROLE_LABELS } from "@/lib/constants";
import { cycleCompetency } from "./actions";

const cellStyle: Record<string, string> = {
  QUALIFIED: "bg-passbg text-pass",
  TRAINING: "bg-holdbg text-hold",
  NONE: "bg-canvas text-faint",
};
const cellMark: Record<string, string> = { QUALIFIED: "✓", TRAINING: "◐", NONE: "—" };

export default async function TrainingPage() {
  const users = await prisma.user.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: { trainings: true },
  });

  const lookup = (uid: string, comp: string, list: { competency: string; level: string }[]) =>
    list.find((t) => t.competency === comp)?.level ?? "NONE";

  const totalCells = users.length * COMPETENCIES.length;
  const qualified = users.reduce((s, u) => s + u.trainings.filter((t) => t.level === "QUALIFIED").length, 0);
  const coverage = totalCells ? Math.round((qualified / totalCells) * 100) : 0;

  return (
    <>
      <PageHeader
        eyebrow="Moduli 9 · Trajnim & Kompetenca"
        title="Matrica e Trajnimeve"
        subtitle="Kliko një qelizë për të ndryshuar nivelin: pa trajnim → në trajnim → i kualifikuar. Vetëm operatorë të kualifikuar duhet të kryejnë hapin përkatës."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Punonjës" value={users.length} />
        <Stat label="Kompetenca të kualifikuara" value={`${qualified}/${totalCells}`} />
        <Stat label="Mbulim" value={`${coverage}%`} tone={coverage >= 70 ? "pass" : "hold"} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-canvas border-b border-line">
            <tr>
              <th className="th sticky left-0 bg-canvas">Punonjësi</th>
              <th className="th">Roli</th>
              {COMPETENCIES.map((c) => <th key={c} className="th text-center">{COMPETENCY_LABELS[c]}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-canvas/40">
                <td className="td font-medium sticky left-0 bg-surface">{u.name}</td>
                <td className="td text-muted text-[13px]">{ROLE_LABELS[u.role] ?? u.role}</td>
                {COMPETENCIES.map((comp) => {
                  const level = lookup(u.id, comp, u.trainings);
                  const action = cycleCompetency.bind(null, u.id, comp);
                  return (
                    <td key={comp} className="td text-center">
                      <form action={action}>
                        <button
                          title={TRAINING_LEVEL_LABELS[level]}
                          className={`h-8 w-8 rounded-md font-mono text-sm ${cellStyle[level]} hover:ring-2 hover:ring-clinic-200 transition`}>
                          {cellMark[level]}
                        </button>
                      </form>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-3 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-passbg text-pass grid place-items-center text-[9px]">✓</span> I kualifikuar</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-holdbg text-hold grid place-items-center text-[9px]">◐</span> Në trajnim</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-canvas border border-line" /> Pa trajnim</span>
      </div>
    </>
  );
}
