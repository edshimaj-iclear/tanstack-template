import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { accountStatus, accountType } from "./schema";

// Listo të gjitha llogaritë (me filtrim opsional sipas llojit/statusit)
export const list = query({
  args: {
    type: v.optional(accountType),
    status: v.optional(accountStatus),
  },
  handler: async (ctx, args) => {
    let accounts;
    if (args.type) {
      accounts = await ctx.db
        .query("accounts")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
    } else {
      accounts = await ctx.db.query("accounts").collect();
    }
    if (args.status) {
      accounts = accounts.filter((a) => a.status === args.status);
    }
    return accounts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Merr një llogari të vetme
export const get = query({
  args: { id: v.id("accounts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Statistika përmbledhëse për dashboard
export const stats = query({
  handler: async (ctx) => {
    const accounts = await ctx.db.query("accounts").collect();
    const byType: Record<string, number> = {};
    for (const a of accounts) {
      byType[a.type] = (byType[a.type] || 0) + 1;
    }
    return {
      total: accounts.length,
      active: accounts.filter((a) => a.status === "active").length,
      prospects: accounts.filter((a) => a.status === "prospect").length,
      totalPotential: accounts.reduce(
        (sum, a) => sum + (a.annualPotential || 0),
        0,
      ),
      byType,
    };
  },
});

const accountFields = {
  name: v.string(),
  type: accountType,
  status: accountStatus,
  city: v.optional(v.string()),
  country: v.optional(v.string()),
  address: v.optional(v.string()),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  website: v.optional(v.string()),
  ownerName: v.optional(v.string()),
  adminName: v.optional(v.string()),
  clinicalDirector: v.optional(v.string()),
  specialties: v.optional(v.array(v.string())),
  equipment: v.optional(v.array(v.string())),
  chairsCount: v.optional(v.number()),
  patientsCount: v.optional(v.number()),
  annualPotential: v.optional(v.number()),
  competitors: v.optional(v.array(v.string())),
  assignedRep: v.optional(v.string()),
  notes: v.optional(v.string()),
};

// Krijo një llogari të re
export const create = mutation({
  args: accountFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("accounts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Përditëso një llogari (vetëm fushat e dhëna ndryshojnë)
export const update = mutation({
  args: {
    id: v.id("accounts"),
    name: v.optional(v.string()),
    type: v.optional(accountType),
    status: v.optional(accountStatus),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    adminName: v.optional(v.string()),
    clinicalDirector: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())),
    equipment: v.optional(v.array(v.string())),
    chairsCount: v.optional(v.number()),
    patientsCount: v.optional(v.number()),
    annualPotential: v.optional(v.number()),
    competitors: v.optional(v.array(v.string())),
    assignedRep: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const patch = Object.fromEntries(
      Object.entries(rest).filter(([, val]) => val !== undefined),
    );
    return await ctx.db.patch(id, patch);
  },
});

// Fshi një llogari
export const remove = mutation({
  args: { id: v.id("accounts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
