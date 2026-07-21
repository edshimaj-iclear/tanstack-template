import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download,
  CalendarPlus,
  CalendarDays,
  MapPin,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  CheckCircle2,
  ClipboardList,
  Gavel,
  FileText,
  Clock,
  Printer,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { ApprovalStepper } from "../../components/qms/ApprovalStepper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Avatar } from "../../components/ui/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { MGMT_REVIEW } from "../../data/reports";
import { formatDate, relativeDeadline, daysUntil } from "../../lib/utils";
import { cn } from "../../lib/utils";

export const Route = createFileRoute("/_app/management-review")({
  component: ManagementReviewPage,
});

const objectiveTone = (status: string) => {
  switch (status) {
    case "Achieved":
      return "success";
    case "On Track":
      return "brand";
    case "Monitor":
      return "warning";
    case "At Risk":
      return "danger";
    default:
      return "neutral";
  }
};

function ManagementReviewPage() {
  const {
    meeting,
    attendees,
    approvalSteps,
    agenda,
    qualityObjectives,
    kpis,
    sections,
    decisions,
    actionItems,
  } = MGMT_REVIEW;

  const [activeSection, setActiveSection] = useState(sections[0].id);
  const present = attendees.filter((a) => a.present).length;
  const objectivesMet = qualityObjectives.filter(
    (o) => o.status === "Achieved" || o.status === "On Track",
  ).length;
  const openActions = actionItems.filter((a) => a.status !== "Closed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ISO 13485 §5.6 · Management Review"
        title="Management Review"
        subtitle="Q3 2026 Review — suitability, adequacy and effectiveness of the quality management system."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export report
            </Button>
            <Button>
              <CalendarPlus className="size-4" /> Schedule
            </Button>
          </>
        }
      />

      {/* Meeting header card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 grid-dots opacity-[0.12]" />
        <CardContent className="relative flex flex-col gap-6 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{meeting.reference}</Badge>
              <StatusBadge status={meeting.status} />
              <span className="text-sm font-semibold text-fg">{meeting.title}</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-secondary">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-brand-600" />
                {formatDate(meeting.date, { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-brand-600" />
                {meeting.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-brand-600" />
                {meeting.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="size-4 text-brand-600" />
                Chair: {meeting.chair}
              </span>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                  Attendees
                </p>
                <Badge tone="neutral">
                  {present} of {attendees.length} present
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex -space-x-2">
                  {attendees.map((a) => (
                    <Avatar
                      key={a.name}
                      name={a.name}
                      size="sm"
                      className={cn(
                        "ring-2 ring-[var(--bg-surface)]",
                        !a.present && "opacity-40 grayscale",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md rounded-xl border border-[var(--border-base)] bg-muted-surface p-5">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              Approval workflow
            </p>
            <ApprovalStepper steps={approvalSteps} />
            <p className="mt-4 text-xs text-fg-muted">
              Minutes recorded by {meeting.minutesBy}. Pending CEO sign-off to become effective.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="QMS health index" value={87} suffix="%" icon={CheckCircle2} tone="brand" delta={3} deltaLabel="vs last review" />
        <MetricCard label="Quality objectives met" value={`${objectivesMet}/${qualityObjectives.length}`} icon={Target} tone="success" hint="on track or achieved" />
        <MetricCard label="Open action items" value={openActions} icon={ClipboardList} tone="warning" hint="from this review" />
        <MetricCard label="Reportable incidents" value={0} icon={UserCheck} tone="success" hint="benefit-risk favourable" />
      </div>

      {/* Quality objectives */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Quality objectives</CardTitle>
            <p className="text-sm text-fg-muted">Annual objectives vs. current performance</p>
          </div>
          <Badge tone="neutral">FY 2026</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          {qualityObjectives.map((o) => (
            <div key={o.id}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-fg-muted">{o.id}</span>
                  <span className="text-sm font-medium text-fg">{o.objective}</span>
                </div>
                <Badge tone={objectiveTone(o.status) as any}>{o.status}</Badge>
              </div>
              <Progress value={o.progress} tone={objectiveTone(o.status) === "neutral" ? undefined : (objectiveTone(o.status) as any)} size="sm" />
              <div className="mt-1.5 flex items-center justify-between text-xs text-fg-muted">
                <span>
                  Actual <span className="font-semibold text-fg-secondary">{o.actual}</span> · Target {o.target}
                </span>
                <span>{o.owner}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* KPI performance */}
      <Card>
        <CardHeader>
          <CardTitle>KPI performance</CardTitle>
          <p className="text-sm text-fg-muted">Key indicators reviewed under §5.6.2 g</p>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-y border-[var(--border-base)] text-left text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-2.5">Metric</th>
                <th className="px-5 py-2.5 text-right">Previous</th>
                <th className="px-5 py-2.5 text-right">Current</th>
                <th className="px-5 py-2.5 text-right">Target</th>
                <th className="px-5 py-2.5 text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((k) => {
                const TrendIcon = k.trend === "up" ? ArrowUpRight : k.trend === "down" ? ArrowDownRight : Minus;
                return (
                  <tr key={k.metric} className="border-b border-[var(--border-base)] last:border-0 hover:bg-subtle/60">
                    <td className="px-5 py-3 font-medium text-fg">{k.metric}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-fg-muted">{k.previous}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-fg">{k.current}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-fg-secondary">{k.target}</td>
                    <td className="px-5 py-3">
                      <span className={cn("flex items-center justify-end gap-1 font-semibold", k.good ? "text-emerald-600" : "text-red-500")}>
                        <TrendIcon className="size-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Review inputs — tabbed sections */}
      <Card>
        <CardHeader>
          <CardTitle>Review inputs</CardTitle>
          <p className="text-sm text-fg-muted">Management review inputs per ISO 13485 §5.6.2</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="flex-wrap">
              {sections.map((s) => (
                <TabsTrigger key={s.id} value={s.id}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {sections.map((s) => (
              <TabsContent key={s.id} value={s.id}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  <p className="text-sm leading-relaxed text-fg-secondary lg:col-span-2">
                    {s.summary}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {s.highlights.map((h) => (
                      <div key={h.label} className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-3">
                        <p className="text-[11px] font-medium text-fg-muted">{h.label}</p>
                        <p className={cn(
                          "mt-0.5 text-lg font-bold tabular-nums",
                          h.tone === "success" && "text-emerald-600",
                          h.tone === "warning" && "text-amber-600",
                          h.tone === "danger" && "text-red-600",
                          !h.tone && "text-fg",
                        )}>
                          {h.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Agenda + Decisions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agenda</CardTitle>
            <p className="text-sm text-fg-muted">8 items · {agenda.reduce((s, a) => s + a.minutes, 0)} min</p>
          </CardHeader>
          <CardContent className="space-y-1">
            {agenda.map((a) => (
              <div key={a.no} className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-subtle">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                  {a.no}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-fg">{a.topic}</p>
                  <p className="text-xs text-fg-muted">
                    {a.clause} · {a.presenter}
                  </p>
                </div>
                <Badge tone="neutral">{a.minutes}m</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="size-4 text-brand-600" /> Decisions & conclusions
            </CardTitle>
            <p className="text-sm text-fg-muted">Recorded outputs per §5.6.3</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {decisions.map((d) => (
              <div key={d.id} className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-3.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-fg">{d.decision}</p>
                    <p className="mt-1 text-xs text-fg-muted">{d.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action items table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Action items</CardTitle>
            <p className="text-sm text-fg-muted">Assigned outputs with owners and deadlines</p>
          </div>
          <Badge tone="warning">{openActions} open</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-y border-[var(--border-base)] text-left text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-2.5">ID</th>
                <th className="px-5 py-2.5">Action</th>
                <th className="px-5 py-2.5">Owner</th>
                <th className="px-5 py-2.5">Priority</th>
                <th className="px-5 py-2.5">Due</th>
                <th className="px-5 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map((a) => {
                const overdue = daysUntil(a.due) < 0 && a.status !== "Closed";
                return (
                  <tr key={a.id} className="border-b border-[var(--border-base)] last:border-0 hover:bg-subtle/60">
                    <td className="px-5 py-3 font-mono text-[13px] font-semibold text-fg">{a.id}</td>
                    <td className="max-w-[300px] px-5 py-3">
                      <p className="truncate font-medium text-fg">{a.item}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={a.owner} size="xs" />
                        <span className="whitespace-nowrap text-fg-secondary">{a.owner}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={a.priority === "High" ? "danger" : a.priority === "Medium" ? "warning" : "neutral"}>
                        {a.priority}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="whitespace-nowrap text-fg-secondary">{formatDate(a.due)}</span>
                        <span className={cn("text-xs", overdue ? "font-medium text-red-500" : "text-fg-muted")}>
                          {relativeDeadline(a.due)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Downloadable report preview */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-brand-600" /> Report preview
            </CardTitle>
            <p className="text-sm text-fg-muted">Signed minutes will be archived as a controlled record</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Printer className="size-4" /> Print
            </Button>
            <Button size="sm">
              <Download className="size-4" /> Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-3xl rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-8 shadow-elevated">
            <div className="flex items-start justify-between border-b border-[var(--border-base)] pb-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                  iClear · Quality Management System
                </div>
                <h2 className="mt-1 text-xl font-bold text-fg">Management Review Minutes</h2>
                <p className="mt-0.5 text-sm text-fg-muted">
                  {meeting.reference} · {formatDate(meeting.date)} · ISO 13485 §5.6
                </p>
              </div>
              <StatusBadge status={meeting.status} />
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 py-5 text-sm sm:grid-cols-3">
              {[
                { k: "Chair", v: meeting.chair },
                { k: "Minutes by", v: meeting.minutesBy },
                { k: "Attendance", v: `${present}/${attendees.length}` },
                { k: "Location", v: meeting.location },
                { k: "Duration", v: meeting.time },
                { k: "Objectives met", v: `${objectivesMet}/${qualityObjectives.length}` },
              ].map((row) => (
                <div key={row.k}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{row.k}</p>
                  <p className="mt-0.5 font-medium text-fg">{row.v}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-[var(--border-base)] pt-5">
              <div>
                <h3 className="text-sm font-semibold text-fg">1. Overall conclusion</h3>
                <p className="mt-1 text-sm leading-relaxed text-fg-secondary">
                  The management team concludes that the quality management system remains suitable,
                  adequate and effective. The QMS health index stands at 87% with no reportable
                  incidents this period; the overall benefit-risk profile of the device portfolio is
                  favourable.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-fg">2. Key decisions</h3>
                <ul className="mt-1 space-y-1.5">
                  {decisions.slice(0, 3).map((d) => (
                    <li key={d.id} className="flex gap-2 text-sm text-fg-secondary">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                      {d.decision}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-subtle px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Approval signature</p>
                  <p className="mt-0.5 text-sm font-medium text-fg">{meeting.chair} · CEO</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl italic text-fg-muted/70">Pending</div>
                  <p className="text-[11px] text-fg-muted">Awaiting sign-off</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
