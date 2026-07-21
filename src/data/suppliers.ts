import type { Supplier } from "../types";

/* ============================================================
   Supplier Management — mock data (SUP-011..020)
   Extended detail types are defined locally to this module.
   ============================================================ */

export const SUPPLIERS: Supplier[] = [
  {
    id: "SUP-011",
    name: "PolyForm Materials GmbH",
    category: "Aligner material",
    risk: "High",
    qualification: "Qualified",
    qualityAgreement: true,
    performance: 96,
    delivery: 94,
    defectRate: 0.4,
    lastAudit: "2026-03-12",
    nextReassessment: "2027-03-12",
    openIssues: 1,
  },
  {
    id: "SUP-012",
    name: "ClearResin Ltd",
    category: "Resin",
    risk: "High",
    qualification: "Qualified",
    qualityAgreement: true,
    performance: 92,
    delivery: 90,
    defectRate: 0.7,
    lastAudit: "2026-02-04",
    nextReassessment: "2027-02-04",
    openIssues: 2,
  },
  {
    id: "SUP-013",
    name: "MedPack Solutions",
    category: "Packaging",
    risk: "Medium",
    qualification: "Qualified",
    qualityAgreement: true,
    performance: 89,
    delivery: 96,
    defectRate: 0.9,
    lastAudit: "2026-05-20",
    nextReassessment: "2027-05-20",
    openIssues: 0,
  },
  {
    id: "SUP-014",
    name: "FormaTech Systems",
    category: "Thermoforming equipment",
    risk: "High",
    qualification: "Conditional",
    qualityAgreement: false,
    performance: 74,
    delivery: 71,
    defectRate: 2.6,
    lastAudit: "2026-01-16",
    nextReassessment: "2026-08-16",
    openIssues: 4,
  },
  {
    id: "SUP-015",
    name: "StrataPrint 3D",
    category: "Printing equipment",
    risk: "Medium",
    qualification: "Qualified",
    qualityAgreement: true,
    performance: 88,
    delivery: 85,
    defectRate: 1.1,
    lastAudit: "2026-04-09",
    nextReassessment: "2027-04-09",
    openIssues: 1,
  },
  {
    id: "SUP-016",
    name: "DentalCAD Software AG",
    category: "Software",
    risk: "Medium",
    qualification: "Under Qualification",
    qualityAgreement: false,
    performance: 81,
    delivery: 92,
    defectRate: 0.0,
    lastAudit: "2026-06-25",
    nextReassessment: "2026-09-25",
    openIssues: 2,
  },
  {
    id: "SUP-017",
    name: "EuroMed Logistics",
    category: "Transport",
    risk: "Medium",
    qualification: "Under Qualification",
    qualityAgreement: false,
    performance: 78,
    delivery: 82,
    defectRate: 1.8,
    lastAudit: "2026-06-02",
    nextReassessment: "2026-08-02",
    openIssues: 2,
  },
  {
    id: "SUP-018",
    name: "BioAssure Laboratories",
    category: "Laboratory services",
    risk: "Low",
    qualification: "Qualified",
    qualityAgreement: true,
    performance: 94,
    delivery: 91,
    defectRate: 0.2,
    lastAudit: "2026-03-28",
    nextReassessment: "2027-03-28",
    openIssues: 0,
  },
  {
    id: "SUP-019",
    name: "Aligna Polymers S.p.A.",
    category: "Aligner material",
    risk: "High",
    qualification: "Suspended",
    qualityAgreement: true,
    performance: 58,
    delivery: 63,
    defectRate: 4.9,
    lastAudit: "2026-06-30",
    nextReassessment: "2026-07-30",
    openIssues: 5,
  },
  {
    id: "SUP-020",
    name: "SealRight Packaging",
    category: "Packaging",
    risk: "Low",
    qualification: "Qualified",
    qualityAgreement: true,
    performance: 91,
    delivery: 88,
    defectRate: 0.6,
    lastAudit: "2026-05-11",
    nextReassessment: "2027-05-11",
    openIssues: 0,
  },
];

