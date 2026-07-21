import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Plus,
  ClipboardList,
  AlarmClock,
  Timer,
  ShieldCheck,
  ArrowRight,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Search as SearchIcon,
  ClipboardCheck,
  Wrench,
  FlaskConical,
  FileText,
  Sparkles,
  Fingerprint,
} from "lucide-react";
import { PageHeader, SectionHeading } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { FilterBar, FilterChips } from "../../components/qms/FilterBar";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { ApprovalStepper, type Step } from "../../components/qms/ApprovalStepper";
import { Timeline, type TimelineItem } from "../../components/qms/Timeline";
import { DataTable } from "../../components/tables/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Avatar } from "../../components/ui/misc";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { DonutChart, BarChartCard, CHART_COLORS, PIE_PALETTE } from "../../components/charts";
import {
  CAPAS,
  CAPA_ROOT_CAUSES,
  CAPA_BY_DEPARTMENT,
  CAPA_WORKFLOW_STEPS,
} from "../../data/capa";
import type { Capa } from "../../types";
import { relativeDeadline, formatDate, daysUntil } from "../../lib/utils";

export const Route = createFileRoute("/_app/capa")({
  component: CapaPage,
});

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

const isOverdue = (c: Capa) => daysUntil(c.dueDate) < 0 && c.status !== "Closed";

const severityTone = (s: Capa["severity"]) =>
  s === "Critical" ? "danger" : s === "Major" ? "warning" : "info";

const effectivenessTone = (e: Capa["effectiveness"]) =>
  e === "Passed" ? "success" : e === "Pending" ? "warning" : e === "Failed" ? "danger" : "neutral";

/** Which workflow step is "current" for a given CAPA status. */
const STATUS_STEP: Record<Capa["status"], number> = {
  Open: 1, // Identification done, Containment current
  Investigation: 2,
  "In Progress": 5, // Implementation
  "Effectiveness Check": 6,
  Overdue: 4, // Action Plan / implementation stalled
  Closed: 8, // everything done
};

function workflowSteps(c: Capa): Step[] {
  const current = STATUS_STEP[c.status];
  return CAPA_WORKFLOW_STEPS.map((label, i) => {
    let state: Step["state"];
    if (i < current) state = "done";
    else if (i === current) state = "current";
    else state = "upcoming";
    return { label, state };
  });
}

/** Ishikawa primary category per root cause. */
const ISHIKAWA: Record<string, string> = {
  "Supplier material variation": "Material",
  "Insufficient edge trimming": "Method",
  "Manual label handling": "Man",
  "Missed calibration schedule": "Measurement",
  "Unclear approval routing": "Method",
  "Supplier process drift": "Material",
  "HVAC filter degradation": "Environment",
  Onboarding: "Man",
  "Onboarding gap": "Man",
  "Address verification failure": "Method",
  "Attachment geometry": "Method",
  "Worn polishing wheel": "Machine",
  "Parallel editing": "Method",
};

const FISHBONE = ["Man", "Machine", "Method", "Material", "Measurement", "Environment"] as const;

interface CapaDetail {
  description: string;
  correction: string;
  containment: string;
  fiveWhys: string[];
  primaryCategory: string;
  corrective: string[];
  preventive: string[];
  evidence: { label: string; ref: string }[];
  criteria: string;
  approvals: { name: string; role: string; state: "Approved" | "Pending" | "Awaiting" }[];
}

