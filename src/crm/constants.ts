// Etiketat, ngjyrat dhe ndihmësit e përbashkët për CRM-në (në shqip)

export const isConvexAvailable = Boolean(import.meta.env.VITE_CONVEX_URL);

// Llojet e llogarive
export type AccountType =
  | "clinic"
  | "hospital"
  | "pharmacy"
  | "laboratory"
  | "university"
  | "dealer"
  | "distributor"
  | "government";

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "clinic", label: "Klinikë" },
  { value: "hospital", label: "Spital" },
  { value: "pharmacy", label: "Farmaci" },
  { value: "laboratory", label: "Laborator" },
  { value: "university", label: "Universitet" },
  { value: "dealer", label: "Tregtar" },
  { value: "distributor", label: "Distributor" },
  { value: "government", label: "Institucion shtetëror" },
];

export const accountTypeLabel = (t: string) =>
  ACCOUNT_TYPES.find((x) => x.value === t)?.label ?? t;

// Statuset
export type AccountStatus = "prospect" | "active" | "inactive";

export const ACCOUNT_STATUSES: { value: AccountStatus; label: string }[] = [
  { value: "prospect", label: "Potencial" },
  { value: "active", label: "Aktiv" },
  { value: "inactive", label: "Joaktiv" },
];

export const accountStatusLabel = (s: string) =>
  ACCOUNT_STATUSES.find((x) => x.value === s)?.label ?? s;

export const statusColor = (s: string) => {
  switch (s) {
    case "active":
      return "bg-green-100 text-green-700";
    case "prospect":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

// Fazat e pipeline-it
export type DealStage =
  | "lead"
  | "qualified"
  | "meeting"
  | "demo"
  | "trial"
  | "quotation"
  | "negotiation"
  | "won"
  | "implementation"
  | "training"
  | "retention"
  | "expansion"
  | "referral"
  | "lost";

export const DEAL_STAGES: { value: DealStage; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "qualified", label: "I kualifikuar" },
  { value: "meeting", label: "Takim" },
  { value: "demo", label: "Demo" },
  { value: "trial", label: "Provë" },
  { value: "quotation", label: "Ofertë" },
  { value: "negotiation", label: "Negociim" },
  { value: "won", label: "Fituar" },
  { value: "implementation", label: "Implementim" },
  { value: "training", label: "Trajnim" },
  { value: "retention", label: "Mbajtje" },
  { value: "expansion", label: "Zgjerim" },
  { value: "referral", label: "Referim" },
  { value: "lost", label: "Humbur" },
];

export const dealStageLabel = (s: string) =>
  DEAL_STAGES.find((x) => x.value === s)?.label ?? s;

// Fazat që shfaqen si kolona në kanban (përjashtohen won/lost si gjendje finale)
export const PIPELINE_COLUMNS: DealStage[] = [
  "lead",
  "qualified",
  "meeting",
  "demo",
  "trial",
  "quotation",
  "negotiation",
  "won",
];

// Ndihmës formatimi
export const formatCurrency = (n?: number) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("sq-AL", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(n);

export const formatNumber = (n?: number) =>
  n == null ? "—" : new Intl.NumberFormat("sq-AL").format(n);

// Ngjyra për vlerësimet (score 0-100)
export const scoreColor = (n?: number) => {
  if (n == null) return "text-gray-400";
  if (n >= 70) return "text-green-600";
  if (n >= 40) return "text-amber-600";
  return "text-red-600";
};

// Emrat e indekseve të scoring për shfaqje
export const SCORE_LABELS: { key: string; label: string }[] = [
  { key: "relationshipHealth", label: "Shëndeti i marrëdhënies" },
  { key: "risk", label: "Rreziku" },
  { key: "vip", label: "VIP" },
  { key: "growth", label: "Potenciali i rritjes" },
  { key: "loyalty", label: "Besnikëria" },
  { key: "compliance", label: "Përputhshmëria" },
  { key: "digitalIndex", label: "Indeksi dixhital" },
  { key: "education", label: "Edukimi" },
];
