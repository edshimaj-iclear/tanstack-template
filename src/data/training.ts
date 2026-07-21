import type { Employee } from "../types";

/* ============================================================
   iClear QMS — Training & Competency mock data
   ISO 13485 §6.2 competence, awareness and training
   Today = 2026-07-21
   ============================================================ */

/* ---------- Local domain types ---------- */

export type MatrixLevel = "qualified" | "training" | "none" | "gap";

export interface CompetencyMatrixColumn {
  key: string;
  label: string;
  hint: string;
}

export interface CompetencyMatrixRow {
  employeeId: string;
  name: string;
  cells: Record<string, MatrixLevel>;
}

export type TrainingItemStatus =
  | "Completed"
  | "In Progress"
  | "Assigned"
  | "Overdue"
  | "Expired"
  | "Expiring";

export interface TrainingItem {
  code: string;
  title: string;
  type: "SOP" | "Work Instruction" | "Regulation" | "Process" | "Equipment" | "Onboarding";
  status: TrainingItemStatus;
  /** completion date (completed) or due date (assigned/expired) */
  date: string;
  /** certificate reference where issued */
  certificate?: string;
}

export type AssignmentState =
  | "Assigned"
  | "Opened"
  | "Completed"
  | "Assessment"
  | "Supervisor Approval"
  | "Qualified";

export interface TrainingAssignment {
  id: string;
  employeeId: string;
  employee: string;
  courseCode: string;
  course: string;
  assignedDate: string;
  dueDate: string;
  state: AssignmentState;
  progress: number;
  assessor: string;
}

export interface EmployeeTrainingDetail {
  assigned: TrainingItem[];
  completed: TrainingItem[];
  expired: TrainingItem[];
  assessment: {
    status: "Passed" | "Scheduled" | "Awaiting" | "Not required";
    score?: number;
    assessor?: string;
    date?: string;
  };
  certificates: { code: string; title: string; issued: string; expires: string }[];
}

/* ---------- Employees (reused TEAM + shop-floor operators) ---------- */

export const EMPLOYEES: Employee[] = [
  { id: "U-002", name: "Anila Berisha", role: "Quality Manager", department: "Quality", competency: 96, requiredTraining: 14, completedTraining: 14, expiredTraining: 0, qualification: "Qualified" },
  { id: "U-003", name: "Genti Hoxha", role: "PRRC", department: "Regulatory Affairs", competency: 94, requiredTraining: 12, completedTraining: 12, expiredTraining: 0, qualification: "Qualified" },
  { id: "U-004", name: "Marsela Doda", role: "Regulatory Specialist", department: "Regulatory Affairs", competency: 81, requiredTraining: 11, completedTraining: 9, expiredTraining: 1, qualification: "In Progress" },
  { id: "U-005", name: "Ilir Prifti", role: "Production Supervisor", department: "Thermoforming", competency: 90, requiredTraining: 13, completedTraining: 13, expiredTraining: 0, qualification: "Qualified" },
  { id: "U-006", name: "Erisa Kola", role: "QC Specialist", department: "Quality Control", competency: 88, requiredTraining: 12, completedTraining: 11, expiredTraining: 0, qualification: "Qualified" },
  { id: "U-007", name: "Dr. Klaudia Meta", role: "Clinical Reviewer", department: "Clinical", competency: 92, requiredTraining: 9, completedTraining: 9, expiredTraining: 0, qualification: "Qualified" },
  { id: "U-008", name: "Besnik Lami", role: "Internal Auditor", department: "Quality", competency: 85, requiredTraining: 10, completedTraining: 9, expiredTraining: 1, qualification: "In Progress" },
  { id: "U-009", name: "Fatjon Rama", role: "Design Lead", department: "Design", competency: 87, requiredTraining: 11, completedTraining: 11, expiredTraining: 0, qualification: "Qualified" },
  { id: "U-010", name: "Xheni Vata", role: "Warehouse Lead", department: "Warehouse", competency: 74, requiredTraining: 8, completedTraining: 6, expiredTraining: 0, qualification: "In Progress" },
  { id: "U-011", name: "Arben Doçi", role: "Thermoforming Operator", department: "Thermoforming", competency: 68, requiredTraining: 10, completedTraining: 7, expiredTraining: 2, qualification: "Gap" },
  { id: "U-012", name: "Elona Rugova", role: "Printing Operator", department: "Printing", competency: 79, requiredTraining: 9, completedTraining: 8, expiredTraining: 0, qualification: "In Progress" },
  { id: "U-013", name: "Blerim Cara", role: "Cutting Operator", department: "Cutting", competency: 52, requiredTraining: 9, completedTraining: 5, expiredTraining: 2, qualification: "Gap" },
  { id: "U-014", name: "Denada Leka", role: "Packaging Operator", department: "Packaging", competency: 83, requiredTraining: 8, completedTraining: 8, expiredTraining: 0, qualification: "Qualified" },
  { id: "U-015", name: "Redi Nushi", role: "QC Inspector", department: "Quality Control", competency: 71, requiredTraining: 10, completedTraining: 8, expiredTraining: 1, qualification: "In Progress" },
];

