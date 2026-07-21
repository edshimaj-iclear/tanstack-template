/* ============================================================
   iClear QMS — Domain Types
   ============================================================ */

export interface Person {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
}

export type DeviceClass = "Class I" | "Class IIa" | "Class IIb" | "Class III";
export type ProductStatus =
  | "Active"
  | "Draft"
  | "Under Review"
  | "Suspended";
export type LifecycleStage =
  | "Concept"
  | "Development"
  | "Verification"
  | "Validation"
  | "Regulatory Review"
  | "Released"
  | "Post-Market";

export interface Product {
  id: string;
  code: string;
  name: string;
  audience: "Adult" | "Pediatric";
  status: ProductStatus;
  deviceClass: DeviceClass;
  intendedUse: string;
  basicUdiDi: string;
  responsible: string;
  lifecycle: LifecycleStage;
  completion: number;
  techDoc: number;
  riskStatus: number;
  clinical: number;
  pms: number;
  udiStatus: "Complete" | "In Progress" | "Pending";
  lastReview: string;
  image?: string;
}

export type DocStatus =
  | "Draft"
  | "In Review"
  | "Approved"
  | "Effective"
  | "Superseded"
  | "Obsolete";

export interface QmsDocument {
  id: string;
  code: string;
  title: string;
  category: string;
  department: string;
  owner: string;
  version: string;
  status: DocStatus;
  effectiveDate: string;
  reviewDate: string;
  trainingRequired: boolean;
  approvalProgress: number;
}

export interface RiskItem {
  id: string;
  product: string;
  hazard: string;
  hazardousSituation: string;
  harm: string;
  severity: number; // 1-5
  probability: number; // 1-5
  initialRisk: number;
  controls: string;
  residualSeverity: number;
  residualProbability: number;
  residualRisk: number;
  status: "Open" | "Controlled" | "Monitor" | "Closed";
  owner: string;
}

export type CapaStatus =
  | "Open"
  | "Investigation"
  | "In Progress"
  | "Effectiveness Check"
  | "Closed"
  | "Overdue";

export interface Capa {
  id: string;
  title: string;
  source: string;
  severity: "Critical" | "Major" | "Minor";
  rootCause: string;
  owner: string;
  department: string;
  dueDate: string;
  status: CapaStatus;
  progress: number;
  effectiveness: "Pending" | "Passed" | "Failed" | "—";
  opened: string;
}

export interface Complaint {
  id: string;
  clinic: string;
  product: string;
  caseId: string;
  received: string;
  type: string;
  patientHarm: "None" | "Minor" | "Serious";
  seriousness: "Non-serious" | "Serious";
  reportability: "Not reportable" | "Under assessment" | "Reportable";
  investigation: "Open" | "Investigation" | "Closed";
  capaRequired: boolean;
  owner: string;
}

export type CaseStage =
  | "Case Received"
  | "Design"
  | "Internal Review"
  | "Doctor Approval"
  | "Production"
  | "Quality Control"
  | "Device Release"
  | "Packaging"
  | "Delivery"
  | "Closed";

export interface ProductionCase {
  id: string;
  patient: string;
  clinic: string;
  doctor: string;
  product: string;
  aligners: number;
  planVersion: string;
  designOperator: string;
  approvalDate: string;
  materialLot: string;
  thickness: string;
  machine: string;
  operator: string;
  qcResult: "Pass" | "Fail" | "Pending";
  stage: CaseStage;
  releaseStatus: "Released" | "On Hold" | "Pending";
  shipment: string;
  remakes: number;
  refinements: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  risk: "Low" | "Medium" | "High";
  qualification: "Qualified" | "Conditional" | "Under Qualification" | "Suspended";
  qualityAgreement: boolean;
  performance: number;
  delivery: number;
  defectRate: number;
  lastAudit: string;
  nextReassessment: string;
  openIssues: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  competency: number;
  requiredTraining: number;
  completedTraining: number;
  expiredTraining: number;
  qualification: "Qualified" | "In Progress" | "Gap";
}

export type AuditType =
  | "Internal"
  | "Supplier"
  | "Process"
  | "Regulatory"
  | "Notified Body"
  | "Mock";

export interface Audit {
  id: string;
  title: string;
  type: AuditType;
  scope: string;
  leadAuditor: string;
  date: string;
  status: "Planned" | "In Progress" | "Closed" | "Overdue";
  findings: { critical: number; major: number; minor: number; observation: number };
  closure: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  location: string;
  status:
    | "Operational"
    | "Maintenance Due"
    | "Calibration Due"
    | "Out of Service"
    | "Under Qualification";
  calibrationStatus: string;
  lastService: string;
  nextDue: string;
  deviations: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  department: string;
  owner: string;
  risk: "Low" | "Medium" | "High";
}

export interface TechDocSection {
  id: string;
  name: string;
  annex: string;
  completion: number;
  owner: string;
  reviewer: string;
  status: DocStatus;
  version: string;
  reviewDate: string;
  missingEvidence: string[];
  linkedDocs: number;
}
