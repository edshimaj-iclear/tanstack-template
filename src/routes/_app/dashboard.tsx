import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download,
  Calendar,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Activity as ActivityIcon,
} from "lucide-react";
import { PageHeader, SectionHeading } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { ComplianceCard } from "../../components/qms/ComplianceCard";
import { ProgressRing } from "../../components/qms/ProgressRing";
import { ActivityFeed } from "../../components/qms/ActivityFeed";
import { RiskHeatmap } from "../../components/qms/RiskHeatmap";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  TrendChart,
  BarChartCard,
  HorizontalBars,
  CHART_COLORS,
} from "../../components/charts";
import {
  QMS_HEALTH,
  COMPLIANCE_SCORES,
  KPIS,
  QUALITY_TREND,
  PRODUCTION_QUALITY,
  COMPLIANCE_BY_MODULE,
  HEATMAP_RISKS,
  ACTIVITY,
  DEADLINES,
} from "../../data/dashboard";
import { relativeDeadline, formatDate, daysUntil } from "../../lib/utils";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const complianceIcons = [ShieldCheck, ShieldCheck, FileText, ActivityIcon, ActivityIcon, TrendingUp];

function DashboardPage() {
  const heatCells = groupHeat(HEATMAP_RISKS);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Executive Dashboard"
        title="Good morning, Edison"
        subtitle="Here is the current quality and regulatory health of iClear."
        actions={
          <>
            <Select defaultValue="30" className="w-[150px]">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">This quarter</option>
              <option value="365">This year</option>
            </Select>
            <Button variant="secondary" size="default">
              <Calendar className="size-4" /> Jul 2026
            </Button>
            <Button>
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      {/* Top row: health score + compliance readiness */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="relative overflow-hidden lg:col-span-1">
          <div className="absolute inset-0 grid-dots opacity-[0.15]" />
          <CardContent className="relative flex flex-col items-center justify-center gap-4 py-8">
            <div className="flex flex-col items-center">
              <Badge tone="brand" className="mb-4">
                <ShieldCheck className="size-3.5" /> Overall QMS Health
              </Badge>
              <ProgressRing value={QMS_HEALTH} size={200} strokeWidth={16} label="Health Score" />
              <p className="mt-4 max-w-[240px] text-center text-sm text-fg-secondary">
                Strong compliance posture.{" "}
                <span className="font-semibold text-emerald-600">+3%</span> vs last
                quarter. 2 areas need attention.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Regulatory Readiness</CardTitle>
            <Link to="/reports" className="text-sm font-medium text-brand-600 hover:underline">
              View reports
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {COMPLIANCE_SCORES.map((c, i) => (
                <ComplianceCard
                  key={c.label}
                  label={c.label}
                  value={c.value}
                  icon={complianceIcons[i]}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI cards */}
      <div>
        <SectionHeading
          title="Key indicators"
          description="Live operational metrics across the quality system"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {KPIS.map((kpi) => (
            <Link key={kpi.label} to={kpi.to}>
              <MetricCard
                label={kpi.label}
                value={kpi.value}
                icon={kpi.icon}
                tone={kpi.tone}
                delta={kpi.delta}
                deltaLabel={kpi.deltaLabel}
                invertDelta={kpi.invert}
                hint={kpi.deltaLabel}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Quality trend</CardTitle>
              <p className="text-sm text-fg-muted">Monthly volume over 7 months</p>
            </div>
            <ChartLegend
              items={[
                { name: "Complaints", color: CHART_COLORS.warning },
                { name: "Remakes", color: CHART_COLORS.info },
                { name: "Nonconf.", color: CHART_COLORS.regulatory },
                { name: "CAPAs", color: CHART_COLORS.brand },
              ]}
            />
          </CardHeader>
          <CardContent>
            <TrendChart
              data={QUALITY_TREND}
              series={[
                { key: "complaints", name: "Complaints", color: CHART_COLORS.warning },
                { key: "remakes", name: "Remakes", color: CHART_COLORS.info },
                { key: "nonconformities", name: "Nonconformities", color: CHART_COLORS.regulatory },
                { key: "capas", name: "CAPAs", color: CHART_COLORS.brand },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Production quality</CardTitle>
              <p className="text-sm text-fg-muted">First-pass yield &amp; defect rates (%)</p>
            </div>
          </CardHeader>
          <CardContent>
            <TrendChart
              type="line"
              data={PRODUCTION_QUALITY}
              series={[
                { key: "firstPass", name: "First-pass yield", color: CHART_COLORS.success },
                { key: "remake", name: "Remake rate", color: CHART_COLORS.warning },
                { key: "refinement", name: "Refinement rate", color: CHART_COLORS.info },
                { key: "rejection", name: "Rejection rate", color: CHART_COLORS.danger },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Compliance by module + risk heatmap */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compliance by module</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBars data={COMPLIANCE_BY_MODULE} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Risk heatmap</CardTitle>
              <p className="text-sm text-fg-muted">Probability × Severity — active risks</p>
            </div>
            <Link to="/risk">
              <Button variant="ghost" size="sm">
                Risk register <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <RiskHeatmap cells={heatCells} />
          </CardContent>
        </Card>
      </div>

      {/* Activity + deadlines */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
            <Badge tone="neutral">Live</Badge>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={ACTIVITY} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {DEADLINES.slice()
              .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
              .map((d) => {
                const days = daysUntil(d.date);
                const overdue = days < 0;
                const soon = days >= 0 && days <= 7;
                return (
                  <div
                    key={d.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-subtle"
                  >
                    <div className="flex w-12 flex-col items-center rounded-lg bg-subtle py-1.5">
                      <span className="text-[10px] font-semibold uppercase text-fg-muted">
                        {formatDate(d.date, { month: "short" })}
                      </span>
                      <span className="text-base font-bold text-fg tabular-nums">
                        {formatDate(d.date, { day: "2-digit" })}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-fg">{d.title}</p>
                      <p className="text-xs text-fg-muted">{d.type}</p>
                    </div>
                    <Badge tone={overdue ? "danger" : soon ? "warning" : "neutral"}>
                      {relativeDeadline(d.date)}
                    </Badge>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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

function groupHeat(risks: typeof HEATMAP_RISKS) {
  const map = new Map<string, string[]>();
  for (const r of risks) {
    const key = `${r.severity}-${r.probability}`;
    map.set(key, [...(map.get(key) ?? []), r.id]);
  }
  return Array.from(map.entries()).map(([key, ids]) => {
    const [severity, probability] = key.split("-").map(Number);
    return { severity, probability, ids };
  });
}
