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
//make this delete function
export const deleteWorkspace = mutation({      
  args: { 
    workspaceId: v.id("workspaces")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();  
    if (!identity) throw new Error("Not authenticated");
const user = await ctx.db
  .query("users")
  .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
  .first();

if (!user) {
  throw new Error("User not found, sync user first!");
}
    
 const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    if (workspace.ownerId !== user._id) {
      throw new Error("Only the workspace owner can delete it");
    }
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
    
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
    
    for (const doc of documents) {
      await ctx.db.delete(doc._id);
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
    
    for (const file of files) {
      await ctx.db.delete(file._id);
    }

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
    
    for (const activity of activities) {
      await ctx.db.delete(activity._id);
    }

    const chatMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
    
    for (const msg of chatMessages) {
      await ctx.db.delete(msg._id);
    }

    // Finally delete the workspace
    await ctx.db.delete(args.workspaceId);

    return { success: true };
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

// Get stats for all user's workspaces (member count, file count, document count)
export const getDashboardStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { totalWorkspaces: 0, totalMembers: 0, totalFiles: 0, totalDocuments: 0 };

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!user) return { totalWorkspaces: 0, totalMembers: 0, totalFiles: 0, totalDocuments: 0 };

    const memberships = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const workspaceIds = memberships.map((m) => m.workspaceId);
    
    // Count total members across all workspaces
    let totalMembers = 0;
    for (const wsId of workspaceIds) {
      const members = await ctx.db
        .query("members")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", wsId))
        .collect();
      totalMembers += members.length;
    }

    // Count total files across all workspaces
    let totalFiles = 0;
    for (const wsId of workspaceIds) {
      const files = await ctx.db
        .query("files")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", wsId))
        .collect();
      totalFiles += files.length;
    }

    // Count total documents across all workspaces
    let totalDocuments = 0;
    for (const wsId of workspaceIds) {
      const docs = await ctx.db
        .query("documents")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", wsId))
        .collect();
      totalDocuments += docs.length;
    }

    return {
      totalWorkspaces: workspaceIds.length,
      totalMembers,
      totalFiles,
      totalDocuments,
    };
  },
});

// Get workspace details with member, file, and document counts
export const getWorkspaceDetails = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!user) return null;

    // Check if user is a member
    const membership = await ctx.db
      .query("members")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", user._id)
      )
      .first();

    if (!membership) return null;

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return null;

    // Get member count
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Get file count
    const files = await ctx.db
      .query("files")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Get document count
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return {
      ...workspace,
      memberCount: members.length,
      fileCount: files.length,
      documentCount: documents.length,
      userRole: membership.role,
    };
  },
});

// Get recent activities across all user's workspaces
export const getRecentActivities = query({
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

    // Get recent activities from all workspaces
    let allActivities: any[] = [];
    for (const wsId of workspaceIds) {
      const activities = await ctx.db
        .query("activities")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", wsId))
        .order("desc")
        .take(10);
      
      // Enrich with workspace name
      const workspace = await ctx.db.get(wsId);
      const enrichedActivities = await Promise.all(
        activities.map(async (activity) => {
          const activityUser = await ctx.db.get(activity.userId);
          return {
            ...activity,
            workspaceName: workspace?.name || "Unknown",
            userName: activityUser?.name || "Unknown User",
          };
        })
      );
      allActivities = [...allActivities, ...enrichedActivities];
    }

    // Sort by creation date and take most recent 10
    return allActivities
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 10);
  },
});
