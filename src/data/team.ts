import type { Person } from "../types";

export const DEPARTMENTS = [
  "Regulatory Affairs",
  "Quality",
  "Design",
  "Printing",
  "Thermoforming",
  "Cutting",
  "Polishing",
  "Quality Control",
  "Packaging",
  "Warehouse",
  "Logistics",
  "Human Resources",
] as const;

export const TEAM: Person[] = [
  { id: "U-001", name: "Edison Shimaj", role: "CEO", department: "Management", email: "edshimaj@iclear.al" },
  { id: "U-002", name: "Anila Berisha", role: "Quality Manager", department: "Quality", email: "anila.b@iclear.al" },
  { id: "U-003", name: "Genti Hoxha", role: "PRRC", department: "Regulatory Affairs", email: "genti.h@iclear.al" },
  { id: "U-004", name: "Marsela Doda", role: "Regulatory Specialist", department: "Regulatory Affairs", email: "marsela.d@iclear.al" },
  { id: "U-005", name: "Ilir Prifti", role: "Production Supervisor", department: "Thermoforming", email: "ilir.p@iclear.al" },
  { id: "U-006", name: "Erisa Kola", role: "QC Specialist", department: "Quality Control", email: "erisa.k@iclear.al" },
  { id: "U-007", name: "Dr. Klaudia Meta", role: "Clinical Reviewer", department: "Clinical", email: "klaudia.m@iclear.al" },
  { id: "U-008", name: "Besnik Lami", role: "Internal Auditor", department: "Quality", email: "besnik.l@iclear.al" },
  { id: "U-009", name: "Fatjon Rama", role: "Design Lead", department: "Design", email: "fatjon.r@iclear.al" },
  { id: "U-010", name: "Xheni Vata", role: "Warehouse Lead", department: "Warehouse", email: "xheni.v@iclear.al" },
];

export function person(name: string): Person | undefined {
  return TEAM.find((p) => p.name === name);
}
