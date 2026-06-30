// Central definitions for the QMS "enum" string fields + Albanian labels.

export const ROLES = ["CEO", "QUALITY_MANAGER", "TECHNICAL_DIRECTOR", "OPERATOR", "QC", "SALES"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<string, string> = {
  CEO: "CEO",
  QUALITY_MANAGER: "Quality Manager",
  TECHNICAL_DIRECTOR: "Drejtor Teknik",
  OPERATOR: "Operator",
  QC: "Kontroll Cilësie",
  SALES: "Shitje",
};

// The production flow — order matters (defines the case journey / DHR)
export const STAGES = [
  "RECEIVED",
  "DESIGN",
  "PLAN_APPROVAL",
  "PRINTING",
  "POST_PROCESS",
  "THERMOFORMING",
  "TRIMMING",
  "LASER_MARKING",
  "FINAL_QC",
  "PACKAGING",
  "SHIPPING",
] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<string, string> = {
  RECEIVED: "Pranim",
  DESIGN: "Dizajn Dixhital",
  PLAN_APPROVAL: "Aprovim Mjekësor",
  PRINTING: "Printim 3D",
  POST_PROCESS: "Post-Procesim",
  THERMOFORMING: "Termoformim",
  TRIMMING: "Prerje",
  LASER_MARKING: "Gravim Lazer",
  FINAL_QC: "QC Final",
  PACKAGING: "Paketim",
  SHIPPING: "Dërgesë",
  COMPLETED: "Përfunduar",
};

export const CASE_STATUS_LABELS: Record<string, string> = {
  OPEN: "Hapur",
  IN_PRODUCTION: "Në Prodhim",
  ON_HOLD: "Në Pritje",
  COMPLETED: "Përfunduar",
  SHIPPED: "Dërguar",
  CANCELLED: "Anuluar",
};

export const STEP_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pret",
  IN_PROGRESS: "Në proces",
  PASSED: "Kaluar",
  FAILED: "Dështuar",
  HOLD: "Pezulluar",
};

export const PRIORITY_LABELS: Record<string, string> = {
  NORMAL: "Normal",
  RUSH: "Urgjent",
};

export function nextStage(stage: string): Stage | null {
  const i = STAGES.indexOf(stage as Stage);
  if (i === -1 || i === STAGES.length - 1) return null;
  return STAGES[i + 1];
}

// Tone for status pills used across the UI
export type Tone = "pass" | "hold" | "fail" | "info" | "neutral";

export function caseStatusTone(status: string): Tone {
  switch (status) {
    case "COMPLETED":
    case "SHIPPED":
      return "pass";
    case "ON_HOLD":
      return "hold";
    case "CANCELLED":
      return "fail";
    case "IN_PRODUCTION":
      return "info";
    default:
      return "neutral";
  }
}

// ── Module 4: Documents ─────────────────────────────────────────
export const DOC_TYPE_LABELS: Record<string, string> = {
  QM: "Quality Manual", SOP: "Procedurë (SOP)", WI: "Udhëzim Pune (WI)",
  FRM: "Formular (FRM)", REC: "Regjistrim (REC)", POL: "Politikë (POL)",
};
export const DOC_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft", REVIEW: "Në rishikim", APPROVED: "Aprovuar", OBSOLETE: "I vjetëruar",
};
export function docStatusTone(s: string): Tone {
  switch (s) { case "APPROVED": return "pass"; case "REVIEW": return "hold"; case "OBSOLETE": return "fail"; default: return "neutral"; }
}

// ── Module 7: CAPA ──────────────────────────────────────────────
export const CAPA_STATUS_LABELS: Record<string, string> = {
  OPEN: "Hapur", INVESTIGATION: "Hetim", IN_PROGRESS: "Në veprim", VERIFICATION: "Verifikim", CLOSED: "Mbyllur",
};
export const CAPA_SOURCE_LABELS: Record<string, string> = {
  COMPLAINT: "Ankesë", AUDIT: "Auditim", INTERNAL: "I brendshëm", KPI: "KPI",
};
export const CAPA_FLOW = ["OPEN", "INVESTIGATION", "IN_PROGRESS", "VERIFICATION", "CLOSED"] as const;
export function capaStatusTone(s: string): Tone {
  switch (s) { case "CLOSED": return "pass"; case "VERIFICATION": return "info"; case "OPEN": return "fail"; default: return "hold"; }
}

// ── Module 15: Complaints ───────────────────────────────────────
export const COMPLAINT_STATUS_LABELS: Record<string, string> = {
  OPEN: "Hapur", INVESTIGATION: "Hetim", DECISION: "Vendim", CLOSED: "Mbyllur",
};
export function complaintStatusTone(s: string): Tone {
  switch (s) { case "CLOSED": return "pass"; case "DECISION": return "info"; case "OPEN": return "fail"; default: return "hold"; }
}

