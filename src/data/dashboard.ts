import {
  ClipboardCheck,
  AlertOctagon,
  MessageSquareWarning,
  ShieldAlert,
  FileWarning,
  GraduationCap,
  FileX2,
  Wrench,
  Truck,
  ClipboardList,
  CheckCircle2,
  FileEdit,
  Link2,
  Boxes,
} from "lucide-react";

export const QMS_HEALTH = 87;

export const COMPLIANCE_SCORES = [
  { label: "MDR Readiness", value: 82 },
  { label: "ISO 13485 Readiness", value: 91 },
  { label: "Technical Documentation", value: 76 },
  { label: "Training Compliance", value: 94 },
  { label: "Supplier Compliance", value: 89 },
  { label: "CAPA Effectiveness", value: 84 },
];

export const KPIS = [
  { label: "Open CAPAs", value: 12, icon: ClipboardCheck, tone: "brand" as const, delta: -8, deltaLabel: "vs last month", invert: true, to: "/capa" },
  { label: "Overdue CAPAs", value: 3, icon: AlertOctagon, tone: "danger" as const, delta: 2, deltaLabel: "needs attention", invert: true, to: "/capa" },
  { label: "Complaints This Month", value: 18, icon: MessageSquareWarning, tone: "warning" as const, delta: 5, deltaLabel: "vs last month", invert: true, to: "/complaints" },
  { label: "Serious Incidents", value: 0, icon: ShieldAlert, tone: "success" as const, deltaLabel: "no reportable events", to: "/complaints" },
  { label: "Documents Expiring", value: 7, icon: FileWarning, tone: "warning" as const, deltaLabel: "within 30 days", to: "/documents" },
  { label: "Training Overdue", value: 9, icon: GraduationCap, tone: "warning" as const, delta: -12, deltaLabel: "improving", invert: true, to: "/training" },
  { label: "Open Nonconformities", value: 14, icon: FileX2, tone: "info" as const, delta: -3, deltaLabel: "vs last month", invert: true, to: "/nonconformities" },
  { label: "Calibration Due", value: 4, icon: Wrench, tone: "warning" as const, deltaLabel: "this quarter", to: "/equipment" },
  { label: "Supplier Issues", value: 2, icon: Truck, tone: "info" as const, deltaLabel: "open SCARs", to: "/suppliers" },
  { label: "Pending Audits", value: 3, icon: ClipboardList, tone: "regulatory" as const, deltaLabel: "next 60 days", to: "/audits" },
];

export const QUALITY_TREND = [
  { month: "Jan", complaints: 22, remakes: 41, nonconformities: 19, capas: 8 },
  { month: "Feb", complaints: 19, remakes: 38, nonconformities: 21, capas: 7 },
  { month: "Mar", complaints: 24, remakes: 44, nonconformities: 17, capas: 10 },
  { month: "Apr", complaints: 20, remakes: 35, nonconformities: 15, capas: 9 },
  { month: "May", complaints: 17, remakes: 31, nonconformities: 16, capas: 6 },
  { month: "Jun", complaints: 18, remakes: 28, nonconformities: 14, capas: 12 },
  { month: "Jul", complaints: 15, remakes: 25, nonconformities: 14, capas: 11 },
];

export const PRODUCTION_QUALITY = [
  { month: "Jan", firstPass: 91.2, remake: 5.1, refinement: 2.9, rejection: 0.8 },
  { month: "Feb", firstPass: 92.0, remake: 4.6, refinement: 2.7, rejection: 0.7 },
  { month: "Mar", firstPass: 90.8, remake: 5.4, refinement: 3.1, rejection: 0.7 },
  { month: "Apr", firstPass: 93.1, remake: 4.1, refinement: 2.2, rejection: 0.6 },
  { month: "May", firstPass: 93.8, remake: 3.7, refinement: 2.0, rejection: 0.5 },
  { month: "Jun", firstPass: 94.4, remake: 3.3, refinement: 1.8, rejection: 0.5 },
  { month: "Jul", firstPass: 95.0, remake: 3.0, refinement: 1.6, rejection: 0.4 },
];

export const COMPLIANCE_BY_MODULE = [
  { label: "Document Control", value: 88 },
  { label: "Risk Management", value: 90 },
  { label: "Clinical Evaluation", value: 78 },
  { label: "PMS", value: 84 },
  { label: "Supplier Management", value: 89 },
  { label: "Training", value: 94 },
  { label: "Audits", value: 81 },
  { label: "Production Validation", value: 92 },
];

export interface DashHeatRisk {
  id: string;
  severity: number;
  probability: number;
  label: string;
}

export const HEATMAP_RISKS: DashHeatRisk[] = [
  { id: "RSK-002", severity: 5, probability: 2, label: "Excessive orthodontic force" },
  { id: "RSK-018", severity: 4, probability: 3, label: "Incorrect material thickness" },
  { id: "RSK-007", severity: 5, probability: 1, label: "Material biocompatibility" },
  { id: "RSK-011", severity: 3, probability: 3, label: "Insufficient trimming" },
  { id: "RSK-004", severity: 4, probability: 2, label: "Wrong label" },
  { id: "RSK-021", severity: 2, probability: 4, label: "Tracking problem" },
  { id: "RSK-015", severity: 3, probability: 2, label: "Contamination" },
  { id: "RSK-009", severity: 2, probability: 2, label: "Inadequate IFU" },
  { id: "RSK-023", severity: 4, probability: 1, label: "Wrong clinic delivery" },
  { id: "RSK-005", severity: 1, probability: 3, label: "Packaging defect" },
];

export const ACTIVITY = [
  { id: "a1", icon: CheckCircle2, tone: "success" as const, title: "CAPA-2026-024 approved by Quality Manager", meta: "Root cause: supplier material variation", time: "24m" },
  { id: "a2", icon: FileEdit, tone: "brand" as const, title: "SOP-QMS-005 moved to review", meta: "Version 4.0 · Document Control", time: "1h" },
  { id: "a3", icon: Link2, tone: "regulatory" as const, title: "Complaint CMP-2026-104 linked to Risk RSK-018", meta: "By Anila Berisha", time: "2h" },
  { id: "a4", icon: Truck, tone: "info" as const, title: "Material supplier reassessment completed", meta: "SUP-014 · Performance 92%", time: "4h" },
  { id: "a5", icon: GraduationCap, tone: "warning" as const, title: "Training assigned to thermoforming team", meta: "WI-PROD-012 · 8 employees", time: "6h" },
  { id: "a6", icon: Boxes, tone: "success" as const, title: "Internal audit finding AUD-2026-005-F3 closed", meta: "Packaging process", time: "1d" },
];

export const DEADLINES = [
  { id: "d1", title: "PSUR review — iClear Aligners", type: "PSUR", date: "2026-08-02", tone: "regulatory" as const },
  { id: "d2", title: "Supplier requalification — SUP-014", type: "Supplier", date: "2026-08-10", tone: "info" as const },
  { id: "d3", title: "Equipment calibration — EQP-PRN-008", type: "Equipment", date: "2026-07-28", tone: "warning" as const },
  { id: "d4", title: "Management review meeting Q3", type: "Review", date: "2026-08-15", tone: "brand" as const },
  { id: "d5", title: "CER update — Night Guard", type: "Clinical", date: "2026-08-22", tone: "regulatory" as const },
  { id: "d6", title: "Internal audit — Production", type: "Audit", date: "2026-07-25", tone: "warning" as const },
  { id: "d7", title: "Document expiry — WI-PROD-012", type: "Document", date: "2026-09-01", tone: "info" as const },
];