/* ---------- Summary metrics ---------- */

export const TRAINING_SUMMARY = {
  compliance: 89, // % of required training completed & current
  overdue: 6, // overdue assignments across workforce
  awaitingAssessment: 4, // completed courses pending assessment/approval
  upcomingExpirations: 7, // certificates expiring within 60 days
};

/* ---------- Department compliance (HorizontalBars) ---------- */

export const DEPARTMENT_COMPLIANCE: { label: string; value: number }[] = [
  { label: "Quality", value: 97 },
  { label: "Regulatory Affairs", value: 91 },
  { label: "Design", value: 93 },
  { label: "Quality Control", value: 86 },
  { label: "Thermoforming", value: 78 },
  { label: "Printing", value: 84 },
  { label: "Packaging", value: 90 },
  { label: "Cutting", value: 61 },
  { label: "Warehouse", value: 75 },
];

/* ---------- Competency / skills matrix ---------- */

export const COMPETENCY_MATRIX_COLUMNS: CompetencyMatrixColumn[] = [
  { key: "sop005", label: "SOP-QMS-005", hint: "Document & Record Control" },
  { key: "iso13485", label: "ISO 13485", hint: "QMS awareness" },
  { key: "mdr", label: "MDR Vigilance", hint: "Reporting & PMS" },
  { key: "wi012", label: "WI-PROD-012", hint: "Thermoforming WI" },
  { key: "thermo", label: "Thermoforming", hint: "Process qualification" },
  { key: "cutting", label: "Aligner Cutting", hint: "Trimming & finishing" },
  { key: "qc", label: "QC Inspection", hint: "Release inspection" },
  { key: "udi", label: "UDI / Labelling", hint: "Identification" },
];

const Q: MatrixLevel = "qualified";
const T: MatrixLevel = "training";
const N: MatrixLevel = "none";
const G: MatrixLevel = "gap";

export const COMPETENCY_MATRIX: CompetencyMatrixRow[] = [
  { employeeId: "U-002", name: "Anila Berisha", cells: { sop005: Q, iso13485: Q, mdr: Q, wi012: Q, thermo: Q, cutting: Q, qc: Q, udi: Q } },
  { employeeId: "U-003", name: "Genti Hoxha", cells: { sop005: Q, iso13485: Q, mdr: Q, wi012: N, thermo: N, cutting: N, qc: Q, udi: Q } },
  { employeeId: "U-004", name: "Marsela Doda", cells: { sop005: Q, iso13485: Q, mdr: T, wi012: N, thermo: N, cutting: N, qc: N, udi: Q } },
  { employeeId: "U-005", name: "Ilir Prifti", cells: { sop005: Q, iso13485: Q, mdr: Q, wi012: Q, thermo: Q, cutting: Q, qc: Q, udi: Q } },
  { employeeId: "U-006", name: "Erisa Kola", cells: { sop005: Q, iso13485: Q, mdr: Q, wi012: N, thermo: T, cutting: N, qc: Q, udi: Q } },
  { employeeId: "U-009", name: "Fatjon Rama", cells: { sop005: Q, iso13485: Q, mdr: N, wi012: N, thermo: N, cutting: N, qc: N, udi: Q } },
  { employeeId: "U-010", name: "Xheni Vata", cells: { sop005: Q, iso13485: T, mdr: N, wi012: N, thermo: N, cutting: N, qc: N, udi: T } },
  { employeeId: "U-011", name: "Arben Doçi", cells: { sop005: Q, iso13485: T, mdr: N, wi012: G, thermo: T, cutting: Q, qc: N, udi: N } },
  { employeeId: "U-012", name: "Elona Rugova", cells: { sop005: Q, iso13485: Q, mdr: N, wi012: T, thermo: N, cutting: N, qc: N, udi: Q } },
  { employeeId: "U-013", name: "Blerim Cara", cells: { sop005: T, iso13485: G, mdr: N, wi012: N, thermo: N, cutting: G, qc: N, udi: T } },
  { employeeId: "U-014", name: "Denada Leka", cells: { sop005: Q, iso13485: Q, mdr: N, wi012: N, thermo: N, cutting: N, qc: T, udi: Q } },
  { employeeId: "U-015", name: "Redi Nushi", cells: { sop005: Q, iso13485: Q, mdr: T, wi012: N, thermo: T, cutting: N, qc: T, udi: Q } },
];

