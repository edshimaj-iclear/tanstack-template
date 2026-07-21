import type { Equipment } from "../types";

/* ============================================================
   iClear QMS — Equipment (Qualification & Calibration) mock data
   Extra detail types are defined locally to this module.
   ============================================================ */

export type QualificationState = "Qualified" | "In Progress" | "Not Started" | "Failed";

export interface QualificationRecord {
  iq: QualificationState;
  oq: QualificationState;
  pq: QualificationState;
  protocol: string;
  qualifiedOn?: string;
}

export interface CalibrationEvent {
  date: string;
  type: "Calibration" | "Verification" | "Preventive Maintenance" | "Qualification" | "Repair";
  result: "Pass" | "Fail" | "Pass with adjustment" | "Completed";
  performedBy: string;
  reference: string;
  note?: string;
}

export interface MaintenanceTask {
  task: string;
  frequency: string;
  lastDone: string;
  nextDue: string;
  owner: string;
}

export interface LinkedDeviation {
  id: string;
  title: string;
  status: "Open" | "Investigation" | "Closed";
  capa?: string;
}

export interface EquipmentDetail extends Equipment {
  manufacturer: string;
  model: string;
  serialNumber: string;
  assetOwner: string;
  installedOn: string;
  calibrationInterval: string;
  criticality: "Critical" | "Major" | "Minor";
  qualification: QualificationRecord;
  calibrationHistory: CalibrationEvent[];
  maintenance: MaintenanceTask[];
  linkedDeviations: LinkedDeviation[];
}

