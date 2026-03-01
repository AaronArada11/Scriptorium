// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users (synced from Clerk)
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  // Workspaces (the core multi-tenant unit)
  workspaces: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.id("users"),
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  // Workspace membership (role-based access)
  members: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("editor"), v.literal("viewer")),
    joinedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_workspace_and_user", ["workspaceId", "userId"]),

  // Documents within a workspace
  documents: defineTable({
    workspaceId: v.id("workspaces"),
    title: v.string(),
    content: v.optional(v.string()),
    authorId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Files uploaded to a workspace
  files: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    storageId: v.id("_storage"),  // Convex file storage reference
    mimeType: v.string(),
    size: v.number(),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Activity log for the timeline
  activities: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    action: v.string(),  // "created_document", "uploaded_file", "invited_member", etc.
    targetType: v.optional(v.string()),  // "document", "file", "member"
    targetId: v.optional(v.string()),
    metadata: v.optional(v.string()),  // JSON string for extra details
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // AI chat messages within a workspace
  chatMessages: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.optional(v.id("users")),  // null for AI messages
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    sources: v.optional(v.array(v.string())),  // references to files/documents
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Embeddings for RAG (AI context retrieval)
  embeddings: defineTable({
    workspaceId: v.id("workspaces"),
    sourceType: v.union(v.literal("document"), v.literal("file")),
    sourceId: v.string(),
    chunkIndex: v.number(),
    text: v.string(),
    embedding: v.array(v.float64()),  // OpenAI embedding vector
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_source", ["sourceType", "sourceId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,  // OpenAI text-embedding-3-small
      filterFields: ["workspaceId"],
    }),
});
