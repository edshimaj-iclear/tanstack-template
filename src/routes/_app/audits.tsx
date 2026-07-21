import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Download,
  ClipboardCheck,
  FolderOpen,
  AlertTriangle,
  Gauge,
  CalendarClock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Link2,
  ArrowRight,
  FileText,
  Users,
  ListChecks,
  Paperclip,
  ShieldCheck,
  Repeat,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { FilterBar, FilterChips } from "../../components/qms/FilterBar";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Timeline } from "../../components/qms/Timeline";
import { DataTable } from "../../components/tables/DataTable";
import { BarChartCard, CHART_COLORS } from "../../components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  AUDITS,
  FINDINGS,
  FINDINGS_BY_SEVERITY,
  CHECKLIST,
  RECURRING_FINDINGS,
  SAMPLE_AUDIT_ID,
  type Finding,
  type FindingSeverity,
} from "../../data/audits";
import type { Audit, AuditType } from "../../types";
import { relativeDeadline, formatDate, daysUntil } from "../../lib/utils";

export const Route = createFileRoute("/_app/audits")({
  component: AuditsPage,
});

/* ---------- shared mappings ---------- */
const TYPE_TONE: Record<AuditType, "brand" | "info" | "neutral" | "regulatory" | "warning" | "success"> = {
  Internal: "brand",
  Supplier: "info",
  Process: "neutral",
  Regulatory: "regulatory",
  "Notified Body": "warning",
  Mock: "success",
};

const SEVERITY_TONE: Record<FindingSeverity, "danger" | "warning" | "info" | "regulatory" | "neutral"> = {
  Critical: "danger",
  Major: "warning",
  Minor: "info",
  Observation: "regulatory",
  "Opportunity for Improvement": "neutral",
};

const TYPE_OPTIONS: { label: string; value: AuditType | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Internal", value: "Internal" },
  { label: "Supplier", value: "Supplier" },
  { label: "Process", value: "Process" },
  { label: "Regulatory", value: "Regulatory" },
  { label: "Notified Body", value: "Notified Body" },
  { label: "Mock", value: "Mock" },
];

function totalFindings(a: Audit) {
  const f = a.findings;
  return f.critical + f.major + f.minor + f.observation;
}