/** Build rich, plausible detail content derived from the CAPA record. */
function buildDetail(c: Capa): CapaDetail {
  const dept = c.department;
  const rc = c.rootCause.toLowerCase();
  const primaryCategory = ISHIKAWA[c.rootCause] ?? "Method";

  return {
    description: `${c.title}. Identified through ${c.source.toLowerCase()} affecting ${dept}. The condition was evaluated against acceptance criteria and confirmed as a nonconformity requiring corrective and preventive action under the iClear QMS (ISO 13485 §8.5).`,
    correction: `Affected units placed on QA hold and segregated from released stock. Impacted lots re-inspected against specification; a disposition decision (rework / scrap / use-as-is) was recorded on the batch record.`,
    containment: `Interim controls applied at ${dept}: enhanced in-process inspection at 100% sampling and a temporary work-instruction addendum issued. No further nonconforming product released to distribution while the investigation is open.`,
    fiveWhys: [
      `The nonconformity was observed during ${c.source.toLowerCase()}.`,
      `Process output at ${dept} fell outside the defined specification limits.`,
      `The in-line control did not detect the deviation before the affected step completed.`,
      `Underlying driver traced to ${rc}.`,
      `No preventive control / monitoring was defined for this specific failure mode — systemic gap confirmed.`,
    ],
    primaryCategory,
    corrective: [
      `Correct the immediate source of ${rc} and re-validate the affected process parameters.`,
      `Update SOP / work instruction for ${dept} to close the detection gap.`,
      `Re-train involved operators against the revised instruction with competency sign-off.`,
    ],
    preventive: [
      `Add a routine monitoring checkpoint targeting this failure mode across similar processes.`,
      `Extend the control to related product families and feed the learning into design/process FMEA.`,
      `Schedule a follow-up effectiveness review at +90 days from closure.`,
    ],
    evidence: [
      { label: "Nonconformity record", ref: "NCR-2026-081" },
      { label: "Revised work instruction", ref: `WI-${dept.slice(0, 4).toUpperCase()}-012` },
      { label: "Training record", ref: "TRN-2026-044" },
      { label: "Verification report", ref: "VV-2026-04" },
    ],
    criteria: `Zero recurrence of the failure mode across the next 3 production lots and no related complaints for 90 days post-implementation. Effectiveness verified by ${dept === "Quality" ? "Quality" : "QA"} review with objective evidence.`,
    approvals: [
      { name: c.owner, role: "CAPA Owner", state: c.progress >= 40 ? "Approved" : "Pending" },
      { name: "Anila Berisha", role: "Quality Manager", state: c.progress >= 70 ? "Approved" : "Pending" },
      {
        name: "Genti Hoxha",
        role: "PRRC",
        state: c.status === "Closed" ? "Approved" : c.progress >= 85 ? "Pending" : "Awaiting",
      },
    ],
  };
}

