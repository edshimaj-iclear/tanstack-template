import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  FileText,
  FileSpreadsheet,
  Eye,
  Clock,
  Layers,
  CheckCircle2,
  FileEdit,
  CalendarClock,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { FilterChips } from "../../components/qms/FilterBar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar } from "../../components/ui/misc";
import {
  REPORTS,
  REPORTS_SUMMARY,
  REPORT_CATEGORIES,
  type ReportCard as ReportCardType,
  type ReportStatus,
} from "../../data/reports";
import { formatDate, cn } from "../../lib/utils";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

const statusTone: Record<ReportStatus, "success" | "warning" | "info"> = {
  Final: "success",
  Draft: "warning",
  Scheduled: "info",
};

const iconTone: Record<string, string> = {
  brand: "bg-brand-50 text-brand-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
  regulatory: "bg-violet-50 text-violet-600",
};

function ReportsPage() {
  const [category, setCategory] = useState("all");

  const chipOptions = useMemo(
    () => [
      { label: "All", value: "all", count: REPORTS.length },
      ...REPORT_CATEGORIES.map((c) => ({
        label: c,
        value: c,
        count: REPORTS.filter((r) => r.category === c).length,
      })),
    ],
    [],
  );

  const filtered = useMemo(
    () => (category === "all" ? REPORTS : REPORTS.filter((r) => r.category === category)),
    [category],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Report Center"
        title="Reports"
        subtitle="Generate, review and export controlled quality and regulatory reports."
        actions={
          <Button>
            <Plus className="size-4" /> Generate report
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total reports" value={REPORTS_SUMMARY.total} icon={Layers} tone="brand" />
        <MetricCard label="Finalised" value={REPORTS_SUMMARY.final} icon={CheckCircle2} tone="success" hint="approved & released" />
        <MetricCard label="In draft" value={REPORTS_SUMMARY.draft} icon={FileEdit} tone="warning" hint="pending review" />
        <MetricCard label="Scheduled" value={REPORTS_SUMMARY.scheduled} icon={CalendarClock} tone="info" hint="auto-generated" />
      </div>

      <FilterChips options={chipOptions} value={category} onChange={setCategory} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <ReportGridCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}

function ReportGridCard({ report }: { report: ReportCardType }) {
  const Icon = report.icon;
  return (
    <Card className="group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex size-11 items-center justify-center rounded-xl", iconTone[report.tone])}>
          <Icon className="size-5.5" />
        </div>
        <Badge tone={statusTone[report.status]} dot>
          {report.status}
        </Badge>
      </div>

      <div className="mt-4 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
            {report.type}
          </span>
          <span className="text-[11px] text-fg-muted">· {report.period}</span>
        </div>
        <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-fg">
          {report.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-fg-secondary">
          {report.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border-base)] pt-4">
        <div className="flex items-center gap-2">
          <Avatar name={report.owner} size="xs" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-fg">{report.owner}</p>
            <p className="flex items-center gap-1 text-[11px] text-fg-muted">
              <Clock className="size-3" /> {formatDate(report.lastGenerated)}
            </p>
          </div>
        </div>
        <span className="text-[11px] text-fg-muted">{report.pages} pp</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {report.formats.includes("PDF") && (
          <Button variant="secondary" size="sm" className="flex-1">
            <FileText className="size-3.5" /> PDF
          </Button>
        )}
        {report.formats.includes("Excel") && (
          <Button variant="secondary" size="sm" className="flex-1">
            <FileSpreadsheet className="size-3.5" /> Excel
          </Button>
        )}
        {report.formats.includes("Word") && (
          <Button variant="secondary" size="sm" className="flex-1">
            <FileText className="size-3.5" /> Word
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" aria-label="Preview report">
          <Eye className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
