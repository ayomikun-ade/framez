import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const profile = await ctx.auth.getUserIdentity();

    if (!profile) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", profile.subject))
      .first();

    return user;
  },
});

/**
 * Create or update user in Convex database
 * This should be called after Clerk authentication is complete
 * Automatically syncs user data from Clerk to Convex
 */
export const createOrUpdateUser = mutation({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.auth.getUserIdentity();

    if (!profile) {
      const errorMsg =
        "Not authenticated. This usually means:\n" +
        "1. Clerk JWT Template is not configured or domain mismatch\n" +
        "2. convex/auth.config.ts domain does not match Clerk Issuer URL\n" +
        "3. Convex backend needs redeployment after auth.config.ts changes\n" +
        "Check your Clerk Dashboard > JWT Templates for the correct Issuer URL";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const clerkId = profile.subject;
    const email = args.email || profile.email || "";
    const name = args.name || profile.name || email.split("@")[0] || "User";
    const emailUsername = email.split("@")[0] || "user";
    const cleanUsername = emailUsername
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();
    const username =
      args.username ||
      cleanUsername ||
      `user${Math.floor(Math.random() * 1000)}`;
    const imageUrl = args.imageUrl || profile.pictureUrl || "";

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email,
        name,
        username,
        imageUrl: imageUrl || existingUser.imageUrl,
        updatedAt: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId,
      email,
      name,
      username,
      imageUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

/**
 * Get user by ID
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * Get user by username
 */
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

/**
 * Update user profile
 */
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    // interests: v.optional(v.array(v.string())),
    profileCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Find user by Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.username !== undefined) updates.username = args.username;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl;
    // if (args.interests !== undefined) updates.interests = args.interests;
    if (args.profileCompleted !== undefined)
      updates.profileCompleted = args.profileCompleted;

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});
