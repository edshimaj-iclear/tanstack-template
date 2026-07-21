import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  MessageSquareWarning,
  ShieldAlert,
  Siren,
  Clock,
  Link2,
  Download,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Package,
  Factory,
  FileWarning,
  Stethoscope,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { FilterBar, FilterChips } from "../../components/qms/FilterBar";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Timeline } from "../../components/qms/Timeline";
import { DataTable } from "../../components/tables/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { TrendChart, DonutChart, CHART_COLORS, PIE_PALETTE } from "../../components/charts";
import {
  COMPLAINTS,
  COMPLAINT_SUMMARY,
  COMPLAINT_TYPE_TREND,
  COMPLAINT_BY_TYPE,
  type ComplaintRecord,
  type VigilanceDecision,
} from "../../data/complaints";
import { formatDate } from "../../lib/utils";

export const Route = createFileRoute("/_app/complaints")({
  component: ComplaintsPage,
});

type StatusFilter = "all" | "Open" | "Investigation" | "Closed";
type SeriousFilter = "all" | "Serious" | "Non-serious";

function harmTone(harm: ComplaintRecord["patientHarm"]) {
  return harm === "Serious" ? "danger" : harm === "Minor" ? "warning" : "success";
}
function reportTone(r: ComplaintRecord["reportability"]) {
  return r === "Reportable" ? "danger" : r === "Under assessment" ? "warning" : "neutral";
}

function ComplaintsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [serious, setSerious] = useState<SeriousFilter>("all");
  const [selected, setSelected] = useState<ComplaintRecord | null>(null);

  const filtered = useMemo(() => {
    return COMPLAINTS.filter((c) => {
      const matchSearch =
        !search ||
        `${c.id} ${c.clinic} ${c.product} ${c.caseId} ${c.type} ${c.owner}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = status === "all" || c.investigation === status;
      const matchSerious = serious === "all" || c.seriousness === serious;
      return matchSearch && matchStatus && matchSerious;
    });
  }, [search, status, serious]);

  const statusOptions = useMemo(
    () => [
      { label: "All", value: "all" as const, count: COMPLAINTS.length },
      { label: "Open", value: "Open" as const, count: COMPLAINTS.filter((c) => c.investigation === "Open").length },
      { label: "Investigation", value: "Investigation" as const, count: COMPLAINTS.filter((c) => c.investigation === "Investigation").length },
      { label: "Closed", value: "Closed" as const, count: COMPLAINTS.filter((c) => c.investigation === "Closed").length },
    ],
    [],
  );

  const seriousOptions = useMemo(
    () => [
      { label: "All", value: "all" as const },
      { label: "Serious", value: "Serious" as const, count: COMPLAINTS.filter((c) => c.seriousness === "Serious").length },
      { label: "Non-serious", value: "Non-serious" as const, count: COMPLAINTS.filter((c) => c.seriousness === "Non-serious").length },
    ],
    [],
  );

  const columns: ColumnDef<ComplaintRecord>[] = [
    {
      accessorKey: "id",
      header: "Complaint ID",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] font-semibold text-fg">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "clinic",
      header: "Clinic",
      cell: ({ row }) => <span className="text-sm font-medium text-fg">{row.original.clinic}</span>,
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <span className="text-sm text-fg-secondary">{row.original.product.replace("iClear ", "")}</span>
      ),
    },
    {
      accessorKey: "caseId",
      header: "Case ID",
      cell: ({ row }) => (
        <span className="font-mono text-[12px] text-fg-secondary">{row.original.caseId}</span>
      ),
    },
    {
      accessorKey: "received",
      header: "Received",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-fg-secondary">
          {formatDate(row.original.received, { month: "short", day: "numeric" })}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <span className="text-sm text-fg-secondary">{row.original.type}</span>,
    },
    {
      accessorKey: "patientHarm",
      header: "Harm",
      cell: ({ row }) => (
        <Badge tone={harmTone(row.original.patientHarm)}>{row.original.patientHarm}</Badge>
      ),
    },
    {
      accessorKey: "seriousness",
      header: "Seriousness",
      cell: ({ row }) => (
        <Badge tone={row.original.seriousness === "Serious" ? "danger" : "neutral"} dot>
          {row.original.seriousness}
        </Badge>
      ),
    },
    {
      accessorKey: "reportability",
      header: "Reportability",
      cell: ({ row }) => (
        <Badge tone={reportTone(row.original.reportability)}>{row.original.reportability}</Badge>
      ),
    },
    {
      accessorKey: "investigation",
      header: "Investigation",
      cell: ({ row }) => <StatusBadge status={row.original.investigation} />,
    },
    {
      accessorKey: "capaRequired",
      header: "CAPA",
      cell: ({ row }) =>
        row.original.capaRequired ? (
          <Badge tone="regulatory">Required</Badge>
        ) : (
          <span className="text-xs text-fg-muted">—</span>
        ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => <span className="text-sm text-fg-secondary">{row.original.owner}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Complaints & Vigilance"
        title="Complaints & Vigilance"
        subtitle="MDR post-market surveillance — complaint handling, investigation and vigilance decisions across the device portfolio."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export log
            </Button>
            <Button>
              <Plus className="size-4" /> Log complaint
            </Button>
          </>
        }
      />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="Open complaints" value={COMPLAINT_SUMMARY.open} icon={MessageSquareWarning} tone="brand" hint="in handling" />
        <MetricCard label="Serious incidents" value={COMPLAINT_SUMMARY.seriousIncidents} icon={Siren} tone="success" hint="none reportable" />
        <MetricCard label="Reportable" value={COMPLAINT_SUMMARY.reportable} icon={ShieldAlert} tone="warning" hint="under assessment" />
        <MetricCard label="Avg investigation" value={COMPLAINT_SUMMARY.avgInvestigationDays} suffix="d" icon={Clock} tone="info" hint="target ≤ 15d" />
        <MetricCard label="CAPA-linked" value={COMPLAINT_SUMMARY.capaLinked} icon={Link2} tone="regulatory" hint="of 16 complaints" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Complaint trend</CardTitle>
              <p className="text-sm text-fg-muted">Monthly volume by category</p>
            </div>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={COMPLAINT_TYPE_TREND}
              height={240}
              series={[
                { key: "fit", name: "Fit / tracking", color: CHART_COLORS.info },
                { key: "fracture", name: "Fracture", color: CHART_COLORS.danger },
                { key: "irritation", name: "Irritation", color: CHART_COLORS.warning },
                { key: "other", name: "Other", color: CHART_COLORS.brand },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Complaints by type</CardTitle>
            <p className="text-sm text-fg-muted">Last 6 months</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2">
              <DonutChart data={COMPLAINT_BY_TYPE} height={200} />
              <div className="flex flex-col gap-1.5">
                {COMPLAINT_BY_TYPE.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: PIE_PALETTE[i % PIE_PALETTE.length] }} />
                      <span className="truncate text-fg-secondary">{d.name}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-fg">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search complaints, clinics, products, case IDs…"
        right={
          <Badge tone="neutral">
            {filtered.length} of {COMPLAINTS.length}
          </Badge>
        }
      >
        <FilterChips options={statusOptions} value={status} onChange={setStatus} />
        <span className="mx-0.5 hidden h-5 w-px bg-[var(--border-base)] sm:block" />
        <FilterChips options={seriousOptions} value={serious} onChange={setSerious} />
      </FilterBar>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={setSelected}
        pageSize={10}
        emptyMessage="No complaints match the current filters."
      />

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent widthClassName="w-full max-w-2xl">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-brand-600">{selected.id}</span>
                  <StatusBadge status={selected.investigation} />
                  <Badge tone={selected.seriousness === "Serious" ? "danger" : "neutral"} dot>
                    {selected.seriousness}
                  </Badge>
                  <Badge tone={reportTone(selected.reportability)}>{selected.reportability}</Badge>
                </div>
                <SheetTitle>{selected.type}</SheetTitle>
                <p className="text-sm text-fg-muted">
                  {selected.clinic} · {selected.product}
                </p>
              </SheetHeader>
              <SheetBody className="space-y-6">
                {/* Vigilance assessment — prominent */}
                <VigilancePanel record={selected} />

                {/* Description & impact */}
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-fg">
                      <FileWarning className="size-4 text-brand-600" /> Complaint description
                    </h4>
                    <p className="text-sm text-fg-secondary">{selected.description}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                    <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-800">
                      <Stethoscope className="size-4" /> Patient impact
                    </h4>
                    <p className="text-sm text-amber-900/80">{selected.patientImpact}</p>
                  </div>
                </div>

                {/* Traceability */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                    <Package className="size-4 text-brand-600" /> Case traceability
                  </h4>
                  <MetaGrid cols={2}>
                    <LabeledValue label="Affected product" value={selected.product} />
                    <LabeledValue
                      label="Production case"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="size-3.5 text-fg-muted" /> {selected.productionCase}
                        </span>
                      }
                      mono
                    />
                    <LabeledValue
                      label="Material lot"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="size-3.5 text-fg-muted" /> {selected.materialLot}
                        </span>
                      }
                      mono
                    />
                    <LabeledValue label="Date received" value={formatDate(selected.received)} />
                  </MetaGrid>
                </div>

                {/* Production history */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                    <Factory className="size-4 text-brand-600" /> Production history
                  </h4>
                  <Timeline
                    items={selected.productionHistory.map((e) => ({
                      title: `${e.stage} — ${e.detail}`,
                      time: formatDate(e.date, { month: "short", day: "numeric" }),
                      actor: e.operator,
                      tone: "neutral" as const,
                    }))}
                  />
                </div>

                {/* Investigation notes */}
                <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
                  <h4 className="mb-1.5 text-sm font-semibold text-fg">Investigation notes</h4>
                  <p className="text-sm text-fg-secondary">{selected.investigationNotes}</p>
                </div>

                {/* Linked items */}
                <MetaGrid cols={2}>
                  <LabeledValue
                    label="Linked risks"
                    value={
                      selected.linkedRisks.length ? (
                        <span className="flex flex-wrap gap-1.5">
                          {selected.linkedRisks.map((r) => (
                            <Badge key={r} tone="info">{r}</Badge>
                          ))}
                        </span>
                      ) : (
                        <span className="text-fg-muted">None</span>
                      )
                    }
                  />
                  <LabeledValue
                    label="Linked CAPA"
                    value={
                      selected.linkedCapa ? (
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="size-3.5 text-fg-muted" />
                          <span className="font-mono text-[13px]">{selected.linkedCapa}</span>
                        </span>
                      ) : (
                        <span className="text-fg-muted">Not required</span>
                      )
                    }
                  />
                  <LabeledValue label="Owner" value={selected.owner} />
                  <LabeledValue label="CAPA required" value={selected.capaRequired ? "Yes" : "No"} />
                </MetaGrid>

                {/* Response & closure */}
                <div className="space-y-3">
                  <div className="rounded-xl border border-[var(--border-base)] p-4">
                    <h4 className="mb-1 text-sm font-semibold text-fg">Response to clinic</h4>
                    <p className="text-sm text-fg-secondary">{selected.responseToClinic}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border-base)] p-4">
                    <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-fg">
                      <CheckCircle2 className="size-4 text-emerald-500" /> Closure approval
                    </h4>
                    <p className="text-sm text-fg-secondary">{selected.closureApproval}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    Open complaint file <ArrowRight className="size-4" />
                  </Button>
                  <Button variant="secondary">Print vigilance form</Button>
                </div>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function VigilancePanel({ record }: { record: ComplaintRecord }) {
  const rows: { question: string; decision: VigilanceDecision }[] = [
    { question: "Is this a serious incident?", decision: record.vigilance.seriousIncident },
    { question: "Is regulatory reporting required?", decision: record.vigilance.regulatoryReporting },
    { question: "Is FSCA required?", decision: record.vigilance.fsca },
    { question: "Is trend reporting required?", decision: record.vigilance.trendReporting },
  ];
  const anyYes = rows.some((r) => r.decision.decision === "Yes");
  return (
    <div className="overflow-hidden rounded-xl border-2 border-brand-200 bg-brand-50/40 shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-brand-200 bg-brand-50 px-4 py-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-brand-800">
          <ShieldAlert className="size-4" /> Vigilance assessment
        </h4>
        <Badge tone={anyYes ? "warning" : "success"}>
          {anyYes ? "Action determined" : "No reporting obligation"}
        </Badge>
      </div>
      <div className="divide-y divide-brand-100">
        {rows.map((r) => {
          const yes = r.decision.decision === "Yes";
          return (
            <div key={r.question} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-0.5 shrink-0">
                {yes ? (
                  <CheckCircle2 className="size-4 text-amber-500" />
                ) : (
                  <XCircle className="size-4 text-fg-muted" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-fg">{r.question}</p>
                  <Badge tone={yes ? "warning" : "neutral"}>{r.decision.decision}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-fg-secondary">{r.decision.reasoning}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-brand-200 bg-brand-50/60 px-4 py-2.5 text-xs text-brand-800">
        Assessed under MDR Art. 87–88 · PRRC: Genti Hoxha
      </div>
    </div>
  );
}
