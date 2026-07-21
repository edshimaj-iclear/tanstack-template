import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  GraduationCap,
  Plus,
  AlertTriangle,
  ClipboardCheck,
  CalendarClock,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Download,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { PageHeader, SectionHeading } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { ApprovalStepper, type Step } from "../../components/qms/ApprovalStepper";
import { ProgressRing } from "../../components/qms/ProgressRing";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress, toneForScore } from "../../components/ui/progress";
import { Avatar } from "../../components/ui/misc";
import { Tooltip } from "../../components/ui/tooltip";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { HorizontalBars } from "../../components/charts";
import type { Employee } from "../../types";
import {
  EMPLOYEES,
  TRAINING_SUMMARY,
  DEPARTMENT_COMPLIANCE,
  COMPETENCY_MATRIX,
  COMPETENCY_MATRIX_COLUMNS,
  TRAINING_ASSIGNMENTS,
  FEATURED_ASSIGNMENT_ID,
  trainingDetailFor,
  type MatrixLevel,
  type AssignmentState,
  type TrainingItem,
  type TrainingItemStatus,
} from "../../data/training";
import { formatDate, daysUntil } from "../../lib/utils";

export const Route = createFileRoute("/_app/training")({
  component: TrainingPage,
});

/* ---------- workflow helpers ---------- */

const WORKFLOW: AssignmentState[] = [
  "Assigned",
  "Opened",
  "Completed",
  "Assessment",
  "Supervisor Approval",
  "Qualified",
];

function stepsFor(state: AssignmentState): Step[] {
  const current = WORKFLOW.indexOf(state);
  return WORKFLOW.map((label, i) => ({
    label,
    state: i < current ? "done" : i === current ? "current" : "upcoming",
  }));
}

/* ---------- matrix level styling ---------- */

const LEVEL_META: Record<
  MatrixLevel,
  { label: string; chip: string; dot?: string }
