import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createWorkspace = mutation({      
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();  
    if (!identity) return null;
const user = await ctx.db
  .query("users")
  .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
  .first();

if (!user) {
  throw new Error("User not found, sync user first!");
}


const workspaceId = await ctx.db.insert("workspaces", {
  name: args.name,
  description: args.description,
  ownerId: user._id,  
  createdAt: Date.now(),
});

    await ctx.db.insert("members", {
    workspaceId: workspaceId,
    userId: user._id,
    role: "owner",
    joinedAt: Date.now(),
    });

 return workspaceId;
    },
  });

export const getWorkspaces = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!user) return [];

    const memberships = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const workspaceIds = memberships.map((m) => m.workspaceId);
    const workspaces = await Promise.all(
      workspaceIds.map((id) => ctx.db.get(id))
    );

    return workspaces.filter(Boolean);
  },
});
