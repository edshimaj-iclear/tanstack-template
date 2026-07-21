import type { ProductionCase } from "../types";

export const PRODUCTION_STAGES = [
  "Case Received",
  "Design",
  "Internal Review",
  "Doctor Approval",
  "Production",
  "Quality Control",
  "Device Release",
  "Packaging",
  "Delivery",
  "Closed",
] as const;

export const CASES: ProductionCase[] = [
  { id: "CASE-2026-4821", patient: "Patient A.K.", clinic: "Smile Dental Tirana", doctor: "Dr. Leka", product: "iClear Aligners for Adults", aligners: 24, planVersion: "v3", designOperator: "Fatjon Rama", approvalDate: "2026-07-08", materialLot: "LOT-TPU-2026-0718", thickness: "0.75 mm", machine: "TF-03", operator: "Ilir Prifti", qcResult: "Pass", stage: "Delivery", releaseStatus: "Released", shipment: "AL-DHL-88213", remakes: 0, refinements: 1 },
  { id: "CASE-2026-4822", patient: "Patient B.M.", clinic: "OrthoCare Durrës", doctor: "Dr. Frashëri", product: "iClear Hero Aligners for Kids", aligners: 18, planVersion: "v2", designOperator: "Fatjon Rama", approvalDate: "2026-07-10", materialLot: "LOT-TPU-2026-0718", thickness: "0.625 mm", machine: "TF-01", operator: "Ilir Prifti", qcResult: "Pass", stage: "Quality Control", releaseStatus: "Pending", shipment: "—", remakes: 0, refinements: 0 },
  { id: "CASE-2026-4823", patient: "Patient C.R.", clinic: "Dental Studio Vlorë", doctor: "Dr. Marku", product: "iClear Aligners for Adults", aligners: 30, planVersion: "v4", designOperator: "Fatjon Rama", approvalDate: "2026-07-11", materialLot: "LOT-TPU-2026-0705", thickness: "0.75 mm", machine: "TF-03", operator: "Ilir Prifti", qcResult: "Fail", stage: "Production", releaseStatus: "On Hold", shipment: "—", remakes: 1, refinements: 0 },
  { id: "CASE-2026-4824", patient: "Patient D.S.", clinic: "Smile Dental Tirana", doctor: "Dr. Leka", product: "iClear Retainers for Adults", aligners: 2, planVersion: "v1", designOperator: "Fatjon Rama", approvalDate: "2026-07-12", materialLot: "LOT-TPU-2026-0705", thickness: "1.0 mm", machine: "TF-02", operator: "Ilir Prifti", qcResult: "Pass", stage: "Packaging", releaseStatus: "Released", shipment: "—", remakes: 0, refinements: 0 },
  { id: "CASE-2026-4825", patient: "Patient E.H.", clinic: "OrthoCare Durrës", doctor: "Dr. Frashëri", product: "iClear Aligners for Adults", aligners: 22, planVersion: "v2", designOperator: "Fatjon Rama", approvalDate: "2026-07-13", materialLot: "LOT-TPU-2026-0718", thickness: "0.75 mm", machine: "TF-01", operator: "Ilir Prifti", qcResult: "Pending", stage: "Doctor Approval", releaseStatus: "Pending", shipment: "—", remakes: 0, refinements: 0 },
  { id: "CASE-2026-4826", patient: "Patient F.B.", clinic: "Dental Studio Vlorë", doctor: "Dr. Marku", product: "iClear Hero Aligners for Kids", aligners: 16, planVersion: "v1", designOperator: "Fatjon Rama", approvalDate: "2026-07-14", materialLot: "LOT-TPU-2026-0718", thickness: "0.625 mm", machine: "TF-02", operator: "Ilir Prifti", qcResult: "Pending", stage: "Design", releaseStatus: "Pending", shipment: "—", remakes: 0, refinements: 0 },
  { id: "CASE-2026-4827", patient: "Patient G.T.", clinic: "Smile Dental Tirana", doctor: "Dr. Leka", product: "iClear Aligners for Adults", aligners: 28, planVersion: "v3", designOperator: "Fatjon Rama", approvalDate: "2026-07-07", materialLot: "LOT-TPU-2026-0705", thickness: "0.75 mm", machine: "TF-03", operator: "Ilir Prifti", qcResult: "Pass", stage: "Closed", releaseStatus: "Released", shipment: "AL-DHL-88120", remakes: 0, refinements: 2 },
  { id: "CASE-2026-4828", patient: "Patient H.L.", clinic: "OrthoCare Durrës", doctor: "Dr. Frashëri", product: "iClear Bite / Night Guard", aligners: 1, planVersion: "v1", designOperator: "Fatjon Rama", approvalDate: "2026-07-15", materialLot: "LOT-TPU-2026-0718", thickness: "2.0 mm", machine: "TF-02", operator: "Ilir Prifti", qcResult: "Pending", stage: "Case Received", releaseStatus: "Pending", shipment: "—", remakes: 0, refinements: 0 },
];

/** Cases sharing the flagged material lot (traceability alert). */
export const FLAGGED_LOT = "LOT-TPU-2026-0718";
export const AFFECTED_CASE_COUNT = 26;

export const CASE_TIMELINE = [
  { stage: "Case Received", date: "2026-07-08 09:12", actor: "System", note: "STL files imported from clinic portal" },
  { stage: "Design", date: "2026-07-08 14:40", actor: "Fatjon Rama", note: "Treatment plan v3 generated — 24 stages" },
  { stage: "Internal Review", date: "2026-07-09 10:05", actor: "Design QA", note: "Attachment geometry verified" },
  { stage: "Doctor Approval", date: "2026-07-09 16:22", actor: "Dr. Leka", note: "Plan approved without modification" },
  { stage: "Production", date: "2026-07-10 08:30", actor: "Ilir Prifti", note: "Thermoformed on TF-03, lot LOT-TPU-2026-0718" },
  { stage: "Quality Control", date: "2026-07-10 15:10", actor: "Erisa Kola", note: "Dimensional + edge inspection passed" },
  { stage: "Device Release", date: "2026-07-11 09:00", actor: "Erisa Kola", note: "Released — batch record complete" },
  { stage: "Packaging", date: "2026-07-11 11:30", actor: "Xheni Vata", note: "Labelled + sealed, UDI verified" },
  { stage: "Delivery", date: "2026-07-11 17:45", actor: "Logistics", note: "Dispatched via DHL AL-DHL-88213" },
];
