import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ClipboardX,
  AlertOctagon,
  Hourglass,
  Link2,
  Download,
  Plus,
  ArrowRight,
  Search,
  Gavel,
  FileCheck2,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { FilterBar, FilterChips } from "../../components/qms/FilterBar";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Timeline } from "../../components/qms/Timeline";
import { DataTable } from "../../components/tables/DataTable";
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
  NONCONFORMITIES,
  NCR_SUMMARY,
  type Nonconformity,
  type NcrSeverity,
  type NcrDisposition,
  type NcrStatus,
} from "../../data/nonconformities";
import { formatDate } from "../../lib/utils";

export const Route = createFileRoute("/_app/nonconformities")({
  component: NonconformitiesPage,
});

type StatusFilter = "all" | NcrStatus;
type SeverityFilter = "all" | NcrSeverity;

function severityTone(s: NcrSeverity) {
  return s === "Critical" ? "danger" : s === "Major" ? "warning" : "info";
}
function dispositionTone(d: NcrDisposition) {
  switch (d) {
    case "Scrap":
      return "danger";
    case "Return to supplier":
      return "warning";
    case "Rework":
      return "info";
    case "Use-as-is":
      return "neutral";
    case "Pending":
      return "warning";
    default:
      return "neutral";
  }
}

function NonconformitiesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [selected, setSelected] = useState<Nonconformity | null>(null);

  const filtered = useMemo(() => {
    return NONCONFORMITIES.filter((n) => {
      const matchSearch =
        !search ||
        `${n.id} ${n.source} ${n.product} ${n.description} ${n.department} ${n.owner}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = status === "all" || n.status === status;
      const matchSeverity = severity === "all" || n.severity === severity;
      return matchSearch && matchStatus && matchSeverity;
    });
  }, [search, status, severity]);

  const statusOptions = useMemo(
    () => [
      { label: "All", value: "all" as const, count: NONCONFORMITIES.length },
      { label: "Open", value: "Open" as const, count: NONCONFORMITIES.filter((n) => n.status === "Open").length },
      { label: "Investigation", value: "Investigation" as const, count: NONCONFORMITIES.filter((n) => n.status === "Investigation").length },
      { label: "Closed", value: "Closed" as const, count: NONCONFORMITIES.filter((n) => n.status === "Closed").length },
    ],
    [],
  );

  const severityOptions = useMemo(
    () => [
      { label: "All", value: "all" as const },
      { label: "Critical", value: "Critical" as const, count: NONCONFORMITIES.filter((n) => n.severity === "Critical").length },
      { label: "Major", value: "Major" as const, count: NONCONFORMITIES.filter((n) => n.severity === "Major").length },
      { label: "Minor", value: "Minor" as const, count: NONCONFORMITIES.filter((n) => n.severity === "Minor").length },
    ],
    [],
  );

  const columns: ColumnDef<Nonconformity>[] = [
    {
      accessorKey: "id",
      header: "NCR ID",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] font-semibold text-fg">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => <Badge tone="outline">{row.original.source}</Badge>,
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <span className="text-sm text-fg-secondary">{row.original.product.replace("iClear ", "")}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <p className="max-w-[260px] truncate text-sm text-fg" title={row.original.description}>
          {row.original.description}
        </p>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => <span className="text-sm text-fg-secondary">{row.original.department}</span>,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => <Badge tone={severityTone(row.original.severity)} dot>{row.original.severity}</Badge>,
    },
    {
      accessorKey: "disposition",
      header: "Disposition",
      cell: ({ row }) => <Badge tone={dispositionTone(row.original.disposition)}>{row.original.disposition}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "capaId",
      header: "CAPA",
      cell: ({ row }) =>
        row.original.capaId ? (
          <span className="inline-flex items-center gap-1 font-mono text-[12px] text-brand-600">
            <Link2 className="size-3.5" /> {row.original.capaId}
          </span>
        ) : (
          <span className="text-xs text-fg-muted">—</span>
        ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => <span className="text-sm text-fg-secondary">{row.original.owner}</span>,
    },
    {
      accessorKey: "detectedDate",
      header: "Detected",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-fg-secondary">
          {formatDate(row.original.detectedDate, { month: "short", day: "numeric" })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quality · Nonconformities"
        title="Nonconformities"
        subtitle="Nonconforming material and product control (ISO 13485 §8.3) — detection, disposition and CAPA escalation."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export register
            </Button>
            <Button>
              <Plus className="size-4" /> Raise NCR
            </Button>
          </>
        }
      />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Open NCRs" value={NCR_SUMMARY.open} icon={ClipboardX} tone="brand" hint="in progress" />
        <MetricCard label="Critical" value={NCR_SUMMARY.critical} icon={AlertOctagon} tone="danger" hint="highest severity" />
        <MetricCard label="Awaiting disposition" value={NCR_SUMMARY.awaitingDisposition} icon={Hourglass} tone="warning" hint="pending decision" />
        <MetricCard label="Linked to CAPA" value={NCR_SUMMARY.linkedToCapa} icon={Link2} tone="regulatory" hint={`of ${NONCONFORMITIES.length} NCRs`} />
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search NCRs, products, departments, owners…"
        right={
          <Badge tone="neutral">
            {filtered.length} of {NONCONFORMITIES.length}
          </Badge>
        }
      >
        <FilterChips options={statusOptions} value={status} onChange={setStatus} />
        <span className="mx-0.5 hidden h-5 w-px bg-[var(--border-base)] sm:block" />
        <FilterChips options={severityOptions} value={severity} onChange={setSeverity} />
      </FilterBar>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={setSelected}
        pageSize={10}
        emptyMessage="No nonconformities match the current filters."
      />

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent widthClassName="w-full max-w-2xl">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-brand-600">{selected.id}</span>
                  <StatusBadge status={selected.status} />
                  <Badge tone={severityTone(selected.severity)} dot>{selected.severity}</Badge>
                  <Badge tone="outline">{selected.source}</Badge>
                </div>
                <SheetTitle>{selected.description}</SheetTitle>
                <p className="text-sm text-fg-muted">
                  {selected.product} · {selected.department}
                </p>
              </SheetHeader>
              <SheetBody className="space-y-6">
                <MetaGrid cols={2}>
                  <LabeledValue label="Source" value={selected.source} />
                  <LabeledValue label="Department" value={selected.department} />
                  <LabeledValue label="Owner" value={selected.owner} />
                  <LabeledValue label="Detected" value={formatDate(selected.detectedDate)} />
                </MetaGrid>

                {/* Root cause hint */}
                <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
                  <h4 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-fg">
                    <Search className="size-4 text-brand-600" /> Root cause hint
                  </h4>
                  <p className="text-sm text-fg-secondary">{selected.rootCauseHint}</p>
                </div>

                {/* Disposition decision */}
                <div className="rounded-xl border-2 border-brand-200 bg-brand-50/40 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-brand-800">
                      <Gavel className="size-4" /> Disposition decision
                    </h4>
                    <Badge tone={dispositionTone(selected.disposition)}>{selected.disposition}</Badge>
                  </div>
                  <p className="text-sm text-fg-secondary">{selected.dispositionRationale}</p>
                </div>

                {/* Linked CAPA */}
                <MetaGrid cols={2}>
                  <LabeledValue
                    label="Linked CAPA"
                    value={
                      selected.capaId ? (
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="size-3.5 text-fg-muted" />
                          <span className="font-mono text-[13px]">{selected.capaId}</span>
                        </span>
                      ) : (
                        <span className="text-fg-muted">Not escalated</span>
                      )
                    }
                  />
                  <LabeledValue label="Severity" value={selected.severity} />
                </MetaGrid>

                {/* Evidence */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
                    <FileCheck2 className="size-4 text-brand-600" /> Evidence
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.evidence.map((e) => (
                      <span
                        key={e}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs text-fg-secondary"
                      >
                        <FileCheck2 className="size-3.5 text-fg-muted" /> {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Audit trail */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-fg">Audit trail</h4>
                  <Timeline
                    items={selected.auditTrail.map((a) => ({
                      title: a.title,
                      time: a.time,
                      description: a.description,
                      actor: a.actor,
                      tone: a.tone,
                    }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    Open NCR record <ArrowRight className="size-4" />
                  </Button>
                  <Button variant="secondary">Escalate to CAPA</Button>
                </div>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