export const EQUIPMENT: EquipmentDetail[] = [
  {
    id: "EQP-PRN-008",
    name: "Stratasys J5 DentaJet 3D Printer",
    category: "Printers",
    location: "Printing · Line 1",
    status: "Operational",
    calibrationStatus: "Calibrated",
    lastService: "2026-05-12",
    nextDue: "2026-11-12",
    deviations: 0,
    manufacturer: "Stratasys",
    model: "J5 DentaJet",
    serialNumber: "SN-J5D-4471",
    assetOwner: "Fatjon Rama",
    installedOn: "2024-03-08",
    calibrationInterval: "6 months",
    criticality: "Critical",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-008",
      qualifiedOn: "2024-04-02",
    },
    calibrationHistory: [
      { date: "2026-05-12", type: "Calibration", result: "Pass", performedBy: "Ilir Prifti", reference: "CAL-2026-041", note: "Print head XY alignment within tolerance." },
      { date: "2026-02-10", type: "Preventive Maintenance", result: "Completed", performedBy: "Stratasys Service", reference: "PM-2026-018" },
      { date: "2025-11-14", type: "Calibration", result: "Pass with adjustment", performedBy: "Ilir Prifti", reference: "CAL-2025-092", note: "Layer thickness recalibrated." },
    ],
    maintenance: [
      { task: "Print head cleaning cycle", frequency: "Weekly", lastDone: "2026-07-17", nextDue: "2026-07-24", owner: "Ilir Prifti" },
      { task: "Resin tank inspection", frequency: "Monthly", lastDone: "2026-07-01", nextDue: "2026-08-01", owner: "Fatjon Rama" },
      { task: "Full calibration", frequency: "6 months", lastDone: "2026-05-12", nextDue: "2026-11-12", owner: "Stratasys Service" },
    ],
    linkedDeviations: [],
  },
  {
    id: "EQP-TF-003",
    name: "BioStar Pressure Thermoforming Unit",
    category: "Thermoforming Machines",
    location: "Thermoforming · Cell A",
    status: "Calibration Due",
    calibrationStatus: "Due",
    lastService: "2026-01-18",
    nextDue: "2026-07-18",
    deviations: 2,
    manufacturer: "SCHEU-DENTAL",
    model: "BioStar VI",
    serialNumber: "SN-BS6-2210",
    assetOwner: "Ilir Prifti",
    installedOn: "2023-06-21",
    calibrationInterval: "6 months",
    criticality: "Critical",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-003",
      qualifiedOn: "2023-07-30",
    },
    calibrationHistory: [
      { date: "2026-01-18", type: "Calibration", result: "Pass", performedBy: "Erisa Kola", reference: "CAL-2026-006", note: "Temperature and pressure sensors verified." },
      { date: "2025-07-15", type: "Calibration", result: "Pass", performedBy: "Erisa Kola", reference: "CAL-2025-058" },
      { date: "2025-03-02", type: "Repair", result: "Completed", performedBy: "External Technician", reference: "WO-2025-014", note: "Heating element replaced." },
    ],
    maintenance: [
      { task: "Heater element inspection", frequency: "Monthly", lastDone: "2026-07-01", nextDue: "2026-08-01", owner: "Ilir Prifti" },
      { task: "Pressure chamber seal check", frequency: "Quarterly", lastDone: "2026-04-10", nextDue: "2026-07-10", owner: "Ilir Prifti" },
      { task: "Temperature calibration", frequency: "6 months", lastDone: "2026-01-18", nextDue: "2026-07-18", owner: "Erisa Kola" },
    ],
    linkedDeviations: [
      { id: "NCR-2026-081", title: "Temperature drift during forming cycle", status: "Investigation", capa: "CAPA-2026-024" },
      { id: "DEV-2026-033", title: "Pressure below setpoint on batch LOT-TPU-2026-0704", status: "Open" },
    ],
  },
  {
    id: "EQP-SCN-002",
    name: "3Shape TRIOS Intraoral Scanner",
    category: "Scanners",
    location: "Design · Scanning Bay",
    status: "Operational",
    calibrationStatus: "Calibrated",
    lastService: "2026-06-20",
    nextDue: "2026-09-20",
    deviations: 0,
    manufacturer: "3Shape",
    model: "TRIOS 5",
    serialNumber: "SN-T5-8890",
    assetOwner: "Fatjon Rama",
    installedOn: "2024-09-11",
    calibrationInterval: "3 months",
    criticality: "Major",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-021",
      qualifiedOn: "2024-10-05",
    },
    calibrationHistory: [
      { date: "2026-06-20", type: "Calibration", result: "Pass", performedBy: "Fatjon Rama", reference: "CAL-2026-050", note: "Optical accuracy verified against reference model." },
      { date: "2026-03-19", type: "Verification", result: "Pass", performedBy: "Fatjon Rama", reference: "VER-2026-028" },
    ],
    maintenance: [
      { task: "Optics cleaning", frequency: "Weekly", lastDone: "2026-07-18", nextDue: "2026-07-25", owner: "Fatjon Rama" },
      { task: "Accuracy verification", frequency: "3 months", lastDone: "2026-06-20", nextDue: "2026-09-20", owner: "Fatjon Rama" },
    ],
    linkedDeviations: [],
  },
  {
    id: "EQP-TRM-005",
    name: "CEREC Automated Trimming Station",
    category: "Trimming Equipment",
    location: "Cutting · Station 2",
    status: "Maintenance Due",
    calibrationStatus: "Verification pending",
    lastService: "2026-04-05",
    nextDue: "2026-07-25",
    deviations: 1,
    manufacturer: "Dentsply Sirona",
    model: "TrimPro 200",
    serialNumber: "SN-TP2-1145",
    assetOwner: "Erisa Kola",
    installedOn: "2023-11-02",
    calibrationInterval: "3 months",
    criticality: "Major",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-014",
      qualifiedOn: "2023-12-12",
    },
    calibrationHistory: [
      { date: "2026-04-05", type: "Preventive Maintenance", result: "Completed", performedBy: "Erisa Kola", reference: "PM-2026-031", note: "Cutting blade replaced, trim-line accuracy checked." },
      { date: "2026-01-08", type: "Calibration", result: "Pass", performedBy: "Erisa Kola", reference: "CAL-2026-002" },
    ],
    maintenance: [
      { task: "Blade replacement", frequency: "Quarterly", lastDone: "2026-04-05", nextDue: "2026-07-25", owner: "Erisa Kola" },
      { task: "Trim-line accuracy check", frequency: "Monthly", lastDone: "2026-07-02", nextDue: "2026-08-02", owner: "Erisa Kola" },
    ],
    linkedDeviations: [
      { id: "DEV-2026-029", title: "Inconsistent trim-line on molar region", status: "Investigation" },
    ],
  },
  {
    id: "EQP-MSR-004",
    name: "Mitutoyo Digital Micrometer Set",
    category: "Measuring Tools",
    location: "Quality Control · Metrology Lab",
    status: "Operational",
    calibrationStatus: "Calibrated",
    lastService: "2026-06-01",
    nextDue: "2026-12-01",
    deviations: 0,
    manufacturer: "Mitutoyo",
    model: "MDC-25MX",
    serialNumber: "SN-MDC-3320",
    assetOwner: "Erisa Kola",
    installedOn: "2022-05-19",
    calibrationInterval: "6 months",
    criticality: "Major",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-009",
      qualifiedOn: "2022-06-14",
    },
    calibrationHistory: [
      { date: "2026-06-01", type: "Calibration", result: "Pass", performedBy: "External Lab (ISO 17025)", reference: "CAL-EXT-2026-011", note: "Traceable to national standard, certificate on file." },
      { date: "2025-12-02", type: "Calibration", result: "Pass", performedBy: "External Lab (ISO 17025)", reference: "CAL-EXT-2025-047" },
    ],
    maintenance: [
      { task: "Gauge block verification", frequency: "6 months", lastDone: "2026-06-01", nextDue: "2026-12-01", owner: "External Lab" },
      { task: "Zero-point check", frequency: "Daily", lastDone: "2026-07-21", nextDue: "2026-07-22", owner: "Erisa Kola" },
    ],
    linkedDeviations: [],
  },
  {
    id: "EQP-ENV-006",
    name: "Testo Cleanroom Environmental Monitor",
    category: "Environmental Monitoring Devices",
    location: "Packaging · Cleanroom ISO 8",
    status: "Operational",
    calibrationStatus: "Calibrated",
    lastService: "2026-05-28",
    nextDue: "2026-08-28",
    deviations: 0,
    manufacturer: "Testo",
    model: "Saveris 2-H1",
    serialNumber: "SN-SV2-6612",
    assetOwner: "Xheni Vata",
    installedOn: "2024-01-15",
    calibrationInterval: "3 months",
    criticality: "Critical",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-017",
      qualifiedOn: "2024-02-20",
    },
    calibrationHistory: [
      { date: "2026-05-28", type: "Calibration", result: "Pass", performedBy: "External Lab (ISO 17025)", reference: "CAL-EXT-2026-009", note: "Temperature and humidity probes verified." },
      { date: "2026-02-27", type: "Verification", result: "Pass", performedBy: "Xheni Vata", reference: "VER-2026-015" },
    ],
    maintenance: [
      { task: "Probe verification", frequency: "3 months", lastDone: "2026-05-28", nextDue: "2026-08-28", owner: "External Lab" },
      { task: "Data-logger battery check", frequency: "Monthly", lastDone: "2026-07-05", nextDue: "2026-08-05", owner: "Xheni Vata" },
    ],
    linkedDeviations: [],
  },
  {
    id: "EQP-PRN-011",
    name: "Formlabs Form 3B+ Resin Printer",
    category: "Printers",
    location: "Printing · Line 2",
    status: "Under Qualification",
    calibrationStatus: "Pending PQ",
    lastService: "2026-07-08",
    nextDue: "2026-08-15",
    deviations: 0,
    manufacturer: "Formlabs",
    model: "Form 3B+",
    serialNumber: "SN-F3B-9903",
    assetOwner: "Fatjon Rama",
    installedOn: "2026-06-30",
    calibrationInterval: "6 months",
    criticality: "Major",
    qualification: {
      iq: "Qualified",
      oq: "In Progress",
      pq: "Not Started",
      protocol: "VAL-EQP-026",
    },
    calibrationHistory: [
      { date: "2026-07-08", type: "Qualification", result: "Pass", performedBy: "Fatjon Rama", reference: "IQ-2026-026", note: "Installation qualification completed and approved." },
    ],
    maintenance: [
      { task: "OQ test runs", frequency: "One-time", lastDone: "2026-07-15", nextDue: "2026-07-28", owner: "Fatjon Rama" },
      { task: "Resin tank inspection", frequency: "Monthly", lastDone: "2026-07-08", nextDue: "2026-08-08", owner: "Fatjon Rama" },
    ],
    linkedDeviations: [],
  },
  {
    id: "EQP-TF-007",
    name: "Ministar S Thermoforming Machine",
    category: "Thermoforming Machines",
    location: "Thermoforming · Cell B",
    status: "Out of Service",
    calibrationStatus: "Expired",
    lastService: "2025-12-10",
    nextDue: "2026-06-10",
    deviations: 3,
    manufacturer: "SCHEU-DENTAL",
    model: "Ministar S",
    serialNumber: "SN-MS-1780",
    assetOwner: "Ilir Prifti",
    installedOn: "2022-08-14",
    calibrationInterval: "6 months",
    criticality: "Critical",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Failed",
      protocol: "VAL-EQP-011",
      qualifiedOn: "2022-09-20",
    },
    calibrationHistory: [
      { date: "2026-06-15", type: "Repair", result: "Fail", performedBy: "External Technician", reference: "WO-2026-022", note: "Pressure regulator fault — awaiting spare part." },
      { date: "2025-12-10", type: "Calibration", result: "Pass with adjustment", performedBy: "Erisa Kola", reference: "CAL-2025-101" },
    ],
    maintenance: [
      { task: "Pressure regulator replacement", frequency: "One-time", lastDone: "—", nextDue: "2026-07-30", owner: "External Technician" },
      { task: "Requalification (PQ)", frequency: "One-time", lastDone: "—", nextDue: "2026-08-14", owner: "Ilir Prifti" },
    ],
    linkedDeviations: [
      { id: "NCR-2026-072", title: "Forming pressure out of specification", status: "Investigation", capa: "CAPA-2026-019" },
      { id: "DEV-2026-025", title: "Repeated cycle abort during production", status: "Open" },
      { id: "DEV-2026-018", title: "Aligner deformation on cooling", status: "Closed", capa: "CAPA-2026-012" },
    ],
  },
  {
    id: "EQP-SCN-009",
    name: "Medit i700 Wireless Scanner",
    category: "Scanners",
    location: "Design · Scanning Bay",
    status: "Calibration Due",
    calibrationStatus: "Due",
    lastService: "2026-04-16",
    nextDue: "2026-07-16",
    deviations: 0,
    manufacturer: "Medit",
    model: "i700 Wireless",
    serialNumber: "SN-MI7-5540",
    assetOwner: "Fatjon Rama",
    installedOn: "2024-11-25",
    calibrationInterval: "3 months",
    criticality: "Major",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-023",
      qualifiedOn: "2024-12-18",
    },
    calibrationHistory: [
      { date: "2026-04-16", type: "Calibration", result: "Pass", performedBy: "Fatjon Rama", reference: "CAL-2026-035" },
      { date: "2026-01-14", type: "Verification", result: "Pass", performedBy: "Fatjon Rama", reference: "VER-2026-004" },
    ],
    maintenance: [
      { task: "Accuracy verification", frequency: "3 months", lastDone: "2026-04-16", nextDue: "2026-07-16", owner: "Fatjon Rama" },
      { task: "Battery calibration", frequency: "Monthly", lastDone: "2026-07-03", nextDue: "2026-08-03", owner: "Fatjon Rama" },
    ],
    linkedDeviations: [],
  },
  {
    id: "EQP-MSR-010",
    name: "Keyence IM-8000 Optical Measuring System",
    category: "Measuring Tools",
    location: "Quality Control · Metrology Lab",
    status: "Operational",
    calibrationStatus: "Calibrated",
    lastService: "2026-06-25",
    nextDue: "2026-12-25",
    deviations: 0,
    manufacturer: "Keyence",
    model: "IM-8000",
    serialNumber: "SN-IM8-7701",
    assetOwner: "Erisa Kola",
    installedOn: "2023-02-28",
    calibrationInterval: "6 months",
    criticality: "Major",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-013",
      qualifiedOn: "2023-04-01",
    },
    calibrationHistory: [
      { date: "2026-06-25", type: "Calibration", result: "Pass", performedBy: "External Lab (ISO 17025)", reference: "CAL-EXT-2026-013", note: "Dimensional accuracy verified across measurement range." },
      { date: "2025-12-27", type: "Calibration", result: "Pass", performedBy: "External Lab (ISO 17025)", reference: "CAL-EXT-2025-050" },
    ],
    maintenance: [
      { task: "Lens and stage cleaning", frequency: "Weekly", lastDone: "2026-07-18", nextDue: "2026-07-25", owner: "Erisa Kola" },
      { task: "Master calibration", frequency: "6 months", lastDone: "2026-06-25", nextDue: "2026-12-25", owner: "External Lab" },
    ],
    linkedDeviations: [],
  },
  {
    id: "EQP-ENV-012",
    name: "Vaisala Warehouse T/RH Logger Array",
    category: "Environmental Monitoring Devices",
    location: "Warehouse · Storage Zone",
    status: "Maintenance Due",
    calibrationStatus: "Verification pending",
    lastService: "2026-04-30",
    nextDue: "2026-07-30",
    deviations: 1,
    manufacturer: "Vaisala",
    model: "HMP110",
    serialNumber: "SN-HMP-4408",
    assetOwner: "Xheni Vata",
    installedOn: "2023-09-05",
    calibrationInterval: "3 months",
    criticality: "Minor",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-016",
      qualifiedOn: "2023-10-11",
    },
    calibrationHistory: [
      { date: "2026-04-30", type: "Calibration", result: "Pass", performedBy: "Xheni Vata", reference: "CAL-2026-038" },
      { date: "2026-01-29", type: "Verification", result: "Pass", performedBy: "Xheni Vata", reference: "VER-2026-009" },
    ],
    maintenance: [
      { task: "Probe verification", frequency: "3 months", lastDone: "2026-04-30", nextDue: "2026-07-30", owner: "Xheni Vata" },
      { task: "Logger firmware update", frequency: "Annual", lastDone: "2026-01-10", nextDue: "2027-01-10", owner: "Xheni Vata" },
    ],
    linkedDeviations: [
      { id: "DEV-2026-031", title: "Humidity excursion in storage zone overnight", status: "Closed", capa: "CAPA-2026-021" },
    ],
  },
  {
    id: "EQP-PRN-014",
    name: "Asiga MAX UV Dental Printer",
    category: "Printers",
    location: "Printing · Line 1",
    status: "Operational",
    calibrationStatus: "Calibrated",
    lastService: "2026-07-02",
    nextDue: "2027-01-02",
    deviations: 0,
    manufacturer: "Asiga",
    model: "MAX UV",
    serialNumber: "SN-AMU-2093",
    assetOwner: "Fatjon Rama",
    installedOn: "2025-01-20",
    calibrationInterval: "6 months",
    criticality: "Major",
    qualification: {
      iq: "Qualified",
      oq: "Qualified",
      pq: "Qualified",
      protocol: "VAL-EQP-024",
      qualifiedOn: "2025-02-24",
    },
    calibrationHistory: [
      { date: "2026-07-02", type: "Calibration", result: "Pass", performedBy: "Ilir Prifti", reference: "CAL-2026-052", note: "UV intensity and build-plate levelling verified." },
      { date: "2026-01-03", type: "Calibration", result: "Pass", performedBy: "Ilir Prifti", reference: "CAL-2026-001" },
    ],
    maintenance: [
      { task: "Build plate levelling", frequency: "Monthly", lastDone: "2026-07-02", nextDue: "2026-08-02", owner: "Fatjon Rama" },
      { task: "UV LED intensity check", frequency: "6 months", lastDone: "2026-07-02", nextDue: "2027-01-02", owner: "Ilir Prifti" },
    ],
    linkedDeviations: [],
  },
];

export const EQUIPMENT_CATEGORIES = [
  "Printers",
  "Thermoforming Machines",
  "Scanners",
  "Trimming Equipment",
  "Measuring Tools",
  "Environmental Monitoring Devices",
] as const;

export const EQUIPMENT_STATUSES = [
  "Operational",
  "Maintenance Due",
  "Calibration Due",
  "Out of Service",
  "Under Qualification",
] as const;