/* ---------- Summary metrics ---------- */
export const SUPPLIER_SUMMARY = {
  total: SUPPLIERS.length,
  qualified: SUPPLIERS.filter((s) => s.qualification === "Qualified").length,
  underQualification: SUPPLIERS.filter(
    (s) => s.qualification === "Under Qualification" || s.qualification === "Conditional",
  ).length,
  highRisk: SUPPLIERS.filter((s) => s.risk === "High").length,
  openIssues: SUPPLIERS.reduce((a, s) => a + s.openIssues, 0),
  avgPerformance: Math.round(
    SUPPLIERS.reduce((a, s) => a + s.performance, 0) / SUPPLIERS.length,
  ),
};

/* ============================================================
   Radar scores per supplier (Overview / Performance tab)
   ============================================================ */
export type RadarPoint = { axis: string; value: number };

export const SUPPLIER_RADAR: Record<string, RadarPoint[]> = {
  "SUP-011": radar(96, 94, 92, 90, 95),
  "SUP-012": radar(92, 90, 88, 85, 91),
  "SUP-013": radar(89, 96, 84, 88, 87),
  "SUP-014": radar(74, 71, 62, 68, 65),
  "SUP-015": radar(88, 85, 80, 84, 86),
  "SUP-016": radar(81, 92, 78, 90, 72),
  "SUP-017": radar(78, 82, 70, 74, 76),
  "SUP-018": radar(94, 91, 96, 89, 97),
  "SUP-019": radar(58, 63, 55, 52, 48),
  "SUP-020": radar(91, 88, 86, 90, 89),
};

function radar(
  quality: number,
  delivery: number,
  documentation: number,
  responsiveness: number,
  compliance: number,
): RadarPoint[] {
  return [
    { axis: "Quality", value: quality },
    { axis: "Delivery", value: delivery },
    { axis: "Documentation", value: documentation },
    { axis: "Responsiveness", value: responsiveness },
    { axis: "Compliance", value: compliance },
  ];
}

/* ============================================================
   Extended detail (drawer tabs)
   ============================================================ */
export interface SupplierContact {
  name: string;
  role: string;
  email: string;
  phone: string;
  primary?: boolean;
}

export interface SupplierCertificate {
  standard: string;
  scope: string;
  number: string;
  issuer: string;
  issued: string;
  expiry: string;
}

export interface SupplierDocument {
  id: string;
  title: string;
  type: string;
  version: string;
  status: string;
  updated: string;
}

export interface SupplierAudit {
  id: string;
  date: string;
  type: string;
  result: "Passed" | "Passed with findings" | "Failed";
  major: number;
  minor: number;
  observation: number;
  auditor: string;
}

export interface SupplierScar {
  id: string;
  opened: string;
  title: string;
  severity: "Critical" | "Major" | "Minor";
  status: "Open" | "Investigation" | "Effectiveness Check" | "Closed";
  due: string;
  owner: string;
}

export interface SupplierComplaintRef {
  id: string;
  date: string;
  description: string;
  lot: string;
  disposition: string;
}

export interface SupplierHistoryEvent {
  title: string;
  time: string;
  description?: string;
  actor?: string;
  tone?: "brand" | "success" | "warning" | "danger" | "info" | "regulatory" | "neutral";
}

export interface TrendPoint {
  month: string;
  received: number;
  rejected: number;
  defectPpm: number;
}

export interface PerfPoint {
  month: string;
  performance: number;
  delivery: number;
}

