import type { Capa } from "../types";

export const CAPAS: Capa[] = [
  { id: "CAPA-2026-024", title: "Material thickness variation in aligner batch", source: "Nonconformity", severity: "Major", rootCause: "Supplier material variation", owner: "Ilir Prifti", department: "Thermoforming", dueDate: "2026-07-30", status: "Effectiveness Check", progress: 85, effectiveness: "Pending", opened: "2026-06-02" },
  { id: "CAPA-2026-023", title: "Recurring gingival irritation complaints", source: "Complaint Trend", severity: "Major", rootCause: "Insufficient edge trimming", owner: "Erisa Kola", department: "Cutting", dueDate: "2026-08-12", status: "Investigation", progress: 45, effectiveness: "—", opened: "2026-06-15" },
  { id: "CAPA-2026-022", title: "Label mismatch at packaging station", source: "Internal Audit", severity: "Critical", rootCause: "Manual label handling", owner: "Xheni Vata", department: "Packaging", dueDate: "2026-07-18", status: "In Progress", progress: 60, effectiveness: "—", opened: "2026-05-28" },
  { id: "CAPA-2026-021", title: "Calibration overdue on thermoformer TF-03", source: "Equipment Deviation", severity: "Major", rootCause: "Missed calibration schedule", owner: "Ilir Prifti", department: "Thermoforming", dueDate: "2026-07-14", status: "Overdue", progress: 40, effectiveness: "—", opened: "2026-05-20" },
  { id: "CAPA-2026-020", title: "Design plan approval delays", source: "Process Audit", severity: "Minor", rootCause: "Unclear approval routing", owner: "Fatjon Rama", department: "Design", dueDate: "2026-08-25", status: "Open", progress: 15, effectiveness: "—", opened: "2026-07-01" },
  { id: "CAPA-2026-019", title: "Incoming resin defect rate above threshold", source: "Supplier SCAR", severity: "Major", rootCause: "Supplier process drift", owner: "Genti Hoxha", department: "Quality", dueDate: "2026-08-05", status: "Investigation", progress: 50, effectiveness: "—", opened: "2026-06-10" },
  { id: "CAPA-2026-018", title: "Cleanroom particle count excursion", source: "Environmental Monitoring", severity: "Major", rootCause: "HVAC filter degradation", owner: "Erisa Kola", department: "Quality Control", dueDate: "2026-07-09", status: "Closed", progress: 100, effectiveness: "Passed", opened: "2026-05-05" },
  { id: "CAPA-2026-017", title: "Missing training records for new operators", source: "Internal Audit", severity: "Minor", rootCause: "Onboarding gap", owner: "Anila Berisha", department: "Human Resources", dueDate: "2026-06-30", status: "Closed", progress: 100, effectiveness: "Passed", opened: "2026-04-22" },
  { id: "CAPA-2026-016", title: "Shipment delivered to incorrect clinic", source: "Complaint", severity: "Critical", rootCause: "Address verification failure", owner: "Xheni Vata", department: "Logistics", dueDate: "2026-07-20", status: "In Progress", progress: 70, effectiveness: "—", opened: "2026-05-30" },
  { id: "CAPA-2026-015", title: "PMS signal — tracking issues Hero Aligners", source: "PMS Signal", severity: "Major", rootCause: "Attachment geometry", owner: "Fatjon Rama", department: "Design", dueDate: "2026-08-18", status: "Investigation", progress: 35, effectiveness: "—", opened: "2026-06-20" },
  { id: "CAPA-2026-014", title: "Polishing scratches on device surface", source: "Nonconformity", severity: "Minor", rootCause: "Worn polishing wheel", owner: "Ilir Prifti", department: "Polishing", dueDate: "2026-07-16", status: "Effectiveness Check", progress: 90, effectiveness: "Pending", opened: "2026-05-18" },
  { id: "CAPA-2026-013", title: "IFU version control discrepancy", source: "Document Review", severity: "Minor", rootCause: "Parallel editing", owner: "Marsela Doda", department: "Regulatory Affairs", dueDate: "2026-08-01", status: "Open", progress: 20, effectiveness: "—", opened: "2026-06-28" },
];

export const CAPA_ROOT_CAUSES = [
  { name: "Supplier / material", value: 5 },
  { name: "Process control", value: 4 },
  { name: "Human factor", value: 3 },
  { name: "Equipment", value: 2 },
  { name: "Documentation", value: 3 },
];

export const CAPA_BY_DEPARTMENT = [
  { name: "Thermoforming", value: 4 },
  { name: "Packaging", value: 3 },
  { name: "Quality", value: 3 },
  { name: "Design", value: 3 },
  { name: "Cutting", value: 2 },
  { name: "Logistics", value: 2 },
];

export const CAPA_WORKFLOW_STEPS = [
  "Identification",
  "Containment",
  "Investigation",
  "Root Cause",
  "Action Plan",
  "Implementation",
  "Effectiveness Check",
  "Closure",
] as const;
