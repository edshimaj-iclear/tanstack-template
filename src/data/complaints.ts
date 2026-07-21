import type { Complaint } from "../types";

/* ============================================================
   Complaints & Vigilance — mock data
   Extra detail fields are defined LOCALLY here (the shared
   Complaint type in src/types stays untouched).
   ============================================================ */

export interface VigilanceDecision {
  decision: "Yes" | "No";
  reasoning: string;
}

export interface ComplaintVigilance {
  seriousIncident: VigilanceDecision;
  regulatoryReporting: VigilanceDecision;
  fsca: VigilanceDecision;
  trendReporting: VigilanceDecision;
}

export interface ProductionEvent {
  stage: string;
  detail: string;
  date: string;
  operator: string;
}

/** Complaint + full investigation detail used by the drawer. */
export interface ComplaintRecord extends Complaint {
  description: string;
  patientImpact: string;
  materialLot: string;
  productionCase: string;
  productionHistory: ProductionEvent[];
  investigationNotes: string;
  linkedRisks: string[];
  linkedCapa: string | null;
  responseToClinic: string;
  closureApproval: string;
  vigilance: ComplaintVigilance;
}

const notReportable: ComplaintVigilance = {
  seriousIncident: { decision: "No", reasoning: "No death or serious deterioration in health; transient, self-limiting effect only." },
  regulatoryReporting: { decision: "No", reasoning: "Below MDR Art. 87 reporting threshold — not a serious incident." },
  fsca: { decision: "No", reasoning: "Isolated event, no field safety corrective action required." },
  trendReporting: { decision: "No", reasoning: "Occurrence rate within expected baseline; no statistically significant increase." },
};

