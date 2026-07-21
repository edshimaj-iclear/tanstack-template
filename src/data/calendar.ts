import type { CalendarEvent } from "../types";

/* ============================================================
   iClear QMS — Regulatory Calendar data
   ============================================================ */

/** Regulatory / quality event categories tracked on the calendar. */
export type EventType =
  | "document review"
  | "CER update"
  | "PMS review"
  | "PMCF update"
  | "PSUR deadline"
  | "internal audit"
  | "supplier requalification"
  | "equipment calibration"
  | "management review"
  | "Notified Body audit"
  | "certificate expiry"
  | "training expiry";

type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "regulatory";

/** Consistent visual language per event type: badge tone + month-grid pill classes + dot. */
export interface EventTone {
  label: string;
  tone: BadgeTone;
  /** Classes for the compact month-grid pill. */
  pill: string;
  /** Solid dot colour for list/timeline accents. */
  dot: string;
}

export const EVENT_TONES: Record<EventType, EventTone> = {
  "document review": {
    label: "Document review",
    tone: "info",
    pill: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    dot: "bg-blue-500",
  },
  "CER update": {
    label: "CER update",
    tone: "regulatory",
    pill: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    dot: "bg-violet-500",
  },
  "PMS review": {
    label: "PMS review",
    tone: "brand",
    pill: "bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100",
    dot: "bg-brand-500",
  },
  "PMCF update": {
    label: "PMCF update",
    tone: "regulatory",
    pill: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    dot: "bg-violet-500",
  },
  "PSUR deadline": {
    label: "PSUR deadline",
    tone: "danger",
    pill: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    dot: "bg-red-500",
  },
  "internal audit": {
    label: "Internal audit",
    tone: "warning",
    pill: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    dot: "bg-amber-500",
  },
  "supplier requalification": {
    label: "Supplier requalification",
    tone: "info",
    pill: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
    dot: "bg-sky-500",
  },
  "equipment calibration": {
    label: "Equipment calibration",
    tone: "neutral",
    pill: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
    dot: "bg-slate-500",
  },
  "management review": {
    label: "Management review",
    tone: "brand",
    pill: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    dot: "bg-teal-500",
  },
  "Notified Body audit": {
    label: "Notified Body audit",
    tone: "danger",
    pill: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    dot: "bg-rose-500",
  },
  "certificate expiry": {
    label: "Certificate expiry",
    tone: "danger",
    pill: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    dot: "bg-red-600",
  },
  "training expiry": {
    label: "Training expiry",
    tone: "warning",
    pill: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    dot: "bg-amber-500",
  },
};

/** Ordered list of types for filter chips. */
export const EVENT_TYPES = Object.keys(EVENT_TONES) as EventType[];

/**
 * ~20 regulatory events spread across Jul–Dec 2026.
 * Today = 2026-07-21 (a few July items are already overdue / imminent).
 */
