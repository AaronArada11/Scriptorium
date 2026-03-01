import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const currentUser = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  
  if (!identity) {
    return null;
  }


  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  return user;
});

export const storeUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),  
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,  
    });
  },
});