export const COMPLAINTS: ComplaintRecord[] = [
  {
    id: "CMP-2026-101",
    clinic: "Smile Dental Tirana",
    product: "iClear Aligners for Adults",
    caseId: "CASE-2026-0512",
    received: "2026-07-18",
    type: "Fracture",
    patientHarm: "Minor",
    seriousness: "Non-serious",
    reportability: "Under assessment",
    investigation: "Investigation",
    capaRequired: true,
    owner: "Anila Berisha",
    description:
      "Upper aligner (stage 9 of 24) cracked along the distal edge of the right first molar within 3 days of use. Patient reported a sharp edge but no laceration.",
    patientImpact: "Minor — sharp fractured edge, no soft-tissue injury. Patient advanced to spare aligner without treatment interruption.",
    materialLot: "LOT-TPU-2026-0718",
    productionCase: "CASE-2026-0512",
    productionHistory: [
      { stage: "Design", detail: "Plan v3 approved, 24 stages", date: "2026-06-02", operator: "Fatjon Rama" },
      { stage: "Thermoforming", detail: "0.75mm TPU, lot LOT-TPU-2026-0718", date: "2026-06-09", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Edge inspection — pass", date: "2026-06-10", operator: "Erisa Kola" },
      { stage: "Delivery", detail: "Shipped to Smile Dental Tirana", date: "2026-06-12", operator: "Xheni Vata" },
    ],
    investigationNotes:
      "Returned device examined under magnification. Fracture initiated at a micro-notch consistent with over-thinning during forming. Same lot LOT-TPU-2026-0718 flagged in NCR-2026-072. Cross-referenced with material thickness CAPA.",
    linkedRisks: ["RSK-011", "RSK-018"],
    linkedCapa: "CAPA-2026-024",
    responseToClinic:
      "Acknowledged within 24h. Replacement aligner set expedited, delivered 2026-07-20. Clinic advised on interim spare-aligner protocol.",
    closureApproval: "Pending — awaiting effectiveness data from CAPA-2026-024 before closure.",
    vigilance: {
      seriousIncident: { decision: "No", reasoning: "Device fracture caused only a transient sharp edge; no injury or serious deterioration in health occurred." },
      regulatoryReporting: { decision: "No", reasoning: "Does not meet MDR Art. 87 serious-incident criteria; logged for trend monitoring." },
      fsca: { decision: "No", reasoning: "Single unit from one lot; contained via replacement, no field action across distributed devices." },
      trendReporting: { decision: "Yes", reasoning: "Third fracture from thermoforming this quarter — included in periodic trend report and linked to CAPA-2026-024." },
    },
  },
  {
    id: "CMP-2026-102",
    clinic: "OrthoCare Durrës",
    product: "iClear Aligners for Adults",
    caseId: "CASE-2026-0498",
    received: "2026-07-16",
    type: "Gingival irritation",
    patientHarm: "Minor",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Investigation",
    capaRequired: true,
    owner: "Erisa Kola",
    description:
      "Patient reported localised gingival redness and soreness at the lower anterior region after wearing stage 5. Clinician observed mild inflammation, no ulceration.",
    patientImpact: "Minor — reversible mucosal irritation resolved within 5 days after edge adjustment.",
    materialLot: "LOT-TPU-2026-0704",
    productionCase: "CASE-2026-0498",
    productionHistory: [
      { stage: "Design", detail: "Plan v2 approved, 18 stages", date: "2026-05-20", operator: "Fatjon Rama" },
      { stage: "Cutting", detail: "Gingival trim line cut", date: "2026-05-28", operator: "Ilir Prifti" },
      { stage: "Polishing", detail: "Edge polish", date: "2026-05-29", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Edge smoothness — pass (borderline)", date: "2026-05-30", operator: "Erisa Kola" },
    ],
    investigationNotes:
      "Edge trimming below specified offset at lower anterior. Consistent with recurring gingival-irritation trend under CAPA-2026-023. Root cause: insufficient edge trimming clearance.",
    linkedRisks: ["RSK-018"],
    linkedCapa: "CAPA-2026-023",
    responseToClinic:
      "Advised chairside edge relief; issued corrected aligner. Patient comfortable at follow-up.",
    closureApproval: "Pending — grouped under trend CAPA-2026-023.",
    vigilance: {
      seriousIncident: { decision: "No", reasoning: "Reversible mild mucosal irritation; no serious deterioration in health." },
      regulatoryReporting: { decision: "No", reasoning: "Non-serious, below reporting threshold." },
      fsca: { decision: "No", reasoning: "No safety corrective action needed across the field." },
      trendReporting: { decision: "Yes", reasoning: "Part of an identified gingival-irritation trend; captured in trend analysis and CAPA-2026-023." },
    },
  },
  {
    id: "CMP-2026-103",
    clinic: "Dental Studio Vlorë",
    product: "iClear Aligners for Kids",
    caseId: "CASE-2026-0531",
    received: "2026-07-15",
    type: "Wrong label",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Under assessment",
    investigation: "Investigation",
    capaRequired: true,
    owner: "Genti Hoxha",
    description:
      "Aligner pouch for stage 7 was labelled as stage 8. Clinic caught the mismatch before dispensing to the patient.",
    patientImpact: "None — error detected by clinic before use; no patient exposure.",
    materialLot: "LOT-TPU-2026-0709",
    productionCase: "CASE-2026-0531",
    productionHistory: [
      { stage: "Packaging", detail: "Stage labels applied manually", date: "2026-06-25", operator: "Xheni Vata" },
      { stage: "Quality Control", detail: "Label verification — missed", date: "2026-06-25", operator: "Erisa Kola" },
      { stage: "Delivery", detail: "Shipped to Dental Studio Vlorë", date: "2026-06-27", operator: "Xheni Vata" },
    ],
    investigationNotes:
      "Manual labelling swap at packaging station. Matches open CAPA-2026-022 (label mismatch). Barcode verification not yet deployed on kids line.",
    linkedRisks: ["RSK-011"],
    linkedCapa: "CAPA-2026-022",
    responseToClinic:
      "Corrected labels shipped same week. Confirmed no other stages affected in the set.",
    closureApproval: "Pending — closure tied to CAPA-2026-022 barcode control.",
    vigilance: {
      seriousIncident: { decision: "No", reasoning: "No patient harm — mislabel intercepted before use." },
      regulatoryReporting: { decision: "No", reasoning: "No incident occurred; potential nonconformity handled internally." },
      fsca: { decision: "Yes", reasoning: "Labelling control gap could affect other units — a corrective action (barcode verification) is being deployed as a preventive field measure." },
      trendReporting: { decision: "Yes", reasoning: "Recurring labelling errors tracked; escalated to CAPA and trend report." },
    },
  },
  {
    id: "CMP-2026-104",
    clinic: "Smile Dental Tirana",
    product: "iClear Aligners for Adults",
    caseId: "CASE-2026-0505",
    received: "2026-07-14",
    type: "Tracking problem",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Open",
    capaRequired: true,
    owner: "Fatjon Rama",
    description:
      "Aligners not tracking on the upper left canine from stage 6 onward; visible gap between aligner and tooth surface reported by clinician.",
    patientImpact: "None — treatment continues; refinement scan requested.",
    materialLot: "LOT-TPU-2026-0701",
    productionCase: "CASE-2026-0505",
    productionHistory: [
      { stage: "Design", detail: "Attachment geometry v1", date: "2026-05-15", operator: "Fatjon Rama" },
      { stage: "Thermoforming", detail: "0.75mm TPU", date: "2026-05-22", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Fit check — pass", date: "2026-05-23", operator: "Erisa Kola" },
    ],
    investigationNotes:
      "Suspected attachment geometry issue matching PMS signal in CAPA-2026-015. Refinement plan under design.",
    linkedRisks: ["RSK-018"],
    linkedCapa: "CAPA-2026-015",
    responseToClinic: "Refinement scan requested; mid-course correction plan offered at no charge.",
    closureApproval: "Open — design investigation in progress.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-105",
    clinic: "OrthoCare Durrës",
    product: "iClear Retainers",
    caseId: "CASE-2026-0487",
    received: "2026-07-12",
    type: "Deformation",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: false,
    owner: "Erisa Kola",
    description:
      "Retainer warped after the patient cleaned it in hot water contrary to IFU. Loss of fit reported.",
    patientImpact: "None — misuse-related; replacement issued.",
    materialLot: "LOT-TPU-2026-0688",
    productionCase: "CASE-2026-0487",
    productionHistory: [
      { stage: "Thermoforming", detail: "1.0mm retainer material", date: "2026-05-05", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Dimensional check — pass", date: "2026-05-06", operator: "Erisa Kola" },
      { stage: "Delivery", detail: "Shipped with IFU", date: "2026-05-08", operator: "Xheni Vata" },
    ],
    investigationNotes:
      "Confirmed thermal deformation from hot-water cleaning. Device met all release specs. IFU warning reviewed — considered adequate; no design change.",
    linkedRisks: [],
    linkedCapa: null,
    responseToClinic: "Replacement retainer issued; patient re-educated on cold-water cleaning per IFU.",
    closureApproval: "Closed by Anila Berisha — 2026-07-15, foreseeable misuse, no CAPA.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-106",
    clinic: "Dental Studio Vlorë",
    product: "iClear Night Guard",
    caseId: "CASE-2026-0470",
    received: "2026-07-11",
    type: "Fit issue",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: false,
    owner: "Erisa Kola",
    description:
      "Night guard felt loose on the lower arch; patient reported it dislodging during sleep.",
    patientImpact: "None — comfort issue only, no injury.",
    materialLot: "LOT-TPU-2026-0665",
    productionCase: "CASE-2026-0470",
    productionHistory: [
      { stage: "Design", detail: "Night guard v1, 2.0mm", date: "2026-04-28", operator: "Fatjon Rama" },
      { stage: "Thermoforming", detail: "2.0mm hard-soft laminate", date: "2026-05-02", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Fit and occlusion — pass", date: "2026-05-03", operator: "Erisa Kola" },
    ],
    investigationNotes:
      "Impression margin short at lingual; borderline retention. Remade from new scan; fit confirmed acceptable.",
    linkedRisks: [],
    linkedCapa: null,
    responseToClinic: "Remade device delivered; retention confirmed at fitting appointment.",
    closureApproval: "Closed by Anila Berisha — 2026-07-14.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-107",
    clinic: "Smile Dental Tirana",
    product: "iClear Aligners for Adults",
    caseId: "CASE-2026-0460",
    received: "2026-07-09",
    type: "Missing aligner",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: false,
    owner: "Xheni Vata",
    description:
      "Delivered set was missing stage 12; box contained stages 1-11 and 13-20.",
    patientImpact: "None — detected on receipt; treatment not started for that stage.",
    materialLot: "LOT-TPU-2026-0692",
    productionCase: "CASE-2026-0460",
    productionHistory: [
      { stage: "Packaging", detail: "20-stage set packed", date: "2026-06-18", operator: "Xheni Vata" },
      { stage: "Quality Control", detail: "Count verification — missed", date: "2026-06-18", operator: "Erisa Kola" },
      { stage: "Delivery", detail: "Shipped to Smile Dental Tirana", date: "2026-06-20", operator: "Xheni Vata" },
    ],
    investigationNotes:
      "Stage 12 found at packaging bench during investigation — packing miscount. Reinforced two-person count check.",
    linkedRisks: [],
    linkedCapa: null,
    responseToClinic: "Missing stage 12 dispatched next day; apology issued.",
    closureApproval: "Closed by Anila Berisha — 2026-07-12.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-108",
    clinic: "OrthoCare Durrës",
    product: "iClear Aligners for Kids",
    caseId: "CASE-2026-0455",
    received: "2026-07-08",
    type: "Wrong stage",
    patientHarm: "Minor",
    seriousness: "Non-serious",
    reportability: "Under assessment",
    investigation: "Investigation",
    capaRequired: true,
    owner: "Genti Hoxha",
    description:
      "Set sequenced incorrectly — stage 4 geometry duplicated as stage 5. Patient wore duplicate for one week before clinician noticed lack of progression.",
    patientImpact: "Minor — one week of non-progressing treatment; no harm, timeline extended.",
    materialLot: "LOT-TPU-2026-0709",
    productionCase: "CASE-2026-0455",
    productionHistory: [
      { stage: "Design", detail: "Staging export error", date: "2026-06-01", operator: "Fatjon Rama" },
      { stage: "Thermoforming", detail: "Formed per (erroneous) export", date: "2026-06-08", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Stage-geometry check — missed", date: "2026-06-09", operator: "Erisa Kola" },
    ],
    investigationNotes:
      "Design export duplicated a stage model. QC geometry comparison did not catch identical stages. Verifying export validation step.",
    linkedRisks: ["RSK-011"],
    linkedCapa: "CAPA-2026-020",
    responseToClinic: "Corrected stage 5 supplied; treatment plan re-sequenced at no charge.",
    closureApproval: "Pending investigation outcome.",
    vigilance: {
      seriousIncident: { decision: "No", reasoning: "Delay in treatment progression only; no injury or serious deterioration in health." },
      regulatoryReporting: { decision: "No", reasoning: "Non-serious; below MDR reporting threshold." },
      fsca: { decision: "No", reasoning: "Single case; no field action across distributed devices." },
      trendReporting: { decision: "Yes", reasoning: "Second staging/export error this period — monitored for trend and linked to design CAPA." },
    },
  },
  {
    id: "CMP-2026-109",
    clinic: "Dental Studio Vlorë",
    product: "iClear Aligners for Adults",
    caseId: "CASE-2026-0448",
    received: "2026-07-06",
    type: "Material issue",
    patientHarm: "Minor",
    seriousness: "Non-serious",
    reportability: "Under assessment",
    investigation: "Investigation",
    capaRequired: true,
    owner: "Anila Berisha",
    description:
      "Cloudy/hazy appearance and slight surface tackiness on multiple aligners from the same set; patient reported unusual taste.",
    patientImpact: "Minor — transient altered taste, no allergic or systemic reaction reported.",
    materialLot: "LOT-TPU-2026-0718",
    productionCase: "CASE-2026-0448",
    productionHistory: [
      { stage: "Incoming", detail: "TPU lot LOT-TPU-2026-0718 received", date: "2026-06-30", operator: "Erisa Kola" },
      { stage: "Thermoforming", detail: "Formed from suspect lot", date: "2026-07-01", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Visual haze noted post-complaint", date: "2026-07-06", operator: "Erisa Kola" },
    ],
    investigationNotes:
      "Suspect incoming material lot LOT-TPU-2026-0718 — possible moisture/curing issue at supplier. Lot quarantined (NCR-2026-072). Supplier SCAR under CAPA-2026-019. Biocompatibility re-review requested from Clinical.",
    linkedRisks: ["RSK-011", "RSK-018"],
    linkedCapa: "CAPA-2026-019",
    responseToClinic: "Set replaced from a verified lot; patient advised no residual risk expected.",
    closureApproval: "Pending — biocompatibility assessment and supplier SCAR closure.",
    vigilance: {
      seriousIncident: { decision: "No", reasoning: "Transient taste change with no evidence of toxic or allergic reaction; no serious deterioration in health." },
      regulatoryReporting: { decision: "No", reasoning: "Under assessment; currently below serious-incident threshold pending biocompatibility review." },
      fsca: { decision: "Yes", reasoning: "Suspect material lot quarantined and potentially distributed — a field safety corrective action (lot recall/hold) is being evaluated." },
      trendReporting: { decision: "Yes", reasoning: "Material-quality signal from supplier lot included in trend reporting and SCAR." },
    },
  },
  {
    id: "CMP-2026-110",
    clinic: "Smile Dental Tirana",
    product: "iClear Aligners for Adults",
    caseId: "CASE-2026-0442",
    received: "2026-07-04",
    type: "Delivery issue",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: true,
    owner: "Xheni Vata",
    description:
      "Aligner set delivered to the wrong clinic branch, delaying the patient's start by four days.",
    patientImpact: "None — logistics delay only.",
    materialLot: "LOT-TPU-2026-0692",
    productionCase: "CASE-2026-0442",
    productionHistory: [
      { stage: "Packaging", detail: "Set packed and addressed", date: "2026-06-14", operator: "Xheni Vata" },
      { stage: "Delivery", detail: "Routed to wrong branch", date: "2026-06-16", operator: "Xheni Vata" },
    ],
    investigationNotes:
      "Address verification failure at dispatch. Linked to CAPA-2026-016 (shipment to incorrect clinic). Address-confirmation step being added.",
    linkedRisks: [],
    linkedCapa: "CAPA-2026-016",
    responseToClinic: "Set rerouted and delivered; courier partner notified.",
    closureApproval: "Closed pending CAPA-2026-016 effectiveness.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-111",
    clinic: "OrthoCare Durrës",
    product: "iClear Aligners for Adults",
    caseId: "CASE-2026-0433",
    received: "2026-07-02",
    type: "Treatment result",
    patientHarm: "Minor",
    seriousness: "Non-serious",
    reportability: "Under assessment",
    investigation: "Investigation",
    capaRequired: false,
    owner: "Genti Hoxha",
    description:
      "Patient dissatisfied with final result — residual rotation on upper lateral incisor at end of the plan.",
    patientImpact: "Minor — sub-optimal aesthetic outcome; refinement offered, no physical harm.",
    materialLot: "LOT-TPU-2026-0670",
    productionCase: "CASE-2026-0433",
    productionHistory: [
      { stage: "Design", detail: "Original plan, 22 stages", date: "2026-04-10", operator: "Fatjon Rama" },
      { stage: "Doctor Approval", detail: "Plan approved by clinician", date: "2026-04-14", operator: "Dr. Klaudia Meta" },
    ],
    investigationNotes:
      "Reviewed against approved plan — device performed per design; residual movement within known biological variability. Clinical review confirms refinement is standard of care.",
    linkedRisks: ["RSK-018"],
    linkedCapa: null,
    responseToClinic: "Complimentary refinement plan offered; clinician alignment confirmed.",
    closureApproval: "Pending refinement acceptance by patient.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-112",
    clinic: "Dental Studio Vlorë",
    product: "iClear Aligners for Kids",
    caseId: "CASE-2026-0421",
    received: "2026-06-30",
    type: "Packaging issue",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: false,
    owner: "Xheni Vata",
    description:
      "Outer box arrived crushed; two aligner pouches were unsealed on receipt (aligners themselves intact).",
    patientImpact: "None — sterility not required (non-sterile device); patient advised to rinse before use.",
    materialLot: "LOT-TPU-2026-0709",
    productionCase: "CASE-2026-0421",
    productionHistory: [
      { stage: "Packaging", detail: "Sealed pouches, outer carton", date: "2026-06-10", operator: "Xheni Vata" },
      { stage: "Delivery", detail: "Transit damage", date: "2026-06-13", operator: "Xheni Vata" },
    ],
    investigationNotes:
      "Transit crush damage — carton within spec but stacking during transport suspected. Replacement pouches sent; courier feedback logged.",
    linkedRisks: [],
    linkedCapa: null,
    responseToClinic: "Replacement sealed pouches shipped; clinic satisfied.",
    closureApproval: "Closed by Anila Berisha — 2026-07-03.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-113",
    clinic: "Smile Dental Tirana",
    product: "iClear Retainers",
    caseId: "CASE-2026-0410",
    received: "2026-06-28",
    type: "Fracture",
    patientHarm: "Minor",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: false,
    owner: "Erisa Kola",
    description:
      "Retainer snapped at the midline during insertion three weeks into use.",
    patientImpact: "Minor — no laceration; patient without retention for two days until replacement.",
    materialLot: "LOT-TPU-2026-0655",
    productionCase: "CASE-2026-0410",
    productionHistory: [
      { stage: "Thermoforming", detail: "1.0mm retainer, midline thin spot", date: "2026-05-30", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Thickness check — pass", date: "2026-05-31", operator: "Erisa Kola" },
    ],
    investigationNotes:
      "Localised thin section at midline near a deep palatal contour — geometry-driven, isolated. Design note added to avoid sharp palatal transitions.",
    linkedRisks: ["RSK-011"],
    linkedCapa: null,
    responseToClinic: "Replacement retainer delivered within 48h.",
    closureApproval: "Closed by Anila Berisha — 2026-07-01.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-114",
    clinic: "OrthoCare Durrës",
    product: "iClear Night Guard",
    caseId: "CASE-2026-0402",
    received: "2026-06-26",
    type: "Gingival irritation",
    patientHarm: "Minor",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: false,
    owner: "Erisa Kola",
    description:
      "Sharp edge on the buccal flange caused a small gingival abrasion on the lower right.",
    patientImpact: "Minor — small abrasion healed within 3 days after edge relief.",
    materialLot: "LOT-TPU-2026-0648",
    productionCase: "CASE-2026-0402",
    productionHistory: [
      { stage: "Cutting", detail: "Flange trim", date: "2026-05-18", operator: "Ilir Prifti" },
      { stage: "Polishing", detail: "Edge finish — incomplete", date: "2026-05-19", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Edge check — borderline pass", date: "2026-05-20", operator: "Erisa Kola" },
    ],
    investigationNotes:
      "Incomplete edge polish at buccal flange. Reinforced polishing WI; feeds into gingival-irritation trend (CAPA-2026-023).",
    linkedRisks: ["RSK-018"],
    linkedCapa: "CAPA-2026-023",
    responseToClinic: "Edge relieved and re-polished; patient comfortable.",
    closureApproval: "Closed by Anila Berisha — 2026-06-29.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-115",
    clinic: "Dental Studio Vlorë",
    product: "iClear Aligners for Adults",
    caseId: "CASE-2026-0395",
    received: "2026-06-24",
    type: "Fit issue",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: false,
    owner: "Fatjon Rama",
    description:
      "First aligner did not seat fully on the posterior; patient reported difficulty inserting stage 1.",
    patientImpact: "None — reseated after chairside adjustment; no harm.",
    materialLot: "LOT-TPU-2026-0640",
    productionCase: "CASE-2026-0395",
    productionHistory: [
      { stage: "Design", detail: "Plan v1, 16 stages", date: "2026-05-01", operator: "Fatjon Rama" },
      { stage: "Thermoforming", detail: "0.75mm TPU", date: "2026-05-07", operator: "Ilir Prifti" },
      { stage: "Quality Control", detail: "Fit check — pass", date: "2026-05-08", operator: "Erisa Kola" },
    ],
    investigationNotes:
      "Minor posterior over-extension on model; within tolerance. Chairside relief resolved. No systemic cause.",
    linkedRisks: [],
    linkedCapa: null,
    responseToClinic: "Advised chairside seating technique; patient progressing normally.",
    closureApproval: "Closed by Anila Berisha — 2026-06-27.",
    vigilance: notReportable,
  },
  {
    id: "CMP-2026-116",
    clinic: "Smile Dental Tirana",
    product: "iClear Aligners for Kids",
    caseId: "CASE-2026-0388",
    received: "2026-06-22",
    type: "Delivery issue",
    patientHarm: "None",
    seriousness: "Non-serious",
    reportability: "Not reportable",
    investigation: "Closed",
    capaRequired: false,
    owner: "Xheni Vata",
    description:
      "Shipment delayed by five days due to a courier customs hold; patient's start appointment rescheduled.",
    patientImpact: "None — scheduling delay only.",
    materialLot: "LOT-TPU-2026-0692",
    productionCase: "CASE-2026-0388",
    productionHistory: [
      { stage: "Packaging", detail: "Set dispatched", date: "2026-06-12", operator: "Xheni Vata" },
      { stage: "Delivery", detail: "Customs hold", date: "2026-06-14", operator: "Xheni Vata" },
    ],
    investigationNotes:
      "External courier customs delay; documentation complete on our side. No internal nonconformity.",
    linkedRisks: [],
    linkedCapa: null,
    responseToClinic: "Kept clinic informed daily; delivered on release from customs.",
    closureApproval: "Closed by Anila Berisha — 2026-06-25.",
    vigilance: notReportable,
  },
];

/* ---------- Aggregates for charts / metrics ---------- */

export const COMPLAINT_TYPE_TREND = [
  { month: "Feb", fit: 2, fracture: 1, irritation: 1, other: 2 },
  { month: "Mar", fit: 1, fracture: 2, irritation: 2, other: 1 },
  { month: "Apr", fit: 3, fracture: 1, irritation: 1, other: 2 },
  { month: "May", fit: 2, fracture: 2, irritation: 3, other: 3 },
  { month: "Jun", fit: 2, fracture: 3, irritation: 2, other: 4 },
  { month: "Jul", fit: 1, fracture: 3, irritation: 2, other: 3 },
];

export const COMPLAINT_BY_TYPE = [
  { name: "Fit issue", value: 3 },
  { name: "Fracture", value: 3 },
  { name: "Gingival irritation", value: 3 },
  { name: "Delivery issue", value: 2 },
  { name: "Wrong stage / label", value: 2 },
  { name: "Material issue", value: 1 },
  { name: "Other", value: 2 },
];

export const COMPLAINT_SUMMARY = {
  open: COMPLAINTS.filter((c) => c.investigation !== "Closed").length,
  seriousIncidents: COMPLAINTS.filter((c) => c.seriousness === "Serious").length,
  reportable: COMPLAINTS.filter((c) => c.reportability === "Under assessment").length,
  avgInvestigationDays: 9,
  capaLinked: COMPLAINTS.filter((c) => c.linkedCapa).length,
};
