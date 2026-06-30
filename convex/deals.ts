import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { dealStage } from "./schema";

// Listo marrëveshjet (të gjitha, ose vetëm për një llogari)
export const list = query({
  args: { accountId: v.optional(v.id("accounts")) },
  handler: async (ctx, args) => {
    let deals;
    if (args.accountId) {
      deals = await ctx.db
        .query("deals")
        .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
        .collect();
    } else {
      deals = await ctx.db.query("deals").collect();
    }
    return deals.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id("deals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Statistika të pipeline-it për dashboard / forecast
export const stats = query({
  handler: async (ctx) => {
    const deals = await ctx.db.query("deals").collect();
    const open = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
    const won = deals.filter((d) => d.stage === "won");
    return {
      total: deals.length,
      openCount: open.length,
      wonCount: won.length,
      openValue: open.reduce((s, d) => s + (d.value || 0), 0),
      wonValue: won.reduce((s, d) => s + (d.value || 0), 0),
      // Forecast i ponderuar = vlera × probabiliteti
      forecast: open.reduce(
        (s, d) => s + ((d.value || 0) * (d.probability ?? 0)) / 100,
        0,
      ),
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    accountId: v.optional(v.id("accounts")),
    contactId: v.optional(v.id("contacts")),
    stage: dealStage,
    value: v.optional(v.number()),
    probability: v.optional(v.number()),
    expectedClose: v.optional(v.string()),
    products: v.optional(v.array(v.string())),
    competitor: v.optional(v.string()),
    lostReason: v.optional(v.string()),
    ownerRep: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("deals", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Përditëso (përdoret edhe nga kanban për ndryshim faze)
export const update = mutation({
  args: {
    id: v.id("deals"),
    title: v.optional(v.string()),
    accountId: v.optional(v.id("accounts")),
    contactId: v.optional(v.id("contacts")),
    stage: v.optional(dealStage),
    value: v.optional(v.number()),
    probability: v.optional(v.number()),
    expectedClose: v.optional(v.string()),
    products: v.optional(v.array(v.string())),
    competitor: v.optional(v.string()),
    lostReason: v.optional(v.string()),
    ownerRep: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const patch = Object.fromEntries(
      Object.entries(rest).filter(([, val]) => val !== undefined),
    );
    return await ctx.db.patch(id, patch);
  },
});

// Ndrysho vetëm fazën (drag & drop në kanban)
export const setStage = mutation({
  args: { id: v.id("deals"), stage: dealStage },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { stage: args.stage });
  },
});

export const remove = mutation({
  args: { id: v.id("deals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