export interface SupplierDetail {
  address: string;
  country: string;
  since: string;
  approvedBy: string;
  spend: string;
  criticality: string;
  materials: string[];
  qualificationNote: string;
  contacts: SupplierContact[];
  certificates: SupplierCertificate[];
  documents: SupplierDocument[];
  audits: SupplierAudit[];
  scars: SupplierScar[];
  complaints: SupplierComplaintRef[];
  defectTrend: TrendPoint[];
  perfHistory: PerfPoint[];
  history: SupplierHistoryEvent[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

function defectTrend(base: number, decreasing = true): TrendPoint[] {
  return MONTHS.map((month, i) => {
    const drift = decreasing ? (MONTHS.length - i) : i + 1;
    const ppm = Math.max(0, Math.round(base * drift * 10));
    const received = 40 + i * 6;
    const rejected = Math.round((ppm / 1_000_000) * received * 1000) % 6;
    return { month, received, rejected, defectPpm: ppm };
  });
}

function perfHistory(end: number, delEnd: number): PerfPoint[] {
  return MONTHS.map((month, i) => ({
    month,
    performance: Math.round(end - (MONTHS.length - 1 - i) * 1.4),
    delivery: Math.round(delEnd - (MONTHS.length - 1 - i) * 1.1),
  }));
}

export const SUPPLIER_DETAIL: Record<string, SupplierDetail> = {
  "SUP-011": {
    address: "Industriestraße 14, 55218 Ingelheim",
    country: "Germany",
    since: "2019-04",
    approvedBy: "Anila Berisha",
    spend: "€1.42M / yr",
    criticality: "Critical — direct patient-contact raw material",
    materials: ["Medical TPU sheet 0.75mm", "Medical TPU sheet 1.00mm"],
    qualificationNote:
      "Full on-site qualification completed. ISO 13485 certified, biocompatibility dossier (ISO 10993) on file. CoA verified per lot.",
    contacts: [
      { name: "Dr. Katrin Vogel", role: "Quality Director", email: "k.vogel@polyform.de", phone: "+49 6132 8800", primary: true },
      { name: "Markus Reinhardt", role: "Key Account Manager", email: "m.reinhardt@polyform.de", phone: "+49 6132 8842" },
    ],
    certificates: [
      { standard: "ISO 13485:2016", scope: "Medical device polymer manufacturing", number: "MD 660214", issuer: "TÜV SÜD", issued: "2024-05-01", expiry: "2027-04-30" },
      { standard: "ISO 9001:2015", scope: "Quality management system", number: "QS 110284", issuer: "TÜV SÜD", issued: "2024-05-01", expiry: "2027-04-30" },
      { standard: "ISO 10993", scope: "Biological evaluation dossier", number: "BIO-2024-118", issuer: "BioAssure Labs", issued: "2024-06-18", expiry: "2027-06-17" },
    ],
    documents: [
      { id: "QAG-011", title: "Quality Agreement — PolyForm", type: "Quality Agreement", version: "v3.1", status: "Effective", updated: "2026-01-20" },
      { id: "SDS-TPU-075", title: "Safety Data Sheet — TPU 0.75mm", type: "SDS", version: "v2.0", status: "Effective", updated: "2025-11-04" },
      { id: "CoA-TPU-0718", title: "CoA — Lot TPU-2026-0718", type: "Certificate of Analysis", version: "—", status: "Approved", updated: "2026-07-18" },
    ],
    audits: [
      { id: "AUD-2026-004", date: "2026-03-12", type: "On-site", result: "Passed", major: 0, minor: 1, observation: 2, auditor: "Besnik Lami" },
      { id: "AUD-2025-011", date: "2025-03-08", type: "On-site", result: "Passed", major: 0, minor: 2, observation: 1, auditor: "Besnik Lami" },
    ],
    scars: [
      { id: "SCAR-2026-008", opened: "2026-06-14", title: "Minor haze deviation on TPU lot 0611", severity: "Minor", status: "Effectiveness Check", due: "2026-08-14", owner: "Anila Berisha" },
    ],
    complaints: [],
    defectTrend: defectTrend(0.5),
    perfHistory: perfHistory(96, 94),
    history: [
      { title: "Reassessment scheduled", time: "Mar 2027", description: "Annual on-site re-qualification", tone: "info" },
      { title: "Audit AUD-2026-004 closed", time: "Mar 2026", description: "1 minor, 2 observations — all actions verified", actor: "Besnik Lami", tone: "success" },
      { title: "Quality Agreement renewed v3.1", time: "Jan 2026", tone: "brand" },
      { title: "Supplier qualified", time: "Apr 2019", description: "Initial approval as critical raw-material supplier", tone: "success" },
    ],
  },
  "SUP-012": {
    address: "Unit 7, Meridian Business Park, Leicester LE19",
    country: "United Kingdom",
    since: "2020-09",
    approvedBy: "Anila Berisha",
    spend: "€680K / yr",
    criticality: "Critical — photopolymer resin for model printing",
    materials: ["Model resin ClearBase", "Support resin FastWash"],
    qualificationNote:
      "Qualified supplier. Two open deviations under monitoring related to viscosity variability between batches.",
    contacts: [
      { name: "Sarah Whitfield", role: "QA Manager", email: "s.whitfield@clearresin.co.uk", phone: "+44 116 244 1200", primary: true },
      { name: "James Okoro", role: "Technical Sales", email: "j.okoro@clearresin.co.uk", phone: "+44 116 244 1233" },
    ],
    certificates: [
      { standard: "ISO 13485:2016", scope: "Photopolymer resin manufacture", number: "MD 552011", issuer: "BSI", issued: "2023-09-15", expiry: "2026-09-14" },
      { standard: "ISO 9001:2015", scope: "Quality management system", number: "FS 88214", issuer: "BSI", issued: "2023-09-15", expiry: "2026-09-14" },
    ],
    documents: [
      { id: "QAG-012", title: "Quality Agreement — ClearResin", type: "Quality Agreement", version: "v2.4", status: "Effective", updated: "2025-09-30" },
      { id: "SDS-RES-CB", title: "Safety Data Sheet — ClearBase", type: "SDS", version: "v1.6", status: "Effective", updated: "2025-08-11" },
    ],
    audits: [
      { id: "AUD-2026-002", date: "2026-02-04", type: "On-site", result: "Passed with findings", major: 1, minor: 2, observation: 1, auditor: "Besnik Lami" },
    ],
    scars: [
      { id: "SCAR-2026-006", opened: "2026-05-22", title: "Viscosity out of specification — batch CB-2251", severity: "Major", status: "Investigation", due: "2026-08-05", owner: "Erisa Kola" },
      { id: "SCAR-2026-003", opened: "2026-03-01", title: "Late CoA submission", severity: "Minor", status: "Closed", due: "2026-04-01", owner: "Anila Berisha" },
    ],
    complaints: [
      { id: "CMP-2026-088", date: "2026-05-19", description: "Model surface roughness linked to resin batch", lot: "CB-2251", disposition: "Batch quarantined & returned" },
    ],
    defectTrend: defectTrend(0.8),
    perfHistory: perfHistory(92, 90),
    history: [
      { title: "SCAR-2026-006 raised", time: "May 2026", description: "Viscosity OOS, investigation open", tone: "warning" },
      { title: "Audit AUD-2026-002 completed", time: "Feb 2026", description: "1 major finding — CAPA requested", actor: "Besnik Lami", tone: "warning" },
      { title: "ISO 13485 certificate expiring", time: "Sep 2026", description: "Renewal evidence requested", tone: "danger" },
    ],
  },
  "SUP-013": {
    address: "Via dell'Industria 22, 20090 Milano",
    country: "Italy",
    since: "2021-02",
    approvedBy: "Xheni Vata",
    spend: "€310K / yr",
    criticality: "Medium — primary & secondary packaging",
    materials: ["Tamper-evident pouches", "Retainer boxes"],
    qualificationNote: "Qualified. Strong delivery performance, no open findings.",
    contacts: [
      { name: "Giulia Ferrari", role: "Quality Lead", email: "g.ferrari@medpack.it", phone: "+39 02 4488 1100", primary: true },
    ],
    certificates: [
      { standard: "ISO 13485:2016", scope: "Medical device packaging", number: "MD 774120", issuer: "DNV", issued: "2025-01-10", expiry: "2028-01-09" },
      { standard: "ISO 15378", scope: "Primary packaging GMP", number: "PKG-2025-044", issuer: "DNV", issued: "2025-01-10", expiry: "2028-01-09" },
    ],
    documents: [
      { id: "QAG-013", title: "Quality Agreement — MedPack", type: "Quality Agreement", version: "v1.8", status: "Effective", updated: "2025-06-02" },
    ],
    audits: [
      { id: "AUD-2026-009", date: "2026-05-20", type: "Remote", result: "Passed", major: 0, minor: 0, observation: 1, auditor: "Anila Berisha" },
    ],
    scars: [],
    complaints: [],
    defectTrend: defectTrend(0.9),
    perfHistory: perfHistory(89, 96),
    history: [
      { title: "Remote audit passed", time: "May 2026", description: "No findings, 1 observation", tone: "success" },
      { title: "ISO 15378 certificate added", time: "Jan 2025", tone: "brand" },
    ],
  },
  "SUP-014": {
    address: "Zone Industrielle Sud, 69800 Saint-Priest",
    country: "France",
    since: "2022-06",
    approvedBy: "Ilir Prifti",
    spend: "€540K / yr",
    criticality: "High — thermoforming line & spare parts",
    materials: ["Thermoformer TF-900", "Vacuum station spares"],
    qualificationNote:
      "Conditional qualification. Quality Agreement not yet signed; equipment IQ/OQ completed, PQ pending. Reassessment due Aug 2026.",
    contacts: [
      { name: "Philippe Marchand", role: "Service Manager", email: "p.marchand@formatech.fr", phone: "+33 4 7290 5500", primary: true },
      { name: "Claire Dubois", role: "Contracts", email: "c.dubois@formatech.fr", phone: "+33 4 7290 5522" },
    ],
    certificates: [
      { standard: "ISO 9001:2015", scope: "Machine manufacturing & service", number: "FR 220144", issuer: "AFNOR", issued: "2024-11-01", expiry: "2027-10-31" },
      { standard: "CE Machinery Directive", scope: "TF-900 declaration of conformity", number: "DoC-TF900-22", issuer: "Self-declared", issued: "2022-05-30", expiry: "—" },
    ],
    documents: [
      { id: "IQ-TF900", title: "IQ/OQ Protocol — TF-900", type: "Qualification", version: "v1.0", status: "Approved", updated: "2026-02-01" },
      { id: "PQ-TF900", title: "PQ Protocol — TF-900", type: "Qualification", version: "v0.4", status: "Draft", updated: "2026-07-08" },
    ],
    audits: [
      { id: "AUD-2026-001", date: "2026-01-16", type: "On-site", result: "Passed with findings", major: 2, minor: 3, observation: 2, auditor: "Besnik Lami" },
    ],
    scars: [
      { id: "SCAR-2026-009", opened: "2026-06-28", title: "Temperature uniformity out of tolerance on TF-900", severity: "Major", status: "Investigation", due: "2026-08-16", owner: "Ilir Prifti" },
      { id: "SCAR-2026-007", opened: "2026-05-30", title: "Missing calibration certificate for supplied sensor", severity: "Minor", status: "Open", due: "2026-08-01", owner: "Erisa Kola" },
      { id: "SCAR-2026-002", opened: "2026-02-10", title: "Spare part dimensional nonconformity", severity: "Major", status: "Effectiveness Check", due: "2026-07-25", owner: "Ilir Prifti" },
    ],
    complaints: [],
    defectTrend: defectTrend(2.4, false),
    perfHistory: perfHistory(74, 71),
    history: [
      { title: "Reassessment due", time: "Aug 2026", description: "Conditional status decision point", tone: "warning" },
      { title: "SCAR-2026-009 raised", time: "Jun 2026", description: "Temperature uniformity major NC", tone: "danger" },
      { title: "Conditional qualification granted", time: "Jul 2022", description: "Quality Agreement outstanding", tone: "warning" },
    ],
  },
  "SUP-015": {
    address: "Technologiepark 8, 5656 AE Eindhoven",
    country: "Netherlands",
    since: "2021-11",
    approvedBy: "Fatjon Rama",
    spend: "€420K / yr",
    criticality: "Medium — model 3D printers & maintenance",
    materials: ["SLA printer SP-Pro", "Resin tank consumables"],
    qualificationNote: "Qualified. Preventive maintenance contract active, one minor open action.",
    contacts: [
      { name: "Lars Jansen", role: "Field Service Lead", email: "l.jansen@strataprint.nl", phone: "+31 40 250 7700", primary: true },
    ],
    certificates: [
      { standard: "ISO 9001:2015", scope: "Additive manufacturing equipment", number: "NL 331902", issuer: "Kiwa", issued: "2024-03-20", expiry: "2027-03-19" },
    ],
    documents: [
      { id: "QAG-015", title: "Service & Quality Agreement — StrataPrint", type: "Quality Agreement", version: "v2.0", status: "Effective", updated: "2025-10-15" },
      { id: "PM-SPPRO", title: "Preventive Maintenance Plan — SP-Pro", type: "Maintenance", version: "v1.3", status: "Effective", updated: "2026-04-09" },
    ],
    audits: [
      { id: "AUD-2026-006", date: "2026-04-09", type: "Remote", result: "Passed", major: 0, minor: 1, observation: 0, auditor: "Anila Berisha" },
    ],
    scars: [
      { id: "SCAR-2026-005", opened: "2026-04-20", title: "Calibration drift on SP-Pro laser", severity: "Minor", status: "Effectiveness Check", due: "2026-07-30", owner: "Fatjon Rama" },
    ],
    complaints: [],
    defectTrend: defectTrend(1.0),
    perfHistory: perfHistory(88, 85),
    history: [
      { title: "Remote audit passed", time: "Apr 2026", description: "1 minor finding", tone: "success" },
      { title: "Maintenance contract renewed", time: "Oct 2025", tone: "brand" },
    ],
  },
  "SUP-016": {
    address: "Bahnhofstrasse 45, 8001 Zürich",
    country: "Switzerland",
    since: "2026-01",
    approvedBy: "Fatjon Rama",
    spend: "€96K / yr",
    criticality: "Medium — treatment-planning CAD software (SaMD adjacent)",
    materials: ["AlignCAD Suite (license)", "Cloud rendering module"],
    qualificationNote:
      "Under qualification. CSV validation in progress per GAMP 5. Software supplier assessment questionnaire returned; on-site not required.",
    contacts: [
      { name: "Nadia Keller", role: "Regulatory & Quality", email: "n.keller@dentalcad.ch", phone: "+41 44 500 3300", primary: true },
      { name: "Thomas Brunner", role: "Customer Success", email: "t.brunner@dentalcad.ch", phone: "+41 44 500 3312" },
    ],
    certificates: [
      { standard: "ISO 13485:2016", scope: "Design & development of dental software", number: "CH 190455", issuer: "SQS", issued: "2025-02-14", expiry: "2028-02-13" },
      { standard: "ISO 27001", scope: "Information security management", number: "IS 660210", issuer: "SQS", issued: "2025-02-14", expiry: "2028-02-13" },
    ],
    documents: [
      { id: "SAQ-016", title: "Software Supplier Assessment Questionnaire", type: "Assessment", version: "v1.0", status: "In Review", updated: "2026-06-25" },
      { id: "CSV-016", title: "CSV / GAMP 5 Validation Plan", type: "Validation", version: "v0.6", status: "Draft", updated: "2026-07-10" },
    ],
    audits: [],
    scars: [
      { id: "SCAR-2026-010", opened: "2026-07-01", title: "Change-notification clause missing from agreement", severity: "Minor", status: "Open", due: "2026-09-01", owner: "Marsela Doda" },
    ],
    complaints: [],
    defectTrend: defectTrend(0.1),
    perfHistory: perfHistory(81, 92),
    history: [
      { title: "CSV validation in progress", time: "Jul 2026", description: "GAMP 5 category 4 assessment", tone: "info" },
      { title: "Supplier assessment received", time: "Jun 2026", tone: "info" },
      { title: "Added to approved-supplier pipeline", time: "Jan 2026", tone: "brand" },
    ],
  },
  "SUP-017": {
    address: "Rr. Kavajës 132, 1001 Tirana",
    country: "Albania",
    since: "2025-10",
    approvedBy: "Xheni Vata",
    spend: "€145K / yr",
    criticality: "Medium — cold-chain agnostic device transport",
    materials: ["Express courier service", "Temperature-monitored transport"],
    qualificationNote:
      "Under qualification. Delivery-integrity study running; GDP-style transport verification pending completion.",
    contacts: [
      { name: "Enkeleda Hoxha", role: "Operations Manager", email: "e.hoxha@euromedlog.al", phone: "+355 4 222 8800", primary: true },
    ],
    certificates: [
      { standard: "ISO 9001:2015", scope: "Logistics & distribution", number: "AL 040121", issuer: "TÜV NORD", issued: "2024-07-01", expiry: "2027-06-30" },
    ],
    documents: [
      { id: "TRV-017", title: "Transport Verification Study", type: "Validation", version: "v0.8", status: "In Review", updated: "2026-06-30" },
    ],
    audits: [
      { id: "AUD-2026-011", date: "2026-06-02", type: "On-site", result: "Passed with findings", major: 0, minor: 2, observation: 3, auditor: "Besnik Lami" },
    ],
    scars: [
      { id: "SCAR-2026-011", opened: "2026-07-05", title: "Two shipments delivered outside SLA window", severity: "Minor", status: "Open", due: "2026-08-05", owner: "Xheni Vata" },
    ],
    complaints: [
      { id: "CMP-2026-091", date: "2026-06-27", description: "Delayed delivery to clinic — 3 days late", lot: "SHP-2026-0620", disposition: "Root cause: carrier hub backlog" },
    ],
    defectTrend: defectTrend(1.7, false),
    perfHistory: perfHistory(78, 82),
    history: [
      { title: "Transport verification under review", time: "Jun 2026", tone: "info" },
      { title: "On-site audit — 2 minor findings", time: "Jun 2026", actor: "Besnik Lami", tone: "warning" },
      { title: "Added as candidate carrier", time: "Oct 2025", tone: "brand" },
    ],
  },
  "SUP-018": {
    address: "Science Park 402, 1098 XH Amsterdam",
    country: "Netherlands",
    since: "2019-08",
    approvedBy: "Genti Hoxha",
    spend: "€220K / yr",
    criticality: "High — biocompatibility & release testing (ISO 10993 / ISO 17025)",
    materials: ["ISO 10993 test panel", "Cytotoxicity & sensitization testing"],
    qualificationNote: "Qualified. Accredited test lab, exemplary documentation, no open issues.",
    contacts: [
      { name: "Dr. Hannah de Vries", role: "Laboratory Director", email: "h.devries@bioassure.nl", phone: "+31 20 599 4400", primary: true },
      { name: "Peter Molenaar", role: "Study Coordinator", email: "p.molenaar@bioassure.nl", phone: "+31 20 599 4412" },
    ],
    certificates: [
      { standard: "ISO/IEC 17025", scope: "Testing laboratory accreditation", number: "RvA L-482", issuer: "RvA", issued: "2024-09-01", expiry: "2028-08-31" },
      { standard: "ISO 13485:2016", scope: "Medical device testing services", number: "MD 601277", issuer: "DEKRA", issued: "2024-09-01", expiry: "2027-08-31" },
      { standard: "GLP Compliance", scope: "Good Laboratory Practice", number: "GLP-NL-118", issuer: "IGJ", issued: "2025-01-15", expiry: "2027-01-14" },
    ],
    documents: [
      { id: "QAG-018", title: "Quality Agreement — BioAssure", type: "Quality Agreement", version: "v2.2", status: "Effective", updated: "2025-09-01" },
      { id: "TR-10993-24", title: "Biocompatibility Test Report 2024", type: "Test Report", version: "final", status: "Approved", updated: "2024-06-18" },
    ],
    audits: [
      { id: "AUD-2026-005", date: "2026-03-28", type: "On-site", result: "Passed", major: 0, minor: 0, observation: 1, auditor: "Genti Hoxha" },
    ],
    scars: [],
    complaints: [],
    defectTrend: defectTrend(0.2),
    perfHistory: perfHistory(94, 91),
    history: [
      { title: "On-site audit passed", time: "Mar 2026", description: "Zero findings", tone: "success" },
      { title: "ISO 17025 re-accreditation", time: "Sep 2024", tone: "brand" },
    ],
  },
  "SUP-019": {
    address: "Via Torino 88, 10093 Collegno (TO)",
    country: "Italy",
    since: "2020-03",
    approvedBy: "Anila Berisha",
    spend: "€0 (on hold)",
    criticality: "Critical — secondary aligner material source (suspended)",
    materials: ["TPU sheet 0.75mm (backup)"],
    qualificationNote:
      "SUSPENDED. Repeated defect rate exceedances and a critical audit finding on lot traceability. Purchasing blocked pending CAPA effectiveness. Reassessment 30 Jul 2026.",
    contacts: [
      { name: "Alessandro Bianchi", role: "Quality Manager", email: "a.bianchi@alignapolymers.it", phone: "+39 011 402 6600", primary: true },
    ],
    certificates: [
      { standard: "ISO 13485:2016", scope: "Polymer sheet manufacture", number: "MD 448120", issuer: "IMQ", issued: "2023-04-01", expiry: "2026-03-31" },
    ],
    documents: [
      { id: "QAG-019", title: "Quality Agreement — Aligna", type: "Quality Agreement", version: "v1.5", status: "Effective", updated: "2024-03-01" },
      { id: "NCR-2026-081", title: "NCR — Traceability failure lot AP-2244", type: "Nonconformity", version: "—", status: "Open", updated: "2026-07-01" },
    ],
    audits: [
      { id: "AUD-2026-012", date: "2026-06-30", type: "For-cause", result: "Failed", major: 3, minor: 4, observation: 1, auditor: "Besnik Lami" },
      { id: "AUD-2025-014", date: "2025-06-24", type: "On-site", result: "Passed with findings", major: 1, minor: 3, observation: 2, auditor: "Besnik Lami" },
    ],
    scars: [
      { id: "SCAR-2026-012", opened: "2026-07-01", title: "Lot traceability failure — critical", severity: "Critical", status: "Investigation", due: "2026-07-30", owner: "Anila Berisha" },
      { id: "SCAR-2026-004", opened: "2026-03-14", title: "Defect rate exceedance Q1", severity: "Major", status: "Open", due: "2026-08-14", owner: "Erisa Kola" },
    ],
    complaints: [
      { id: "CMP-2026-076", date: "2026-06-12", description: "Sheet delamination during thermoforming", lot: "AP-2244", disposition: "Lot rejected, supplier suspended" },
      { id: "CMP-2026-069", date: "2026-04-30", description: "Thickness variability outside spec", lot: "AP-2210", disposition: "CAPA raised" },
    ],
    defectTrend: defectTrend(4.6, false),
    perfHistory: perfHistory(58, 63),
    history: [
      { title: "Supplier suspended", time: "Jul 2026", description: "Purchasing blocked pending CAPA", tone: "danger" },
      { title: "For-cause audit FAILED", time: "Jun 2026", description: "3 major findings, critical traceability NC", actor: "Besnik Lami", tone: "danger" },
      { title: "Complaint CMP-2026-076", time: "Jun 2026", description: "Delamination during thermoforming", tone: "warning" },
      { title: "ISO 13485 certificate expired", time: "Mar 2026", tone: "danger" },
    ],
  },
  "SUP-020": {
    address: "Gewerbestraße 3, 4020 Linz",
    country: "Austria",
    since: "2022-01",
    approvedBy: "Xheni Vata",
    spend: "€185K / yr",
    criticality: "Low — secondary packaging & inserts",
    materials: ["Retainer boxes", "IFU inserts (printed)"],
    qualificationNote: "Qualified. Reliable secondary supplier, no open findings.",
    contacts: [
      { name: "Julia Wagner", role: "Account Manager", email: "j.wagner@sealright.at", phone: "+43 732 770 900", primary: true },
    ],
    certificates: [
      { standard: "ISO 9001:2015", scope: "Packaging & print", number: "AT 552019", issuer: "Quality Austria", issued: "2024-06-01", expiry: "2027-05-31" },
      { standard: "FSC Chain of Custody", scope: "Responsible sourcing", number: "FSC-C155210", issuer: "SGS", issued: "2024-06-01", expiry: "2029-05-31" },
    ],
    documents: [
      { id: "QAG-020", title: "Quality Agreement — SealRight", type: "Quality Agreement", version: "v1.4", status: "Effective", updated: "2025-05-11" },
    ],
    audits: [
      { id: "AUD-2026-010", date: "2026-05-11", type: "Remote", result: "Passed", major: 0, minor: 1, observation: 0, auditor: "Anila Berisha" },
    ],
    scars: [],
    complaints: [],
    defectTrend: defectTrend(0.6),
    perfHistory: perfHistory(91, 88),
    history: [
      { title: "Remote audit passed", time: "May 2026", description: "1 minor finding", tone: "success" },
      { title: "Qualified as secondary packaging supplier", time: "Jan 2022", tone: "brand" },
    ],
  },
};
