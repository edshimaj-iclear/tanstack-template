import {
  Activity,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  MessageSquareWarning,
  Radar,
  BookMarked,
  Truck,
  GraduationCap,
  ClipboardList,
  ShieldAlert,
  Factory,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Report Center                                                      */
/* ------------------------------------------------------------------ */

export type ReportStatus = "Draft" | "Final" | "Scheduled";
export type ReportFormat = "PDF" | "Excel" | "Word";
export type ReportCategory =
  | "Quality"
  | "Regulatory"
  | "Post-Market"
  | "Production"
  | "Supplier"
  | "Training";

export interface ReportCard {
  id: string;
  type: string;
  title: string;
  description: string;
  category: ReportCategory;
  period: string;
  owner: string;
  status: ReportStatus;
  lastGenerated: string;
  formats: ReportFormat[];
  icon: LucideIcon;
  tone: "brand" | "success" | "warning" | "danger" | "info" | "regulatory";
  pages: number;
}

export const REPORT_CATEGORIES: ReportCategory[] = [
  "Quality",
  "Regulatory",
  "Post-Market",
  "Production",
  "Supplier",
  "Training",
];

export const REPORTS: ReportCard[] = [
  {
    id: "REP-QMS-2026-07",
    type: "QMS Health",
    title: "QMS Health Report",
    description: "Consolidated quality-system health index across all modules.",
    category: "Quality",
    period: "Q3 2026",
    owner: "Anila Berisha",
    status: "Final",
    lastGenerated: "2026-07-18",
    formats: ["PDF", "Excel"],
    icon: Activity,
    tone: "brand",
    pages: 24,
  },
  {
    id: "REP-MDR-2026-07",
    type: "Regulatory",
    title: "MDR Readiness Report",
    description: "EU MDR 2017/745 conformity gap and readiness assessment.",
    category: "Regulatory",
    period: "Q3 2026",
    owner: "Genti Hoxha",
    status: "Draft",
    lastGenerated: "2026-07-15",
    formats: ["PDF", "Word"],
    icon: ShieldCheck,
    tone: "regulatory",
    pages: 41,
  },
  {
    id: "REP-TDG-2026-07",
    type: "Technical File",
    title: "Technical Documentation Gap Report",
    description: "Annex II/III completeness gaps per device family.",
    category: "Regulatory",
    period: "Q3 2026",
    owner: "Marsela Doda",
    status: "Draft",
    lastGenerated: "2026-07-12",
    formats: ["PDF", "Excel"],
    icon: FileText,
    tone: "warning",
    pages: 18,
  },
  {
    id: "REP-CAPA-2026-07",
    type: "CAPA",
    title: "CAPA Report",
    description: "Corrective & preventive action status, ageing and effectiveness.",
    category: "Quality",
    period: "Jul 2026",
    owner: "Anila Berisha",
    status: "Final",
    lastGenerated: "2026-07-19",
    formats: ["PDF", "Excel"],
    icon: ClipboardCheck,
    tone: "brand",
    pages: 16,
  },
  {
    id: "REP-CMP-2026-Q2",
    type: "Complaints",
    title: "Complaint Trend Report",
    description: "Complaint categories, rates per 10k devices and signals.",
    category: "Post-Market",
    period: "Q2 2026",
    owner: "Erisa Kola",
    status: "Final",
    lastGenerated: "2026-07-08",
    formats: ["PDF", "Excel"],
    icon: MessageSquareWarning,
    tone: "warning",
    pages: 22,
  },
  {
    id: "REP-PMS-2026-H1",
    type: "Post-Market",
    title: "PMS Report",
    description: "Post-market surveillance summary for Class IIa aligner range.",
    category: "Post-Market",
    period: "H1 2026",
    owner: "Genti Hoxha",
    status: "Draft",
    lastGenerated: "2026-07-14",
    formats: ["PDF", "Word"],
    icon: Radar,
    tone: "info",
    pages: 33,
  },
  {
    id: "REP-PSUR-2026",
    type: "PSUR",
    title: "PSUR Draft",
    description: "Periodic Safety Update Report — benefit-risk conclusion.",
    category: "Regulatory",
    period: "2025–2026",
    owner: "Dr. Klaudia Meta",
    status: "Draft",
    lastGenerated: "2026-07-10",
    formats: ["PDF", "Word"],
    icon: BookMarked,
    tone: "regulatory",
    pages: 47,
  },
  {
    id: "REP-SUP-2026-Q2",
    type: "Supplier",
    title: "Supplier Performance Report",
    description: "Scorecards, SCAR ageing and re-qualification status.",
    category: "Supplier",
    period: "Q2 2026",
    owner: "Xheni Vata",
    status: "Final",
    lastGenerated: "2026-07-06",
    formats: ["PDF", "Excel"],
    icon: Truck,
    tone: "info",
    pages: 19,
  },
  {
    id: "REP-TRN-2026-07",
    type: "Training",
    title: "Training Compliance Report",
    description: "Competency matrix coverage and overdue training by department.",
    category: "Training",
    period: "Jul 2026",
    owner: "Anila Berisha",
    status: "Scheduled",
    lastGenerated: "2026-06-30",
    formats: ["PDF", "Excel"],
    icon: GraduationCap,
    tone: "success",
    pages: 12,
  },
  {
    id: "REP-AUD-2026-H1",
    type: "Audit",
    title: "Audit Report",
    description: "Internal audit programme findings and closure status.",
    category: "Quality",
    period: "H1 2026",
    owner: "Besnik Lami",
    status: "Final",
    lastGenerated: "2026-07-02",
    formats: ["PDF", "Word"],
    icon: ClipboardList,
    tone: "brand",
    pages: 28,
  },
  {
    id: "REP-RSK-2026-Q3",
    type: "Risk",
    title: "Risk Management Summary",
    description: "ISO 14971 residual-risk profile and benefit-risk overview.",
    category: "Quality",
    period: "Q3 2026",
    owner: "Fatjon Rama",
    status: "Draft",
    lastGenerated: "2026-07-16",
    formats: ["PDF", "Excel"],
    icon: ShieldAlert,
    tone: "danger",
    pages: 21,
  },
  {
    id: "REP-PRD-2026-07",
    type: "Production",
    title: "Production Quality Report",
    description: "First-pass yield, remake and scrap rates across production lines.",
    category: "Production",
    period: "Jul 2026",
    owner: "Ilir Prifti",
    status: "Scheduled",
    lastGenerated: "2026-07-17",
    formats: ["PDF", "Excel"],
    icon: Factory,
    tone: "success",
    pages: 15,
  },
];

export const REPORTS_SUMMARY = {
  total: REPORTS.length,
  final: REPORTS.filter((r) => r.status === "Final").length,
  draft: REPORTS.filter((r) => r.status === "Draft").length,
  scheduled: REPORTS.filter((r) => r.status === "Scheduled").length,
};

/* ------------------------------------------------------------------ */
/*  Management Review — ISO 13485 §5.6                                 */
/* ------------------------------------------------------------------ */

export interface ReviewAttendee {
  name: string;
  role: string;
  present: boolean;
}

export interface QualityObjective {
  id: string;
  objective: string;
  target: string;
  actual: string;
  progress: number;
  status: string;
  owner: string;
}

export interface KpiRow {
  metric: string;
  current: string;
  previous: string;
  target: string;
  trend: "up" | "down" | "flat";
  good: boolean;
}

export interface ReviewSection {
  id: string;
  label: string;
  summary: string;
  highlights: { label: string; value: string; tone?: string }[];
}

export interface AgendaItem {
  no: number;
  topic: string;
  clause: string;
  presenter: string;
  minutes: number;
}

export interface ReviewDecision {
  id: string;
  decision: string;
  rationale: string;
}

export interface ActionItem {
  id: string;
  item: string;
  owner: string;
  due: string;
  status: string;
  priority: "High" | "Medium" | "Low";
}

export const MGMT_REVIEW = {
  meeting: {
    title: "Q3 2026 Management Review",
    date: "2026-07-21",
    time: "09:00–11:30 CET",
    location: "iClear HQ · Boardroom / Teams",
    chair: "Edison Shimaj",
    minutesBy: "Anila Berisha",
    reference: "MR-2026-03",
    status: "In Review",
  },

  attendees: [
    { name: "Edison Shimaj", role: "CEO (Chair)", present: true },
    { name: "Anila Berisha", role: "Quality Manager", present: true },
    { name: "Genti Hoxha", role: "PRRC", present: true },
    { name: "Marsela Doda", role: "Regulatory Specialist", present: true },
    { name: "Ilir Prifti", role: "Production Supervisor", present: true },
    { name: "Erisa Kola", role: "QC Specialist", present: true },
    { name: "Dr. Klaudia Meta", role: "Clinical Reviewer", present: false },
    { name: "Besnik Lami", role: "Internal Auditor", present: true },
  ] as ReviewAttendee[],

  approvalSteps: [
    { label: "Draft", state: "done" as const, meta: "18 Jul" },
    { label: "In Review", state: "current" as const, meta: "Anila B." },
    { label: "Approved", state: "upcoming" as const, meta: "CEO sign-off" },
  ],

  agenda: [
    { no: 1, topic: "Status of actions from previous review", clause: "§5.6.2 a", presenter: "Anila Berisha", minutes: 15 },
    { no: 2, topic: "Feedback & complaints trend", clause: "§5.6.2 b", presenter: "Erisa Kola", minutes: 20 },
    { no: 3, topic: "Process performance & product conformity", clause: "§5.6.2 c", presenter: "Ilir Prifti", minutes: 20 },
    { no: 4, topic: "CAPA status & effectiveness", clause: "§5.6.2 d", presenter: "Anila Berisha", minutes: 15 },
    { no: 5, topic: "Internal & external audit results", clause: "§5.6.2 e", presenter: "Besnik Lami", minutes: 15 },
    { no: 6, topic: "Regulatory & MDR updates", clause: "§5.6.2 f", presenter: "Genti Hoxha", minutes: 20 },
    { no: 7, topic: "Quality objectives & KPIs", clause: "§5.6.2 g", presenter: "Anila Berisha", minutes: 15 },
    { no: 8, topic: "Resource needs & improvement opportunities", clause: "§5.6.3", presenter: "Edison Shimaj", minutes: 20 },
  ] as AgendaItem[],

  qualityObjectives: [
    { id: "QO-01", objective: "First-pass yield ≥ 96%", target: "96%", actual: "94.8%", progress: 92, status: "Monitor", owner: "Ilir Prifti" },
    { id: "QO-02", objective: "Complaint rate < 4 / 10k devices", target: "< 4.0", actual: "3.6", progress: 88, status: "On Track", owner: "Erisa Kola" },
    { id: "QO-03", objective: "CAPA closed on time ≥ 90%", target: "90%", actual: "83%", progress: 83, status: "At Risk", owner: "Anila Berisha" },
    { id: "QO-04", objective: "On-time delivery ≥ 98%", target: "98%", actual: "98.4%", progress: 100, status: "Achieved", owner: "Xheni Vata" },
    { id: "QO-05", objective: "Training compliance ≥ 95%", target: "95%", actual: "94%", progress: 94, status: "On Track", owner: "Anila Berisha" },
    { id: "QO-06", objective: "Zero reportable incidents", target: "0", actual: "0", progress: 100, status: "Achieved", owner: "Genti Hoxha" },
  ] as QualityObjective[],

  kpis: [
    { metric: "QMS health index", current: "87%", previous: "84%", target: "85%", trend: "up", good: true },
    { metric: "Open CAPAs", current: "12", previous: "15", target: "< 10", trend: "down", good: true },
    { metric: "Overdue CAPAs", current: "3", previous: "1", target: "0", trend: "up", good: false },
    { metric: "Complaint rate /10k", current: "3.6", previous: "4.1", target: "< 4.0", trend: "down", good: true },
    { metric: "First-pass yield", current: "94.8%", previous: "93.5%", target: "96%", trend: "up", good: true },
    { metric: "On-time delivery", current: "98.4%", previous: "97.9%", target: "98%", trend: "up", good: true },
  ] as KpiRow[],

  sections: [
    {
      id: "audit",
      label: "Audit Results",
      summary:
        "H1 internal audit programme complete (6 of 6 audits). 14 findings raised — 2 major, 9 minor, 3 observations. TÜV surveillance audit passed with zero major nonconformities.",
      highlights: [
        { label: "Audits completed", value: "6 / 6" },
        { label: "Major findings", value: "2", tone: "warning" },
        { label: "Findings closed", value: "9 / 14" },
        { label: "External audit", value: "Passed", tone: "success" },
      ],
    },
    {
      id: "complaints",
      label: "Complaints & Feedback",
      summary:
        "38 complaints logged this quarter (rate 3.6 / 10k devices, down from 4.1). Leading category remains gingival irritation from edge trimming; CAPA-2026-023 in progress. No serious incidents or field safety corrective actions.",
      highlights: [
        { label: "Complaints (Q3)", value: "38" },
        { label: "Rate / 10k", value: "3.6", tone: "success" },
        { label: "Top category", value: "Edge fit" },
        { label: "Reportable events", value: "0", tone: "success" },
      ],
    },
    {
      id: "capa",
      label: "CAPA Status",
      summary:
        "12 CAPAs open, 3 overdue. Effectiveness checks passed on 2 of 3 closed CAPAs this period. Overdue ageing driven by thermoformer calibration (CAPA-2026-021) and packaging label handling (CAPA-2026-022).",
      highlights: [
        { label: "Open CAPAs", value: "12" },
        { label: "Overdue", value: "3", tone: "danger" },
        { label: "On-time closure", value: "83%", tone: "warning" },
        { label: "Effectiveness passed", value: "2 / 3" },
      ],
    },
    {
      id: "process",
      label: "Process & Product Conformity",
      summary:
        "First-pass yield 94.8% (target 96%). Remake rate 3.1%, scrap 1.4%. Cleanroom particle excursion resolved (CAPA-2026-018 closed). Two nonconformities open on incoming resin lots pending supplier disposition.",
      highlights: [
        { label: "First-pass yield", value: "94.8%", tone: "warning" },
        { label: "Remake rate", value: "3.1%" },
        { label: "Scrap rate", value: "1.4%", tone: "success" },
        { label: "Open NCRs", value: "14" },
      ],
    },
    {
      id: "pms",
      label: "Post-Market Surveillance",
      summary:
        "PMS plan on schedule. H1 PMS report in draft; PSUR for the aligner range under clinical review. One PMS signal (attachment geometry, Hero Aligners) escalated to design change assessment.",
      highlights: [
        { label: "PMS signals", value: "1", tone: "warning" },
        { label: "PSUR", value: "Draft" },
        { label: "Vigilance cases", value: "0", tone: "success" },
        { label: "Trend reports", value: "On track" },
      ],
    },
    {
      id: "supplier",
      label: "Supplier Performance",
      summary:
        "Average supplier scorecard 89%. One critical supplier (TPU resin) on SCAR for process drift; re-qualification audit scheduled. All other critical suppliers remain qualified.",
      highlights: [
        { label: "Avg. scorecard", value: "89%", tone: "success" },
        { label: "Open SCARs", value: "2", tone: "warning" },
        { label: "Qualified suppliers", value: "18 / 19" },
        { label: "Re-quals due", value: "1" },
      ],
    },
    {
      id: "training",
      label: "Training Compliance",
      summary:
        "Competency matrix 94% complete (target 95%). 9 training records overdue, concentrated in new thermoforming operators. Onboarding gap CAPA-2026-017 closed and effective.",
      highlights: [
        { label: "Compliance", value: "94%", tone: "success" },
        { label: "Overdue records", value: "9", tone: "warning" },
        { label: "New operators", value: "6" },
        { label: "Matrix coverage", value: "94%" },
      ],
    },
    {
      id: "regulatory",
      label: "Regulatory Updates",
      summary:
        "MDR technical documentation at 82% readiness. MDCG 2022-14 guidance on transitional provisions reviewed. Notified Body recertification window opens Q1 2027 — Annex II gap closure prioritised.",
      highlights: [
        { label: "MDR readiness", value: "82%", tone: "warning" },
        { label: "TD gaps", value: "7 open" },
        { label: "NB recert", value: "Q1 2027" },
        { label: "New guidance", value: "MDCG 2022-14" },
      ],
    },
    {
      id: "resources",
      label: "Resource Needs",
      summary:
        "Additional QC headcount (1 FTE) requested to support inspection throughput. Second thermoformer calibration contract approved. Regulatory affairs seeking external MDR consultancy for technical file remediation.",
      highlights: [
        { label: "QC headcount", value: "+1 FTE" },
        { label: "Capex approved", value: "€48k" },
        { label: "Consultancy", value: "Pending" },
        { label: "Training budget", value: "Approved" },
      ],
    },
    {
      id: "improvement",
      label: "Improvement Opportunities",
      summary:
        "Automate edge-trimming inspection to reduce fit complaints. Digitise supplier scorecards. Introduce statistical process control on thermoforming thickness to lift first-pass yield toward 96% target.",
      highlights: [
        { label: "Initiatives", value: "3" },
        { label: "SPC pilot", value: "Q4 2026" },
        { label: "Automation", value: "Scoped" },
        { label: "Expected yield", value: "+1.2%" },
      ],
    },
  ] as ReviewSection[],

  decisions: [
    {
      id: "D-1",
      decision: "Approve additional QC inspector (1 FTE) to sustain inspection throughput.",
      rationale: "First-pass yield below target and rising inspection load.",
    },
    {
      id: "D-2",
      decision: "Prioritise Annex II technical documentation remediation ahead of Q1 2027 recertification.",
      rationale: "MDR readiness at 82% with 7 open technical-file gaps.",
    },
    {
      id: "D-3",
      decision: "Escalate overdue CAPAs (021, 022) to weekly executive tracking until closed.",
      rationale: "On-time CAPA closure (83%) below the 90% quality objective.",
    },
    {
      id: "D-4",
      decision: "Launch SPC pilot on thermoforming thickness in Q4 2026.",
      rationale: "Root cause of recurring material-thickness nonconformities.",
    },
    {
      id: "D-5",
      decision: "The QMS remains suitable, adequate and effective; benefit-risk profile is favourable.",
      rationale: "Overall QMS health index 87%, no reportable incidents.",
    },
  ] as ReviewDecision[],

  actionItems: [
    { id: "MRA-01", item: "Recruit and onboard additional QC inspector", owner: "Anila Berisha", due: "2026-09-15", status: "Open", priority: "High" },
    { id: "MRA-02", item: "Close thermoformer calibration CAPA-2026-021", owner: "Ilir Prifti", due: "2026-07-30", status: "In Progress", priority: "High" },
    { id: "MRA-03", item: "Resolve packaging label-handling CAPA-2026-022", owner: "Xheni Vata", due: "2026-07-18", status: "Overdue", priority: "High" },
    { id: "MRA-04", item: "Complete Annex II technical-file gap remediation plan", owner: "Marsela Doda", due: "2026-10-31", status: "Open", priority: "High" },
    { id: "MRA-05", item: "Submit H1 PMS report and finalise PSUR draft", owner: "Genti Hoxha", due: "2026-08-15", status: "In Progress", priority: "Medium" },
    { id: "MRA-06", item: "Complete overdue thermoforming operator training", owner: "Anila Berisha", due: "2026-08-05", status: "In Progress", priority: "Medium" },
    { id: "MRA-07", item: "Conduct TPU resin supplier re-qualification audit", owner: "Genti Hoxha", due: "2026-09-01", status: "Open", priority: "Medium" },
    { id: "MRA-08", item: "Scope edge-trimming inspection automation", owner: "Fatjon Rama", due: "2026-10-15", status: "Open", priority: "Low" },
  ] as ActionItem[],
};