/* ---------- In-progress training assignments (workflow) ---------- */

export const TRAINING_ASSIGNMENTS: TrainingAssignment[] = [
  { id: "TRN-2026-0142", employeeId: "U-011", employee: "Arben Doçi", courseCode: "WI-PROD-012 v4", course: "Thermoforming Work Instruction — Rev. 4", assignedDate: "2026-07-08", dueDate: "2026-07-24", state: "Assessment", progress: 70, assessor: "Ilir Prifti" },
  { id: "TRN-2026-0139", employeeId: "U-004", employee: "Marsela Doda", courseCode: "SOP-QMS-018", course: "MDR Vigilance & Incident Reporting", assignedDate: "2026-07-10", dueDate: "2026-07-28", state: "Completed", progress: 55, assessor: "Genti Hoxha" },
  { id: "TRN-2026-0151", employeeId: "U-013", employee: "Blerim Cara", courseCode: "SOP-QMS-005 v6", course: "Document & Record Control", assignedDate: "2026-07-15", dueDate: "2026-07-30", state: "Opened", progress: 25, assessor: "Anila Berisha" },
  { id: "TRN-2026-0136", employeeId: "U-015", employee: "Redi Nushi", courseCode: "WI-QC-007", course: "Aligner Release Inspection", assignedDate: "2026-07-02", dueDate: "2026-07-22", state: "Supervisor Approval", progress: 90, assessor: "Erisa Kola" },
  { id: "TRN-2026-0155", employeeId: "U-010", employee: "Xheni Vata", courseCode: "SOP-QMS-011", course: "ISO 13485 QMS Awareness", assignedDate: "2026-07-18", dueDate: "2026-08-05", state: "Assigned", progress: 5, assessor: "Besnik Lami" },
];

/* Sample assignment surfaced in the workflow stepper */
export const FEATURED_ASSIGNMENT_ID = "TRN-2026-0142";

/* ---------- Per-employee training detail (drawer) ---------- */

