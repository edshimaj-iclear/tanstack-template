import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Healthcare CRM (HCIP) — Schema
 *
 * Faza 1 — Bërthama: Accounts → Contacts → Deals (Pipeline)
 * Modulet e tjera (Products/MDR, Education, Field Sales, AI) shtohen mbi këtë bazë.
 */

// Lloji i llogarisë (account) — klinika, spital, laborator, distributor, etj.
export const accountType = v.union(
  v.literal("clinic"), // Klinikë
  v.literal("hospital"), // Spital
  v.literal("pharmacy"), // Farmaci
  v.literal("laboratory"), // Laborator
  v.literal("university"), // Universitet
  v.literal("dealer"), // Tregtar
  v.literal("distributor"), // Distributor
  v.literal("government"), // Institucion shtetëror
);

export const accountStatus = v.union(
  v.literal("prospect"), // Potencial
  v.literal("active"), // Aktiv
  v.literal("inactive"), // Joaktiv
);

// Fazat e pipeline-it të shitjeve
export const dealStage = v.union(
  v.literal("lead"),
  v.literal("qualified"),
  v.literal("meeting"),
  v.literal("demo"),
  v.literal("trial"),
  v.literal("quotation"),
  v.literal("negotiation"),
  v.literal("won"),
  v.literal("implementation"),
  v.literal("training"),
  v.literal("retention"),
  v.literal("expansion"),
  v.literal("referral"),
  v.literal("lost"),
);

// Indekset e vlerësimit (0-100) — "Clinical Relationship Management"
const scores = v.optional(
  v.object({
    risk: v.optional(v.number()), // Risk Score
    vip: v.optional(v.number()), // VIP Score
    growth: v.optional(v.number()), // Growth Potential
    loyalty: v.optional(v.number()), // Loyalty Score
    compliance: v.optional(v.number()), // Compliance Score
    digitalIndex: v.optional(v.number()), // Clinical Digital Index
    education: v.optional(v.number()), // Education Score
    relationshipHealth: v.optional(v.number()), // Relationship Health Score
  }),
);

export default defineSchema({
  // Modul 1 — Account Management
  accounts: defineTable({
    name: v.string(),
    type: accountType,
    status: accountStatus,
    // Vendndodhja & kontakti
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    // Profili
    ownerName: v.optional(v.string()), // Pronari
    adminName: v.optional(v.string()), // Administratori
    clinicalDirector: v.optional(v.string()), // Drejtuesi klinik
    specialties: v.optional(v.array(v.string())), // Specialitetet
    equipment: v.optional(v.array(v.string())), // Scanner, CBCT, Printer 3D, Software...
    chairsCount: v.optional(v.number()), // Numri i karrigeve
    patientsCount: v.optional(v.number()), // Numri i pacientëve
    annualPotential: v.optional(v.number()), // Potenciali vjetor (€)
    competitors: v.optional(v.array(v.string())), // Konkurrentët
    assignedRep: v.optional(v.string()), // Përgjegjësi i shitjeve
    scores,
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_rep", ["assignedRep"]),

  // Modul 2 — Contact Intelligence
  contacts: defineTable({
    accountId: v.optional(v.id("accounts")),
    firstName: v.string(),
    lastName: v.optional(v.string()),
    title: v.optional(v.string()), // Roli: Owner, Dentist, Admin...
    decisionPower: v.optional(v.number()), // Influenca në vendimmarrje (0-100)
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    instagram: v.optional(v.string()),
    birthday: v.optional(v.string()), // ISO date
    disc: v.optional(v.string()), // Profili DISC
    interests: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_account", ["accountId"]),

  // Modul 3 — Sales Pipeline
  deals: defineTable({
    title: v.string(),
    accountId: v.optional(v.id("accounts")),
    contactId: v.optional(v.id("contacts")),
    stage: dealStage,
    value: v.optional(v.number()), // Vlera e mundshme (€)
    probability: v.optional(v.number()), // Probabiliteti (0-100)
    expectedClose: v.optional(v.string()), // ISO date
    products: v.optional(v.array(v.string())),
    competitor: v.optional(v.string()),
    lostReason: v.optional(v.string()),
    ownerRep: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_account", ["accountId"])
    .index("by_stage", ["stage"]),

  // Chat / AI Assistant (modul ekzistues)
  conversations: defineTable({
    title: v.string(),
    messages: v.array(
      v.object({
        id: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
  }),
});
