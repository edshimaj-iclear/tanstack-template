import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Boxes,
  CircleCheck,
  CalendarClock,
  Ban,
  Plus,
  Download,
  MapPin,
  Wrench,
  Gauge,
  Link2,
  ShieldCheck,
  ClipboardCheck,
  History,
  CircleAlert,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { FilterChips } from "../../components/qms/FilterBar";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Timeline } from "../../components/qms/Timeline";
import type { TimelineItem } from "../../components/qms/Timeline";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  EQUIPMENT,
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_STATUSES,
} from "../../data/equipment";
import type {
  EquipmentDetail,
  QualificationState,
} from "../../data/equipment";
import { statusTone } from "../../lib/status";
import { formatDate, relativeDeadline, daysUntil, cn } from "../../lib/utils";

export const Route = createFileRoute("/_app/equipment")({
  component: EquipmentPage,
});

const STATUS_BORDER: Record<string, string> = {
  Operational: "border-l-emerald-500",
  "Maintenance Due": "border-l-amber-500",
  "Calibration Due": "border-l-amber-500",
  "Out of Service": "border-l-red-500",
  "Under Qualification": "border-l-blue-500",
};

const STATUS_DOT: Record<string, string> = {
  Operational: "bg-emerald-500",
  "Maintenance Due": "bg-amber-500",
  "Calibration Due": "bg-amber-500",
  "Out of Service": "bg-red-500",
  "Under Qualification": "bg-blue-500",
};

function EquipmentPage() {
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<EquipmentDetail | null>(null);

  const summary = useMemo(
    () => ({
      total: EQUIPMENT.length,
      operational: EQUIPMENT.filter((e) => e.status === "Operational").length,
      calibrationDue: EQUIPMENT.filter(
        (e) => e.status === "Calibration Due" || e.status === "Maintenance Due",
      ).length,
      outOfService: EQUIPMENT.filter((e) => e.status === "Out of Service").length,
    }),
    [],
  );

  const statusOptions = useMemo(
    () => [
      { label: "All statuses", value: "all", count: EQUIPMENT.length },
      ...EQUIPMENT_STATUSES.map((s) => ({
        label: s,
        value: s,
        count: EQUIPMENT.filter((e) => e.status === s).length,
      })),
    ],
    [],
  );

  const categoryOptions = useMemo(
    () => [
      { label: "All categories", value: "all", count: EQUIPMENT.length },
      ...EQUIPMENT_CATEGORIES.map((c) => ({
        label: c,
        value: c,
        count: EQUIPMENT.filter((e) => e.category === c).length,
      })),
    ],
    [],
  );

  const filtered = useMemo(
    () =>
      EQUIPMENT.filter(
        (e) =>
          (status === "all" || e.status === status) &&
          (category === "all" || e.category === category),
      ),
    [status, category],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assets · Qualification & Calibration"
        title="Equipment"
        subtitle="Qualification, calibration and maintenance status across production, metrology and monitoring assets."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export register
            </Button>
            <Button>
              <Plus className="size-4" /> Add equipment
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total equipment" value={summary.total} icon={Boxes} tone="brand" hint="qualified assets" />
        <MetricCard label="Operational" value={summary.operational} icon={CircleCheck} tone="success" hint="ready for production" />
        <MetricCard label="Calibration / maintenance due" value={summary.calibrationDue} icon={CalendarClock} tone="warning" hint="action required" />
        <MetricCard label="Out of service" value={summary.outOfService} icon={Ban} tone="danger" hint="unavailable" />
      </div>

      <div className="space-y-3">
        <FilterChips options={statusOptions} value={status} onChange={setStatus} />
        <FilterChips options={categoryOptions} value={category} onChange={setCategory} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => (
          <EquipmentCard key={e.id} equipment={e} onClick={() => setSelected(e)} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-[var(--border-base)] bg-subtle/50 p-10 text-center text-sm text-fg-muted">
            No equipment matches the current filters.
          </div>
        )}
      </div>

      <EquipmentDrawer equipment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function EquipmentCard({
  equipment: e,
  onClick,
}: {
  equipment: EquipmentDetail;
  onClick: () => void;
}) {
  const overdue = daysUntil(e.nextDue) < 0;
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer flex-col border-l-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated hover:border-[var(--border-strong)]",
        STATUS_BORDER[e.status] ?? "border-l-ink-300",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[e.status])} />
            <h3 className="truncate text-[15px] font-semibold text-fg">{e.name}</h3>
          </div>
          <p className="mt-1 font-mono text-[12px] text-fg-muted">{e.id}</p>
        </div>
        <StatusBadge status={e.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <Boxes className="size-3.5" /> {e.category}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" /> {e.location}
        </span>
      </div>

      <div className="my-4 h-px bg-[var(--border-base)]" />

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Qualification</p>
          <div className="mt-1">
            <QualPills qual={e.qualification} />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Calibration</p>
          <p className="mt-1 font-medium text-fg-secondary">{e.calibrationStatus}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Next due</p>
          <p className={cn("mt-1 font-semibold tabular-nums", overdue ? "text-red-600" : "text-fg")}>
            {formatDate(e.nextDue)}
            <span className={cn("ml-1.5 text-xs font-medium", overdue ? "text-red-500" : "text-fg-muted")}>
              {relativeDeadline(e.nextDue)}
            </span>
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Last service</p>
          <p className="mt-1 font-medium text-fg-secondary tabular-nums">{formatDate(e.lastService)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {e.deviations > 0 ? (
          <Badge tone="danger">
            <Link2 className="size-3" /> {e.deviations} linked deviation{e.deviations > 1 ? "s" : ""}
          </Badge>
        ) : (
          <Badge tone="success" dot>
            No deviations
          </Badge>
        )}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
          View <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Card>
  );
}

