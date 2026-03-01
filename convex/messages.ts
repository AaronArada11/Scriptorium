import { query } from './_generated/server'
import { v } from 'convex/values'

export const getChatMessages = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
      throw new Error('Not authenticated')
    }
    return await ctx.db
      .query('chatMessages')
      .withIndex('by_workspace', (q) => q.eq('workspaceId', args.workspaceId))
      .collect()
  },
})