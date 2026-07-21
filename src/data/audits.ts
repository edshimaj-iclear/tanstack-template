import type { Audit } from "../types";

/* ============================================================
   iClear QMS — Audit Program mock data
   Local (module-scoped) types for findings, checklist, recurring
   ============================================================ */

export type FindingSeverity =
  | "Critical"
  | "Major"
  | "Minor"
  | "Observation"
  | "Opportunity for Improvement";

export interface Finding {
  id: string;
  severity: FindingSeverity;
  clause: string;
  description: string;
  status: "Open" | "Closed";
  capaId?: string;
  department: string;
  raised: string;
}

export interface ChecklistItem {
  id: string;
  clause: string;
  requirement: string;
  result: "Pass" | "Fail" | "N/A";
  note?: string;
}

export interface RecurringFinding {
  clause: string;
  theme: string;
  occurrences: number;
  audits: string[];
  trend: "up" | "down" | "flat";
}

/* ---------- Audit register (AUD-2026-001 … 010) ---------- */
export const AUDITS: Audit[] = [
  {
    id: "AUD-2026-001",
    title: "Annual QMS internal audit — full ISO 13485 cycle",
    type: "Internal",
    scope: "Whole quality management system",
    leadAuditor: "Besnik Lami",
    date: "2026-02-10",
    status: "Closed",
    findings: { critical: 0, major: 1, minor: 3, observation: 4 },
    closure: 100,
  },
  {
    id: "AUD-2026-002",
    title: "TPU raw-material supplier qualification audit",
    type: "Supplier",
    scope: "PolyDent Materials GmbH — incoming TPU film",
    leadAuditor: "Anila Berisha",
    date: "2026-03-18",
    status: "Closed",
    findings: { critical: 0, major: 2, minor: 2, observation: 1 },
    closure: 100,
  },
  {
    id: "AUD-2026-003",
    title: "MDR Annex IX surveillance audit — Notified Body",
    type: "Notified Body",
    scope: "QMS + technical documentation (iClear Aligner Class IIa)",
    leadAuditor: "TÜV SÜD — R. Fischer",
    date: "2026-07-14",
    status: "In Progress",
    findings: { critical: 1, major: 2, minor: 3, observation: 2 },
    closure: 42,
  },
  {
    id: "AUD-2026-004",
    title: "Thermoforming process audit — pressure-forming line",
    type: "Process",
    scope: "Thermoforming, trimming & validation (WI-PROD-012)",
    leadAuditor: "Erisa Kola",
    date: "2026-04-22",
    status: "Closed",
    findings: { critical: 0, major: 0, minor: 2, observation: 3 },
    closure: 100,
  },
  {
    id: "AUD-2026-005",
    title: "PRRC & vigilance readiness regulatory audit",
    type: "Regulatory",
    scope: "Article 15 PRRC duties, vigilance & PMS reporting",
    leadAuditor: "Genti Hoxha",
    date: "2026-06-30",
    status: "Overdue",
    findings: { critical: 0, major: 1, minor: 2, observation: 1 },
    closure: 55,
  },
  {
    id: "AUD-2026-006",
    title: "Design & development controls internal audit",
    type: "Internal",
    scope: "Design history file, DHF gates & design transfer",
    leadAuditor: "Besnik Lami",
    date: "2026-08-12",
    status: "Planned",
    findings: { critical: 0, major: 0, minor: 0, observation: 0 },
    closure: 0,
  },
  {
    id: "AUD-2026-007",
    title: "Sterile packaging supplier re-assessment",
    type: "Supplier",
    scope: "MedPack Solutions — pouches & labelling",
    leadAuditor: "Anila Berisha",
    date: "2026-09-03",
    status: "Planned",
    findings: { critical: 0, major: 0, minor: 0, observation: 0 },
    closure: 0,
  },
  {
    id: "AUD-2026-008",
    title: "Mock recall & field-safety corrective action drill",
    type: "Mock",
    scope: "Traceability, LOT recall simulation, PMS response",
    leadAuditor: "Marsela Doda",
    date: "2026-08-25",
    status: "Planned",
    findings: { critical: 0, major: 0, minor: 0, observation: 0 },
    closure: 0,
  },
  {
    id: "AUD-2026-009",
    title: "Cutting & polishing process audit",
    type: "Process",
    scope: "Laser cutting, edge polishing & in-process QC",
    leadAuditor: "Ilir Prifti",
    date: "2026-07-19",
    status: "In Progress",
    findings: { critical: 0, major: 1, minor: 1, observation: 2 },
    closure: 30,
  },
  {
    id: "AUD-2026-010",
    title: "CAPA & complaint-handling internal audit",
    type: "Internal",
    scope: "Nonconformity, CAPA lifecycle & complaint intake",
    leadAuditor: "Besnik Lami",
    date: "2026-05-15",
    status: "Closed",
    findings: { critical: 0, major: 1, minor: 4, observation: 2 },
    closure: 100,
  },
];

/* ---------- Findings for the featured audit (AUD-2026-003) ---------- */
export const SAMPLE_AUDIT_ID = "AUD-2026-003";

