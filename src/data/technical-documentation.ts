import type { TechDocSection } from "../types";

export const TECH_FILE_READINESS = 76;

export const TECH_DOC_SECTIONS: TechDocSection[] = [
  { id: "TD-01", name: "Device Description", annex: "Annex II §1.1", completion: 100, owner: "Genti Hoxha", reviewer: "Anila Berisha", status: "Effective", version: "3.2", reviewDate: "2026-03-10", missingEvidence: [], linkedDocs: 6 },
  { id: "TD-02", name: "Product Specification", annex: "Annex II §1.1", completion: 95, owner: "Fatjon Rama", reviewer: "Genti Hoxha", status: "Approved", version: "2.4", reviewDate: "2026-04-02", missingEvidence: [], linkedDocs: 9 },
  { id: "TD-03", name: "Intended Purpose", annex: "Annex II §1.1", completion: 100, owner: "Marsela Doda", reviewer: "Genti Hoxha", status: "Effective", version: "2.0", reviewDate: "2026-02-18", missingEvidence: [], linkedDocs: 3 },
  { id: "TD-04", name: "Classification Rationale", annex: "Annex VIII", completion: 100, owner: "Genti Hoxha", reviewer: "Anila Berisha", status: "Effective", version: "1.3", reviewDate: "2026-01-30", missingEvidence: [], linkedDocs: 2 },
  { id: "TD-05", name: "Design and Manufacturing Information", annex: "Annex II §3", completion: 88, owner: "Fatjon Rama", reviewer: "Ilir Prifti", status: "In Review", version: "4.1", reviewDate: "2026-06-12", missingEvidence: ["Process validation report PV-2026-03"], linkedDocs: 14 },
  { id: "TD-06", name: "GSPR Checklist", annex: "Annex I", completion: 82, owner: "Marsela Doda", reviewer: "Genti Hoxha", status: "In Review", version: "3.0", reviewDate: "2026-06-20", missingEvidence: ["GSPR 14.2 evidence", "GSPR 23.4 labelling proof"], linkedDocs: 21 },
  { id: "TD-07", name: "Risk Management File", annex: "Annex I §3", completion: 90, owner: "Anila Berisha", reviewer: "Genti Hoxha", status: "Approved", version: "5.0", reviewDate: "2026-05-08", missingEvidence: [], linkedDocs: 12 },
  { id: "TD-08", name: "Biological Evaluation", annex: "ISO 10993", completion: 70, owner: "Dr. Klaudia Meta", reviewer: "Genti Hoxha", status: "In Review", version: "2.1", reviewDate: "2026-06-01", missingEvidence: ["Cytotoxicity re-test report", "Updated BEP"], linkedDocs: 7 },
  { id: "TD-09", name: "Clinical Evaluation", annex: "Annex XIV", completion: 78, owner: "Dr. Klaudia Meta", reviewer: "Genti Hoxha", status: "In Review", version: "3.4", reviewDate: "2026-06-15", missingEvidence: ["CER literature appraisal 2026"], linkedDocs: 11 },
  { id: "TD-10", name: "Verification and Validation", annex: "Annex II §6.1", completion: 85, owner: "Ilir Prifti", reviewer: "Anila Berisha", status: "In Review", version: "4.0", reviewDate: "2026-05-25", missingEvidence: ["Transport validation TV-2026-02"], linkedDocs: 18 },
  { id: "TD-11", name: "Labelling", annex: "Annex I §23", completion: 92, owner: "Marsela Doda", reviewer: "Genti Hoxha", status: "Approved", version: "2.8", reviewDate: "2026-04-18", missingEvidence: [], linkedDocs: 8 },
  { id: "TD-12", name: "Instructions for Use", annex: "Annex I §23.4", completion: 88, owner: "Marsela Doda", reviewer: "Dr. Klaudia Meta", status: "In Review", version: "3.1", reviewDate: "2026-06-05", missingEvidence: ["Pediatric IFU translation set"], linkedDocs: 5 },
  { id: "TD-13", name: "PMS Plan", annex: "Annex III", completion: 80, owner: "Anila Berisha", reviewer: "Genti Hoxha", status: "Approved", version: "2.0", reviewDate: "2026-05-12", missingEvidence: [], linkedDocs: 6 },
  { id: "TD-14", name: "PMCF Plan", annex: "Annex XIV Part B", completion: 55, owner: "Dr. Klaudia Meta", reviewer: "Genti Hoxha", status: "Draft", version: "1.2", reviewDate: "2026-06-22", missingEvidence: ["PMCF survey protocol", "Investigator agreements"], linkedDocs: 4 },
  { id: "TD-15", name: "PSUR", annex: "Article 86", completion: 60, owner: "Genti Hoxha", reviewer: "Anila Berisha", status: "Draft", version: "1.0", reviewDate: "2026-07-01", missingEvidence: ["2026 complaint dataset", "Trend analysis"], linkedDocs: 9 },
  { id: "TD-16", name: "Declaration of Conformity", annex: "Annex IV", completion: 100, owner: "Genti Hoxha", reviewer: "Edison Shimaj", status: "Effective", version: "2.1", reviewDate: "2026-03-01", missingEvidence: [], linkedDocs: 1 },
];