export const CAL_EVENTS: CalendarEvent[] = [
  {
    id: "CAL-2026-101",
    title: "SOP-QMS-005 periodic review — Document Control",
    type: "document review",
    date: "2026-07-14",
    department: "Quality",
    owner: "Anila Berisha",
    risk: "Medium",
  },
  {
    id: "CAL-2026-102",
    title: "PSUR submission — iClear Aligner System (Class IIa)",
    type: "PSUR deadline",
    date: "2026-07-18",
    department: "Regulatory Affairs",
    owner: "Genti Hoxha",
    risk: "High",
  },
  {
    id: "CAL-2026-103",
    title: "Printer EQP-PRN-008 quarterly calibration",
    type: "equipment calibration",
    date: "2026-07-21",
    department: "Printing",
    owner: "Ilir Prifti",
    risk: "Medium",
  },
  {
    id: "CAL-2026-104",
    title: "PMS trend review Q2 2026 — complaints & vigilance",
    type: "PMS review",
    date: "2026-07-24",
    department: "Regulatory Affairs",
    owner: "Marsela Doda",
    risk: "Medium",
  },
  {
    id: "CAL-2026-105",
    title: "Internal audit AUD-2026-006 — Production & QC",
    type: "internal audit",
    date: "2026-07-29",
    department: "Quality",
    owner: "Besnik Lami",
    risk: "Medium",
  },
  {
    id: "CAL-2026-106",
    title: "WI-PROD-012 thermoforming work instruction review",
    type: "document review",
    date: "2026-07-31",
    department: "Thermoforming",
    owner: "Ilir Prifti",
    risk: "Low",
  },
  {
    id: "CAL-2026-107",
    title: "CER update — iClear Aligner System literature refresh",
    type: "CER update",
    date: "2026-08-06",
    department: "Clinical",
    owner: "Dr. Klaudia Meta",
    risk: "High",
  },
  {
    id: "CAL-2026-108",
    title: "Supplier SUP-014 requalification — TPU resin",
    type: "supplier requalification",
    date: "2026-08-12",
    department: "Quality",
    owner: "Anila Berisha",
    risk: "Medium",
  },
  {
    id: "CAL-2026-109",
    title: "PMCF evaluation report update — retention outcomes",
    type: "PMCF update",
    date: "2026-08-20",
    department: "Clinical",
    owner: "Dr. Klaudia Meta",
    risk: "Medium",
  },
  {
    id: "CAL-2026-110",
    title: "GMP/EtO sterility training expiry — QC team",
    type: "training expiry",
    date: "2026-08-27",
    department: "Quality Control",
    owner: "Erisa Kola",
    risk: "Low",
  },
  {
    id: "CAL-2026-111",
    title: "Management review meeting — H1 2026 QMS performance",
    type: "management review",
    date: "2026-09-03",
    department: "Management",
    owner: "Edison Shimaj",
    risk: "High",
  },
  {
    id: "CAL-2026-112",
    title: "Design dossier review — refinement workflow update",
    type: "document review",
    date: "2026-09-10",
    department: "Design",
    owner: "Fatjon Rama",
    risk: "Low",
  },
  {
    id: "CAL-2026-113",
    title: "Thermoforming press TF-04 annual calibration",
    type: "equipment calibration",
    date: "2026-09-17",
    department: "Thermoforming",
    owner: "Ilir Prifti",
    risk: "Medium",
  },
  {
    id: "CAL-2026-114",
    title: "PMS review Q3 2026 — post-market surveillance report",
    type: "PMS review",
    date: "2026-09-30",
    department: "Regulatory Affairs",
    owner: "Marsela Doda",
    risk: "Medium",
  },
  {
    id: "CAL-2026-115",
    title: "Notified Body surveillance audit — MDR Annex IX",
    type: "Notified Body audit",
    date: "2026-10-08",
    department: "Regulatory Affairs",
    owner: "Genti Hoxha",
    risk: "High",
  },
  {
    id: "CAL-2026-116",
    title: "Supplier SUP-021 requalification — packaging films",
    type: "supplier requalification",
    date: "2026-10-15",
    department: "Warehouse",
    owner: "Xheni Vata",
    risk: "Low",
  },
  {
    id: "CAL-2026-117",
    title: "Internal audit AUD-2026-007 — Regulatory & Clinical",
    type: "internal audit",
    date: "2026-10-27",
    department: "Quality",
    owner: "Besnik Lami",
    risk: "Medium",
  },
  {
    id: "CAL-2026-118",
    title: "ISO 13485:2016 certificate expiry — recertification due",
    type: "certificate expiry",
    date: "2026-11-12",
    department: "Quality",
    owner: "Anila Berisha",
    risk: "High",
  },
  {
    id: "CAL-2026-119",
    title: "CER update — pediatric indication clinical evidence",
    type: "CER update",
    date: "2026-11-24",
    department: "Clinical",
    owner: "Dr. Klaudia Meta",
    risk: "Medium",
  },
  {
    id: "CAL-2026-120",
    title: "PSUR submission — iClear Retainer (Class I)",
    type: "PSUR deadline",
    date: "2026-12-04",
    department: "Regulatory Affairs",
    owner: "Genti Hoxha",
    risk: "High",
  },
  {
    id: "CAL-2026-121",
    title: "Management review — annual QMS effectiveness & planning",
    type: "management review",
    date: "2026-12-16",
    department: "Management",
    owner: "Edison Shimaj",
    risk: "High",
  },
];
