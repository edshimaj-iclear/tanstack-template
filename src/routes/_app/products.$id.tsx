import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  ScanLine,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Stethoscope,
  Activity as ActivityIcon,
  FlaskConical,
  Tag,
  Layers,
  ClipboardList,
  CheckCircle2,
  CircleDashed,
  AlertTriangle,
  Building2,
  BadgeCheck,
  History,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { ApprovalStepper } from "../../components/qms/ApprovalStepper";
import { ProgressRing } from "../../components/qms/ProgressRing";
import { StatusBadge, RiskBadge } from "../../components/qms/StatusBadge";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Timeline } from "../../components/qms/Timeline";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Avatar } from "../../components/ui/misc";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { PRODUCTS, LIFECYCLE_STAGES } from "../../data/products";
import { RISKS } from "../../data/risks";
import type { Product } from "../../types";
import { formatDate } from "../../lib/utils";

export const Route = createFileRoute("/_app/products/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const product = PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

  const currentIdx = LIFECYCLE_STAGES.indexOf(product.lifecycle);
  const steps = LIFECYCLE_STAGES.map((stage, i) => ({
    label: stage,
    state: (i < currentIdx ? "done" : i === currentIdx ? "current" : "upcoming") as
      | "done"
      | "current"
      | "upcoming",
  }));

  return (
    <div className="space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Back to products
      </Link>

      {/* Product header block */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 grid-dots opacity-[0.12]" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Package className="size-7" />
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <Badge tone={product.audience === "Pediatric" ? "regulatory" : "brand"}>
                  {product.audience}
                </Badge>
                <Badge tone="outline">{product.deviceClass}</Badge>
                <StatusBadge status={product.status} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-fg">{product.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                <span className="text-fg-muted">
                  Internal code{" "}
                  <span className="font-mono font-medium text-fg-secondary">{product.code}</span>
                </span>
                <span className="text-fg-muted">
                  Basic UDI-DI{" "}
                  <span className="font-mono font-medium text-fg-secondary">
                    {product.basicUdiDi}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l border-[var(--border-base)] pl-6">
              <Avatar name={product.responsible} size="md" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                  Responsible person
                </p>
                <p className="text-sm font-medium text-fg">{product.responsible}</p>
                <p className="text-xs text-fg-muted">PRRC · Art. 15 MDR</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing value={product.completion} size={104} strokeWidth={9} />
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                File complete
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Lifecycle tracker */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Product lifecycle</CardTitle>
            <p className="text-sm text-fg-muted">
              Design &amp; development stage per the DHF — currently in{" "}
              <span className="font-medium text-fg-secondary">{product.lifecycle}</span>
            </p>
          </div>
          <Badge tone="brand" dot>
            {product.lifecycle}
          </Badge>
        </CardHeader>
        <CardContent>
          <ApprovalStepper steps={steps} />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          <TabsTrigger value="purpose">Intended Purpose</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="techdoc">Technical Documentation</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="clinical">Clinical</TabsTrigger>
          <TabsTrigger value="pms">PMS</TabsTrigger>
          <TabsTrigger value="labelling">Labelling</TabsTrigger>
          <TabsTrigger value="changes">Change History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab product={product} />
        </TabsContent>
        <TabsContent value="regulatory">
          <RegulatoryTab product={product} />
        </TabsContent>
        <TabsContent value="purpose">
          <PurposeTab product={product} />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialsTab />
        </TabsContent>
        <TabsContent value="classification">
          <ClassificationTab product={product} />
        </TabsContent>
        <TabsContent value="techdoc">
          <TechDocTab product={product} />
        </TabsContent>
        <TabsContent value="risk">
          <RiskTab product={product} />
        </TabsContent>
        <TabsContent value="clinical">
          <ClinicalTab product={product} />
        </TabsContent>
        <TabsContent value="pms">
          <PmsTab product={product} />
        </TabsContent>
        <TabsContent value="labelling">
          <LabellingTab product={product} />
        </TabsContent>
        <TabsContent value="changes">
          <ChangeHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Reusable primitives ---------- */

function Panel({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: typeof Package;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-brand-600" />}
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function MetricStat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
}) {
  const toneText: Record<string, string> = {
    neutral: "text-fg",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-red-600",
    brand: "text-brand-600",
  };
  return (
    <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${toneText[tone]}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}

function ComplianceBar({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Package }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium text-fg-secondary">
          <Icon className="size-3.5 text-fg-muted" /> {label}
        </span>
        <span className="font-semibold tabular-nums text-fg">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function SoftLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
    >
      {children} <ArrowRight className="size-3.5" />
    </Link>
  );
}

/* ---------- Tabs ---------- */

function OverviewTab({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel title="Device summary" icon={ClipboardList} className="lg:col-span-2">
        <MetaGrid cols={3}>
          <LabeledValue label="Internal code" value={product.code} mono />
          <LabeledValue label="Device class" value={product.deviceClass} />
          <LabeledValue label="Target audience" value={product.audience} />
          <LabeledValue label="Lifecycle stage" value={product.lifecycle} />
          <LabeledValue label="Regulatory status" value={<StatusBadge status={product.status} />} />
          <LabeledValue label="UDI status" value={<Badge tone="info">{product.udiStatus}</Badge>} />
          <LabeledValue label="Basic UDI-DI" value={product.basicUdiDi} mono />
          <LabeledValue label="Responsible (PRRC)" value={product.responsible} />
          <LabeledValue label="Last design review" value={formatDate(product.lastReview)} />
        </MetaGrid>
        <div className="mt-5 rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
            Intended use
          </p>
          <p className="mt-1 text-sm text-fg-secondary">{product.intendedUse}</p>
        </div>
      </Panel>

      <Panel title="Compliance readiness" icon={ShieldCheck}>
        <div className="space-y-4">
          <ComplianceBar label="Technical documentation" value={product.techDoc} icon={FileText} />
          <ComplianceBar label="Risk management" value={product.riskStatus} icon={ShieldAlert} />
          <ComplianceBar label="Clinical evaluation" value={product.clinical} icon={Stethoscope} />
          <ComplianceBar label="Post-market surveillance" value={product.pms} icon={ActivityIcon} />
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-brand-50 p-3">
          <ProgressRing value={product.completion} size={56} strokeWidth={6} animate={false} />
          <p className="text-sm text-brand-800">
            Overall technical file is <strong>{product.completion}%</strong> complete against the MDR
            Annex II/III structure.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function RegulatoryTab({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel title="Regulatory identity" icon={BadgeCheck} className="lg:col-span-2">
        <MetaGrid cols={3}>
          <LabeledValue label="Regulation" value="EU MDR 2017/745" />
          <LabeledValue label="Conformity route" value="Annex IX, Ch. I + III" />
          <LabeledValue label="Notified Body" value="TÜV SÜD (0123)" />
          <LabeledValue label="CE certificate" value="G1 24 05 12345 678" mono />
          <LabeledValue
            label="Certificate validity"
            value={<span className="text-emerald-600">Valid → 26 May 2029</span>}
          />
          <LabeledValue label="SRN" value="AL-MF-000012345" mono />
          <LabeledValue label="Basic UDI-DI" value={product.basicUdiDi} mono />
          <LabeledValue
            label="Declaration of Conformity"
            value={<Badge tone="success">Signed · v3.1</Badge>}
          />
          <LabeledValue label="EUDAMED registration" value={<Badge tone="info">Submitted</Badge>} />
        </MetaGrid>
      </Panel>

      <Panel title="GSPR checklist" icon={ShieldCheck} action={<Badge tone="brand">Annex I</Badge>}>
        <div className="space-y-3">
          {[
            { label: "General requirements (1–9)", v: 100 },
            { label: "Design & manufacture (10–22)", v: 92 },
            { label: "Information supplied (23)", v: 88 },
          ].map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-fg-secondary">{r.label}</span>
                <span className="font-semibold tabular-nums text-fg">{r.v}%</span>
              </div>
              <Progress value={r.v} size="sm" />
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="size-4 shrink-0" /> 156 of 168 applicable requirements have linked
            evidence.
          </div>
        </div>
      </Panel>
    </div>
  );
}

function PurposeTab({ product }: { product: Product }) {
  const pediatric = product.audience === "Pediatric";
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel title="Intended purpose statement" icon={ClipboardList} className="lg:col-span-3">
        <p className="text-sm leading-relaxed text-fg-secondary">{product.intendedUse}</p>
        <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
          The device is a patient-matched, non-active, removable orthodontic appliance manufactured
          by thermoforming a biocompatible polymer sheet over a digitally designed dental model. It is
          used under the supervision of a qualified dental professional as part of a defined treatment
          plan.
        </p>
      </Panel>

      <Panel title="Indications" icon={CheckCircle2}>
        <ul className="space-y-2 text-sm text-fg-secondary">
          {[
            "Malocclusion requiring orthodontic correction",
            "Crowding and spacing of mild to moderate severity",
            "Post-treatment retention of achieved tooth position",
          ].map((i) => (
            <li key={i} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" /> {i}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Contraindications" icon={AlertTriangle}>
        <ul className="space-y-2 text-sm text-fg-secondary">
          {[
            "Active periodontal disease or untreated caries",
            "Severe skeletal discrepancy requiring surgery",
            "Known hypersensitivity to device materials",
          ].map((i) => (
            <li key={i} className="flex gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" /> {i}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Population & users" icon={Stethoscope}>
        <MetaGrid cols={2}>
          <LabeledValue
            label="Patient population"
            value={pediatric ? "Children, mixed dentition (6–12 yrs)" : "Adults (18+ yrs)"}
          />
          <LabeledValue label="Intended user" value="Dental professional + patient" />
          <LabeledValue label="Use environment" value="Clinic & home" />
          <LabeledValue label="Duration of use" value="Long-term (> 30 days)" />
          <LabeledValue label="Part of body" value="Oral cavity / dentition" />
          <LabeledValue label="Single use" value="Patient-matched, reusable set" />
        </MetaGrid>
        <div className="mt-4 rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
          <strong>Clinical benefit:</strong> effective, aesthetic and predictable tooth alignment with
          reduced chair-time versus fixed appliances.
        </div>
      </Panel>
    </div>
  );
}

const MATERIALS = [
  {
    name: "Zendura FLX",
    spec: "Multilayer TPU / co-polyester",
    supplier: "Bay Materials (SUP-014)",
    thickness: "0.76 mm",
    tests: "ISO 10993-5, -10, -11",
    status: "Pass",
  },
  {
    name: "Essix ACE",
    spec: "Co-polyester (PETG blend)",
    supplier: "Dentsply Sirona",
    thickness: "0.75 mm",
    tests: "ISO 10993-5, -10",
    status: "Pass",
  },
  {
    name: "Duran+",
    spec: "PET-G thermoplastic",
    supplier: "Scheu-Dental",
    thickness: "0.625 mm",
    tests: "ISO 10993-5, -10",
    status: "Pass",
  },
  {
    name: "Bonding attachment resin",
    spec: "Light-cure composite (auxiliary)",
    supplier: "3M Oral Care",
    thickness: "—",
    tests: "ISO 10993-5",
    status: "Monitor",
  },
];

function MaterialsTab() {
  return (
    <Panel title="Materials & biocompatibility" icon={FlaskConical} action={<Badge tone="brand">ISO 10993-1</Badge>}>
      <div className="-mx-1 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border-base)] text-left text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              <th className="px-2 py-2.5">Material</th>
              <th className="px-2 py-2.5">Specification</th>
              <th className="px-2 py-2.5">Supplier</th>
              <th className="px-2 py-2.5">Thickness</th>
              <th className="px-2 py-2.5">Biocompatibility</th>
              <th className="px-2 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {MATERIALS.map((m) => (
              <tr
                key={m.name}
                className="border-b border-[var(--border-base)] last:border-0 hover:bg-subtle"
              >
                <td className="px-2 py-3 font-medium text-fg">{m.name}</td>
                <td className="px-2 py-3 text-fg-secondary">{m.spec}</td>
                <td className="px-2 py-3 text-fg-secondary">{m.supplier}</td>
                <td className="px-2 py-3 font-mono text-[13px] text-fg-secondary">{m.thickness}</td>
                <td className="px-2 py-3 font-mono text-[12px] text-fg-muted">{m.tests}</td>
                <td className="px-2 py-3">
                  <Badge tone={m.status === "Pass" ? "success" : "warning"} dot>
                    {m.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
        <CheckCircle2 className="size-4 shrink-0" /> Biological evaluation per ISO 10993-1 complete;
        chemical characterization (ISO 10993-18) on file. Contact type: surface-contacting mucosal
        membrane, prolonged (24 h – 30 d).
      </div>
    </Panel>
  );
}

function ClassificationTab({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel title="Classification rationale" icon={Layers} className="lg:col-span-2">
        <MetaGrid cols={3} className="mb-5">
          <LabeledValue label="Regulation" value="MDR Annex VIII" />
          <LabeledValue label="Applicable rule" value="Rule 5" />
          <LabeledValue
            label="Resulting class"
            value={<Badge tone="regulatory">{product.deviceClass}</Badge>}
          />
        </MetaGrid>
        <div className="space-y-3 text-sm leading-relaxed text-fg-secondary">
          <p>
            The device is <strong>invasive with respect to a body orifice</strong> (the oral cavity),
            other than surgically invasive, and is intended to be used in the mouth beyond the
            pharynx. It is not intended for connection to an active device.
          </p>
          <p>
            Under <strong>Rule 5, MDR Annex VIII</strong>, such a device intended for use for a period
            of <strong>more than 30 days (long-term)</strong> is classified as{" "}
            <strong>Class IIa</strong>. Treatment sequences typically span 6–18 months of continuous
            wear, placing the device firmly in the long-term category.
          </p>
        </div>
      </Panel>

      <Panel title="Classification checks" icon={ClipboardList}>
        <ul className="space-y-3 text-sm">
          {[
            { label: "Non-active device", ok: true },
            { label: "Invasive (body orifice)", ok: true },
            { label: "Not surgically invasive", ok: true },
            { label: "Long-term use (> 30 d)", ok: true },
            { label: "No medicinal substance", ok: true },
          ].map((c) => (
            <li key={c.label} className="flex items-center justify-between">
              <span className="text-fg-secondary">{c.label}</span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-fg-muted">
          Classification reviewed and signed off by Regulatory Affairs. Rule application documented in
          the technical file (Annex II §1.1).
        </p>
      </Panel>
    </div>
  );
}

const TECHDOC_SECTIONS = [
  { name: "Device description & specification", annex: "Annex II §1", v: 96 },
  { name: "Information supplied by manufacturer", annex: "Annex II §2", v: 90 },
  { name: "Design & manufacturing information", annex: "Annex II §3", v: 88 },
  { name: "GSPR conformity (Annex I)", annex: "Annex II §4", v: 92 },
  { name: "Benefit-risk & risk management", annex: "Annex II §5", v: 85 },
  { name: "Product verification & validation", annex: "Annex II §6", v: 80 },
];

function TechDocTab({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel
        title="Technical file sections"
        icon={FileText}
        className="lg:col-span-2"
        action={<SoftLink to="/technical-documentation">Open technical file</SoftLink>}
      >
        <div className="space-y-4">
          {TECHDOC_SECTIONS.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium text-fg-secondary">{s.name}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <Badge tone="neutral" className="font-mono text-[10px]">
                    {s.annex}
                  </Badge>
                  <span className="font-semibold tabular-nums text-fg">{s.v}%</span>
                </span>
              </div>
              <Progress value={s.v} size="sm" />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="File status" icon={ShieldCheck}>
        <div className="flex flex-col items-center py-2">
          <ProgressRing value={product.techDoc} size={128} strokeWidth={11} label="Complete" />
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Format</span>
            <span className="font-medium text-fg">STED / IMDRF ToC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Last compiled</span>
            <span className="font-medium text-fg">{formatDate(product.lastReview)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Open evidence gaps</span>
            <Badge tone="warning">3</Badge>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function RiskTab({ product }: { product: Product }) {
  const productRisks = RISKS.filter((r) => r.product === product.name)
    .sort((a, b) => b.initialRisk - a.initialRisk)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel
        title="Top risks"
        icon={ShieldAlert}
        className="lg:col-span-2"
        action={<SoftLink to="/risk">Risk register</SoftLink>}
      >
        {productRisks.length > 0 ? (
          <div className="space-y-2">
            {productRisks.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--border-base)] p-3"
              >
                <span className="font-mono text-[12px] font-semibold text-brand-600">{r.id}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{r.hazard}</p>
                  <p className="truncate text-xs text-fg-muted">{r.harm}</p>
                </div>
                <RiskBadge score={r.initialRisk} showScore={false} />
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-fg-muted">
            No product-specific hazards recorded yet — inherited from the platform risk file.
          </p>
        )}
      </Panel>

      <Panel title="Risk management" icon={ShieldCheck}>
        <div className="flex flex-col items-center py-2">
          <ProgressRing value={product.riskStatus} size={120} strokeWidth={10} label="Controlled" />
        </div>
        <MetaGrid cols={2} className="mt-4">
          <LabeledValue label="Standard" value="ISO 14971:2019" />
          <LabeledValue label="RMF version" value="v4.2" mono />
          <LabeledValue label="Benefit-risk" value={<Badge tone="success">Favourable</Badge>} />
          <LabeledValue label="Residual" value={<Badge tone="success">Acceptable</Badge>} />
        </MetaGrid>
      </Panel>
    </div>
  );
}

function ClinicalTab({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel title="Clinical evaluation report" icon={Stethoscope} className="lg:col-span-2">
        <MetaGrid cols={3}>
          <LabeledValue label="CER version" value="v3.0" mono />
          <LabeledValue label="Route" value="Equivalence + PMCF" />
          <LabeledValue label="Standard" value="MEDDEV 2.7/1 rev 4" />
          <LabeledValue label="Last update" value={formatDate(product.lastReview)} />
          <LabeledValue label="Next review" value="Q2 2027" />
          <LabeledValue label="Status" value={<StatusBadge status={product.status} />} />
        </MetaGrid>
        <div className="mt-5 space-y-3">
          <ComplianceBar label="Literature review & appraisal" value={Math.min(100, product.clinical + 6)} icon={FileText} />
          <ComplianceBar label="Clinical data analysis" value={product.clinical} icon={ActivityIcon} />
          <ComplianceBar label="PMCF plan execution" value={Math.max(0, product.clinical - 12)} icon={Stethoscope} />
        </div>
      </Panel>

      <Panel title="Clinical readiness" icon={ShieldCheck}>
        <div className="flex flex-col items-center py-2">
          <ProgressRing value={product.clinical} size={128} strokeWidth={11} label="Evaluated" />
        </div>
        <div className="mt-4 rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
          Sufficient clinical evidence demonstrates conformity with the relevant GSPRs. PMCF ongoing to
          confirm long-term safety and performance.
        </div>
      </Panel>
    </div>
  );
}

function PmsTab({ product }: { product: Product }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricStat label="Complaint rate" value="0.42%" hint="per units shipped · 12mo" tone="success" />
        <MetricStat label="Remake rate" value="3.1%" hint="vs 3.6% target" tone="success" />
        <MetricStat label="Refinement rate" value="9.4%" hint="cases requiring refinement" tone="warning" />
        <MetricStat label="Serious incidents" value="0" hint="reportable · 12mo" tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Post-market surveillance" icon={ActivityIcon} className="lg:col-span-2" action={<SoftLink to="/pms">PMS module</SoftLink>}>
          <MetaGrid cols={3}>
            <LabeledValue label="PMS plan" value={<Badge tone="success">Active · v2.3</Badge>} />
            <LabeledValue label="PSUR" value="Due Mar 2027" />
            <LabeledValue label="PMCF plan" value={<Badge tone="info">Ongoing</Badge>} />
            <LabeledValue label="Trend reporting" value="Monthly" />
            <LabeledValue label="Vigilance cases" value="0 open" />
            <LabeledValue label="Field actions" value="None" />
          </MetaGrid>
        </Panel>

        <Panel title="PMS readiness" icon={ShieldCheck}>
          <div className="flex flex-col items-center py-2">
            <ProgressRing value={product.pms} size={120} strokeWidth={10} label="Coverage" />
          </div>
          <p className="mt-3 text-center text-xs text-fg-muted">
            Feedback loop closes into Risk &amp; CAPA. No adverse trend detected in the current period.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function LabellingTab({ product }: { product: Product }) {
  const symbols = [
    { sym: "MD", meaning: "Medical device" },
    { sym: "UDI", meaning: "Unique Device Identifier" },
    { sym: "i", meaning: "Consult instructions for use" },
    { sym: "REF", meaning: "Catalogue number" },
    { sym: "LOT", meaning: "Batch code" },
    { sym: "🏭", meaning: "Manufacturer" },
  ];
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel title="Labelling & UDI" icon={Tag} className="lg:col-span-2">
        <MetaGrid cols={3}>
          <LabeledValue label="Basic UDI-DI" value={product.basicUdiDi} mono />
          <LabeledValue label="UDI-DI (primary)" value="05099872010ABCD" mono />
          <LabeledValue label="UDI-PI structure" value="(11)YYMMDD (10)LOT" mono />
          <LabeledValue label="Carrier" value="GS1 DataMatrix" />
          <LabeledValue label="IFU version" value="IFU-ALG v5" mono />
          <LabeledValue label="Label approval" value={<Badge tone="success">Approved</Badge>} />
        </MetaGrid>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
          <ScanLine className="size-4 shrink-0" /> UDI status:{" "}
          <strong>{product.udiStatus}</strong> — assigned per GS1 and reflected in EUDAMED UDI module.
        </div>
      </Panel>

      <Panel title="Symbols (ISO 15223-1)" icon={ScanLine}>
        <ul className="space-y-2 text-sm">
          {symbols.map((s) => (
            <li key={s.sym} className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-base)] bg-subtle font-mono text-xs font-semibold text-fg">
                {s.sym}
              </span>
              <span className="text-fg-secondary">{s.meaning}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

const CHANGE_HISTORY = [
  {
    title: "Technical documentation recompiled",
    time: "14 May 2026",
    description: "Annex II file regenerated after biocompatibility data refresh (ISO 10993-18).",
    actor: "Genti Hoxha",
    tone: "brand" as const,
    icon: <FileText className="size-3" />,
  },
  {
    title: "ECO-2026-031 · Material second-source added",
    time: "22 Mar 2026",
    description: "Essix ACE qualified as alternate thermoforming sheet; DHF and RMF updated.",
    actor: "Anila Berisha",
    tone: "info" as const,
    icon: <Layers className="size-3" />,
  },
  {
    title: "CER v3.0 approved",
    time: "18 Feb 2026",
    description: "Clinical evaluation report updated with 12-month PMCF survey results.",
    actor: "Dr. Klaudia Meta",
    tone: "success" as const,
    icon: <Stethoscope className="size-3" />,
  },
  {
    title: "Design freeze · v2 geometry",
    time: "05 Nov 2025",
    description: "Trim-line and attachment library revised following DV testing.",
    actor: "Fatjon Rama",
    tone: "regulatory" as const,
    icon: <Layers className="size-3" />,
  },
  {
    title: "CE certificate renewed",
    time: "26 May 2024",
    description: "Notified Body TÜV SÜD (0123) recertification under MDR.",
    actor: "Genti Hoxha",
    tone: "brand" as const,
    icon: <BadgeCheck className="size-3" />,
  },
];

function ChangeHistoryTab() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel title="Change history" icon={History} className="lg:col-span-2">
        <Timeline items={CHANGE_HISTORY} />
      </Panel>
      <Panel title="Version control" icon={ClipboardList}>
        <MetaGrid cols={2}>
          <LabeledValue label="Current version" value="v3.1" mono />
          <LabeledValue label="DHF status" value={<Badge tone="success">Current</Badge>} />
          <LabeledValue label="Open change orders" value="1 (ECO-2026-031)" />
          <LabeledValue label="Change control" value="SOP-QMS-012" mono />
        </MetaGrid>
        <div className="mt-4 space-y-2 text-sm text-fg-secondary">
          <div className="flex items-center gap-2">
            <CircleDashed className="size-4 text-amber-500" /> 1 change in progress
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" /> 8 changes closed this year
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-fg-muted" /> Notified Body notified where required
          </div>
        </div>
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
        >
          Download DHF index <ExternalLink className="size-3.5" />
        </a>
      </Panel>
    </div>
  );
}
