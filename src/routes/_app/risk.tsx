import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ShieldAlert,
  TrendingDown,
  AlertTriangle,
  Download,
  Plus,
  ArrowRight,
  Link2,
  CheckCircle2,
  Target,
  X,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { RiskHeatmap } from "../../components/qms/RiskHeatmap";
import { RiskBadge, StatusBadge } from "../../components/qms/StatusBadge";
import { FilterBar } from "../../components/qms/FilterBar";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { DataTable } from "../../components/tables/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { RISKS, RISK_SUMMARY } from "../../data/risks";
import type { RiskItem } from "../../types";
import { riskLabel } from "../../lib/status";

export const Route = createFileRoute("/_app/risk")({
  component: RiskPage,
});

function RiskPage() {
  const [search, setSearch] = useState("");
  const [cell, setCell] = useState<{ severity: number; probability: number } | null>(null);
  const [selected, setSelected] = useState<RiskItem | null>(null);

  const heatCells = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const r of RISKS) {
      const key = `${r.severity}-${r.probability}`;
      map.set(key, [...(map.get(key) ?? []), r.id]);
    }
    return Array.from(map.entries()).map(([key, ids]) => {
      const [severity, probability] = key.split("-").map(Number);
      return { severity, probability, ids };
    });
  }, []);

  const filtered = useMemo(() => {
    return RISKS.filter((r) => {
      const matchSearch =
        !search ||
        `${r.id} ${r.hazard} ${r.product} ${r.harm} ${r.owner}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchCell =
        !cell || (r.severity === cell.severity && r.probability === cell.probability);
      return matchSearch && matchCell;
    });
  }, [search, cell]);

  const columns: ColumnDef<RiskItem>[] = [
    {
      accessorKey: "id",
      header: "Risk ID",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] font-semibold text-fg">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "hazard",
      header: "Hazard → Harm",
      cell: ({ row }) => (
        <div className="max-w-[240px]">
          <p className="truncate font-medium text-fg">{row.original.hazard}</p>
          <p className="truncate text-xs text-fg-muted">{row.original.harm}</p>
        </div>
      ),
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <span className="text-sm text-fg-secondary">{row.original.product.replace("iClear ", "")}</span>
      ),
    },
    {
      accessorKey: "initialRisk",
      header: "Initial",
      cell: ({ row }) => <RiskBadge score={row.original.initialRisk} />,
    },
    {
      accessorKey: "residualRisk",
      header: "Residual",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <RiskBadge score={row.original.residualRisk} />
          {row.original.residualRisk < row.original.initialRisk && (
            <TrendingDown className="size-3.5 text-emerald-500" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
        eyebrow="ISO 14971 · Risk Management"
        title="Risk Management"
        subtitle="Hazard identification, risk evaluation and control across all device families."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export register
            </Button>
            <Button>
              <Plus className="size-4" /> New risk
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total risks" value={RISK_SUMMARY.total} icon={ShieldAlert} tone="brand" />
        <MetricCard label="High initial risk" value={RISK_SUMMARY.high} icon={AlertTriangle} tone="danger" hint="score ≥ 10" />
        <MetricCard label="Open items" value={RISK_SUMMARY.open} icon={Target} tone="warning" hint="controls in progress" />
        <MetricCard label="Risk reduced" value={RISK_SUMMARY.residualReduced} suffix="%" icon={TrendingDown} tone="success" hint="initial → residual" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Risk heatmap</CardTitle>
              <p className="text-sm text-fg-muted">Click a cell to filter the register</p>
            </div>
            {cell && (
              <Button variant="ghost" size="sm" onClick={() => setCell(null)}>
                <X className="size-3.5" /> Clear
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <RiskHeatmap cells={heatCells} onCellClick={(s, p) => setCell({ severity: s, probability: p })} selected={cell} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Residual risk distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {["High", "Medium", "Low", "Negligible"].map((level) => {
              const count = RISKS.filter((r) => riskLabel(r.residualRisk) === level).length;
              const pct = Math.round((count / RISKS.length) * 100);
              const tone = level === "High" ? "danger" : level === "Medium" ? "warning" : level === "Low" ? "info" : "success";
              return (
                <div key={level}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-fg-secondary">{level}</span>
                    <span className="text-fg-muted">{count} risks</span>
                  </div>
                  <Progress value={pct} tone={tone as any} size="sm" />
                </div>
              );
            })}
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="mb-1 size-4" />
              All residual risks are within the acceptable region per the risk acceptability matrix. Overall benefit-risk is <strong>favourable</strong>.
            </div>
          </CardContent>
        </Card>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search hazards, harms, products, owners…"
        right={
          <Badge tone="neutral">
            {filtered.length} of {RISKS.length}
          </Badge>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={setSelected}
        pageSize={12}
        emptyMessage="No risks match the current filters."
      />

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent widthClassName="w-full max-w-2xl">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-brand-600">{selected.id}</span>
                  <StatusBadge status={selected.status} />
                </div>
                <SheetTitle>{selected.hazard}</SheetTitle>
                <p className="text-sm text-fg-muted">{selected.product}</p>
              </SheetHeader>
              <SheetBody className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <ScoreBlock label="Initial risk" score={selected.initialRisk} severity={selected.severity} probability={selected.probability} />
                  <ScoreBlock label="Residual risk" score={selected.residualRisk} severity={selected.residualSeverity} probability={selected.residualProbability} residual />
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-semibold text-fg">Risk-control chain</h4>
                  <div className="space-y-2">
                    {[
                      { k: "Hazard", v: selected.hazard },
                      { k: "Foreseeable sequence", v: "Use / process deviation leading to hazardous situation" },
                      { k: "Hazardous situation", v: selected.hazardousSituation },
                      { k: "Possible harm", v: selected.harm },
                    ].map((row, i, arr) => (
                      <div key={row.k} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="flex size-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
                          {i < arr.length - 1 && <span className="my-0.5 h-full w-px flex-1 bg-[var(--border-base)]" />}
                        </div>
                        <div className="pb-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{row.k}</p>
                          <p className="text-sm text-fg">{row.v}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
                    <Target className="size-4 text-brand-600" /> Risk-control measures
                  </h4>
                  <p className="text-sm text-fg-secondary">{selected.controls}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
                    <CheckCircle2 className="size-3.5" /> Implementation verified · evidence linked
                  </div>
                </div>

                <MetaGrid cols={2}>
                  <LabeledValue label="Owner" value={selected.owner} />
                  <LabeledValue label="Verification" value="V&V report VV-2026-04" mono />
                  <LabeledValue label="Linked complaints" value={<span className="inline-flex items-center gap-1"><Link2 className="size-3.5 text-fg-muted" /> CMP-2026-104</span>} />
                  <LabeledValue label="Linked CAPA" value={<span className="inline-flex items-center gap-1"><Link2 className="size-3.5 text-fg-muted" /> CAPA-2026-024</span>} />
                </MetaGrid>

                <div className="flex gap-2">
                  <Button className="flex-1">Open full risk file <ArrowRight className="size-4" /></Button>
                  <Button variant="secondary">Add control</Button>
                </div>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ScoreBlock({ label, score, severity, probability, residual }: { label: string; score: number; severity: number; probability: number; residual?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${residual ? "border-emerald-200 bg-emerald-50/50" : "border-[var(--border-base)] bg-muted-surface"}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <span className="text-3xl font-bold tabular-nums text-fg">{score}</span>
        <RiskBadge score={score} showScore={false} className="mb-1.5" />
      </div>
      <p className="mt-1 text-xs text-fg-muted">Severity {severity} × Probability {probability}</p>
    </div>
  );
}