export const FINDINGS: Finding[] = [
  {
    id: "F-2026-031",
    severity: "Critical",
    clause: "ISO 13485 §7.5.6 / MDR Annex I 10.2",
    description:
      "Process validation for the pressure-forming step lacks a documented re-validation trigger after the March mould change; no evidence of OQ/PQ re-execution.",
    status: "Open",
    capaId: "CAPA-2026-024",
    department: "Thermoforming",
    raised: "2026-07-14",
  },
  {
    id: "F-2026-032",
    severity: "Major",
    clause: "ISO 13485 §8.2.1",
    description:
      "Post-market surveillance data from clinic feedback is not systematically fed back into the risk management file review cycle.",
    status: "Open",
    capaId: "CAPA-2026-025",
    department: "Regulatory Affairs",
    raised: "2026-07-14",
  },
  {
    id: "F-2026-033",
    severity: "Major",
    clause: "MDR Article 10(9)(h)",
    description:
      "UDI assignment records for two aligner variants are incomplete in the EUDAMED submission draft; Basic UDI-DI traceability gap.",
    status: "Open",
    capaId: "CAPA-2026-026",
    department: "Regulatory Affairs",
    raised: "2026-07-15",
  },
  {
    id: "F-2026-034",
    severity: "Minor",
    clause: "ISO 13485 §6.2",
    description:
      "Training records for two thermoforming operators do not show re-qualification after the updated WI-PROD-012 revision.",
    status: "Closed",
    capaId: "CAPA-2026-021",
    department: "Thermoforming",
    raised: "2026-07-15",
  },
  {
    id: "F-2026-035",
    severity: "Minor",
    clause: "ISO 13485 §7.4.1",
    description:
      "Supplier quality agreement with the TPU film vendor is past its scheduled review date by 6 weeks.",
    status: "Open",
    department: "Quality",
    raised: "2026-07-15",
  },
  {
    id: "F-2026-036",
    severity: "Minor",
    clause: "ISO 13485 §4.2.4",
    description:
      "Two effective SOPs available on the shop floor were printed uncontrolled copies without the current revision stamp.",
    status: "Closed",
    department: "Quality",
    raised: "2026-07-14",
  },
  {
    id: "F-2026-037",
    severity: "Observation",
    clause: "ISO 13485 §7.5.8",
    description:
      "LOT traceability is robust, but scan timestamps between cutting and QC stations occasionally rely on manual entry.",
    status: "Open",
    department: "Quality Control",
    raised: "2026-07-16",
  },
  {
    id: "F-2026-038",
    severity: "Opportunity for Improvement",
    clause: "ISO 13485 §8.4",
    description:
      "Consider trend-analysis dashboards for in-process defect data to shorten reaction time on refinement rate spikes.",
    status: "Open",
    department: "Quality Control",
    raised: "2026-07-16",
  },
];

/* ---------- Findings-by-severity aggregate (chart) ---------- */
export const FINDINGS_BY_SEVERITY: { name: string; value: number }[] = [
  { name: "Critical", value: 1 },
  { name: "Major", value: 5 },
  { name: "Minor", value: 14 },
  { name: "Observation", value: 12 },
  { name: "Opportunity", value: 6 },
];

/* ---------- Checklist for the featured audit ---------- */
export const CHECKLIST: ChecklistItem[] = [
  {
    id: "CL-01",
    clause: "§4.2.3",
    requirement: "Medical device file maintained and current",
    result: "Pass",
  },
  {
    id: "CL-02",
    clause: "§4.2.4",
    requirement: "Control of documents — only current revisions in use",
    result: "Fail",
    note: "Uncontrolled printed SOP copies on shop floor (F-2026-036)",
  },
  {
    id: "CL-03",
    clause: "§6.2",
    requirement: "Personnel competence & training records complete",
    result: "Fail",
    note: "Operator re-qualification missing (F-2026-034)",
  },
  {
    id: "CL-04",
    clause: "§7.4.1",
    requirement: "Supplier evaluation & quality agreements current",
    result: "Fail",
    note: "TPU vendor agreement review overdue (F-2026-035)",
  },
  {
    id: "CL-05",
    clause: "§7.5.6",
    requirement: "Validation of processes for production",
    result: "Fail",
    note: "Re-validation trigger not defined after mould change (F-2026-031)",
  },
  {
    id: "CL-06",
    clause: "§7.5.8",
    requirement: "Identification & UDI traceability throughout production",
    result: "Pass",
  },
  {
    id: "CL-07",
    clause: "§8.2.1",
    requirement: "Feedback & post-market surveillance loop into risk file",
    result: "Fail",
    note: "PMS data not systematically reviewed (F-2026-032)",
  },
  {
    id: "CL-08",
    clause: "§8.5.2",
    requirement: "Corrective action process effective & timely",
    result: "Pass",
  },
];

/* ---------- Recurring / systemic findings callout ---------- */
export const RECURRING_FINDINGS: RecurringFinding[] = [
  {
    clause: "ISO 13485 §7.5.6",
    theme: "Process re-validation triggers not defined after equipment/tooling changes",
    occurrences: 3,
    audits: ["AUD-2026-003", "AUD-2026-004", "AUD-2025-011"],
    trend: "up",
  },
  {
    clause: "ISO 13485 §6.2",
    theme: "Operator re-training not captured after work-instruction revisions",
    occurrences: 3,
    audits: ["AUD-2026-003", "AUD-2026-009", "AUD-2026-001"],
    trend: "flat",
  },
  {
    clause: "ISO 13485 §7.4.1",
    theme: "Supplier quality-agreement reviews slipping past due dates",
    occurrences: 2,
    audits: ["AUD-2026-003", "AUD-2026-002"],
    trend: "down",
  },
];