const QUAL_TONE: Record<QualificationState, string> = {
  Qualified: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Not Started": "bg-subtle text-fg-muted",
  Failed: "bg-red-100 text-red-700",
};

function QualPills({ qual }: { qual: EquipmentDetail["qualification"] }) {
  const stages: { label: string; state: QualificationState }[] = [
    { label: "IQ", state: qual.iq },
    { label: "OQ", state: qual.oq },
    { label: "PQ", state: qual.pq },
  ];
  return (
    <div className="flex items-center gap-1">
      {stages.map((s) => (
        <span
          key={s.label}
          title={`${s.label}: ${s.state}`}
          className={cn(
            "inline-flex h-6 min-w-[30px] items-center justify-center rounded-md px-1.5 text-[11px] font-bold",
            QUAL_TONE[s.state],
          )}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}

function EquipmentDrawer({
  equipment: e,
  onClose,
}: {
  equipment: EquipmentDetail | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!e} onOpenChange={(o) => !o && onClose()}>
      <SheetContent widthClassName="w-full max-w-2xl">
        {e && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-brand-600">{e.id}</span>
                <StatusBadge status={e.status} />
                <Badge tone={e.criticality === "Critical" ? "danger" : e.criticality === "Major" ? "warning" : "neutral"}>
                  {e.criticality}
                </Badge>
              </div>
              <SheetTitle>{e.name}</SheetTitle>
              <p className="text-sm text-fg-muted">
                {e.manufacturer} · {e.model} · {e.location}
              </p>
            </SheetHeader>
            <SheetBody className="space-y-6">
              {/* Metadata */}
              <MetaGrid cols={3}>
                <LabeledValue label="Serial number" value={e.serialNumber} mono />
                <LabeledValue label="Asset owner" value={e.assetOwner} />
                <LabeledValue label="Installed" value={formatDate(e.installedOn)} />
                <LabeledValue label="Cal. interval" value={e.calibrationInterval} />
                <LabeledValue label="Last service" value={formatDate(e.lastService)} />
                <LabeledValue
                  label="Next due"
                  value={
                    <span className={daysUntil(e.nextDue) < 0 ? "text-red-600" : undefined}>
                      {formatDate(e.nextDue)} · {relativeDeadline(e.nextDue)}
                    </span>
                  }
                />
              </MetaGrid>

              {/* Qualification IQ/OQ/PQ */}
              <section>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                  <ShieldCheck className="size-4 text-brand-600" /> Qualification status
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { label: "IQ", full: "Installation", state: e.qualification.iq },
                    { label: "OQ", full: "Operational", state: e.qualification.oq },
                    { label: "PQ", full: "Performance", state: e.qualification.pq },
                  ] as const).map((s) => (
                    <div
                      key={s.label}
                      className={cn(
                        "rounded-xl border p-3 text-center",
                        s.state === "Qualified"
                          ? "border-emerald-200 bg-emerald-50/60"
                          : s.state === "In Progress"
                            ? "border-blue-200 bg-blue-50/60"
                            : s.state === "Failed"
                              ? "border-red-200 bg-red-50/60"
                              : "border-[var(--border-base)] bg-muted-surface",
                      )}
                    >
                      <p className="text-lg font-bold text-fg">{s.label}</p>
                      <p className="text-[11px] text-fg-muted">{s.full}</p>
                      <Badge
                        tone={statusTone(s.state)}
                        className="mt-2"
                      >
                        {s.state}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-fg-muted">
                  Validation protocol{" "}
                  <span className="font-mono text-fg-secondary">{e.qualification.protocol}</span>
                  {e.qualification.qualifiedOn && <> · qualified {formatDate(e.qualification.qualifiedOn)}</>}
                </p>
              </section>

              {/* Calibration history timeline */}
              <section>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                  <History className="size-4 text-brand-600" /> Calibration & service history
                </h4>
                <Timeline items={e.calibrationHistory.map(calEventToTimeline)} />
              </section>

              {/* Maintenance schedule */}
              <section>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                  <Wrench className="size-4 text-brand-600" /> Maintenance schedule
                </h4>
                <div className="overflow-hidden rounded-xl border border-[var(--border-base)]">
                  <table className="w-full text-sm">
                    <thead className="bg-subtle text-[11px] uppercase tracking-wider text-fg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Task</th>
                        <th className="px-3 py-2 text-left font-semibold">Frequency</th>
                        <th className="px-3 py-2 text-left font-semibold">Next due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-base)]">
                      {e.maintenance.map((m) => {
                        const od = m.nextDue !== "—" && daysUntil(m.nextDue) < 0;
                        return (
                          <tr key={m.task}>
                            <td className="px-3 py-2.5">
                              <p className="font-medium text-fg">{m.task}</p>
                              <p className="text-xs text-fg-muted">{m.owner}</p>
                            </td>
                            <td className="px-3 py-2.5 text-fg-secondary">{m.frequency}</td>
                            <td className="px-3 py-2.5">
                              <span className={cn("tabular-nums", od ? "font-semibold text-red-600" : "text-fg-secondary")}>
                                {m.nextDue === "—" ? "—" : formatDate(m.nextDue)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Linked deviations / CAPAs */}
              <section>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                  <Link2 className="size-4 text-brand-600" /> Linked deviations & CAPAs
                </h4>
                {e.linkedDeviations.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-sm text-emerald-800">
                    <CircleCheck className="size-4" /> No open deviations against this asset.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {e.linkedDeviations.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center gap-3 rounded-xl border border-[var(--border-base)] bg-muted-surface p-3"
                      >
                        <CircleAlert className={cn("size-4 shrink-0", d.status === "Closed" ? "text-emerald-500" : "text-amber-500")} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-fg">{d.title}</p>
                          <p className="font-mono text-xs text-fg-muted">
                            {d.id}
                            {d.capa && <> · {d.capa}</>}
                          </p>
                        </div>
                        <StatusBadge status={d.status} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="flex gap-2 pt-1">
                <Button className="flex-1">
                  <Gauge className="size-4" /> Schedule calibration
                </Button>
                <Button variant="secondary">
                  <ClipboardCheck className="size-4" /> Equipment file
                </Button>
              </div>
            </SheetBody>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function calEventToTimeline(
  ev: EquipmentDetail["calibrationHistory"][number],
): TimelineItem {
  const tone =
    ev.result === "Fail"
      ? "danger"
      : ev.result === "Pass with adjustment"
        ? "warning"
        : ev.type === "Repair"
          ? "info"
          : "success";
  return {
    title: (
      <span className="flex items-center gap-2">
        {ev.type}
        <Badge tone={tone === "danger" ? "danger" : tone === "warning" ? "warning" : "neutral"}>
          {ev.result}
        </Badge>
      </span>
    ),
    time: formatDate(ev.date),
    description: (
      <>
        {ev.note && <span>{ev.note} </span>}
        <span className="font-mono text-xs text-fg-muted">{ev.reference}</span>
      </>
    ),
    actor: ev.performedBy,
    tone,
  };
}
