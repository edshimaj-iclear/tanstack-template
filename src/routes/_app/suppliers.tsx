import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Download,
  BadgeCheck,
  Loader,
  AlertTriangle,
  FileWarning,
  Check,
  X,
  ShieldCheck,
  Mail,
  Phone,
  FileText,
  Award,
  ClipboardCheck,
  PackageX,
  ArrowRight,
  Building2,
  CalendarClock,
  ExternalLink,
} from "lucide-react";
import { PageHeader, SectionHeading } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Timeline } from "../../components/qms/Timeline";
import { FilterBar } from "../../components/qms/FilterBar";
import { DataTable } from "../../components/tables/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Avatar } from "../../components/ui/misc";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { RadarCard, TrendChart, BarChartCard, CHART_COLORS } from "../../components/charts";
import {
  SUPPLIERS,
  SUPPLIER_SUMMARY,
  SUPPLIER_RADAR,
  SUPPLIER_DETAIL,
} from "../../data/suppliers";
import type { SupplierCertificate } from "../../data/suppliers";
import type { Supplier } from "../../types";
import { statusTone } from "../../lib/status";
import { formatDate, relativeDeadline, daysUntil } from "../../lib/utils";

export const Route = createFileRoute("/_app/suppliers")({
  component: SuppliersPage,
});

function riskTone(risk: string) {
  return statusTone(risk); // High→danger, Medium→warning, Low→success
}