// ── Module 8: Risk ──────────────────────────────────────────────
export const RISK_STATUS_LABELS: Record<string, string> = {
  OPEN: "Hapur", MITIGATED: "Zbutur", ACCEPTED: "Pranuar",
};
export function riskTone(score: number): Tone {
  if (score >= 15) return "fail";
  if (score >= 8) return "hold";
  return "pass";
}
export function riskLevel(score: number): string {
  if (score >= 15) return "I lartë";
  if (score >= 8) return "Mesatar";
  return "I ulët";
}

// ── Module 9: Training ──────────────────────────────────────────
export const COMPETENCIES = ["STL", "PRINTER", "CURE", "THERMO", "QC", "SHIPPING"] as const;
export const COMPETENCY_LABELS: Record<string, string> = {
  STL: "STL", PRINTER: "Printim", CURE: "Curing", THERMO: "Termoformim", QC: "QC", SHIPPING: "Dërgesë",
};
export const TRAINING_LEVEL_LABELS: Record<string, string> = {
  NONE: "Pa trajnim", TRAINING: "Në trajnim", QUALIFIED: "I kualifikuar",
};
export function trainingTone(level: string): Tone {
  if (level === "QUALIFIED") return "pass";
  if (level === "TRAINING") return "hold";
  return "neutral";
}

// ── Module 10: Equipment ────────────────────────────────────────
export const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  PRINTER: "Printer 3D", WASHER: "Larëse", CURE: "Curing", THERMOFORMER: "Termoformues", LASER: "Lazer", OTHER: "Tjetër",
};
export const EQUIPMENT_STATUS_LABELS: Record<string, string> = {
  OPERATIONAL: "Operacional", MAINTENANCE: "Mirëmbajtje", DOWN: "Jashtë pune",
};
export const EQUIPMENT_EVENT_LABELS: Record<string, string> = {
  IQ: "IQ · Instalim", OQ: "OQ · Operacional", PQ: "PQ · Performancë", CALIBRATION: "Kalibrim", MAINTENANCE: "Mirëmbajtje",
};
export function equipmentTone(s: string): Tone {
  switch (s) { case "OPERATIONAL": return "pass"; case "MAINTENANCE": return "hold"; case "DOWN": return "fail"; default: return "neutral"; }
}

// ── Module 11/12: Suppliers & Lots ──────────────────────────────
export const SUPPLIER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Në pritje", APPROVED: "Aprovuar", SUSPENDED: "Pezulluar",
};
export function supplierTone(s: string): Tone {
  switch (s) { case "APPROVED": return "pass"; case "SUSPENDED": return "fail"; default: return "hold"; }
}
export const LOT_STATUS_LABELS: Record<string, string> = {
  QUARANTINE: "Karantinë", ACCEPTED: "Pranuar", REJECTED: "Refuzuar", EXPIRED: "Skaduar",
};
export function lotTone(s: string): Tone {
  switch (s) { case "ACCEPTED": return "pass"; case "REJECTED": case "EXPIRED": return "fail"; default: return "hold"; }
}

// ── Module 13/14: QC ────────────────────────────────────────────
export const QC_TYPE_LABELS: Record<string, string> = {
  INCOMING: "Pranim", IN_PROCESS: "Në proces", FINAL: "Final",
};
export const QC_RESULT_LABELS: Record<string, string> = {
  PASS: "Kaluar", FAIL: "Dështuar", CONDITIONAL: "Me kusht",
};
export function qcResultTone(r: string): Tone {
  switch (r) { case "PASS": return "pass"; case "FAIL": return "fail"; default: return "hold"; }
}
// SOP-010 Final inspection checklist
export const FINAL_QC_CHECKS = ["dimensions", "transparency", "fit", "edges", "label", "patient_name", "packaging"] as const;
export const FINAL_QC_LABELS: Record<string, string> = {
  dimensions: "Dimensionet", transparency: "Transparenca", fit: "Adaptimi (Fit)", edges: "Skajet",
  label: "Etiketa / ID", patient_name: "Emri i pacientit", packaging: "Paketimi",
};

// ── Module 16: Audits ───────────────────────────────────────────
export const AUDIT_AREA_LABELS: Record<string, string> = {
  SALES: "Shitje", PRODUCTION: "Prodhim", QC: "Kontroll Cilësie", SHIPPING: "Dërgesa",
  DOCUMENTATION: "Dokumentacion", TRACEABILITY: "Gjurmueshmëri", TRAINING: "Trajnim",
};
export const AUDIT_STATUS_LABELS: Record<string, string> = { OPEN: "Hapur", CLOSED: "Mbyllur" };

// Sequential code helpers
export function seqCode(prefix: string, seq: number, width = 3) {
  return `${prefix}-${new Date().getFullYear()}-${String(seq).padStart(width, "0")}`;
}
