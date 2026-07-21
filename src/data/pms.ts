import type { LucideIcon } from "lucide-react";
import {
  MessageSquareWarning,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Truck,
  Stethoscope,
  FileText,
  ClipboardList,
  BookOpen,
  Building2,
  AlertTriangle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Post-Market Surveillance & PMCF — mock dataset (iClear aligners)   */
/* ------------------------------------------------------------------ */

/** Monthly PMS signal trend — normalised rates (per 1000 cases or %). */
export interface PmsTrendPoint {
  month: string;
  complaintRate: number; // complaints per 1000 cases
  remakeRate: number; // % of shipped cases
  refinementRate: number; // % of cases requiring refinement
  seriousIncidentRate: number; // per 1000 cases
}

export const PMS_TREND: PmsTrendPoint[] = [
  { month: "Jan", complaintRate: 8.4, remakeRate: 5.1, refinementRate: 12.8, seriousIncidentRate: 0.09 },
  { month: "Feb", complaintRate: 7.9, remakeRate: 4.6, refinementRate: 12.1, seriousIncidentRate: 0.07 },
  { month: "Mar", complaintRate: 9.1, remakeRate: 5.4, refinementRate: 13.2, seriousIncidentRate: 0.11 },
  { month: "Apr", complaintRate: 7.6, remakeRate: 4.1, refinementRate: 11.4, seriousIncidentRate: 0.05 },
  { month: "May", complaintRate: 7.1, remakeRate: 3.7, refinementRate: 10.9, seriousIncidentRate: 0.06 },
  { month: "Jun", complaintRate: 6.8, remakeRate: 3.3, refinementRate: 10.2, seriousIncidentRate: 0.04 },
  { month: "Jul", complaintRate: 6.9, remakeRate: 3.1, refinementRate: 10.5, seriousIncidentRate: 0.05 },
];

/** Per-product comparison for the bar chart. */
export interface ProductComparisonRow {
  product: string;
  complaintRate: number; // per 1000 cases
  remakeRate: number; // %
}

export const PRODUCT_COMPARISON: ProductComparisonRow[] = [
  { product: "Aligners", complaintRate: 6.4, remakeRate: 3.0 },
  { product: "Hero Kids", complaintRate: 11.2, remakeRate: 5.8 },
  { product: "Night Guard", complaintRate: 4.1, remakeRate: 2.2 },
  { product: "Retainer", complaintRate: 3.6, remakeRate: 1.9 },
  { product: "Pro Clear", complaintRate: 7.8, remakeRate: 4.1 },
];

/** Source-mix donut — where signals originate. */
export interface SourceMixSlice {
  name: string;
  value: number;
}

export const SIGNAL_SOURCE_MIX: SourceMixSlice[] = [
  { name: "Complaints", value: 142 },
  { name: "Remakes", value: 96 },
  { name: "Refinements", value: 78 },
  { name: "Clinical feedback", value: 54 },
  { name: "Distributor reports", value: 31 },
  { name: "Vigilance / literature", value: 12 },
];

/** Top-line metric row. */
export interface PmsMetric {
  key: string;
  label: string;
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
  tone: "brand" | "success" | "warning" | "danger" | "info" | "regulatory";
  delta?: number;
  deltaLabel?: string;
  invert?: boolean;
}

export const PMS_METRICS: PmsMetric[] = [
  { key: "complaint", label: "Complaint rate", value: 6.9, suffix: "/1k", icon: MessageSquareWarning, tone: "warning", delta: -18, deltaLabel: "vs H2 2025", invert: true },
  { key: "remake", label: "Remake rate", value: 3.1, suffix: "%", icon: RotateCcw, tone: "info", delta: -24, deltaLabel: "vs H2 2025", invert: true },
  { key: "refinement", label: "Refinement rate", value: 10.5, suffix: "%", icon: Sparkles, tone: "brand", delta: -12, deltaLabel: "vs H2 2025", invert: true },
  { key: "serious", label: "Serious incident rate", value: 0.05, suffix: "/1k", icon: ShieldAlert, tone: "success", delta: -40, deltaLabel: "no reportable events", invert: true },
  { key: "supplier", label: "Supplier defect rate", value: 1.8, suffix: "%", icon: Truck, tone: "info", delta: 6, deltaLabel: "TPU lot variance", invert: true },
  { key: "feedback", label: "Clinical feedback score", value: 4.5, suffix: "/5", icon: Stethoscope, tone: "success", delta: 3, deltaLabel: "412 clinician responses" },
];

/** PMS signal cards. */
export interface PmsSignal {
  id: string;
  title: string;
  source: string;
  product: string;
  trend: "up" | "down" | "flat";
  changeLabel: string;
  severity: "low" | "medium" | "high";
  status: string;
  statusTone: "neutral" | "brand" | "warning" | "danger" | "info" | "success" | "regulatory";
}

export const PMS_SIGNALS: PmsSignal[] = [
  {
    id: "SIG-2026-041",
    title: "Gingival irritation — rising",
    source: "Complaints + clinical feedback",
    product: "iClear Aligners",
    trend: "up",
    changeLabel: "+34% QoQ",
    severity: "high",
    status: "Under investigation",
    statusTone: "warning",
  },
  {
    id: "SIG-2026-039",
    title: "Tracking issues — Hero Kids",
    source: "Refinement requests",
    product: "iClear Hero Kids",
    trend: "up",
    changeLabel: "+21% QoQ",
    severity: "medium",
    status: "CAPA-2026-031 opened",
    statusTone: "info",
  },
  {
    id: "SIG-2026-036",
    title: "Attachment debonding",
    source: "Distributor reports",
    product: "iClear Pro Clear",
    trend: "up",
    changeLabel: "+9% QoQ",
    severity: "medium",
    status: "Signal confirmed",
    statusTone: "regulatory",
  },
  {
    id: "SIG-2026-034",
    title: "Sharp trim edges",
    source: "Complaints",
    product: "iClear Aligners",
    trend: "down",
    changeLabel: "-27% QoQ",
    severity: "low",
    status: "Trending to close",
    statusTone: "success",
  },
  {
    id: "SIG-2026-030",
    title: "Case fit at delivery",
    source: "Remakes",
    product: "iClear Aligners",
    trend: "down",
    changeLabel: "-15% QoQ",
    severity: "low",
    status: "Monitoring",
    statusTone: "neutral",
  },
  {
    id: "SIG-2026-028",
    title: "Aligner odour / taste",
    source: "Clinical feedback",
    product: "iClear Night Guard",
    trend: "flat",
    changeLabel: "±0% QoQ",
    severity: "low",
    status: "Below signal threshold",
    statusTone: "neutral",
  },
];

/** Emerging risk alerts. */
export interface EmergingRisk {
  id: string;
  title: string;
  detail: string;
  level: "amber" | "red";
  linkedRisk: string;
  owner: string;
}

export const EMERGING_RISKS: EmergingRisk[] = [
  {
    id: "ER-2026-007",
    title: "Gingival irritation cluster — 0.4 mm material lot",
    detail:
      "12 complaints of soft-tissue irritation traced to TPU lot LOT-TPU-2026-0718. Rate exceeds the PMS signal threshold (>8/1000). Benefit-risk re-assessment initiated under ISO 14971.",
    level: "red",
    linkedRisk: "RSK-018",
    owner: "Anila Berisha",
  },
  {
    id: "ER-2026-006",
    title: "Hero Kids tracking loss above forecast",
    detail:
      "Refinement rate for the paediatric line reached 18% vs a 12% planned threshold. Possible under-retention of attachments in mixed dentition. PMCF question raised.",
    level: "amber",
    linkedRisk: "RSK-021",
    owner: "Blerim Krasniqi",
  },
];

/** Literature review tracker rows. */
export interface LiteratureItem {
  id: string;
  title: string;
  database: string;
  relevance: "high" | "medium" | "low";
  status: "Screened" | "Appraised" | "Included" | "Excluded" | "Pending";
  reviewer: string;
  date: string;
}

export const LITERATURE_ITEMS: LiteratureItem[] = [
  { id: "LIT-2026-058", title: "Periodontal response to thermoformed PET-G aligners", database: "PubMed", relevance: "high", status: "Included", reviewer: "Dr. Rea Hoxha", date: "2026-07-09" },
  { id: "LIT-2026-057", title: "Attachment retention in paediatric clear aligner therapy", database: "Embase", relevance: "high", status: "Appraised", reviewer: "Dr. Rea Hoxha", date: "2026-07-12" },
  { id: "LIT-2026-055", title: "Cytotoxicity of aligner thermoplastics — systematic review", database: "Cochrane", relevance: "medium", status: "Screened", reviewer: "Anila Berisha", date: "2026-07-15" },
  { id: "LIT-2026-053", title: "Enamel demineralisation during aligner wear", database: "Scopus", relevance: "medium", status: "Pending", reviewer: "Unassigned", date: "2026-07-18" },
  { id: "LIT-2026-051", title: "Aligner-related soft-tissue trauma: case series", database: "PubMed", relevance: "high", status: "Included", reviewer: "Dr. Rea Hoxha", date: "2026-07-04" },
];

/** PMCF study tracker rows. */
export interface PmcfStudy {
  id: string;
  title: string;
  product: string;
  design: string;
  status: "Planned" | "Recruiting" | "Ongoing" | "Analysis" | "Reporting" | "Complete";
  progress: number;
  enrolled: number;
  target: number;
  lead: string;
  nextMilestone: string;
  due: string;
}

export const PMCF_STUDIES: PmcfStudy[] = [
  {
    id: "PMCF-2026-01",
    title: "Long-term periodontal safety of iClear Aligners",
    product: "iClear Aligners",
    design: "Prospective cohort · 18 clinics",
    status: "Ongoing",
    progress: 62,
    enrolled: 248,
    target: 400,
    lead: "Dr. Rea Hoxha",
    nextMilestone: "12-month interim analysis",
    due: "2026-09-15",
  },
  {
    id: "PMCF-2026-02",
    title: "Paediatric tracking & compliance (Hero Kids)",
    product: "iClear Hero Kids",
    design: "Multi-centre registry",
    status: "Recruiting",
    progress: 34,
    enrolled: 86,
    target: 250,
    lead: "Blerim Krasniqi",
    nextMilestone: "Recruitment gate review",
    due: "2026-08-05",
  },
  {
    id: "PMCF-2026-03",
    title: "Attachment survival — Pro Clear system",
    product: "iClear Pro Clear",
    design: "Prospective single-arm",
    status: "Analysis",
    progress: 88,
    enrolled: 180,
    target: 180,
    lead: "Dr. Rea Hoxha",
    nextMilestone: "Draft PMCF evaluation report",
    due: "2026-07-30",
  },
  {
    id: "PMCF-2026-04",
    title: "Retainer wear survey (PROMs)",
    product: "iClear Retainer",
    design: "Patient-reported outcomes survey",
    status: "Planned",
    progress: 8,
    enrolled: 0,
    target: 300,
    lead: "Anila Berisha",
    nextMilestone: "Protocol ethics approval",
    due: "2026-08-20",
  },
];

/** PSUR preparation checklist. */
export interface PsurTask {
  id: string;
  task: string;
  owner: string;
  status: "Complete" | "In progress" | "Not started" | "Blocked";
  due: string;
}

export const PSUR_TASKS: PsurTask[] = [
  { id: "PSUR-01", task: "Consolidate complaint & vigilance data", owner: "Anila Berisha", status: "Complete", due: "2026-07-10" },
  { id: "PSUR-02", task: "Update sales volumes & denominator", owner: "Ledion Meta", status: "Complete", due: "2026-07-12" },
  { id: "PSUR-03", task: "Signal & trend analysis summary", owner: "Anila Berisha", status: "In progress", due: "2026-07-24" },
  { id: "PSUR-04", task: "Refresh benefit-risk determination", owner: "Dr. Rea Hoxha", status: "In progress", due: "2026-07-28" },
  { id: "PSUR-05", task: "Integrate PMCF interim findings", owner: "Dr. Rea Hoxha", status: "Not started", due: "2026-08-04" },
  { id: "PSUR-06", task: "CAPA effectiveness cross-reference", owner: "Blerim Krasniqi", status: "Blocked", due: "2026-08-01" },
  { id: "PSUR-07", task: "Notified Body submission package", owner: "Edison Shimaj", status: "Not started", due: "2026-08-12" },
];

/** PMS data-source hub-and-spoke nodes. */
export interface PmsSourceNode {
  label: string;
  icon: LucideIcon;
  count: string;
  tone: "brand" | "warning" | "danger" | "info" | "regulatory" | "success" | "neutral";
}

export const PMS_SOURCE_NODES: PmsSourceNode[] = [
  { label: "Complaints", icon: MessageSquareWarning, count: "142 cases", tone: "warning" },
  { label: "Nonconformities", icon: AlertTriangle, count: "38 open", tone: "danger" },
  { label: "CAPA", icon: ClipboardList, count: "9 linked", tone: "brand" },
  { label: "Remakes", icon: RotateCcw, count: "3.1%", tone: "info" },
  { label: "Refinements", icon: Sparkles, count: "10.5%", tone: "brand" },
  { label: "Clinical feedback", icon: Stethoscope, count: "412 forms", tone: "success" },
  { label: "Literature", icon: BookOpen, count: "58 records", tone: "regulatory" },
  { label: "Distributors", icon: Building2, count: "14 markets", tone: "info" },
  { label: "Suppliers", icon: Truck, count: "6 audited", tone: "neutral" },
  { label: "Vigilance", icon: FileText, count: "0 reportable", tone: "success" },
];

/* Filter option sets (mock, non-functional). */
export const PMS_FILTERS = {
  product: ["All products", "iClear Aligners", "iClear Hero Kids", "iClear Night Guard", "iClear Retainer", "iClear Pro Clear"],
  country: ["All countries", "Albania", "Kosovo", "Italy", "Germany", "North Macedonia", "Greece"],
  clinic: ["All clinics", "Tirana Central", "Prishtina Ortho", "Milano Dental", "Berlin Kieferorthopädie", "Skopje Smile"],
  period: ["Last 6 months", "Last 12 months", "Q2 2026", "YTD 2026", "Rolling 24 months"],
  ageGroup: ["All ages", "Under 12", "12–17", "18–34", "35–54", "55+"],
  material: ["All materials", "PET-G 0.5 mm", "PET-G 0.75 mm", "TPU 0.4 mm", "TPU 0.6 mm", "Multi-layer 0.75 mm"],
  thickness: ["All thicknesses", "0.4 mm", "0.5 mm", "0.6 mm", "0.75 mm"],
  line: ["All lines", "Line A — Tirana", "Line B — Tirana", "Line C — Prishtina"],
};

/* Icon aliases re-exported for the page. */
export { FlaskConical, Activity, BookOpen, ClipboardList };
