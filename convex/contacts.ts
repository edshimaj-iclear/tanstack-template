import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Listo kontaktet (të gjitha, ose vetëm për një llogari)
export const list = query({
  args: { accountId: v.optional(v.id("accounts")) },
  handler: async (ctx, args) => {
    let contacts;
    if (args.accountId) {
      contacts = await ctx.db
        .query("contacts")
        .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
        .collect();
    } else {
      contacts = await ctx.db.query("contacts").collect();
    }
    return contacts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    accountId: v.optional(v.id("accounts")),
    firstName: v.string(),
    lastName: v.optional(v.string()),
    title: v.optional(v.string()),
    decisionPower: v.optional(v.number()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    instagram: v.optional(v.string()),
    birthday: v.optional(v.string()),
    disc: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contacts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("contacts"),
    accountId: v.optional(v.id("accounts")),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    title: v.optional(v.string()),
    decisionPower: v.optional(v.number()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    instagram: v.optional(v.string()),
    birthday: v.optional(v.string()),
    disc: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
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

export const remove = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