function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Supplier | null>(null);

  const filtered = useMemo(() => {
    if (!search) return SUPPLIERS;
    const q = search.toLowerCase();
    return SUPPLIERS.filter((s) =>
      `${s.id} ${s.name} ${s.category} ${s.qualification} ${s.risk}`
        .toLowerCase()
        .includes(q),
    );
  }, [search]);

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] font-semibold text-fg">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Supplier",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-fg">{row.original.name}</p>
          <p className="text-xs text-fg-muted">
            {row.original.qualityAgreement ? "Quality agreement signed" : "No quality agreement"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge tone="neutral" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "risk",
      header: "Risk",
      cell: ({ row }) => (
        <Badge tone={riskTone(row.original.risk)} dot>
          {row.original.risk}
        </Badge>
      ),
    },
    {
      accessorKey: "qualification",
      header: "Qualification",
      cell: ({ row }) => <StatusBadge status={row.original.qualification} />,
    },
    {
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => <ScoreCell value={row.original.performance} />,
    },
    {
      accessorKey: "delivery",
      header: "Delivery",
      cell: ({ row }) => <ScoreCell value={row.original.delivery} />,
    },
    {
      accessorKey: "defectRate",
      header: "Defect rate",
      cell: ({ row }) => {
        const d = row.original.defectRate;
        const tone = d >= 3 ? "danger" : d >= 1.5 ? "warning" : "success";
        return (
          <Badge tone={tone as "danger" | "warning" | "success"}>{d.toFixed(1)}%</Badge>
        );
      },
    },
    {
      accessorKey: "nextReassessment",
      header: "Next reassessment",
      cell: ({ row }) => {
        const days = daysUntil(row.original.nextReassessment);
        const tone = days < 0 ? "danger" : days <= 45 ? "warning" : "neutral";
        return (
          <Badge tone={tone as "danger" | "warning" | "neutral"}>
            {relativeDeadline(row.original.nextReassessment)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "openIssues",
      header: "Open issues",
      cell: ({ row }) =>
        row.original.openIssues > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg">
            <FileWarning className="size-3.5 text-amber-500" />
            {row.original.openIssues}
          </span>
        ) : (
          <span className="text-sm text-fg-muted">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Supply Chain · Qualification"
        title="Supplier Management"
        subtitle="Qualification status, performance and compliance of critical and non-critical suppliers across the aligner supply chain."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export register
            </Button>
            <Button>
              <Plus className="size-4" /> New supplier
            </Button>
          </>
        }
      />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Qualified suppliers"
          value={SUPPLIER_SUMMARY.qualified}
          icon={BadgeCheck}
          tone="success"
          hint={`of ${SUPPLIER_SUMMARY.total} approved`}
        />
        <MetricCard
          label="Under qualification"
          value={SUPPLIER_SUMMARY.underQualification}
          icon={Loader}
          tone="info"
          hint="conditional & in progress"
        />
        <MetricCard
          label="High-risk suppliers"
          value={SUPPLIER_SUMMARY.highRisk}
          icon={AlertTriangle}
          tone="danger"
          hint="enhanced oversight"
        />
        <MetricCard
          label="Open SCARs / issues"
          value={SUPPLIER_SUMMARY.openIssues}
          icon={FileWarning}
          tone="warning"
          hint="across all suppliers"
        />
      </div>

      {/* Scorecards */}
      <div>
        <SectionHeading
          title="Supplier scorecards"
          description="Performance, delivery and compliance at a glance — click a card for the full supplier file"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SUPPLIERS.map((s) => (
            <ScorecardCard key={s.id} supplier={s} onClick={() => setSelected(s)} />
          ))}
        </div>
      </div>

      {/* Table */}
      <div>
        <SectionHeading
          title="Supplier register"
          description="Full list — sortable and searchable"
        />
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search suppliers, categories, status…"
          right={
            <Badge tone="neutral">
              {filtered.length} of {SUPPLIERS.length}
            </Badge>
          }
        />
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={setSelected}
            pageSize={10}
            emptyMessage="No suppliers match the current search."
          />
        </div>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent widthClassName="w-full max-w-3xl">
          {selected && <SupplierDrawer supplier={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ---------------- Scorecard card ---------------- */
function ScorecardCard({
  supplier: s,
  onClick,
}: {
  supplier: Supplier;
  onClick: () => void;
}) {
  const days = daysUntil(s.nextReassessment);
  const reassessTone = days < 0 ? "danger" : days <= 45 ? "warning" : "neutral";
  const perfTone = s.performance >= 85 ? "success" : s.performance >= 70 ? "brand" : "danger";

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-brand-600">{s.id}</span>
            <Badge tone={riskTone(s.risk)} dot>
              {s.risk} risk
            </Badge>
          </div>
          <h3 className="mt-1.5 truncate text-[15px] font-semibold text-fg">{s.name}</h3>
          <p className="mt-0.5 text-xs capitalize text-fg-muted">{s.category}</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold tabular-nums ${perfColor(s.performance)}`}>
            {s.performance}
            <span className="text-base font-semibold text-fg-muted">%</span>
          </p>
          <p className="text-[11px] uppercase tracking-wider text-fg-muted">Performance</p>
        </div>
      </div>

      <div className="mt-4">
        <StatusBadge status={s.qualification} />
      </div>

      <div className="mt-4 space-y-3">
        <ScoreRow label="Performance" value={s.performance} tone={perfTone} />
        <ScoreRow
          label="On-time delivery"
          value={s.delivery}
          tone={s.delivery >= 85 ? "success" : s.delivery >= 70 ? "brand" : "danger"}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--border-base)] pt-4 text-sm">
        <MiniStat
          label="Defect rate"
          value={`${s.defectRate.toFixed(1)}%`}
          valueClass={s.defectRate >= 3 ? "text-red-600" : s.defectRate >= 1.5 ? "text-amber-600" : "text-emerald-600"}
        />
        <MiniStat
          label="Quality agreement"
          value={
            s.qualityAgreement ? (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <Check className="size-4" /> Signed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-red-500">
                <X className="size-4" /> Missing
              </span>
            )
          }
        />
        <MiniStat label="Last audit" value={formatDate(s.lastAudit, { day: "2-digit", month: "short", year: "numeric" })} />
        <MiniStat
          label="Reassessment"
          value={
            <Badge tone={reassessTone as "danger" | "warning" | "neutral"}>
              {relativeDeadline(s.nextReassessment)}
            </Badge>
          }
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        {s.openIssues > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
            <FileWarning className="size-3.5" /> {s.openIssues} open{" "}
            {s.openIssues === 1 ? "issue" : "issues"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <ShieldCheck className="size-3.5" /> No open issues
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-fg-muted transition-colors group-hover:text-brand-600">
          Open file <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Card>
  );
}

function perfColor(v: number) {
  if (v >= 85) return "text-emerald-600";
  if (v >= 70) return "text-fg";
  return "text-red-600";
}

function ScoreRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "brand" | "warning" | "danger";
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-fg-secondary">{label}</span>
        <span className="font-semibold text-fg tabular-nums">{value}%</span>
      </div>
      <Progress value={value} tone={tone} size="sm" />
    </div>
  );
}

function MiniStat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: ReactNode;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-fg-muted">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold text-fg ${valueClass ?? ""}`}>{value}</p>
    </div>
  );
}

function ScoreCell({ value }: { value: number }) {
  const tone = value >= 85 ? "success" : value >= 70 ? "brand" : "danger";
  return (
    <div className="flex min-w-[92px] items-center gap-2">
      <Progress value={value} tone={tone} size="sm" className="w-14" />
      <span className="text-sm font-semibold text-fg tabular-nums">{value}%</span>
    </div>
  );
}

/* ---------------- Detail drawer ---------------- */
function certExpired(c: SupplierCertificate) {
  if (c.expiry === "—") return false;
  return daysUntil(c.expiry) < 0;
}
function certExpiring(c: SupplierCertificate) {
  if (c.expiry === "—") return false;
  const d = daysUntil(c.expiry);
  return d >= 0 && d <= 90;
}

function SupplierDrawer({ supplier: s }: { supplier: Supplier }) {
  const detail = SUPPLIER_DETAIL[s.id];
  const radar = SUPPLIER_RADAR[s.id];

  return (
    <>
      <SheetHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-brand-600">{s.id}</span>
          <StatusBadge status={s.qualification} />
          <Badge tone={riskTone(s.risk)} dot>
            {s.risk} risk
          </Badge>
        </div>
        <SheetTitle>{s.name}</SheetTitle>
        <p className="text-sm text-fg-muted">
          <span className="capitalize">{s.category}</span> · {detail.country} · approved by {detail.approvedBy}
        </p>
      </SheetHeader>
      <SheetBody className="space-y-5">
        {/* Score strip */}
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Performance" value={`${s.performance}%`} tone={s.performance >= 85 ? "success" : s.performance >= 70 ? "brand" : "danger"} />
          <StatTile label="On-time delivery" value={`${s.delivery}%`} tone={s.delivery >= 85 ? "success" : s.delivery >= 70 ? "brand" : "danger"} />
          <StatTile label="Defect rate" value={`${s.defectRate.toFixed(1)}%`} tone={s.defectRate >= 3 ? "danger" : s.defectRate >= 1.5 ? "warning" : "success"} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="qualification">Qualification</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="defects">Incoming Defects</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="scars">SCARs</TabsTrigger>
            <TabsTrigger value="performance">Performance History</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-5">
            <MetaGrid cols={2}>
              <LabeledValue label="Legal address" value={<span className="inline-flex items-start gap-1.5"><Building2 className="mt-0.5 size-3.5 shrink-0 text-fg-muted" />{detail.address}</span>} />
              <LabeledValue label="Country" value={detail.country} />
              <LabeledValue label="Supplier since" value={detail.since} />
              <LabeledValue label="Annual spend" value={detail.spend} />
              <LabeledValue label="Approved by" value={detail.approvedBy} />
              <LabeledValue label="Quality agreement" value={s.qualityAgreement ? "Signed" : "Not signed"} />
            </MetaGrid>

            <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Criticality</p>
              <p className="mt-1 text-sm text-fg">{detail.criticality}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {detail.materials.map((m) => (
                  <Badge key={m} tone="brand">{m}</Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Performance profile</CardTitle>
                  <p className="text-sm text-fg-muted">5-dimension supplier scorecard</p>
                </div>
              </CardHeader>
              <CardContent>
                <RadarCard data={radar} color={CHART_COLORS.brand} height={260} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts */}
          <TabsContent value="contacts" className="space-y-3">
            {detail.contacts.map((c) => (
              <div key={c.email} className="flex items-center gap-3 rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
                <Avatar name={c.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-fg">{c.name}</p>
                    {c.primary && <Badge tone="brand">Primary</Badge>}
                  </div>
                  <p className="text-xs text-fg-muted">{c.role}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-secondary">
                    <span className="inline-flex items-center gap-1"><Mail className="size-3.5 text-fg-muted" />{c.email}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="size-3.5 text-fg-muted" />{c.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Certificates */}
          <TabsContent value="certificates" className="space-y-3">
            {detail.certificates.map((c) => {
              const expired = certExpired(c);
              const expiring = certExpiring(c);
              return (
                <div key={c.number} className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <Award className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-fg">{c.standard}</p>
                        <p className="text-xs text-fg-muted">{c.scope}</p>
                      </div>
                    </div>
                    <Badge tone={expired ? "danger" : expiring ? "warning" : "success"} dot>
                      {expired ? "Expired" : expiring ? "Expiring" : "Valid"}
                    </Badge>
                  </div>
                  <MetaGrid cols={3} className="mt-3">
                    <LabeledValue label="Cert. no." value={c.number} mono />
                    <LabeledValue label="Issuer" value={c.issuer} />
                    <LabeledValue label="Expiry" value={c.expiry === "—" ? "—" : formatDate(c.expiry)} />
                  </MetaGrid>
                </div>
              );
            })}
            {detail.certificates.length === 0 && <EmptyTab text="No certificates on file." />}
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-2">
            {detail.documents.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] px-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-subtle text-fg-secondary">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{d.title}</p>
                  <p className="text-xs text-fg-muted">
                    <span className="font-mono">{d.id}</span> · {d.type} · {d.version} · updated {formatDate(d.updated)}
                  </p>
                </div>
                <StatusBadge status={d.status} dot={false} />
                <ExternalLink className="size-4 text-fg-muted" />
              </div>
            ))}
            {detail.documents.length === 0 && <EmptyTab text="No documents linked." />}
          </TabsContent>

          {/* Qualification */}
          <TabsContent value="qualification" className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Current status</p>
                <div className="mt-1.5"><StatusBadge status={s.qualification} /></div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Next reassessment</p>
                <p className="mt-1 text-sm font-semibold text-fg">{formatDate(s.nextReassessment)}</p>
                <p className="text-xs text-fg-muted">{relativeDeadline(s.nextReassessment)}</p>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
                <ClipboardCheck className="size-4 text-brand-600" /> Qualification assessment
              </h4>
              <p className="text-sm text-fg-secondary">{detail.qualificationNote}</p>
            </div>
            <MetaGrid cols={2}>
              <LabeledValue label="Quality agreement" value={s.qualityAgreement ? "Signed & effective" : "Outstanding"} />
              <LabeledValue label="Last audit" value={formatDate(s.lastAudit)} />
              <LabeledValue label="Risk classification" value={`${s.risk} risk`} />
              <LabeledValue label="Approved by" value={detail.approvedBy} />
            </MetaGrid>
          </TabsContent>

          {/* Audits */}
          <TabsContent value="audits" className="space-y-3">
            {detail.audits.map((a) => (
              <div key={a.id} className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-fg">
                      <span className="font-mono text-brand-600">{a.id}</span> · {a.type} audit
                    </p>
                    <p className="text-xs text-fg-muted">{formatDate(a.date)} · lead {a.auditor}</p>
                  </div>
                  <Badge tone={a.result === "Failed" ? "danger" : a.result === "Passed" ? "success" : "warning"}>
                    {a.result}
                  </Badge>
                </div>
                <div className="mt-3 flex gap-2 text-xs">
                  <FindingPill label="Major" count={a.major} tone="danger" />
                  <FindingPill label="Minor" count={a.minor} tone="warning" />
                  <FindingPill label="Observations" count={a.observation} tone="info" />
                </div>
              </div>
            ))}
            {detail.audits.length === 0 && <EmptyTab text="No supplier audits recorded yet." />}
          </TabsContent>

          {/* Incoming Defects */}
          <TabsContent value="defects" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Current defect rate" value={`${s.defectRate.toFixed(1)}%`} tone={s.defectRate >= 3 ? "danger" : s.defectRate >= 1.5 ? "warning" : "success"} />
              <StatTile label="Latest lots (Jul)" value={`${detail.defectTrend[detail.defectTrend.length - 1].received}`} tone="brand" />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Incoming inspection — defect PPM</CardTitle>
                <p className="text-sm text-fg-muted">Parts-per-million defective, last 7 months</p>
              </CardHeader>
              <CardContent>
                <BarChartCard
                  data={detail.defectTrend}
                  bars={[{ key: "defectPpm", name: "Defect PPM", color: CHART_COLORS.danger }]}
                  height={220}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints */}
          <TabsContent value="complaints" className="space-y-3">
            {detail.complaints.map((c) => (
              <div key={c.id} className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm font-semibold text-brand-600">{c.id}</span>
                  <span className="text-xs text-fg-muted">{formatDate(c.date)}</span>
                </div>
                <p className="mt-1.5 text-sm text-fg">{c.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
                  <Badge tone="neutral">Lot {c.lot}</Badge>
                  <span>{c.disposition}</span>
                </div>
              </div>
            ))}
            {detail.complaints.length === 0 && <EmptyTab text="No complaints linked to this supplier." />}
          </TabsContent>

          {/* SCARs */}
          <TabsContent value="scars" className="space-y-3">
            {detail.scars.map((sc) => (
              <div key={sc.id} className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-fg">
                      <span className="font-mono text-brand-600">{sc.id}</span>
                    </p>
                    <p className="text-sm text-fg">{sc.title}</p>
                  </div>
                  <Badge tone={sc.severity === "Critical" ? "danger" : sc.severity === "Major" ? "warning" : "info"}>
                    {sc.severity}
                  </Badge>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
                  <StatusBadge status={sc.status} />
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="size-3.5" /> due {formatDate(sc.due)}
                    <span className={daysUntil(sc.due) < 0 ? "font-semibold text-red-500" : ""}>
                      ({relativeDeadline(sc.due)})
                    </span>
                  </span>
                  <span>owner {sc.owner}</span>
                </div>
              </div>
            ))}
            {detail.scars.length === 0 && <EmptyTab text="No open or historical SCARs." />}
          </TabsContent>

          {/* Performance History */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance &amp; delivery trend</CardTitle>
                <p className="text-sm text-fg-muted">Rolling 7-month view (%)</p>
              </CardHeader>
              <CardContent>
                <TrendChart
                  type="line"
                  data={detail.perfHistory}
                  height={220}
                  series={[
                    { key: "performance", name: "Performance", color: CHART_COLORS.brand },
                    { key: "delivery", name: "On-time delivery", color: CHART_COLORS.success },
                  ]}
                />
              </CardContent>
            </Card>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-fg">Supplier history</h4>
              <Timeline items={detail.history} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 border-t border-[var(--border-base)] pt-5">
          <Button className="flex-1">
            Open full supplier file <ArrowRight className="size-4" />
          </Button>
          <Button variant="secondary">
            <ClipboardCheck className="size-4" /> Schedule audit
          </Button>
        </div>
      </SheetBody>
    </>
  );
}

/* ---------------- small drawer helpers ---------------- */
function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "brand" | "warning" | "danger";
}) {
  const toneText: Record<string, string> = {
    success: "text-emerald-600",
    brand: "text-fg",
    warning: "text-amber-600",
    danger: "text-red-600",
  };
  return (
    <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${toneText[tone]}`}>{value}</p>
    </div>
  );
}

function FindingPill({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "danger" | "warning" | "info";
}) {
  const cls =
    count === 0
      ? "border-[var(--border-base)] bg-subtle text-fg-muted"
      : tone === "danger"
        ? "border-red-200 bg-red-50 text-red-700"
        : tone === "warning"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-blue-200 bg-blue-50 text-blue-700";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium ${cls}`}>
      <span className="font-bold tabular-nums">{count}</span> {label}
    </span>
  );
}

function EmptyTab({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-base)] bg-muted-surface py-10 text-center">
      <PackageX className="size-6 text-fg-muted" />
      <p className="text-sm text-fg-muted">{text}</p>
    </div>
  );
}