function buildTimeline(c: Capa): TimelineItem[] {
  const items: TimelineItem[] = [
    {
      title: "CAPA raised",
      description: `Opened from ${c.source.toLowerCase()} and assigned to ${c.owner}.`,
      time: formatDate(c.opened),
      tone: "brand",
      icon: <ClipboardList />,
    },
    {
      title: "Containment applied",
      description: "Affected product segregated; interim controls in place.",
      time: formatDate(addDays(c.opened, 2)),
      tone: "warning",
      icon: <ClipboardCheck />,
    },
    {
      title: "Root-cause investigation",
      description: `5-Whys completed — primary cause: ${c.rootCause.toLowerCase()}.`,
      time: formatDate(addDays(c.opened, 8)),
      tone: "info",
      icon: <SearchIcon />,
    },
  ];
  if (c.progress >= 60) {
    items.push({
      title: "Action plan implemented",
      description: "Corrective actions executed and verified against specification.",
      time: formatDate(addDays(c.opened, 21)),
      tone: "brand",
      icon: <Wrench />,
    });
  }
  if (c.status === "Effectiveness Check" || c.status === "Closed") {
    items.push({
      title: "Effectiveness check",
      description:
        c.effectiveness === "Passed"
          ? "Effectiveness criteria met — no recurrence observed."
          : "Effectiveness monitoring in progress against defined criteria.",
      time: formatDate(addDays(c.opened, 40)),
      tone: c.effectiveness === "Passed" ? "success" : "warning",
      icon: <FlaskConical />,
    });
  }
  if (c.status === "Closed") {
    items.push({
      title: "CAPA closed",
      description: "Approved and closed with objective evidence archived in the DHR.",
      time: formatDate(c.dueDate),
      tone: "success",
      icon: <CheckCircle2 />,
    });
  } else {
    items.push({
      title: `Target closure ${relativeDeadline(c.dueDate)}`,
      description: `Due ${formatDate(c.dueDate)}${isOverdue(c) ? " — action overdue" : ""}.`,
      time: formatDate(c.dueDate),
      tone: isOverdue(c) ? "danger" : "neutral",
      icon: <Timer />,
    });
  }
  return items;
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

type StatusFilter =
  | "all"
  | "Open"
  | "Investigation"
  | "In Progress"
  | "Effectiveness Check"
  | "Overdue"
  | "Closed";

function CapaPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Capa | null>(null);

  const metrics = useMemo(() => {
    const open = CAPAS.filter((c) => c.status !== "Closed").length;
    const overdue = CAPAS.filter(isOverdue).length;
    return { open, overdue };
  }, []);

  const chipOptions = useMemo(() => {
    const count = (fn: (c: Capa) => boolean) => CAPAS.filter(fn).length;
    return [
      { label: "All", value: "all" as const, count: CAPAS.length },
      { label: "Open", value: "Open" as const, count: count((c) => c.status === "Open") },
      { label: "Investigation", value: "Investigation" as const, count: count((c) => c.status === "Investigation") },
      { label: "In Progress", value: "In Progress" as const, count: count((c) => c.status === "In Progress") },
      { label: "Effectiveness Check", value: "Effectiveness Check" as const, count: count((c) => c.status === "Effectiveness Check") },
      { label: "Overdue", value: "Overdue" as const, count: count(isOverdue) },
      { label: "Closed", value: "Closed" as const, count: count((c) => c.status === "Closed") },
    ];
  }, []);

  const filtered = useMemo(() => {
    return CAPAS.filter((c) => {
      const matchSearch =
        !search ||
        `${c.id} ${c.title} ${c.source} ${c.rootCause} ${c.owner} ${c.department}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus =
        status === "all" || (status === "Overdue" ? isOverdue(c) : c.status === status);
      return matchSearch && matchStatus;
    });
  }, [search, status]);

  const columns: ColumnDef<Capa>[] = [
    {
      accessorKey: "id",
      header: "CAPA ID",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] font-semibold text-fg">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <p className="max-w-[240px] truncate font-medium text-fg">{row.original.title}</p>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => (
        <span className="text-sm text-fg-secondary">{row.original.source}</span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <Badge tone={severityTone(row.original.severity)}>{row.original.severity}</Badge>
      ),
    },
    {
      accessorKey: "rootCause",
      header: "Root cause",
      cell: ({ row }) => (
        <span className="max-w-[180px] truncate text-sm text-fg-secondary">{row.original.rootCause}</span>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.original.owner} size="xs" />
          <span className="whitespace-nowrap text-sm text-fg-secondary">{row.original.owner}</span>
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due date",
      cell: ({ row }) => {
        const over = isOverdue(row.original);
        return (
          <span
            className={
              over
                ? "flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-red-600"
                : "whitespace-nowrap text-sm text-fg-secondary"
            }
          >
            {over && <AlertTriangle className="size-3.5" />}
            {relativeDeadline(row.original.dueDate)}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => (
        <div className="flex min-w-[104px] items-center gap-2">
          <Progress value={row.original.progress} size="sm" className="flex-1" />
          <span className="w-8 text-right text-xs font-medium tabular-nums text-fg-muted">
            {row.original.progress}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: "effectiveness",
      header: "Effectiveness",
      cell: ({ row }) =>
        row.original.effectiveness === "—" ? (
          <span className="text-sm text-fg-muted">—</span>
        ) : (
          <Badge tone={effectivenessTone(row.original.effectiveness)}>
            {row.original.effectiveness}
          </Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Corrective & Preventive Action"
        title="CAPA Management"
        subtitle="Track corrective and preventive actions from identification through effectiveness verification — ISO 13485 §8.5 & MDR compliant."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export
            </Button>
            <Button>
              <Plus className="size-4" /> New CAPA
            </Button>
          </>
        }
      />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Open CAPAs" value={metrics.open} icon={ClipboardList} tone="brand" hint="active across all stages" />
        <MetricCard label="Overdue CAPAs" value={metrics.overdue} icon={AlarmClock} tone="danger" hint="past target closure" />
        <MetricCard label="Avg. closure time" value="42d" icon={Timer} tone="info" hint="identification → closure" />
        <MetricCard label="Effectiveness pass rate" value={84} suffix="%" icon={ShieldCheck} tone="success" hint="verified checks (trailing 12 mo)" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>CAPAs by root cause</CardTitle>
              <p className="text-sm text-fg-muted">Ishikawa category distribution</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
              <DonutChart data={CAPA_ROOT_CAUSES} height={200} />
              <ChartLegend
                items={CAPA_ROOT_CAUSES.map((d, i) => ({
                  name: d.name,
                  value: d.value,
                  color: PIE_PALETTE[i % PIE_PALETTE.length],
                }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>CAPAs by department</CardTitle>
              <p className="text-sm text-fg-muted">Where actions originate</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-fg-muted">
              <span className="size-2 rounded-full" style={{ backgroundColor: CHART_COLORS.brand }} />
              Open CAPAs
            </span>
          </CardHeader>
          <CardContent>
            <BarChartCard
              data={CAPA_BY_DEPARTMENT}
              xKey="name"
              height={210}
              bars={[{ key: "value", name: "CAPAs", color: CHART_COLORS.brand }]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <SectionHeading title="CAPA register" description="Click any row to open the full workflow and case file" />
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by ID, title, source, root cause, owner…"
          right={
            <Badge tone="neutral">
              {filtered.length} of {CAPAS.length}
            </Badge>
          }
        >
          <FilterChips options={chipOptions} value={status} onChange={setStatus} />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={setSelected}
        pageSize={12}
        emptyMessage="No CAPAs match the current filters."
      />

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent widthClassName="w-full max-w-3xl">
          {selected && <CapaDetailPanel capa={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail panel                                                        */
/* ------------------------------------------------------------------ */

function CapaDetailPanel({ capa }: { capa: Capa }) {
  const detail = useMemo(() => buildDetail(capa), [capa]);
  const steps = useMemo(() => workflowSteps(capa), [capa]);
  const timeline = useMemo(() => buildTimeline(capa), [capa]);
  const over = isOverdue(capa);

  return (
    <>
      <SheetHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-brand-600">{capa.id}</span>
          <StatusBadge status={capa.status} />
          <Badge tone={severityTone(capa.severity)}>{capa.severity}</Badge>
          {over && (
            <Badge tone="danger">
              <AlertTriangle className="size-3" /> {relativeDeadline(capa.dueDate)}
            </Badge>
          )}
        </div>
        <SheetTitle>{capa.title}</SheetTitle>
        <p className="text-sm text-fg-muted">
          {capa.source} · {capa.department}
        </p>
      </SheetHeader>

      <SheetBody className="space-y-6">
        {/* Metadata */}
        <MetaGrid cols={4}>
          <LabeledValue label="Owner" value={<span className="inline-flex items-center gap-1.5"><Avatar name={capa.owner} size="xs" /> {capa.owner}</span>} />
          <LabeledValue label="Opened" value={formatDate(capa.opened)} />
          <LabeledValue label="Due" value={<span className={over ? "text-red-600" : undefined}>{formatDate(capa.dueDate)}</span>} />
          <LabeledValue label="Root cause" value={capa.rootCause} />
        </MetaGrid>

        {/* Progress */}
        <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-fg">CAPA completion</span>
            <span className="font-semibold tabular-nums text-fg">{capa.progress}%</span>
          </div>
          <Progress value={capa.progress} />
        </div>

        {/* Workflow stepper */}
        <section>
          <SubHeading icon={<ClipboardCheck className="size-4 text-brand-600" />} title="CAPA workflow" />
          <div className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
            <ApprovalStepper steps={steps} />
          </div>
        </section>

        {/* Issue + correction + containment */}
        <section className="space-y-3">
          <SubHeading icon={<FileText className="size-4 text-brand-600" />} title="Issue & containment" />
          <InfoBlock label="Issue description" body={detail.description} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoBlock label="Immediate correction" body={detail.correction} tone="warning" />
            <InfoBlock label="Containment" body={detail.containment} tone="warning" />
          </div>
        </section>

        {/* Root cause analysis */}
        <section className="space-y-3">
          <SubHeading icon={<SearchIcon className="size-4 text-brand-600" />} title="Root-cause analysis" />
          <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">5-Whys</p>
            <ol className="space-y-2">
              {detail.fiveWhys.map((w, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm text-fg-secondary">{w}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              Fishbone (Ishikawa) categories
            </p>
            <div className="flex flex-wrap gap-2">
              {FISHBONE.map((cat) => {
                const primary = cat === detail.primaryCategory;
                return (
                  <span
                    key={cat}
                    className={
                      primary
                        ? "inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700"
                        : "inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-base)] bg-subtle px-3 py-1.5 text-sm text-fg-secondary"
                    }
                  >
                    {primary && <Sparkles className="size-3.5" />}
                    {cat}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-fg-muted">
              Primary contributing category: <strong className="text-fg-secondary">{detail.primaryCategory}</strong>
            </p>
          </div>
        </section>

        {/* Corrective + preventive actions */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ActionList
            icon={<Wrench className="size-4 text-brand-600" />}
            title="Corrective actions"
            items={detail.corrective}
          />
          <ActionList
            icon={<ShieldCheck className="size-4 text-violet-600" />}
            title="Preventive actions"
            items={detail.preventive}
          />
        </section>

        {/* Evidence */}
        <section>
          <SubHeading icon={<Link2 className="size-4 text-brand-600" />} title="Evidence & linked records" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {detail.evidence.map((e) => (
              <a
                key={e.ref}
                className="flex items-center justify-between rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] px-3 py-2.5 transition-colors hover:border-[var(--border-strong)] hover:bg-subtle"
              >
                <span className="flex items-center gap-2 text-sm text-fg-secondary">
                  <FileText className="size-4 text-fg-muted" /> {e.label}
                </span>
                <span className="font-mono text-xs font-semibold text-brand-600">{e.ref}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Effectiveness */}
        <section>
          <SubHeading icon={<FlaskConical className="size-4 text-brand-600" />} title="Effectiveness verification" />
          <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Acceptance criteria</p>
              {capa.effectiveness === "—" ? (
                <span className="text-xs text-fg-muted">Not yet evaluated</span>
              ) : (
                <Badge tone={effectivenessTone(capa.effectiveness)}>{capa.effectiveness}</Badge>
              )}
            </div>
            <p className="text-sm text-fg-secondary">{detail.criteria}</p>
            {capa.effectiveness === "Passed" && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
                <CheckCircle2 className="size-3.5" /> Criteria met — no recurrence observed post-implementation.
              </div>
            )}
          </div>
        </section>

        {/* Approvals */}
        <section>
          <SubHeading icon={<Fingerprint className="size-4 text-brand-600" />} title="Approvals" />
          <div className="divide-y divide-[var(--border-base)] overflow-hidden rounded-xl border border-[var(--border-base)]">
            {detail.approvals.map((a) => (
              <div key={a.role} className="flex items-center justify-between bg-[var(--bg-surface)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={a.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-fg">{a.name}</p>
                    <p className="text-xs text-fg-muted">{a.role}</p>
                  </div>
                </div>
                <Badge tone={a.state === "Approved" ? "success" : a.state === "Pending" ? "warning" : "neutral"} dot>
                  {a.state}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* History timeline */}
        <section>
          <SubHeading icon={<Timer className="size-4 text-brand-600" />} title="Case history" />
          <div className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
            <Timeline items={timeline} />
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex gap-2 pt-1">
          <Button className="flex-1">
            Open full CAPA file <ArrowRight className="size-4" />
          </Button>
          <Button variant="secondary">Add note</Button>
        </div>
      </SheetBody>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function SubHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
      {icon}
      {title}
    </h4>
  );
}

function InfoBlock({
  label,
  body,
  tone = "neutral",
}: {
  label: string;
  body: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <div
      className={
        tone === "warning"
          ? "rounded-xl border border-amber-200 bg-amber-50/50 p-4"
          : "rounded-xl border border-[var(--border-base)] bg-muted-surface p-4"
      }
    >
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{label}</p>
      <p className="text-sm text-fg-secondary">{body}</p>
    </div>
  );
}

function ActionList({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
      <SubHeading icon={icon} title={title} />
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-fg-secondary">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChartLegend({
  items,
}: {
  items: { name: string; value: number; color: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => (
        <div key={it.name} className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-fg-secondary">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: it.color }} />
            {it.name}
          </span>
          <span className="font-semibold tabular-nums text-fg">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