> = {
  qualified: {
    label: "Qualified",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  training: {
    label: "In training",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  gap: {
    label: "Gap",
    chip: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  none: {
    label: "Not required",
    chip: "border-[var(--border-base)] bg-subtle text-fg-muted",
  },
};

const qualTone: Record<Employee["qualification"], "success" | "info" | "danger"> = {
  Qualified: "success",
  "In Progress": "info",
  Gap: "danger",
};

/* ---------- training item status → icon/tone ---------- */

const itemStatusMeta: Record<
  TrainingItemStatus,
  { icon: typeof CheckCircle2; className: string }
> = {
  Completed: { icon: CheckCircle2, className: "text-emerald-500" },
  "In Progress": { icon: Clock, className: "text-blue-500" },
  Assigned: { icon: Clock, className: "text-fg-muted" },
  Overdue: { icon: AlertTriangle, className: "text-red-500" },
  Expired: { icon: XCircle, className: "text-red-500" },
  Expiring: { icon: CalendarClock, className: "text-amber-500" },
};

function TrainingPage() {
  const [selected, setSelected] = useState<Employee | null>(null);

  const featured =
    TRAINING_ASSIGNMENTS.find((a) => a.id === FEATURED_ASSIGNMENT_ID) ??
    TRAINING_ASSIGNMENTS[0];
  const otherAssignments = TRAINING_ASSIGNMENTS.filter((a) => a.id !== featured.id);

  const qualMix = useMemo(() => {
    const total = EMPLOYEES.length;
    const count = (q: Employee["qualification"]) =>
      EMPLOYEES.filter((e) => e.qualification === q).length;
    return [
      { label: "Qualified", value: count("Qualified"), tone: "success" as const },
      { label: "In Progress", value: count("In Progress"), tone: "info" as const },
      { label: "Gap", value: count("Gap"), tone: "danger" as const },
    ].map((r) => ({ ...r, pct: Math.round((r.value / total) * 100) }));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People · Competency"
        title="Training & Competency"
        subtitle="Personnel qualification, training assignments and skills matrix per ISO 13485 §6.2."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Training matrix
            </Button>
            <Button>
              <Plus className="size-4" /> Assign training
            </Button>
          </>
        }
      />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Training compliance"
          value={TRAINING_SUMMARY.compliance}
          suffix="%"
          icon={ShieldCheck}
          tone="success"
          delta={4}
          deltaLabel="vs last quarter"
        />
        <MetricCard
          label="Overdue training"
          value={TRAINING_SUMMARY.overdue}
          icon={AlertTriangle}
          tone="danger"
          hint="assignments past due"
        />
        <MetricCard
          label="Awaiting assessment"
          value={TRAINING_SUMMARY.awaitingAssessment}
          icon={ClipboardCheck}
          tone="warning"
          hint="pending sign-off"
        />
        <MetricCard
          label="Upcoming expirations"
          value={TRAINING_SUMMARY.upcomingExpirations}
          icon={CalendarClock}
          tone="info"
          hint="certificates due in 60 days"
        />
      </div>

      {/* Department compliance + qualification mix */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Training compliance by department</CardTitle>
              <p className="text-sm text-fg-muted">
                Share of required training completed &amp; current
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <HorizontalBars data={DEPARTMENT_COMPLIANCE} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workforce qualification</CardTitle>
            <p className="text-sm text-fg-muted">{EMPLOYEES.length} personnel in scope</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            {qualMix.map((r) => (
              <div key={r.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-fg-secondary">{r.label}</span>
                  <span className="text-fg-muted">
                    {r.value} · {r.pct}%
                  </span>
                </div>
                <Progress value={r.pct} tone={r.tone} size="sm" />
              </div>
            ))}
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                2 operators show competency gaps in Cutting &amp; Thermoforming — retraining
                assigned, supervisor re-assessment pending.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training workflow */}
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle>Training assignment workflow</CardTitle>
            <p className="text-sm text-fg-muted">
              Assign → complete → assess → supervisor approval → qualified
            </p>
          </div>
          <Badge tone="brand">
            <BookOpen className="size-3.5" /> {TRAINING_ASSIGNMENTS.length} in progress
          </Badge>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-fg">{featured.course}</p>
                  <p className="text-xs text-fg-muted">
                    <span className="font-mono">{featured.id}</span> ·{" "}
                    {featured.courseCode} · {featured.employee}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                <CalendarClock className="size-3.5" />
                Due {formatDate(featured.dueDate)} · assessor {featured.assessor}
              </div>
            </div>
            <ApprovalStepper steps={stepsFor(featured.state)} />
          </div>

          <div>
            <SectionHeading title="Other active assignments" className="mb-2" />
            <div className="divide-y divide-[var(--border-base)] overflow-hidden rounded-xl border border-[var(--border-base)]">
              {otherAssignments.map((a) => {
                const days = daysUntil(a.dueDate);
                const overdue = days < 0;
                return (
                  <div
                    key={a.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-subtle"
                  >
                    <div className="min-w-[180px] flex-1">
                      <p className="truncate text-sm font-medium text-fg">{a.course}</p>
                      <p className="text-xs text-fg-muted">
                        <span className="font-mono">{a.courseCode}</span> · {a.employee}
                      </p>
                    </div>
                    <div className="hidden w-40 sm:block">
                      <Progress value={a.progress} size="sm" />
                    </div>
                    <StatusBadge status={a.state} dot={false} />
                    <Badge tone={overdue ? "danger" : days <= 7 ? "warning" : "neutral"}>
                      {overdue ? `${Math.abs(days)}d overdue` : `Due in ${days}d`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee cards */}
      <div>
        <SectionHeading
          title="Personnel"
          description="Competency, training status and qualification per employee — click for the training record"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {EMPLOYEES.map((emp) => (
            <EmployeeCard key={emp.id} emp={emp} onOpen={() => setSelected(emp)} />
          ))}
        </div>
      </div>

      {/* Competency matrix */}
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Competency / skills matrix</CardTitle>
            <p className="text-sm text-fg-muted">
              Personnel × process, SOP &amp; equipment qualifications
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(Object.keys(LEVEL_META) as MatrixLevel[]).map((lvl) => (
              <span key={lvl} className="flex items-center gap-1.5 text-xs text-fg-muted">
                <span
                  className={`size-2.5 rounded-full ${
                    LEVEL_META[lvl].dot ?? "border border-[var(--border-strong)] bg-subtle"
                  }`}
                />
                {LEVEL_META[lvl].label}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-[var(--bg-surface)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                    Employee
                  </th>
                  {COMPETENCY_MATRIX_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className="border-b border-[var(--border-base)] px-3 py-2.5 text-center"
                    >
                      <Tooltip content={col.hint} side="top">
                        <span className="cursor-default whitespace-nowrap font-mono text-[11px] font-semibold text-fg-secondary">
                          {col.label}
                        </span>
                      </Tooltip>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPETENCY_MATRIX.map((row) => (
                  <tr key={row.employeeId} className="group">
                    <td className="sticky left-0 z-10 whitespace-nowrap border-b border-[var(--border-base)] bg-[var(--bg-surface)] px-3 py-2 font-medium text-fg group-hover:bg-subtle">
                      {row.name}
                    </td>
                    {COMPETENCY_MATRIX_COLUMNS.map((col) => {
                      const lvl = row.cells[col.key] ?? "none";
                      const meta = LEVEL_META[lvl];
                      return (
                        <td
                          key={col.key}
                          className="border-b border-[var(--border-base)] px-3 py-2 text-center group-hover:bg-subtle/60"
                        >
                          {lvl === "none" ? (
                            <span className="text-fg-muted/50">—</span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.chip}`}
                            >
                              <span className={`size-1.5 rounded-full ${meta.dot}`} />
                              {meta.label}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent widthClassName="w-full max-w-2xl">
          {selected && <EmployeeDetail emp={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ---------- Employee card ---------- */

function EmployeeCard({ emp, onOpen }: { emp: Employee; onOpen: () => void }) {
  return (
    <Card
      onClick={onOpen}
      className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={emp.name} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-fg">{emp.name}</p>
            <p className="truncate text-sm text-fg-muted">{emp.role}</p>
          </div>
        </div>
        <Badge tone={qualTone[emp.qualification]} dot>
          {emp.qualification}
        </Badge>
      </div>

      <div className="mt-3">
        <Badge tone="outline">{emp.department}</Badge>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-fg-secondary">Competency</span>
          <span className="font-semibold tabular-nums text-fg">{emp.competency}%</span>
        </div>
        <Progress value={emp.competency} tone={toneForScore(emp.competency)} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--border-base)] pt-3 text-center">
        <TrainingStat label="Required" value={emp.requiredTraining} className="text-fg" />
        <TrainingStat label="Completed" value={emp.completedTraining} className="text-emerald-600" />
        <TrainingStat
          label="Expired"
          value={emp.expiredTraining}
          className={emp.expiredTraining > 0 ? "text-red-500" : "text-fg-muted"}
        />
      </div>
    </Card>
  );
}

function TrainingStat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div>
      <p className={`text-lg font-bold tabular-nums ${className ?? "text-fg"}`}>{value}</p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-fg-muted">{label}</p>
    </div>
  );
}

/* ---------- Employee detail drawer ---------- */

function EmployeeDetail({ emp }: { emp: Employee }) {
  const detail = trainingDetailFor(emp);
  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-4">
          <Avatar name={emp.name} size="lg" />
          <div className="min-w-0">
            <SheetTitle>{emp.name}</SheetTitle>
            <p className="text-sm text-fg-muted">
              {emp.role} · {emp.department}
            </p>
          </div>
          <Badge tone={qualTone[emp.qualification]} dot className="ml-auto">
            {emp.qualification}
          </Badge>
        </div>
      </SheetHeader>
      <SheetBody className="space-y-6">
        {/* Competency + assessment summary */}
        <div className="flex items-center gap-5 rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
          <ProgressRing value={emp.competency} size={104} strokeWidth={10} label="Competency" />
          <div className="min-w-0 flex-1">
            <MetaGrid cols={2}>
              <LabeledValue label="Required" value={`${emp.requiredTraining} courses`} />
              <LabeledValue label="Completed" value={`${emp.completedTraining} courses`} />
              <LabeledValue
                label="Expired"
                value={
                  <span className={emp.expiredTraining > 0 ? "text-red-600" : undefined}>
                    {emp.expiredTraining} courses
                  </span>
                }
              />
              <LabeledValue
                label="Assessment"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <Badge
                      tone={
                        detail.assessment.status === "Passed"
                          ? "success"
                          : detail.assessment.status === "Scheduled"
                            ? "info"
                            : detail.assessment.status === "Awaiting"
                              ? "warning"
                              : "neutral"
                      }
                    >
                      {detail.assessment.status}
                    </Badge>
                    {typeof detail.assessment.score === "number" && (
                      <span className="text-xs text-fg-muted">{detail.assessment.score}%</span>
                    )}
                  </span>
                }
              />
            </MetaGrid>
            {detail.assessment.assessor && (
              <p className="mt-3 text-xs text-fg-muted">
                Assessor: {detail.assessment.assessor}
                {detail.assessment.date && ` · ${formatDate(detail.assessment.date)}`}
              </p>
            )}
          </div>
        </div>

        <TrainingList title="Assigned / in progress" items={detail.assigned} icon={Clock} />
        <TrainingList title="Completed" items={detail.completed} icon={CheckCircle2} />
        {detail.expired.length > 0 && (
          <TrainingList title="Expired / superseded" items={detail.expired} icon={XCircle} />
        )}

        {/* Certificates */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
            <Award className="size-4 text-brand-600" /> Certificates
          </h4>
          <div className="space-y-2">
            {detail.certificates.map((c) => {
              const days = daysUntil(c.expires);
              return (
                <div
                  key={c.code}
                  className="flex items-center gap-3 rounded-lg border border-[var(--border-base)] px-3 py-2.5"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Award className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{c.title}</p>
                    <p className="font-mono text-xs text-fg-muted">{c.code}</p>
                  </div>
                  <Badge tone={days < 0 ? "danger" : days <= 60 ? "warning" : "neutral"}>
                    {days < 0 ? "Expired" : `Expires ${formatDate(c.expires)}`}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">
            Open training record <ArrowRight className="size-4" />
          </Button>
          <Button variant="secondary">Assign course</Button>
        </div>
      </SheetBody>
    </>
  );
}

function TrainingList({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: TrainingItem[];
  icon: typeof CheckCircle2;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
        <Icon className="size-4 text-fg-muted" /> {title}
        <span className="text-xs font-normal text-fg-muted">({items.length})</span>
      </h4>
      <div className="space-y-1.5">
        {items.map((it) => {
          const meta = itemStatusMeta[it.status];
          const StatusIcon = meta.icon;
          return (
            <div
              key={it.code + it.title}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-subtle"
            >
              <StatusIcon className={`size-4 shrink-0 ${meta.className}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{it.title}</p>
                <p className="text-xs text-fg-muted">
                  <span className="font-mono">{it.code}</span> · {it.type}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={it.status} dot={false} />
                <p className="mt-0.5 text-[11px] text-fg-muted">{formatDate(it.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
