import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  Link2,
  CheckCircle2,
  Clock,
  Circle,
  Ban,
  Users,
  Radar as RadarIcon,
  Radio,
} from "lucide-react";
import { PageHeader, SectionHeading } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  TrendChart,
  BarChartCard,
  DonutChart,
  CHART_COLORS,
  PIE_PALETTE,
} from "../../components/charts";
import {
  PMS_TREND,
  PRODUCT_COMPARISON,
  SIGNAL_SOURCE_MIX,
  PMS_METRICS,
  PMS_SIGNALS,
  EMERGING_RISKS,
  LITERATURE_ITEMS,
  PMCF_STUDIES,
  PSUR_TASKS,
  PMS_SOURCE_NODES,
  PMS_FILTERS,
  type PmsSignal,
  type PsurTask,
  type LiteratureItem,
} from "../../data/pms";
import { formatDate, relativeDeadline, daysUntil, cn } from "../../lib/utils";

export const Route = createFileRoute("/_app/pms")({
  component: PmsPage,
});

/* ------------------------------------------------------------------ */

function PmsPage() {
  const [product, setProduct] = useState("All products");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Post-Market Surveillance"
        title="PMS & PMCF"
        subtitle="Continuous signal detection across complaints, production and clinical follow-up — feeding the PSUR and benefit-risk determination per MDR Annex III."
        actions={
          <>
            <Select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-[180px]"
            >
              {PMS_FILTERS.product.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
            <Button>
              <Download className="size-4" /> Export PMS report
            </Button>
          </>
        }
      />

      {/* Filter row */}
      <FilterRow />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {PMS_METRICS.map((m) => (
          <MetricCard
            key={m.key}
            label={m.label}
            value={m.value}
            suffix={m.suffix}
            icon={m.icon}
            tone={m.tone}
            delta={m.delta}
            deltaLabel={m.deltaLabel}
            invertDelta={m.invert}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>PMS signal trend</CardTitle>
              <p className="text-sm text-fg-muted">Normalised rates over 7 months</p>
            </div>
            <ChartLegend
              items={[
                { name: "Complaint /1k", color: CHART_COLORS.warning },
                { name: "Remake %", color: CHART_COLORS.info },
                { name: "Refinement %", color: CHART_COLORS.brand },
                { name: "Serious /1k", color: CHART_COLORS.danger },
              ]}
            />
          </CardHeader>
          <CardContent>
            <TrendChart
              data={PMS_TREND}
              series={[
                { key: "complaintRate", name: "Complaint /1k", color: CHART_COLORS.warning },
                { key: "remakeRate", name: "Remake %", color: CHART_COLORS.info },
                { key: "refinementRate", name: "Refinement %", color: CHART_COLORS.brand },
                { key: "seriousIncidentRate", name: "Serious /1k", color: CHART_COLORS.danger },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Signal source mix</CardTitle>
            <p className="text-sm text-fg-muted">Where signals originated this period</p>
          </CardHeader>
          <CardContent>
            <DonutChart data={SIGNAL_SOURCE_MIX} />
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {SIGNAL_SOURCE_MIX.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: PIE_PALETTE[i % PIE_PALETTE.length] }}
                  />
                  <span className="truncate text-fg-muted">{s.name}</span>
                  <span className="ml-auto font-semibold tabular-nums text-fg">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product comparison bar chart */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Product comparison</CardTitle>
            <p className="text-sm text-fg-muted">Complaint rate (/1k) &amp; remake rate (%) by device family</p>
          </div>
          <ChartLegend
            items={[
              { name: "Complaint /1k", color: CHART_COLORS.warning },
              { name: "Remake %", color: CHART_COLORS.brand },
            ]}
          />
        </CardHeader>
        <CardContent>
          <BarChartCard
            data={PRODUCT_COMPARISON}
            xKey="product"
            height={240}
            bars={[
              { key: "complaintRate", name: "Complaint /1k", color: CHART_COLORS.warning },
              { key: "remakeRate", name: "Remake %", color: CHART_COLORS.brand },
            ]}
          />
        </CardContent>
      </Card>

      {/* Signal cards + emerging risks */}
      <div>
        <SectionHeading
          title="Signals & emerging risks"
          description="Detected trends compared against pre-defined PMS thresholds"
          action={
            <Badge tone="warning" dot>
              {PMS_SIGNALS.filter((s) => s.trend === "up").length} rising
            </Badge>
          }
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PMS_SIGNALS.map((sig) => (
            <SignalCard key={sig.id} signal={sig} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {EMERGING_RISKS.map((risk) => (
            <EmergingRiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </div>

      {/* Trackers */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <LiteratureTracker />
        <PmcfTracker />
        <PsurTracker />
      </div>

      {/* Data sources hub-and-spoke */}
      <SourceMap />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter row                                                         */
/* ------------------------------------------------------------------ */

function FilterRow() {
  const groups: { key: keyof typeof PMS_FILTERS; label: string }[] = [
    { key: "product", label: "Product" },
    { key: "country", label: "Country" },
    { key: "clinic", label: "Clinic" },
    { key: "period", label: "Period" },
    { key: "ageGroup", label: "Age group" },
    { key: "material", label: "Material" },
    { key: "thickness", label: "Thickness" },
    { key: "line", label: "Production line" },
  ];
  return (
    <div className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-3 shadow-card">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {groups.map((g) => (
          <label key={g.key} className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              {g.label}
            </span>
            <Select defaultValue={PMS_FILTERS[g.key][0]} className="w-full">
              {PMS_FILTERS[g.key].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Signal card                                                        */
/* ------------------------------------------------------------------ */

const severityTone = {
  low: "success",
  medium: "warning",
  high: "danger",
} as const;

function TrendArrow({ trend }: { trend: PmsSignal["trend"] }) {
  if (trend === "up")
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
        <ArrowUpRight className="size-4" />
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <ArrowDownRight className="size-4" />
      </span>
    );
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-subtle text-fg-muted">
      <Minus className="size-4" />
    </span>
  );
}

function SignalCard({ signal }: { signal: PmsSignal }) {
  const changeColor =
    signal.trend === "up"
      ? "text-red-600"
      : signal.trend === "down"
        ? "text-emerald-600"
        : "text-fg-muted";
  return (
    <Card className="group p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-semibold text-brand-600">{signal.id}</p>
          <h3 className="mt-0.5 text-[15px] font-semibold tracking-tight text-fg">
            {signal.title}
          </h3>
        </div>
        <TrendArrow trend={signal.trend} />
      </div>
      <p className="mt-2 text-xs text-fg-muted">
        {signal.source} · <span className="text-fg-secondary">{signal.product}</span>
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-[var(--border-base)] pt-3">
        <div className="flex items-center gap-2">
          <Badge tone={severityTone[signal.severity]} className="capitalize">
            {signal.severity}
          </Badge>
          <span className={cn("text-xs font-semibold tabular-nums", changeColor)}>
            {signal.changeLabel}
          </span>
        </div>
        <Badge tone={signal.statusTone} dot>
          {signal.status}
        </Badge>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Emerging risk alert                                                */
/* ------------------------------------------------------------------ */

function EmergingRiskCard({ risk }: { risk: (typeof EMERGING_RISKS)[number] }) {
  const red = risk.level === "red";
  return (
    <div
      className={cn(
        "rounded-xl border p-4 shadow-card",
        red ? "border-red-200 bg-red-50/60" : "border-amber-200 bg-amber-50/60",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            red ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600",
          )}
        >
          <AlertTriangle className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={red ? "danger" : "warning"}>
              {red ? "Threshold exceeded" : "Watch"}
            </Badge>
            <span className="font-mono text-[11px] font-semibold text-fg-muted">{risk.id}</span>
          </div>
          <h3 className={cn("mt-1.5 text-sm font-semibold", red ? "text-red-900" : "text-amber-900")}>
            {risk.title}
          </h3>
          <p className="mt-1 text-sm text-fg-secondary">{risk.detail}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
            <span className="inline-flex items-center gap-1">
              <Link2 className="size-3.5" /> {risk.linkedRisk}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" /> {risk.owner}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Literature tracker                                                 */
/* ------------------------------------------------------------------ */

const litStatusTone: Record<LiteratureItem["status"], "success" | "brand" | "info" | "neutral" | "warning"> = {
  Included: "success",
  Appraised: "brand",
  Screened: "info",
  Excluded: "neutral",
  Pending: "warning",
};

function LiteratureTracker() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Literature review</CardTitle>
          <p className="text-sm text-fg-muted">PMCF literature surveillance</p>
        </div>
        <Badge tone="regulatory">{LITERATURE_ITEMS.length} records</Badge>
      </CardHeader>
      <CardContent className="space-y-1">
        {LITERATURE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-subtle"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">{item.title}</p>
              <p className="mt-0.5 text-xs text-fg-muted">
                <span className="font-mono">{item.id}</span> · {item.database} · {item.reviewer}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <Badge tone={litStatusTone[item.status]}>{item.status}</Badge>
              {item.relevance === "high" && (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-red-500">
                  high relevance
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  PMCF study tracker                                                 */
/* ------------------------------------------------------------------ */

const studyTone: Record<string, "neutral" | "info" | "brand" | "warning" | "regulatory" | "success"> = {
  Planned: "neutral",
  Recruiting: "info",
  Ongoing: "brand",
  Analysis: "warning",
  Reporting: "regulatory",
  Complete: "success",
};

function PmcfTracker() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>PMCF studies</CardTitle>
          <p className="text-sm text-fg-muted">Active clinical follow-up plan</p>
        </div>
        <Badge tone="brand">{PMCF_STUDIES.length} studies</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {PMCF_STUDIES.map((s) => {
          const days = daysUntil(s.due);
          const overdue = days < 0;
          return (
            <div key={s.id} className="rounded-lg border border-[var(--border-base)] bg-muted-surface p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{s.title}</p>
                  <p className="mt-0.5 text-xs text-fg-muted">
                    <span className="font-mono">{s.id}</span> · {s.design}
                  </p>
                </div>
                <Badge tone={studyTone[s.status]}>{s.status}</Badge>
              </div>
              <div className="mt-2.5">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-fg-muted">
                    {s.enrolled}/{s.target} enrolled
                  </span>
                  <span className="font-semibold tabular-nums text-fg">{s.progress}%</span>
                </div>
                <Progress value={s.progress} size="sm" />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-xs">
                <span className="truncate text-fg-secondary">{s.nextMilestone}</span>
                <Badge tone={overdue ? "danger" : days <= 14 ? "warning" : "neutral"}>
                  {relativeDeadline(s.due)}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  PSUR preparation tracker                                           */
/* ------------------------------------------------------------------ */

const psurStatusMeta: Record<
  PsurTask["status"],
  { icon: typeof CheckCircle2; className: string; tone: "success" | "info" | "neutral" | "danger" }
> = {
  Complete: { icon: CheckCircle2, className: "text-emerald-500", tone: "success" },
  "In progress": { icon: Clock, className: "text-blue-500", tone: "info" },
  "Not started": { icon: Circle, className: "text-fg-muted", tone: "neutral" },
  Blocked: { icon: Ban, className: "text-red-500", tone: "danger" },
};

function PsurTracker() {
  const done = PSUR_TASKS.filter((t) => t.status === "Complete").length;
  const pct = Math.round((done / PSUR_TASKS.length) * 100);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>PSUR preparation</CardTitle>
          <p className="text-sm text-fg-muted">iClear Aligners · due 2026-08-12</p>
        </div>
        <Badge tone="regulatory">{pct}%</Badge>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="mb-2 px-2">
          <Progress value={pct} tone="regulatory" size="sm" />
        </div>
        {PSUR_TASKS.map((t) => {
          const meta = psurStatusMeta[t.status];
          const Icon = meta.icon;
          const days = daysUntil(t.due);
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-subtle"
            >
              <Icon className={cn("size-4 shrink-0", meta.className)} />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm",
                    t.status === "Complete" ? "text-fg-muted line-through" : "font-medium text-fg",
                  )}
                >
                  {t.task}
                </p>
                <p className="text-xs text-fg-muted">
                  {t.owner} · due {formatDate(t.due, { month: "short", day: "numeric" })}
                </p>
              </div>
              {t.status !== "Complete" && days < 7 && (
                <Badge tone={days < 0 ? "danger" : "warning"}>{relativeDeadline(t.due)}</Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  PMS data-source hub-and-spoke map                                  */
/* ------------------------------------------------------------------ */

const nodeTone: Record<string, string> = {
  brand: "border-brand-200 bg-brand-50 text-brand-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  regulatory: "border-violet-200 bg-violet-50 text-violet-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  neutral: "border-[var(--border-base)] bg-subtle text-fg-secondary",
};

function SourceMap() {
  const nodes = PMS_SOURCE_NODES;
  const half = Math.ceil(nodes.length / 2);
  const left = nodes.slice(0, half);
  const right = nodes.slice(half);

  const Spoke = ({ node, side }: { node: (typeof nodes)[number]; side: "left" | "right" }) => {
    const Icon = node.icon;
    return (
      <div
        className={cn(
          "flex items-center gap-2.5",
          side === "right" && "lg:flex-row-reverse lg:text-right",
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg border",
            nodeTone[node.tone],
          )}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-fg">{node.label}</p>
          <p className="truncate text-xs text-fg-muted tabular-nums">{node.count}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 grid-dots opacity-[0.12]" />
      <CardHeader className="relative flex-row items-center justify-between">
        <div>
          <CardTitle>PMS data sources</CardTitle>
          <p className="text-sm text-fg-muted">
            Inputs continuously feeding the surveillance system per the PMS plan
          </p>
        </div>
        <Badge tone="brand" dot>
          <Radio className="size-3.5" /> 10 active feeds
        </Badge>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          {/* Left spokes */}
          <div className="space-y-3">
            {left.map((n) => (
              <div
                key={n.label}
                className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)]/70 p-2.5 shadow-sm backdrop-blur-sm"
              >
                <Spoke node={n} side="left" />
              </div>
            ))}
          </div>

          {/* Hub */}
          <div className="relative flex justify-center py-2">
            {/* connective lines (decorative) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-center lg:flex">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />
            </div>
            <div className="relative flex size-32 flex-col items-center justify-center rounded-2xl border border-brand-300 bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-elevated">
              <RadarIcon className="size-7" />
              <span className="mt-1.5 text-lg font-bold tracking-tight">PMS</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/80">
                Central hub
              </span>
              <span className="absolute -inset-2 -z-10 animate-pulse rounded-3xl bg-brand-400/20 blur-lg" />
            </div>
          </div>

          {/* Right spokes */}
          <div className="space-y-3">
            {right.map((n) => (
              <div
                key={n.label}
                className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)]/70 p-2.5 shadow-sm backdrop-blur-sm"
              >
                <Spoke node={n} side="right" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-5 flex items-center gap-2 rounded-lg border border-[var(--border-base)] bg-muted-surface px-3 py-2.5 text-xs text-fg-secondary">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          All feeds reconcile into the PSUR and the ISO 14971 benefit-risk file. Overall benefit-risk
          remains <strong className="text-fg">favourable</strong> for all device families this period.
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */

function ChartLegend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="hidden flex-wrap items-center gap-3 sm:flex">
      {items.map((it) => (
        <span key={it.name} className="flex items-center gap-1.5 text-xs text-fg-muted">
          <span className="size-2 rounded-full" style={{ backgroundColor: it.color }} />
          {it.name}
        </span>
      ))}
    </div>
  );
}
