import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Boxes,
  ClipboardCheck,
  PauseCircle,
  PackageCheck,
  AlertTriangle,
  ArrowRight,
  X,
  Download,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { FilterBar, FilterChips } from "../../components/qms/FilterBar";
import { DataTable } from "../../components/tables/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  CASES,
  PRODUCTION_STAGES,
  FLAGGED_LOT,
  AFFECTED_CASE_COUNT,
} from "../../data/production";
import type { ProductionCase } from "../../types";
import { cn } from "../../lib/utils";

export const Route = createFileRoute("/_app/production")({
  component: ProductionPage,
});

type StageName = (typeof PRODUCTION_STAGES)[number];

const OPEN_STAGES: StageName[] = [
  "Case Received",
  "Design",
  "Internal Review",
  "Doctor Approval",
  "Production",
  "Quality Control",
  "Device Release",
  "Packaging",
  "Delivery",
];

function qcTone(qc: ProductionCase["qcResult"]) {
  return qc === "Pass" ? "success" : qc === "Fail" ? "danger" : "warning";
}

function ProductionPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [qcFilter, setQcFilter] = useState<string>("all");
  const [lotAlertOpen, setLotAlertOpen] = useState(true);

  // Counts per stage for the workflow strip.
  const stageCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of PRODUCTION_STAGES) map.set(s, 0);
    for (const c of CASES) map.set(c.stage, (map.get(c.stage) ?? 0) + 1);
    return map;
  }, []);

  // Metric row.
  const metrics = useMemo(() => {
    const inProduction = CASES.filter((c) => OPEN_STAGES.includes(c.stage as StageName)).length;
    const awaitingQc = CASES.filter((c) => c.qcResult === "Pending").length;
    const onHold = CASES.filter(
      (c) => c.releaseStatus === "On Hold" || c.qcResult === "Fail",
    ).length;
    const releasedToday = CASES.filter(
      (c) => c.releaseStatus === "Released" && c.approvalDate >= "2026-07-12",
    ).length;
    return { inProduction, awaitingQc, onHold, releasedToday };
  }, []);

  const filtered = useMemo(() => {
    return CASES.filter((c) => {
      const matchSearch =
        !search ||
        `${c.id} ${c.patient} ${c.clinic} ${c.doctor} ${c.product} ${c.materialLot} ${c.machine}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStage = stageFilter === "all" || c.stage === stageFilter;
      const matchQc = qcFilter === "all" || c.qcResult === qcFilter;
      return matchSearch && matchStage && matchQc;
    });
  }, [search, stageFilter, qcFilter]);

  const stageOptions = useMemo(
    () => [
      { label: "All stages", value: "all", count: CASES.length },
      ...PRODUCTION_STAGES.filter((s) => (stageCounts.get(s) ?? 0) > 0).map((s) => ({
        label: s,
        value: s as string,
        count: stageCounts.get(s) ?? 0,
      })),
    ],
    [stageCounts],
  );

  const qcOptions = [
    { label: "Any QC", value: "all" },
    { label: "Pass", value: "Pass", count: CASES.filter((c) => c.qcResult === "Pass").length },
    { label: "Fail", value: "Fail", count: CASES.filter((c) => c.qcResult === "Fail").length },
    { label: "Pending", value: "Pending", count: CASES.filter((c) => c.qcResult === "Pending").length },
  ];

  const columns: ColumnDef<ProductionCase>[] = [
    {
      accessorKey: "id",
      header: "Case ID",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] font-semibold text-brand-600">
          {row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "patient",
      header: "Patient",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="font-medium text-fg">{row.original.patient}</p>
          <p className="truncate text-xs text-fg-muted">{row.original.doctor}</p>
        </div>
      ),
    },
    {
      accessorKey: "clinic",
      header: "Clinic",
      cell: ({ row }) => <span className="text-sm text-fg-secondary">{row.original.clinic}</span>,
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <span className="text-sm text-fg-secondary">
          {row.original.product.replace("iClear ", "")}
        </span>
      ),
    },
    {
      accessorKey: "aligners",
      header: "Aligners",
      cell: ({ row }) => (
        <span className="tabular-nums text-fg-secondary">{row.original.aligners}</span>
      ),
    },
    {
      accessorKey: "materialLot",
      header: "Material Lot",
      cell: ({ row }) => {
        const flagged = row.original.materialLot === FLAGGED_LOT;
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-mono text-[12px]",
              flagged ? "font-semibold text-amber-700" : "text-fg-secondary",
            )}
          >
            {flagged && <AlertTriangle className="size-3" />}
            {row.original.materialLot}
          </span>
        );
      },
    },
    {
      accessorKey: "machine",
      header: "Machine",
      cell: ({ row }) => (
        <span className="font-mono text-[12px] text-fg-secondary">{row.original.machine}</span>
      ),
    },
    {
      accessorKey: "qcResult",
      header: "QC Result",
      cell: ({ row }) => (
        <Badge tone={qcTone(row.original.qcResult)} dot>
          {row.original.qcResult}
        </Badge>
      ),
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => <StatusBadge status={row.original.stage} />,
    },
    {
      accessorKey: "releaseStatus",
      header: "Release",
      cell: ({ row }) => <StatusBadge status={row.original.releaseStatus} />,
    },
    {
      id: "go",
      header: "",
      cell: () => <ChevronRight className="size-4 text-fg-muted" />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Production · Case Traceability"
        title="Production Traceability"
        subtitle="Full device genealogy for every aligner case — from STL import through design, thermoforming, quality control, release and delivery. Trace any material lot to every case it touched."
        actions={
          <Button variant="secondary">
            <Download className="size-4" /> Export batch records
          </Button>
        }
      />

      {/* Workflow strip */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Production workflow</CardTitle>
            <p className="text-sm text-fg-muted">Live case distribution across the 10-stage device lifecycle</p>
          </div>
          <Badge tone="neutral">{CASES.length} active cases</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
            {PRODUCTION_STAGES.map((stage, i) => {
              const count = stageCounts.get(stage) ?? 0;
              const active = count > 0;
              const isSelected = stageFilter === stage;
              return (
                <div key={stage} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStageFilter(isSelected ? "all" : stage)}
                    className={cn(
                      "flex min-w-[92px] flex-col items-center gap-1.5 rounded-lg border px-3 py-2.5 text-center transition-all",
                      isSelected
                        ? "border-brand-500 bg-brand-50 shadow-sm"
                        : active
                          ? "border-[var(--border-base)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-subtle"
                          : "border-dashed border-[var(--border-base)] bg-subtle/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full text-sm font-bold tabular-nums",
                        active ? "bg-brand-600 text-white" : "bg-muted-surface text-fg-muted",
                      )}
                    >
                      {count}
                    </span>
                    <span
                      className={cn(
                        "text-[10.5px] font-medium leading-tight",
                        active ? "text-fg" : "text-fg-muted",
                      )}
                    >
                      {stage}
                    </span>
                  </button>
                  {i < PRODUCTION_STAGES.length - 1 && (
                    <ArrowRight className="size-3.5 shrink-0 text-fg-muted/50" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Cases in production" value={metrics.inProduction} icon={Boxes} tone="brand" hint="open across all stages" />
        <MetricCard label="Awaiting QC" value={metrics.awaitingQc} icon={ClipboardCheck} tone="info" hint="pending inspection" />
        <MetricCard label="On hold / failed QC" value={metrics.onHold} icon={PauseCircle} tone="danger" hint="needs attention" />
        <MetricCard label="Released today" value={metrics.releasedToday} icon={PackageCheck} tone="success" hint="devices dispatched" />
      </div>

      {/* Lot traceability alert */}
      {lotAlertOpen && (
        <Card className="overflow-hidden border-amber-300 bg-amber-50/60 shadow-card">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-amber-900">
                  Material lot traceability alert
                </h3>
                <Badge tone="warning" dot>
                  Under investigation
                </Badge>
              </div>
              <p className="mt-1 text-sm text-amber-800">
                Supplier deviation reported for TPU sheet lot{" "}
                <span className="font-mono font-semibold">{FLAGGED_LOT}</span> (thickness tolerance
                out of spec). Potential affected cases:{" "}
                <span className="font-bold tabular-nums">{AFFECTED_CASE_COUNT}</span> across all
                clinics.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  setSearch(FLAGGED_LOT);
                  setStageFilter("all");
                  setQcFilter("all");
                }}
              >
                Trace affected cases <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Dismiss alert"
                onClick={() => setLotAlertOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search case ID, patient, clinic, product, lot, machine…"
        right={
          <Badge tone="neutral">
            {filtered.length} of {CASES.length}
          </Badge>
        }
      >
        <FilterChips options={qcOptions} value={qcFilter} onChange={setQcFilter} />
      </FilterBar>

      <div className="-mt-2">
        <FilterChips options={stageOptions} value={stageFilter} onChange={setStageFilter} />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(c) => navigate({ to: "/production/$id", params: { id: c.id } })}
        pageSize={12}
        emptyMessage="No cases match the current filters."
      />

      <p className="text-center text-xs text-fg-muted">
        Every case links to a complete Device History Record (DHR).{" "}
        <Link to="/production" className="font-medium text-brand-600 hover:underline">
          Learn about lot genealogy
        </Link>
      </p>
    </div>
  );
}
