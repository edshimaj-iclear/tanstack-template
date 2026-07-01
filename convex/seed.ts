import { mutation } from "./_generated/server";

/**
 * Mbush bazën me të dhëna demo (vetëm nëse është bosh).
 * Ekzekuto nga Convex dashboard ose: `npx convex run seed:demo`
 */
export const demo = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("accounts").first();
    if (existing) {
      return { skipped: true, reason: "Ka tashmë të dhëna" };
    }

    const now = Date.now();

    const clinic = await ctx.db.insert("accounts", {
      name: "Klinika Dentare Smile",
      type: "clinic",
      status: "active",
      city: "Tiranë",
      country: "Shqipëri",
      phone: "+355 69 000 0000",
      email: "info@smile.al",
      ownerName: "Dr. Edison",
      assignedRep: "Arben K.",
      specialties: ["Ortodonci", "Implantologji"],
      equipment: ["Scanner Medit", "CBCT", "Printer 3D"],
      chairsCount: 4,
      patientsCount: 1200,
      annualPotential: 85000,
      competitors: ["Invisalign"],
      scores: {
        relationshipHealth: 78,
        risk: 22,
        vip: 80,
        growth: 72,
        loyalty: 68,
        compliance: 90,
        digitalIndex: 85,
        education: 60,
      },
      notes: "Klinikë e dixhitalizuar, e interesuar për aligners dhe AI.",
      createdAt: now,
    });

    const lab = await ctx.db.insert("accounts", {
      name: "Laboratori iClear",
      type: "laboratory",
      status: "active",
      city: "Durrës",
      country: "Shqipëri",
      assignedRep: "Arben K.",
      equipment: ["Printer RF880", "Scanner"],
      annualPotential: 140000,
      scores: { relationshipHealth: 88, risk: 10, growth: 80 },
      createdAt: now,
    });

    await ctx.db.insert("accounts", {
      name: "Spitali Amerikan",
      type: "hospital",
      status: "prospect",
      city: "Tiranë",
      country: "Shqipëri",
      annualPotential: 220000,
      scores: { relationshipHealth: 45, risk: 50, growth: 65 },
      createdAt: now,
    });

    await ctx.db.insert("contacts", {
      accountId: clinic,
      firstName: "Edison",
      lastName: "H.",
      title: "Pronar / Dentist",
      decisionPower: 95,
      email: "edison@smile.al",
      interests: ["Digital workflow", "AI", "Kirurgji"],
      disc: "D",
      createdAt: now,
    });

    await ctx.db.insert("contacts", {
      accountId: clinic,
      firstName: "Ana",
      lastName: "M.",
      title: "Administratore",
      decisionPower: 40,
      createdAt: now,
    });

    await ctx.db.insert("deals", {
      title: "Aligners — paketë startuese",
      accountId: clinic,
      stage: "demo",
      value: 12000,
      probability: 70,
      products: ["Aligners"],
      ownerRep: "Arben K.",
      createdAt: now,
    });

    await ctx.db.insert("deals", {
      title: "Printer i ri 3D",
      accountId: lab,
      stage: "negotiation",
      value: 28000,
      probability: 55,
      products: ["Printer 3D"],
      competitor: "Formlabs",
      createdAt: now,
    });

    return { skipped: false, created: { accounts: 3, contacts: 2, deals: 2 } };
  },
});