export const TRAINING_DETAIL: Record<string, EmployeeTrainingDetail> = {
  "U-011": {
    assigned: [
      { code: "WI-PROD-012 v4", title: "Thermoforming Work Instruction — Rev. 4", type: "Work Instruction", status: "In Progress", date: "2026-07-24" },
      { code: "SOP-QMS-011", title: "ISO 13485 QMS Awareness (refresh)", type: "SOP", status: "Assigned", date: "2026-08-02" },
    ],
    completed: [
      { code: "WI-PROD-004", title: "Aligner Trimming & Cutting", type: "Work Instruction", status: "Completed", date: "2026-03-11", certificate: "CERT-2026-0311" },
      { code: "SOP-QMS-005 v5", title: "Document & Record Control", type: "SOP", status: "Completed", date: "2025-11-20", certificate: "CERT-2025-1120" },
      { code: "EHS-002", title: "Machine Safety & PPE", type: "Onboarding", status: "Completed", date: "2025-09-05", certificate: "CERT-2025-0905" },
    ],
    expired: [
      { code: "WI-PROD-012 v3", title: "Thermoforming WI — superseded rev.", type: "Work Instruction", status: "Expired", date: "2026-06-30" },
      { code: "SOP-QMS-018", title: "MDR Vigilance Awareness", type: "Regulation", status: "Expired", date: "2026-05-15" },
    ],
    assessment: { status: "Awaiting", assessor: "Ilir Prifti", date: "2026-07-23" },
    certificates: [
      { code: "CERT-2026-0311", title: "Aligner Trimming & Cutting", issued: "2026-03-11", expires: "2027-03-11" },
      { code: "CERT-2025-0905", title: "Machine Safety & PPE", issued: "2025-09-05", expires: "2026-09-05" },
    ],
  },
  "U-013": {
    assigned: [
      { code: "SOP-QMS-005 v6", title: "Document & Record Control", type: "SOP", status: "In Progress", date: "2026-07-30" },
      { code: "WI-PROD-009", title: "Aligner Cutting — Requalification", type: "Work Instruction", status: "Overdue", date: "2026-07-12" },
      { code: "SOP-QMS-011", title: "ISO 13485 QMS Awareness", type: "SOP", status: "Overdue", date: "2026-07-05" },
    ],
    completed: [
      { code: "EHS-002", title: "Machine Safety & PPE", type: "Onboarding", status: "Completed", date: "2026-01-14", certificate: "CERT-2026-0114" },
      { code: "WI-PROD-004", title: "Aligner Trimming & Cutting", type: "Work Instruction", status: "Completed", date: "2025-10-02", certificate: "CERT-2025-1002" },
    ],
    expired: [
      { code: "WI-PROD-009 v2", title: "Aligner Cutting — prior rev.", type: "Work Instruction", status: "Expired", date: "2026-04-30" },
      { code: "SOP-QMS-005 v5", title: "Document & Record Control", type: "SOP", status: "Expired", date: "2026-06-01" },
    ],
    assessment: { status: "Scheduled", assessor: "Anila Berisha", date: "2026-07-31" },
    certificates: [
      { code: "CERT-2026-0114", title: "Machine Safety & PPE", issued: "2026-01-14", expires: "2027-01-14" },
    ],
  },
  "U-004": {
    assigned: [
      { code: "SOP-QMS-018", title: "MDR Vigilance & Incident Reporting", type: "Regulation", status: "In Progress", date: "2026-07-28" },
      { code: "SOP-QMS-022", title: "PMS & PSUR Preparation", type: "SOP", status: "Assigned", date: "2026-08-10" },
    ],
    completed: [
      { code: "SOP-QMS-005 v6", title: "Document & Record Control", type: "SOP", status: "Completed", date: "2026-06-18", certificate: "CERT-2026-0618" },
      { code: "SOP-QMS-011", title: "ISO 13485 QMS Awareness", type: "SOP", status: "Completed", date: "2026-02-09", certificate: "CERT-2026-0209" },
      { code: "REG-004", title: "EU MDR 2017/745 Fundamentals", type: "Regulation", status: "Completed", date: "2025-12-01", certificate: "CERT-2025-1201" },
    ],
    expired: [
      { code: "SOP-QMS-018 v2", title: "MDR Vigilance — prior rev.", type: "Regulation", status: "Expired", date: "2026-06-20" },
    ],
    assessment: { status: "Awaiting", assessor: "Genti Hoxha", date: "2026-07-29" },
    certificates: [
      { code: "CERT-2026-0618", title: "Document & Record Control", issued: "2026-06-18", expires: "2027-06-18" },
      { code: "CERT-2025-1201", title: "EU MDR Fundamentals", issued: "2025-12-01", expires: "2027-12-01" },
    ],
  },
};

/* Generic fallback detail for employees without a bespoke record */
export function trainingDetailFor(emp: Employee): EmployeeTrainingDetail {
  const bespoke = TRAINING_DETAIL[emp.id];
  if (bespoke) return bespoke;
  const done = emp.qualification === "Qualified";
  return {
    assigned: done
      ? [{ code: "SOP-QMS-005 v6", title: "Document & Record Control (annual refresh)", type: "SOP", status: "Assigned", date: "2026-09-15" }]
      : [{ code: "SOP-QMS-011", title: "ISO 13485 QMS Awareness", type: "SOP", status: "In Progress", date: "2026-08-01" }],
    completed: [
      { code: "SOP-QMS-005 v6", title: "Document & Record Control", type: "SOP", status: "Completed", date: "2026-05-12", certificate: "CERT-2026-0512" },
      { code: "EHS-001", title: "GMP & Cleanroom Discipline", type: "Onboarding", status: "Completed", date: "2025-08-20", certificate: "CERT-2025-0820" },
    ],
    expired: emp.expiredTraining > 0
      ? [{ code: "SOP-QMS-011 v3", title: "ISO 13485 Awareness — prior rev.", type: "SOP", status: "Expired", date: "2026-05-30" }]
      : [],
    assessment: done
      ? { status: "Passed", score: 96, assessor: "Anila Berisha", date: "2026-05-12" }
      : { status: "Awaiting", assessor: "Anila Berisha", date: "2026-07-30" },
    certificates: [
      { code: "CERT-2026-0512", title: "Document & Record Control", issued: "2026-05-12", expires: "2027-05-12" },
      { code: "CERT-2025-0820", title: "GMP & Cleanroom Discipline", issued: "2025-08-20", expires: "2026-08-20" },
    ],
  };
}
