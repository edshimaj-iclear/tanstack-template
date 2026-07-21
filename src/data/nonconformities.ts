/* ============================================================
   Nonconformities (NCR) — mock data
   Local types defined here; shared types untouched.
   ============================================================ */

export type NcrSource = "Incoming" | "In-process" | "Final QC" | "Customer";
export type NcrSeverity = "Critical" | "Major" | "Minor";
export type NcrDisposition =
  | "Rework"
  | "Scrap"
  | "Use-as-is"
  | "Return to supplier"
  | "Pending";
export type NcrStatus = "Open" | "Investigation" | "Closed";

export interface AuditEntry {
  title: string;
  time: string;
  actor: string;
  description?: string;
  tone?: "brand" | "success" | "warning" | "danger" | "info" | "regulatory" | "neutral";
}

export interface Nonconformity {
  id: string;
  source: NcrSource;
  product: string;
  description: string;
  department: string;
  severity: NcrSeverity;
  disposition: NcrDisposition;
  status: NcrStatus;
  capaId: string | null;
  owner: string;
  detectedDate: string;
  rootCauseHint: string;
  dispositionRationale: string;
  evidence: string[];
  auditTrail: AuditEntry[];
}

export const NONCONFORMITIES: Nonconformity[] = [
  {
    id: "NCR-2026-071",
    source: "Final QC",
    product: "iClear Aligners for Adults",
    description: "Sharp unpolished edge on lower anterior aligner detected at final inspection",
    department: "Polishing",
    severity: "Major",
    disposition: "Rework",
    status: "Investigation",
    capaId: "CAPA-2026-023",
    owner: "Erisa Kola",
    detectedDate: "2026-07-19",
    rootCauseHint: "Worn polishing wheel producing inconsistent edge finish; edge offset below WI spec.",
    dispositionRationale: "Reworkable — re-polish and re-inspect edge against smoothness criteria before release.",
    evidence: ["QC inspection sheet QC-2026-0719", "Photo micrograph EDGE-071", "WI-POL-004 rev C"],
    auditTrail: [
      { title: "NCR raised at Final QC", time: "2026-07-19 09:12", actor: "Erisa Kola", tone: "danger", description: "Edge sharpness outside acceptance criteria." },
      { title: "Quarantined & tagged", time: "2026-07-19 09:40", actor: "Erisa Kola", tone: "warning" },
      { title: "Disposition: Rework approved", time: "2026-07-19 14:05", actor: "Anila Berisha", tone: "info" },
      { title: "Linked to CAPA-2026-023", time: "2026-07-20 08:30", actor: "Anila Berisha", tone: "regulatory" },
    ],
  },
  {
    id: "NCR-2026-072",
    source: "Incoming",
    product: "TPU raw material",
    description: "Incoming TPU lot LOT-TPU-2026-0718 shows haze and surface tackiness on sample coupons",
    department: "Quality Control",
    severity: "Critical",
    disposition: "Return to supplier",
    status: "Investigation",
    capaId: "CAPA-2026-019",
    owner: "Genti Hoxha",
    detectedDate: "2026-07-18",
    rootCauseHint: "Suspected moisture ingress or incomplete curing at supplier; correlates with complaint CMP-2026-109.",
    dispositionRationale: "Lot quarantined and returned to supplier; SCAR issued pending certificate-of-analysis review.",
    evidence: ["Incoming inspection IIR-2026-0718", "Supplier CoA LOT-TPU-2026-0718", "Coupon haze test HT-072"],
    auditTrail: [
      { title: "NCR raised on incoming lot", time: "2026-07-18 10:20", actor: "Erisa Kola", tone: "danger", description: "Visual haze + tackiness on 3/5 coupons." },
      { title: "Lot placed on hold (quarantine)", time: "2026-07-18 10:45", actor: "Genti Hoxha", tone: "warning" },
      { title: "Supplier SCAR issued", time: "2026-07-19 11:00", actor: "Genti Hoxha", tone: "regulatory" },
      { title: "Disposition: Return to supplier", time: "2026-07-20 09:15", actor: "Anila Berisha", tone: "info" },
    ],
  },
  {
    id: "NCR-2026-073",
    source: "In-process",
    product: "iClear Aligners for Adults",
    description: "Thermoformed part thickness 0.62mm vs 0.75mm target on thermoformer TF-03",
    department: "Thermoforming",
    severity: "Major",
    disposition: "Scrap",
    status: "Investigation",
    capaId: "CAPA-2026-024",
    owner: "Ilir Prifti",
    detectedDate: "2026-07-17",
    rootCauseHint: "Forming pressure drift on TF-03; over-thinning at deep contours.",
    dispositionRationale: "Out-of-spec thickness not reworkable — scrap affected parts; machine parameters re-validated.",
    evidence: ["Thickness log TH-2026-0717", "TF-03 pressure trace", "Scrap record SCR-073"],
    auditTrail: [
      { title: "NCR raised in-process", time: "2026-07-17 13:30", actor: "Ilir Prifti", tone: "danger" },
      { title: "Batch segregated", time: "2026-07-17 13:50", actor: "Ilir Prifti", tone: "warning" },
      { title: "Disposition: Scrap", time: "2026-07-18 08:40", actor: "Anila Berisha", tone: "info", description: "12 parts scrapped." },
      { title: "Linked to CAPA-2026-024", time: "2026-07-18 09:10", actor: "Anila Berisha", tone: "regulatory" },
    ],
  },
  {
    id: "NCR-2026-074",
    source: "Final QC",
    product: "iClear Aligners for Kids",
    description: "Stage label mismatch — pouch labelled stage 8 contained stage 7 device",
    department: "Packaging",
    severity: "Major",
    disposition: "Rework",
    status: "Open",
    capaId: "CAPA-2026-022",
    owner: "Xheni Vata",
    detectedDate: "2026-07-15",
    rootCauseHint: "Manual label application without barcode verification; feeds complaint CMP-2026-103.",
    dispositionRationale: "Re-label with verified stage mapping and 100% barcode check before release.",
    evidence: ["Packaging record PKG-2026-0625", "Label reconciliation LR-074"],
    auditTrail: [
      { title: "NCR raised at Final QC", time: "2026-07-15 15:10", actor: "Erisa Kola", tone: "danger" },
      { title: "Set held", time: "2026-07-15 15:25", actor: "Xheni Vata", tone: "warning" },
      { title: "Linked to CAPA-2026-022", time: "2026-07-16 09:00", actor: "Anila Berisha", tone: "regulatory" },
    ],
  },
  {
    id: "NCR-2026-075",
    source: "Customer",
    product: "iClear Aligners for Adults",
    description: "Clinic-returned aligner fractured at distal molar edge (from complaint CMP-2026-101)",
    department: "Quality",
    severity: "Major",
    disposition: "Use-as-is",
    status: "Investigation",
    capaId: "CAPA-2026-024",
    owner: "Anila Berisha",
    detectedDate: "2026-07-18",
    rootCauseHint: "Micro-notch from over-thinning during forming; same lot as NCR-2026-073.",
    dispositionRationale: "Returned unit retained as evidence (use-as-is for investigation only, not for patient use).",
    evidence: ["Returned device RMA-075", "Fracture analysis FA-075", "Complaint CMP-2026-101"],
    auditTrail: [
      { title: "NCR opened from complaint", time: "2026-07-18 11:00", actor: "Anila Berisha", tone: "danger" },
      { title: "Fracture analysis started", time: "2026-07-19 10:00", actor: "Erisa Kola", tone: "info" },
      { title: "Linked to CAPA-2026-024", time: "2026-07-19 10:30", actor: "Anila Berisha", tone: "regulatory" },
    ],
  },
  {
    id: "NCR-2026-076",
    source: "In-process",
    product: "iClear Retainers",
    description: "Polishing scratches visible on retainer occlusal surface",
    department: "Polishing",
    severity: "Minor",
    disposition: "Rework",
    status: "Closed",
    capaId: "CAPA-2026-014",
    owner: "Ilir Prifti",
    detectedDate: "2026-07-10",
    rootCauseHint: "Worn polishing wheel — contamination on abrasive.",
    dispositionRationale: "Re-polished with new wheel; surface acceptable on re-inspection.",
    evidence: ["QC re-inspection QC-076", "Wheel replacement log EQ-076"],
    auditTrail: [
      { title: "NCR raised in-process", time: "2026-07-10 09:30", actor: "Ilir Prifti", tone: "danger" },
      { title: "Disposition: Rework", time: "2026-07-10 13:00", actor: "Anila Berisha", tone: "info" },
      { title: "Re-inspected — pass", time: "2026-07-11 10:15", actor: "Erisa Kola", tone: "success" },
      { title: "NCR closed", time: "2026-07-12 09:00", actor: "Anila Berisha", tone: "success" },
    ],
  },
  {
    id: "NCR-2026-077",
    source: "Incoming",
    product: "Pouch packaging film",
    description: "Incoming pouch film roll width out of tolerance (+2.1mm)",
    department: "Warehouse",
    severity: "Minor",
    disposition: "Return to supplier",
    status: "Closed",
    capaId: null,
    owner: "Xheni Vata",
    detectedDate: "2026-07-08",
    rootCauseHint: "Supplier slitting variation; isolated roll.",
    dispositionRationale: "Roll returned; replacement within spec received and released.",
    evidence: ["Incoming inspection IIR-2026-0708", "Return note RN-077"],
    auditTrail: [
      { title: "NCR raised on incoming film", time: "2026-07-08 11:00", actor: "Xheni Vata", tone: "danger" },
      { title: "Disposition: Return to supplier", time: "2026-07-08 14:30", actor: "Genti Hoxha", tone: "info" },
      { title: "Replacement received & released", time: "2026-07-11 09:45", actor: "Xheni Vata", tone: "success" },
      { title: "NCR closed", time: "2026-07-11 16:00", actor: "Anila Berisha", tone: "success" },
    ],
  },
  {
    id: "NCR-2026-078",
    source: "In-process",
    product: "iClear Aligners for Kids",
    description: "Duplicate stage geometry exported from design (stage 4 = stage 5)",
    department: "Design",
    severity: "Major",
    disposition: "Scrap",
    status: "Investigation",
    capaId: "CAPA-2026-020",
    owner: "Fatjon Rama",
    detectedDate: "2026-07-08",
    rootCauseHint: "Staging export tool duplicated a stage model; QC geometry compare did not flag identical stages.",
    dispositionRationale: "Duplicated stage scrapped; correct stage re-designed and re-formed.",
    evidence: ["Design export log DX-078", "Geometry compare report GC-078", "Complaint CMP-2026-108"],
    auditTrail: [
      { title: "NCR raised (design export)", time: "2026-07-08 10:00", actor: "Fatjon Rama", tone: "danger" },
      { title: "Affected stage scrapped", time: "2026-07-08 15:00", actor: "Ilir Prifti", tone: "warning" },
      { title: "Linked to CAPA-2026-020", time: "2026-07-09 09:00", actor: "Anila Berisha", tone: "regulatory" },
    ],
  },
  {
    id: "NCR-2026-079",
    source: "Final QC",
    product: "iClear Night Guard",
    description: "Incomplete edge polish on buccal flange of night guard",
    department: "Quality Control",
    severity: "Minor",
    disposition: "Rework",
    status: "Closed",
    capaId: "CAPA-2026-023",
    owner: "Erisa Kola",
    detectedDate: "2026-07-05",
    rootCauseHint: "Edge finishing step skipped; feeds gingival-irritation trend.",
    dispositionRationale: "Re-polished flange; edge smoothness confirmed before release.",
    evidence: ["QC sheet QC-079", "Edge photo EDGE-079"],
    auditTrail: [
      { title: "NCR raised at Final QC", time: "2026-07-05 14:00", actor: "Erisa Kola", tone: "danger" },
      { title: "Disposition: Rework", time: "2026-07-05 16:00", actor: "Anila Berisha", tone: "info" },
      { title: "NCR closed", time: "2026-07-07 10:00", actor: "Anila Berisha", tone: "success" },
    ],
  },
  {
    id: "NCR-2026-080",
    source: "In-process",
    product: "iClear Aligners for Adults",
    description: "Count mismatch at packing — 19 stages packed vs 20 required",
    department: "Packaging",
    severity: "Minor",
    disposition: "Rework",
    status: "Closed",
    capaId: null,
    owner: "Xheni Vata",
    detectedDate: "2026-07-04",
    rootCauseHint: "Manual count error; two-person verification not performed.",
    dispositionRationale: "Missing stage located and added; full set re-verified before dispatch.",
    evidence: ["Packing record PKG-080", "Count verification CV-080"],
    auditTrail: [
      { title: "NCR raised in-process", time: "2026-07-04 12:00", actor: "Xheni Vata", tone: "danger" },
      { title: "Disposition: Rework", time: "2026-07-04 13:30", actor: "Anila Berisha", tone: "info" },
      { title: "NCR closed", time: "2026-07-05 09:00", actor: "Anila Berisha", tone: "success" },
    ],
  },
  {
    id: "NCR-2026-081",
    source: "Customer",
    product: "iClear Aligners for Adults",
    description: "Cloudy/tacky aligners reported by clinic — material appearance defect (from CMP-2026-109)",
    department: "Quality",
    severity: "Critical",
    disposition: "Pending",
    status: "Open",
    capaId: "CAPA-2026-019",
    owner: "Anila Berisha",
    detectedDate: "2026-07-06",
    rootCauseHint: "Suspect incoming material lot LOT-TPU-2026-0718; biocompatibility re-review requested.",
    dispositionRationale: "Disposition pending biocompatibility assessment and supplier SCAR outcome; devices from lot on hold.",
    evidence: ["Complaint CMP-2026-109", "Lot hold record HOLD-081", "Biocomp request BIO-081"],
    auditTrail: [
      { title: "NCR opened from complaint", time: "2026-07-06 15:00", actor: "Anila Berisha", tone: "danger" },
      { title: "Affected lot placed on hold", time: "2026-07-06 15:30", actor: "Genti Hoxha", tone: "warning" },
      { title: "Biocompatibility review requested", time: "2026-07-07 09:00", actor: "Dr. Klaudia Meta", tone: "regulatory" },
    ],
  },
  {
    id: "NCR-2026-082",
    source: "In-process",
    product: "iClear Retainers",
    description: "Thin section at midline near deep palatal contour on retainer",
    department: "Thermoforming",
    severity: "Minor",
    disposition: "Use-as-is",
    status: "Closed",
    capaId: null,
    owner: "Ilir Prifti",
    detectedDate: "2026-06-28",
    rootCauseHint: "Geometry-driven thinning at deep contour; within min-thickness tolerance.",
    dispositionRationale: "Use-as-is — thickness within acceptance limits; design note added for future cases.",
    evidence: ["Thickness map TM-082", "Design note DN-082"],
    auditTrail: [
      { title: "NCR raised in-process", time: "2026-06-28 11:00", actor: "Ilir Prifti", tone: "danger" },
      { title: "Engineering review", time: "2026-06-29 10:00", actor: "Fatjon Rama", tone: "info" },
      { title: "Disposition: Use-as-is", time: "2026-06-29 14:00", actor: "Anila Berisha", tone: "info" },
      { title: "NCR closed", time: "2026-06-30 09:00", actor: "Anila Berisha", tone: "success" },
    ],
  },
  {
    id: "NCR-2026-083",
    source: "Final QC",
    product: "iClear Aligners for Adults",
    description: "Posterior over-extension on stage 1 model exceeding trim line",
    department: "Cutting",
    severity: "Minor",
    disposition: "Rework",
    status: "Closed",
    capaId: null,
    owner: "Erisa Kola",
    detectedDate: "2026-06-24",
    rootCauseHint: "Trim line offset at posterior; within reworkable range.",
    dispositionRationale: "Re-trimmed to spec and re-inspected; released.",
    evidence: ["QC sheet QC-083", "Trim record TR-083"],
    auditTrail: [
      { title: "NCR raised at Final QC", time: "2026-06-24 10:30", actor: "Erisa Kola", tone: "danger" },
      { title: "Disposition: Rework", time: "2026-06-24 13:00", actor: "Anila Berisha", tone: "info" },
      { title: "NCR closed", time: "2026-06-26 09:00", actor: "Anila Berisha", tone: "success" },
    ],
  },
  {
    id: "NCR-2026-084",
    source: "Incoming",
    product: "TPU raw material",
    description: "Supplier CoA missing tensile-strength data for received TPU lot",
    department: "Regulatory Affairs",
    severity: "Minor",
    disposition: "Use-as-is",
    status: "Closed",
    capaId: null,
    owner: "Genti Hoxha",
    detectedDate: "2026-06-20",
    rootCauseHint: "Documentation omission on supplier certificate; material itself conforming.",
    dispositionRationale: "Use-as-is after supplier provided complete CoA; documentation reconciled.",
    evidence: ["Supplier CoA rev 2", "Incoming inspection IIR-2026-0620"],
    auditTrail: [
      { title: "NCR raised on incoming docs", time: "2026-06-20 09:00", actor: "Genti Hoxha", tone: "danger" },
      { title: "Updated CoA requested", time: "2026-06-20 11:00", actor: "Marsela Doda", tone: "info" },
      { title: "CoA received & reconciled", time: "2026-06-23 10:00", actor: "Genti Hoxha", tone: "success" },
      { title: "NCR closed", time: "2026-06-23 15:00", actor: "Anila Berisha", tone: "success" },
    ],
  },
];

/* ---------- Aggregate helpers ---------- */

export const NCR_SUMMARY = {
  open: NONCONFORMITIES.filter((n) => n.status !== "Closed").length,
  critical: NONCONFORMITIES.filter((n) => n.severity === "Critical").length,
  awaitingDisposition: NONCONFORMITIES.filter((n) => n.disposition === "Pending").length,
  linkedToCapa: NONCONFORMITIES.filter((n) => n.capaId).length,
};

export function countBy<K extends keyof Nonconformity>(key: K) {
  const map = new Map<string, number>();
  for (const n of NONCONFORMITIES) {
    const v = String(n[key]);
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export const NCR_BY_SEVERITY = countBy("severity");
export const NCR_BY_SOURCE = countBy("source");
