import type { RiskItem } from "../types";

export const RISKS: RiskItem[] = [
  { id: "RSK-001", product: "iClear Aligners for Adults", hazard: "Incorrect patient identification", hazardousSituation: "Aligners produced for wrong treatment plan", harm: "Ineffective / harmful tooth movement", severity: 4, probability: 2, initialRisk: 8, controls: "Double-scan verification, barcode case matching", residualSeverity: 4, residualProbability: 1, residualRisk: 4, status: "Controlled", owner: "Anila Berisha" },
  { id: "RSK-002", product: "iClear Aligners for Adults", hazard: "Excessive orthodontic force", hazardousSituation: "Aligner geometry applies excessive force", harm: "Root resorption / pain", severity: 5, probability: 2, initialRisk: 10, controls: "Staged movement limits in CAD, clinician approval", residualSeverity: 5, residualProbability: 1, residualRisk: 5, status: "Monitor", owner: "Dr. Klaudia Meta" },
  { id: "RSK-004", product: "iClear Retainers for Adults", hazard: "Wrong label applied", hazardousSituation: "Device delivered with incorrect patient label", harm: "Wrong device used by patient", severity: 4, probability: 2, initialRisk: 8, controls: "Automated label print + scan at packaging", residualSeverity: 4, residualProbability: 1, residualRisk: 4, status: "Controlled", owner: "Xheni Vata" },
  { id: "RSK-005", product: "iClear Aligners for Adults", hazard: "Packaging defect", hazardousSituation: "Seal breach during transport", harm: "Contamination of device", severity: 1, probability: 3, initialRisk: 3, controls: "Seal integrity test, tamper-evident pouch", residualSeverity: 1, residualProbability: 2, residualRisk: 2, status: "Controlled", owner: "Xheni Vata" },
  { id: "RSK-007", product: "iClear Aligners for Adults", hazard: "Material biocompatibility issue", hazardousSituation: "Non-conforming resin batch used", harm: "Allergic / cytotoxic reaction", severity: 5, probability: 1, initialRisk: 5, controls: "ISO 10993 testing, CoA verification per lot", residualSeverity: 5, residualProbability: 1, residualRisk: 5, status: "Monitor", owner: "Genti Hoxha" },
  { id: "RSK-009", product: "iClear Hero Aligners for Kids", hazard: "Inadequate instructions for use", hazardousSituation: "Caregiver misunderstands wear schedule", harm: "Treatment delay / ineffectiveness", severity: 2, probability: 2, initialRisk: 4, controls: "Pictographic IFU, app reminders", residualSeverity: 2, residualProbability: 1, residualRisk: 2, status: "Controlled", owner: "Marsela Doda" },
  { id: "RSK-011", product: "iClear Aligners for Adults", hazard: "Insufficient trimming", hazardousSituation: "Sharp aligner edge contacts gingiva", harm: "Gingival irritation / laceration", severity: 3, probability: 3, initialRisk: 9, controls: "Automated trim-line QC, edge inspection", residualSeverity: 3, residualProbability: 2, residualRisk: 6, status: "Open", owner: "Erisa Kola" },
  { id: "RSK-015", product: "iClear Aligners for Adults", hazard: "Contamination", hazardousSituation: "Device contaminated during handling", harm: "Infection risk", severity: 3, probability: 2, initialRisk: 6, controls: "Cleanroom handling, disinfection validation", residualSeverity: 3, residualProbability: 1, residualRisk: 3, status: "Controlled", owner: "Erisa Kola" },
  { id: "RSK-018", product: "iClear Aligners for Adults", hazard: "Incorrect material thickness", hazardousSituation: "Wrong gauge sheet loaded in thermoformer", harm: "Aligner failure / ineffective force", severity: 4, probability: 3, initialRisk: 12, controls: "Thickness sensor, lot verification, operator check", residualSeverity: 4, residualProbability: 2, residualRisk: 8, status: "Open", owner: "Ilir Prifti" },
  { id: "RSK-021", product: "iClear Hero Aligners for Kids", hazard: "Tracking problem", hazardousSituation: "Aligner does not seat correctly", harm: "Treatment ineffectiveness", severity: 2, probability: 4, initialRisk: 8, controls: "Attachment design review, refinement protocol", residualSeverity: 2, residualProbability: 3, residualRisk: 6, status: "Monitor", owner: "Fatjon Rama" },
  { id: "RSK-023", product: "iClear Retainers for Adults", hazard: "Aligner delivered to wrong clinic", hazardousSituation: "Shipment mislabeled", harm: "Delay / privacy breach", severity: 4, probability: 1, initialRisk: 4, controls: "Address verification, scan-on-dispatch", residualSeverity: 4, residualProbability: 1, residualRisk: 4, status: "Controlled", owner: "Xheni Vata" },
  { id: "RSK-024", product: "iClear Bite / Night Guard", hazard: "Incorrect treatment plan", hazardousSituation: "Plan approved with wrong occlusal scheme", harm: "Occlusal damage", severity: 3, probability: 2, initialRisk: 6, controls: "Clinical review gate, double approval", residualSeverity: 3, residualProbability: 1, residualRisk: 3, status: "Controlled", owner: "Dr. Klaudia Meta" },
];

export const RISK_SUMMARY = {
  total: RISKS.length,
  high: RISKS.filter((r) => r.initialRisk >= 10).length,
  open: RISKS.filter((r) => r.status === "Open").length,
  residualReduced: Math.round(
    (RISKS.reduce((a, r) => a + (r.initialRisk - r.residualRisk), 0) /
      RISKS.reduce((a, r) => a + r.initialRisk, 0)) *
      100,
  ),
};
