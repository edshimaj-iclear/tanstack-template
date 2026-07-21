import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Boxes,
  FlaskConical,
  ShieldCheck,
  Package,
  Truck,
  MessageSquareWarning,
  RefreshCw,
  History,
  ExternalLink,
  Thermometer,
  Gauge,
  Timer,
  Layers,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { Timeline } from "../../components/qms/Timeline";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { EmptyState } from "../../components/qms/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { CASES, CASE_TIMELINE, FLAGGED_LOT } from "../../data/production";
import type { ProductionCase } from "../../types";
import { cn, formatDate } from "../../lib/utils";

export const Route = createFileRoute("/_app/production/$id")({
  component: CaseDetailPage,
});

const stageTone: Record<string, "brand" | "success" | "warning" | "danger" | "info" | "regulatory" | "neutral"> = {
  "Case Received": "neutral",
  Design: "info",
  "Internal Review": "info",
  "Doctor Approval": "warning",
  Production: "brand",
  "Quality Control": "info",
  "Device Release": "regulatory",
  Packaging: "brand",
  Delivery: "success",
  Closed: "success",
};

function CaseDetailPage() {
  const { id } = Route.useParams();
  const c: ProductionCase = CASES.find((x) => x.id === id) ?? CASES[0];
  const lotFlagged = c.materialLot === FLAGGED_LOT;

  // Only show timeline steps up to (and including) the current stage.
  const reached = useMemo(() => {
    const idx = CASE_TIMELINE.findIndex((t) => t.stage === c.stage);
    const upto = idx === -1 ? CASE_TIMELINE.length : idx + 1;
    return CASE_TIMELINE.slice(0, upto);
  }, [c.stage]);

  const timelineItems = reached.map((t, i) => ({
    title: t.stage,
    time: t.date,
    description: t.note,
    actor: t.actor,
    tone: (i === reached.length - 1 ? stageTone[t.stage] ?? "brand" : "success") as
      | "brand"
      | "success",
    icon: i === reached.length - 1 ? <Clock /> : <CheckCircle2 />,
  }));

  // Other cases produced with the same material lot (lot genealogy).
  const lotSiblings = CASES.filter((x) => x.materialLot === c.materialLot && x.id !== c.id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/production"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="size-4" /> Back to Production Traceability
        </Link>
        <PageHeader
          eyebrow={`Case Traceability · ${c.clinic}`}
          title={
            <span className="flex flex-wrap items-center gap-3">
              <span className="font-mono">{c.id}</span>
              <span className="text-fg-muted">·</span>
              <span>{c.patient}</span>
            </span>
          }
          subtitle={`${c.product} — ${c.aligners} aligners · ${c.doctor}, ${c.clinic}`}
          actions={
            <>
              <StatusBadge status={c.stage} />
              <StatusBadge status={c.releaseStatus} />
              <Badge tone={c.qcResult === "Pass" ? "success" : c.qcResult === "Fail" ? "danger" : "warning"} dot>
                QC {c.qcResult}
              </Badge>
            </>
          }
        />
      </div>

      {lotFlagged && (
        <Card className="border-amber-300 bg-amber-50/60">
          <div className="flex items-center gap-3 p-4">
            <AlertTriangle className="size-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              This case was produced with flagged material lot{" "}
              <span className="font-mono font-semibold">{c.materialLot}</span>. Included in the
              active lot traceability investigation — verify dimensional QC before release.
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Journey timeline */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Case journey</CardTitle>
            <p className="text-sm text-fg-muted">Chronological device history record</p>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineItems} />
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap">
              <TabsTrigger value="overview"><FileText /> Overview</TabsTrigger>
              <TabsTrigger value="design"><Layers /> Design History</TabsTrigger>
              <TabsTrigger value="production"><Boxes /> Production</TabsTrigger>
              <TabsTrigger value="material"><FlaskConical /> Material Traceability</TabsTrigger>
              <TabsTrigger value="qc"><ShieldCheck /> Quality Control</TabsTrigger>
              <TabsTrigger value="packaging"><Package /> Packaging</TabsTrigger>
              <TabsTrigger value="delivery"><Truck /> Delivery</TabsTrigger>
              <TabsTrigger value="complaints"><MessageSquareWarning /> Complaints</TabsTrigger>
              <TabsTrigger value="remakes"><RefreshCw /> Remakes</TabsTrigger>
              <TabsTrigger value="audit"><History /> Audit Trail</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Case overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetaGrid cols={3}>
                    <LabeledValue label="Case ID" value={c.id} mono />
                    <LabeledValue label="Patient" value={c.patient} />
                    <LabeledValue label="Product" value={c.product.replace("iClear ", "")} />
                    <LabeledValue label="Clinic" value={c.clinic} />
                    <LabeledValue label="Referring doctor" value={c.doctor} />
                    <LabeledValue label="Aligners" value={`${c.aligners} stages`} />
                    <LabeledValue label="Treatment plan" value={c.planVersion} mono />
                    <LabeledValue label="Design operator" value={c.designOperator} />
                    <LabeledValue label="Doctor approval" value={formatDate(c.approvalDate)} />
                    <LabeledValue label="Current stage" value={<StatusBadge status={c.stage} />} />
                    <LabeledValue label="Release status" value={<StatusBadge status={c.releaseStatus} />} />
                    <LabeledValue label="Refinements" value={`${c.refinements}`} />
                  </MetaGrid>
                  <div className="mt-5 rounded-xl border border-[var(--border-base)] bg-muted-surface p-4 text-sm text-fg-secondary">
                    <span className="font-medium text-fg">Intended use:</span> Sequential orthodontic
                    correction via removable clear aligners. Class IIa device manufactured under
                    ISO 13485 and EU MDR 2017/745. Full DHR retained for 10 years.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design History */}
            <TabsContent value="design">
              <Card>
                <CardHeader>
                  <CardTitle>Design history</CardTitle>
                  <p className="text-sm text-fg-muted">Treatment planning and design verification</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MetaGrid cols={3}>
                    <LabeledValue label="Plan version" value={c.planVersion} mono />
                    <LabeledValue label="Stages designed" value={`${c.aligners}`} />
                    <LabeledValue label="Design operator" value={c.designOperator} />
                    <LabeledValue label="STL source" value="Clinic portal upload" />
                    <LabeledValue label="Internal review" value={<Badge tone="success" dot>Approved</Badge>} />
                    <LabeledValue label="Doctor approval" value={formatDate(c.approvalDate)} />
                  </MetaGrid>
                  <div className="space-y-2">
                    {[
                      { v: "v1", note: "Initial setup — 20 stages generated", state: "Superseded" },
                      { v: "v2", note: "Attachment optimisation applied", state: "Superseded" },
                      { v: c.planVersion, note: "Final approved plan — released to production", state: "Approved" },
                    ].map((r) => (
                      <div
                        key={r.v}
                        className="flex items-center justify-between rounded-lg border border-[var(--border-base)] px-3 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-fg">{r.v}</span>
                          <span className="text-sm text-fg-secondary">{r.note}</span>
                        </div>
                        <StatusBadge status={r.state} dot={false} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Production */}
            <TabsContent value="production">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Thermoforming record</CardTitle>
                    <p className="text-sm text-fg-muted">Batch parameters logged on {c.machine}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <ParamTile icon={Thermometer} label="Heater temp" value="185 °C" />
                      <ParamTile icon={Gauge} label="Forming pressure" value="6.0 bar" />
                      <ParamTile icon={Timer} label="Cycle time" value="42 s" />
                      <ParamTile icon={Layers} label="Sheet thickness" value={c.thickness} />
                    </div>
                    <MetaGrid cols={3} className="mt-5">
                      <LabeledValue label="Machine" value={c.machine} mono />
                      <LabeledValue label="Operator" value={c.operator} />
                      <LabeledValue label="Material lot" value={c.materialLot} mono />
                      <LabeledValue label="Material" value="Zendura FLX TPU" />
                      <LabeledValue label="Trim method" value="CNC laser trim" />
                      <LabeledValue label="Batch record" value="WI-PROD-012" mono />
                    </MetaGrid>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Material Traceability */}
            <TabsContent value="material">
              <div className="space-y-4">
                <Card className={cn(lotFlagged && "border-amber-300 bg-amber-50/40")}>
                  <CardHeader className="flex-row items-center justify-between">
                    <div>
                      <CardTitle>Material lot</CardTitle>
                      <p className="text-sm text-fg-muted">Incoming material genealogy</p>
                    </div>
                    {lotFlagged ? (
                      <Badge tone="warning" dot>Flagged lot</Badge>
                    ) : (
                      <Badge tone="success" dot>Released</Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <MetaGrid cols={3}>
                      <LabeledValue label="Material lot" value={c.materialLot} mono />
                      <LabeledValue label="Material" value="Zendura FLX TPU" />
                      <LabeledValue label="Thickness" value={c.thickness} />
                      <LabeledValue label="Supplier" value="Bay Materials (SUP-014)" />
                      <LabeledValue label="CoC received" value={<Badge tone="success" dot>Yes</Badge>} />
                      <LabeledValue label="Received" value={formatDate("2026-07-05")} />
                    </MetaGrid>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lot genealogy</CardTitle>
                    <p className="text-sm text-fg-muted">
                      Other cases produced with{" "}
                      <span className="font-mono font-medium text-fg-secondary">{c.materialLot}</span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    {lotSiblings.length === 0 ? (
                      <EmptyState title="No other cases used this lot" />
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-[var(--border-base)]">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[var(--border-base)] bg-muted-surface text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
                              <th className="px-3 py-2.5">Case ID</th>
                              <th className="px-3 py-2.5">Clinic</th>
                              <th className="px-3 py-2.5">Machine</th>
                              <th className="px-3 py-2.5">QC</th>
                              <th className="px-3 py-2.5">Stage</th>
                              <th className="px-3 py-2.5"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {lotSiblings.map((s) => (
                              <tr key={s.id} className="border-b border-[var(--border-base)] last:border-0">
                                <td className="px-3 py-2.5">
                                  <Link
                                    to="/production/$id"
                                    params={{ id: s.id }}
                                    className="font-mono text-[13px] font-semibold text-brand-600 hover:underline"
                                  >
                                    {s.id}
                                  </Link>
                                </td>
                                <td className="px-3 py-2.5 text-fg-secondary">{s.clinic}</td>
                                <td className="px-3 py-2.5 font-mono text-[12px] text-fg-secondary">{s.machine}</td>
                                <td className="px-3 py-2.5">
                                  <Badge tone={s.qcResult === "Pass" ? "success" : s.qcResult === "Fail" ? "danger" : "warning"}>
                                    {s.qcResult}
                                  </Badge>
                                </td>
                                <td className="px-3 py-2.5"><StatusBadge status={s.stage} /></td>
                                <td className="px-3 py-2.5 text-right">
                                  <Link to="/production/$id" params={{ id: s.id }}>
                                    <ExternalLink className="inline size-3.5 text-fg-muted" />
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {lotFlagged && (
                      <p className="mt-3 text-xs text-amber-700">
                        <AlertTriangle className="mr-1 inline size-3.5" />
                        All cases sharing this lot are under review as part of the active
                        traceability investigation.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Quality Control */}
            <TabsContent value="qc">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>Quality control checklist</CardTitle>
                    <p className="text-sm text-fg-muted">Inspected by Erisa Kola</p>
                  </div>
                  <Badge tone={c.qcResult === "Pass" ? "success" : c.qcResult === "Fail" ? "danger" : "warning"} dot>
                    {c.qcResult}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Dimensional accuracy vs. plan", pass: c.qcResult !== "Fail" },
                    { label: "Edge finishing & trim quality", pass: true },
                    { label: "Surface clarity / no delamination", pass: c.qcResult !== "Fail" },
                    { label: "Fit verification on model", pass: c.qcResult !== "Fail" },
                    { label: "Stage sequence & labelling", pass: true },
                    { label: "Sheet thickness within tolerance", pass: !lotFlagged },
                  ].map((item) => {
                    const failed = c.qcResult === "Pending" ? null : item.pass;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-lg border border-[var(--border-base)] px-3 py-2.5"
                      >
                        <span className="text-sm text-fg-secondary">{item.label}</span>
                        {failed === null ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                            <Clock className="size-4" /> Pending
                          </span>
                        ) : failed ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                            <CheckCircle2 className="size-4" /> Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
                            <XCircle className="size-4" /> Fail
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {c.qcResult === "Fail" && (
                    <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      <AlertTriangle className="mb-1 size-4" />
                      Case failed dimensional inspection — routed to remake. Nonconformity
                      NCR-2026-081 raised.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Packaging */}
            <TabsContent value="packaging">
              <Card>
                <CardHeader>
                  <CardTitle>Packaging & labelling</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetaGrid cols={3}>
                    <LabeledValue label="UDI-DI" value="0764 iClear-AL-24" mono />
                    <LabeledValue label="Label verified" value={<Badge tone={c.stage === "Case Received" || c.stage === "Design" ? "warning" : "success"} dot>{c.stage === "Case Received" || c.stage === "Design" ? "Pending" : "Verified"}</Badge>} />
                    <LabeledValue label="Sealed by" value="Xheni Vata" />
                    <LabeledValue label="Kit contents" value={`${c.aligners} aligners + case`} />
                    <LabeledValue label="IFU version" value="IFU-AL-04" mono />
                    <LabeledValue label="Packaging line" value="PKG-02" mono />
                  </MetaGrid>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Delivery */}
            <TabsContent value="delivery">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Shipment tracking</CardTitle>
                  {c.shipment !== "—" ? (
                    <Badge tone="success" dot>Dispatched</Badge>
                  ) : (
                    <Badge tone="warning" dot>Not yet shipped</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {c.shipment === "—" ? (
                    <EmptyState
                      icon={Truck}
                      title="Awaiting dispatch"
                      description="This case has not yet reached the delivery stage. Tracking details appear once the device is released and packed."
                    />
                  ) : (
                    <>
                      <MetaGrid cols={3}>
                        <LabeledValue label="Tracking number" value={c.shipment} mono />
                        <LabeledValue label="Carrier" value="DHL Express Albania" />
                        <LabeledValue label="Destination" value={c.clinic} />
                        <LabeledValue label="Dispatched" value={formatDate("2026-07-11")} />
                        <LabeledValue label="Service" value="Next-day priority" />
                        <LabeledValue label="Status" value={<Badge tone="success" dot>Delivered</Badge>} />
                      </MetaGrid>
                      <div className="mt-4 rounded-xl border border-[var(--border-base)] bg-muted-surface p-4 text-sm text-fg-secondary">
                        Proof of delivery signed at {c.clinic}. Delivery confirmation linked to the
                        device history record.
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complaints */}
            <TabsContent value="complaints">
              <Card>
                <CardHeader>
                  <CardTitle>Linked complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={CheckCircle2}
                    title="No complaints on file"
                    description="No post-market complaints have been associated with this case. Field reports linked here would trigger the complaint-handling workflow."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Remakes */}
            <TabsContent value="remakes">
              <Card>
                <CardHeader>
                  <CardTitle>Remakes & refinements</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetaGrid cols={3} className="mb-4">
                    <LabeledValue label="Remakes" value={`${c.remakes}`} />
                    <LabeledValue label="Refinements" value={`${c.refinements}`} />
                    <LabeledValue label="Rework cost impact" value={c.remakes > 0 ? "Tracked" : "None"} />
                  </MetaGrid>
                  {c.remakes === 0 && c.refinements === 0 ? (
                    <EmptyState title="No remakes or refinements" description="Produced right-first-time." />
                  ) : (
                    <div className="space-y-2">
                      {c.remakes > 0 && (
                        <div className="flex items-center justify-between rounded-lg border border-[var(--border-base)] px-3 py-2.5">
                          <span className="text-sm text-fg-secondary">Remake — QC dimensional failure</span>
                          <Badge tone="danger" dot>Remake</Badge>
                        </div>
                      )}
                      {Array.from({ length: c.refinements }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--border-base)] px-3 py-2.5">
                          <span className="text-sm text-fg-secondary">Refinement round {i + 1} — mid-treatment adjustment</span>
                          <Badge tone="warning" dot>Refinement</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Trail */}
            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle>Audit trail</CardTitle>
                  <p className="text-sm text-fg-muted">Immutable system event log (21 CFR Part 11)</p>
                </CardHeader>
                <CardContent>
                  <Timeline
                    items={[
                      { title: "DHR record created", time: "2026-07-08 09:12", actor: "System", tone: "neutral", icon: <FileText /> },
                      { title: `Treatment plan ${c.planVersion} committed`, time: "2026-07-08 14:40", actor: c.designOperator, tone: "info" },
                      { title: "Doctor e-signature captured", time: "2026-07-09 16:22", actor: c.doctor, tone: "regulatory", icon: <ShieldCheck /> },
                      { title: `Material lot ${c.materialLot} consumed`, time: "2026-07-10 08:30", actor: c.operator, tone: lotFlagged ? "warning" : "brand", icon: <FlaskConical /> },
                      { title: `QC result recorded: ${c.qcResult}`, time: "2026-07-10 15:10", actor: "Erisa Kola", tone: c.qcResult === "Fail" ? "danger" : "success" },
                      { title: `Release status: ${c.releaseStatus}`, time: "2026-07-11 09:00", actor: "Erisa Kola", tone: "success", icon: <CheckCircle2 /> },
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-base)] bg-muted-surface px-5 py-4">
        <p className="text-sm text-fg-secondary">
          Need the full signed Device History Record for this case?
        </p>
        <div className="flex gap-2">
          <Link to="/production">
            <Button variant="secondary">
              <ArrowLeft className="size-4" /> All cases
            </Button>
          </Link>
          <Button>
            <FileText className="size-4" /> Export DHR (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}

function ParamTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Thermometer;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-3">
      <div className="flex items-center gap-1.5 text-fg-muted">
        <Icon className="size-3.5" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1.5 text-lg font-bold tabular-nums text-fg">{value}</p>
    </div>
  );
}
