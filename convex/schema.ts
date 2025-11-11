import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    username: v.string(),
    imageUrl: v.optional(v.string()),
    // bio: v.optional(v.string()),
    // interests: v.optional(v.array(v.string())),
    // profileCompleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"])
    .index("by_email", ["email"]),

  posts: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    likes: v.array(v.string()),
    comments: v.array(
      v.object({
        userId: v.id("users"),
        content: v.string(),
        createdAt: v.number(),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_created", ["createdAt"]),

  //   follows: defineTable({
  //     followerId: v.id('users'),
  //     followingId: v.id('users'),
  //     createdAt: v.number(),
  //   })
  //     .index('by_follower', ['followerId'])
  //     .index('by_following', ['followingId'])
  //     .index('by_follower_following', ['followerId', 'followingId']),
});