/* ---------- small findings pills ---------- */
function FindingPills({ findings }: { findings: Audit["findings"] }) {
  const pills = [
    { n: findings.critical, cls: "bg-red-50 text-red-700 border-red-200", title: "Critical" },
    { n: findings.major, cls: "bg-amber-50 text-amber-700 border-amber-200", title: "Major" },
    { n: findings.minor, cls: "bg-blue-50 text-blue-700 border-blue-200", title: "Minor" },
  ];
  if (findings.critical + findings.major + findings.minor === 0) {
    return <span className="text-xs text-fg-muted">None</span>;
  }
  return (
    <div className="flex items-center gap-1">
      {pills.map((p) => (
        <span
          key={p.title}
          title={`${p.title}: ${p.n}`}
          className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-md border px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
            p.n === 0 ? "border-[var(--border-base)] bg-subtle text-fg-muted" : p.cls
          }`}
        >
          {p.n}
        </span>
      ))}
    </div>
  );
}

function AuditsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<AuditType | "All">("All");
  const [selected, setSelected] = useState<Audit | null>(null);

  /* ---------- metrics ---------- */
  const metrics = useMemo(() => {
    const ytd = AUDITS.length;
    const openFindings = AUDITS.filter((a) => a.status !== "Closed" && a.status !== "Planned").reduce(
      (sum, a) => sum + totalFindings(a),
      0,
    );
    const overdueFindings = AUDITS.filter((a) => a.status === "Overdue").reduce(
      (sum, a) => sum + totalFindings(a),
      0,
    );
    const started = AUDITS.filter((a) => a.status !== "Planned");
    const avgClosure = Math.round(
      started.reduce((s, a) => s + a.closure, 0) / Math.max(started.length, 1),
    );
    return { ytd, openFindings, overdueFindings, avgClosure };
  }, []);

  /* ---------- calendar grouping (by month) ---------- */
  const byMonth = useMemo(() => {
    const groups = new Map<string, Audit[]>();
    for (const a of [...AUDITS].sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime())) {
      const key = formatDate(a.date, { month: "short", year: "numeric" });
      groups.set(key, [...(groups.get(key) ?? []), a]);
    }
    return Array.from(groups.entries());
  }, []);

  /* ---------- table filter ---------- */
  const filtered = useMemo(() => {
    return AUDITS.filter((a) => {
      const matchType = type === "All" || a.type === type;
      const matchSearch =
        !search ||
        `${a.id} ${a.title} ${a.type} ${a.scope} ${a.leadAuditor}`
          .toLowerCase()
          .includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [search, type]);

  const typeCounts = useMemo(() => {
    const map: Record<string, number> = { All: AUDITS.length };
    for (const a of AUDITS) map[a.type] = (map[a.type] ?? 0) + 1;
    return map;
  }, []);

  const columns: ColumnDef<Audit>[] = [
    {
      accessorKey: "id",
      header: "Audit ID",
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
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge tone={TYPE_TONE[row.original.type]}>{row.original.type}</Badge>
      ),
    },
    {
      accessorKey: "scope",
      header: "Scope",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[200px] text-sm text-fg-secondary">
          {row.original.scope}
        </span>
      ),
    },
    {
      accessorKey: "leadAuditor",
      header: "Lead Auditor",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-fg-secondary">{row.original.leadAuditor}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const days = daysUntil(row.original.date);
        const overdue = row.original.status === "Overdue";
        return (
          <div className="whitespace-nowrap">
            <p className="text-sm text-fg">{formatDate(row.original.date)}</p>
            <p className={`text-xs ${overdue || days < 0 ? "text-red-500" : "text-fg-muted"}`}>
              {relativeDeadline(row.original.date)}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "findings",
      header: "Findings",
      cell: ({ row }) => <FindingPills findings={row.original.findings} />,
    },
    {
      accessorKey: "closure",
      header: "Closure",
      cell: ({ row }) => (
        <div className="w-28">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-semibold tabular-nums text-fg-secondary">{row.original.closure}%</span>
          </div>
          <Progress value={row.original.closure} size="sm" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit Program"
        title="Audits"
        subtitle="Internal, supplier, process and regulatory audits across the iClear quality system."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export program
            </Button>
            <Button>
              <Plus className="size-4" /> Schedule audit
            </Button>
          </>
        }
      />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Audits YTD" value={metrics.ytd} icon={ClipboardCheck} tone="brand" hint="2026 program" />
        <MetricCard label="Open findings" value={metrics.openFindings} icon={FolderOpen} tone="warning" hint="active audits" />
        <MetricCard
          label="Overdue findings"
          value={metrics.overdueFindings}
          icon={AlertTriangle}
          tone="danger"
          hint="past closure date"
        />
        <MetricCard label="Avg closure" value={metrics.avgClosure} suffix="%" icon={Gauge} tone="success" hint="started audits" />
      </div>

      {/* Calendar strip + findings-by-severity chart */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Audit calendar</CardTitle>
              <p className="text-sm text-fg-muted">2026 program timeline — grouped by month</p>
            </div>
            <CalendarClock className="size-5 text-fg-muted" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {byMonth.map(([month, audits]) => (
                <div key={month} className="min-w-[220px] flex-1 shrink-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                      {month}
                    </span>
                    <span className="h-px flex-1 bg-[var(--border-base)]" />
                    <span className="text-xs text-fg-muted tabular-nums">{audits.length}</span>
                  </div>
                  <div className="space-y-2">
                    {audits.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setSelected(a)}
                        className="w-full rounded-lg border border-[var(--border-base)] bg-muted-surface p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-card"
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <Badge tone={TYPE_TONE[a.type]} className="text-[10px]">
                            {a.type}
                          </Badge>
                          <span className="text-[11px] font-semibold text-fg-muted tabular-nums">
                            {formatDate(a.date, { day: "2-digit", month: "short" })}
                          </span>
                        </div>
                        <p className="mb-1.5 line-clamp-2 text-xs font-medium text-fg">{a.title}</p>
                        <StatusBadge status={a.status} className="text-[10px]" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Findings by severity</CardTitle>
            <p className="text-sm text-fg-muted">All 2026 audits</p>
          </CardHeader>
          <CardContent>
            <BarChartCard
              data={FINDINGS_BY_SEVERITY}
              xKey="name"
              height={240}
              bars={[{ key: "value", name: "Findings", color: CHART_COLORS.brand }]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Filter + table */}
      <div className="space-y-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search audits, scope, lead auditor…"
          right={
            <Badge tone="neutral">
              {filtered.length} of {AUDITS.length}
            </Badge>
          }
        >
          <FilterChips
            options={TYPE_OPTIONS.map((o) => ({
              label: o.label,
              value: o.value,
              count: typeCounts[o.value] ?? 0,
            }))}
            value={type}
            onChange={setType}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={setSelected}
          pageSize={10}
          emptyMessage="No audits match the current filters."
        />
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent widthClassName="w-full max-w-3xl">
          {selected && <AuditDetail audit={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ============================================================
   Detail drawer
   ============================================================ */
function AuditDetail({ audit }: { audit: Audit }) {
  const isSample = audit.id === SAMPLE_AUDIT_ID;
  const findings: Finding[] = isSample ? FINDINGS : [];
  const openFindings = findings.filter((f) => f.status === "Open").length;

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-brand-600">{audit.id}</span>
          <Badge tone={TYPE_TONE[audit.type]}>{audit.type}</Badge>
          <StatusBadge status={audit.status} />
        </div>
        <SheetTitle>{audit.title}</SheetTitle>
        <p className="text-sm text-fg-muted">
          Lead auditor {audit.leadAuditor} · {formatDate(audit.date)}
        </p>
      </SheetHeader>
      <SheetBody className="space-y-5">
        {/* summary strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Findings</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-fg">{totalFindings(audit)}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Critical / Major</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-fg">
              {audit.findings.critical}<span className="text-fg-muted"> / </span>{audit.findings.major}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Closure</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-fg">{audit.closure}%</p>
          </div>
        </div>

        {/* recurring findings callout */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
            <Repeat className="size-4" /> Recurring / systemic findings
          </div>
          <div className="space-y-2">
            {RECURRING_FINDINGS.map((r) => (
              <div key={r.clause} className="flex items-start gap-2 text-sm">
                <span className="font-mono text-[11px] font-semibold text-amber-800">{r.clause}</span>
                <span className="flex-1 text-fg-secondary">{r.theme}</span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-amber-800">
                  ×{r.occurrences}
                  {r.trend === "up" ? (
                    <TrendingUp className="size-3.5 text-red-500" />
                  ) : r.trend === "down" ? (
                    <TrendingDown className="size-3.5 text-emerald-500" />
                  ) : (
                    <MinusCircle className="size-3.5 text-fg-muted" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="scope">
          <TabsList className="flex-wrap">
            <TabsTrigger value="scope">
              <FileText /> Scope
            </TabsTrigger>
            <TabsTrigger value="auditors">
              <Users /> Auditors
            </TabsTrigger>
            <TabsTrigger value="checklist">
              <ListChecks /> Checklist
            </TabsTrigger>
            <TabsTrigger value="findings">
              <AlertTriangle /> Findings
            </TabsTrigger>
            <TabsTrigger value="evidence">
              <Paperclip /> Evidence
            </TabsTrigger>
            <TabsTrigger value="capa">
              <Link2 /> CAPA
            </TabsTrigger>
            <TabsTrigger value="closure">
              <ShieldCheck /> Closure
            </TabsTrigger>
          </TabsList>

          {/* Scope & Criteria */}
          <TabsContent value="scope" className="space-y-4">
            <MetaGrid cols={2}>
              <LabeledValue label="Audit type" value={audit.type} />
              <LabeledValue label="Status" value={<StatusBadge status={audit.status} />} />
              <LabeledValue label="Scheduled" value={formatDate(audit.date)} />
              <LabeledValue label="Timing" value={relativeDeadline(audit.date)} />
            </MetaGrid>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Scope</p>
              <p className="text-sm text-fg-secondary">{audit.scope}</p>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Audit criteria</p>
              <div className="flex flex-wrap gap-2">
                {["ISO 13485:2016", "MDR 2017/745", "iClear QMS manual", "MDSAP GRP"].map((c) => (
                  <Badge key={c} tone="outline">{c}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Auditors & Departments */}
          <TabsContent value="auditors" className="space-y-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Audit team</p>
              <div className="space-y-2">
                {[
                  { name: audit.leadAuditor, role: "Lead auditor" },
                  { name: "Anila Berisha", role: "Quality Manager (host)" },
                  { name: "Erisa Kola", role: "Technical expert — QC" },
                ].map((p) => (
                  <div
                    key={p.role}
                    className="flex items-center justify-between rounded-lg border border-[var(--border-base)] bg-muted-surface px-3 py-2"
                  >
                    <span className="text-sm font-medium text-fg">{p.name}</span>
                    <span className="text-xs text-fg-muted">{p.role}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Departments in scope</p>
              <div className="flex flex-wrap gap-2">
                {["Quality", "Regulatory Affairs", "Thermoforming", "Quality Control", "Design"].map((d) => (
                  <Badge key={d} tone="neutral">{d}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Checklist */}
          <TabsContent value="checklist" className="space-y-2">
            {CHECKLIST.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-lg border border-[var(--border-base)] bg-muted-surface px-3 py-2.5"
              >
                {c.result === "Pass" ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                ) : c.result === "Fail" ? (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
                ) : (
                  <MinusCircle className="mt-0.5 size-4 shrink-0 text-fg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] font-semibold text-fg-muted">{c.clause}</span>
                    <span className="text-sm font-medium text-fg">{c.requirement}</span>
                  </div>
                  {c.note && <p className="mt-0.5 text-xs text-fg-muted">{c.note}</p>}
                </div>
                <Badge tone={c.result === "Pass" ? "success" : c.result === "Fail" ? "danger" : "neutral"}>
                  {c.result}
                </Badge>
              </div>
            ))}
          </TabsContent>

          {/* Findings */}
          <TabsContent value="findings" className="space-y-3">
            {findings.length === 0 ? (
              <p className="rounded-lg border border-[var(--border-base)] bg-muted-surface px-4 py-8 text-center text-sm text-fg-muted">
                No findings recorded for this audit yet.
              </p>
            ) : (
              <>
                <p className="text-sm text-fg-muted">
                  {openFindings} open · {findings.length - openFindings} closed
                </p>
                {findings.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-[var(--border-base)] bg-surface p-3.5 shadow-card"
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge tone={SEVERITY_TONE[f.severity]}>
                        {f.severity === "Opportunity for Improvement" && (
                          <Lightbulb className="size-3" />
                        )}
                        {f.severity === "Opportunity for Improvement" ? "OFI" : f.severity}
                      </Badge>
                      <span className="font-mono text-[11px] font-semibold text-fg-muted">{f.clause}</span>
                      <span className="ml-auto font-mono text-[11px] text-fg-muted">{f.id}</span>
                    </div>
                    <p className="text-sm text-fg-secondary">{f.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
                      <span>{f.department}</span>
                      <StatusBadge status={f.status} className="text-[10px]" />
                      {f.capaId && (
                        <span className="inline-flex items-center gap-1 font-medium text-brand-600">
                          <Link2 className="size-3.5" /> {f.capaId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>

          {/* Evidence */}
          <TabsContent value="evidence" className="space-y-2">
            {[
              { name: "Audit plan — AUD-2026-003.pdf", meta: "Audit plan · 214 KB" },
              { name: "Opening meeting minutes.docx", meta: "Record · 88 KB" },
              { name: "Thermoforming OQ/PQ report.pdf", meta: "Objective evidence · 1.2 MB" },
              { name: "Training matrix export.xlsx", meta: "Objective evidence · 340 KB" },
              { name: "Photo — uncontrolled SOP copy.jpg", meta: "Objective evidence · 620 KB" },
            ].map((e) => (
              <div
                key={e.name}
                className="flex items-center gap-3 rounded-lg border border-[var(--border-base)] bg-muted-surface px-3 py-2.5"
              >
                <Paperclip className="size-4 shrink-0 text-fg-muted" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{e.name}</p>
                  <p className="text-xs text-fg-muted">{e.meta}</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </TabsContent>

          {/* CAPA links */}
          <TabsContent value="capa" className="space-y-2">
            {findings.filter((f) => f.capaId).length === 0 ? (
              <p className="rounded-lg border border-[var(--border-base)] bg-muted-surface px-4 py-8 text-center text-sm text-fg-muted">
                No CAPAs linked to this audit.
              </p>
            ) : (
              findings
                .filter((f) => f.capaId)
                .map((f) => (
                  <div
                    key={f.capaId}
                    className="flex items-center gap-3 rounded-lg border border-[var(--border-base)] bg-muted-surface px-3 py-2.5"
                  >
                    <Link2 className="size-4 shrink-0 text-brand-600" />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-semibold text-brand-600">{f.capaId}</p>
                      <p className="truncate text-xs text-fg-muted">
                        From {f.id} · {f.clause}
                      </p>
                    </div>
                    <Badge tone={SEVERITY_TONE[f.severity]}>{f.severity}</Badge>
                  </div>
                ))
            )}
          </TabsContent>

          {/* Closure timeline */}
          <TabsContent value="closure" className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-fg-secondary">Closure progress</span>
                <span className="font-semibold tabular-nums text-fg">{audit.closure}%</span>
              </div>
              <Progress value={audit.closure} />
            </div>
            <Timeline
              items={[
                {
                  title: "Audit scheduled",
                  time: formatDate(audit.date),
                  description: "Audit plan issued and criteria confirmed with auditee.",
                  actor: audit.leadAuditor,
                  tone: "neutral",
                  icon: <CalendarClock />,
                },
                {
                  title: "Opening meeting & fieldwork",
                  time: "Day 1",
                  description: "Process walkthroughs, record sampling and interviews completed.",
                  tone: "info",
                  icon: <ClipboardCheck />,
                },
                {
                  title: "Findings raised",
                  time: "Day 2",
                  description: `${totalFindings(audit)} findings documented — ${audit.findings.critical} critical, ${audit.findings.major} major.`,
                  tone: "warning",
                  icon: <AlertTriangle />,
                },
                {
                  title: "CAPA assignment",
                  description: "Corrective actions raised and assigned to responsible owners.",
                  tone: "brand",
                  icon: <Link2 />,
                },
                {
                  title: audit.closure === 100 ? "Audit closed" : "Effectiveness & closure",
                  description:
                    audit.closure === 100
                      ? "All actions verified effective; audit report signed off."
                      : "Pending effectiveness checks before final closure.",
                  tone: audit.closure === 100 ? "success" : "neutral",
                  icon: audit.closure === 100 ? <CheckCircle2 /> : <ShieldCheck />,
                },
              ]}
            />
            <div className="flex gap-2">
              <Button className="flex-1">
                Open audit report <ArrowRight className="size-4" />
              </Button>
              <Button variant="secondary">Add finding</Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetBody>
    </>
  );
}
