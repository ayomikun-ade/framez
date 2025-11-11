import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get all posts ordered by creation date (newest first)
 */
export const getAllPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_created")
      .order("desc")
      .collect();

    // Enrich posts with author information and comments
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);

        // Enrich comments with user information
        const enrichedComments = await Promise.all(
          post.comments.map(async (comment) => {
            const user = await ctx.db.get(comment.userId);
            return {
              ...comment,
              userName: user?.name || "Unknown",
              userImageUrl: user?.imageUrl || null,
            };
          })
        );

        return {
          ...post,
          authorName: author?.name || "Unknown",
          authorUsername: author?.username || "unknown",
          authorImageUrl: author?.imageUrl || null,
          comments: enrichedComments,
        };
      })
    );

    return enrichedPosts;
  },
});

/**
 * Get posts by a specific author
 */
export const getPostsByAuthor = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();

    const author = await ctx.db.get(args.authorId);

    return posts.map((post) => ({
      ...post,
      authorName: author?.name || "Unknown",
      authorUsername: author?.username || "unknown",
      authorImageUrl: author?.imageUrl || null,
    }));
  },
});

/**
 * Get a single post by ID
 */
export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    const author = await ctx.db.get(post.authorId);

    // Enrich comments with user information
    const enrichedComments = await Promise.all(
      post.comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          userName: user?.name || "Unknown",
          userImageUrl: user?.imageUrl || null,
        };
      })
    );

    return {
      ...post,
      authorName: author?.name || "Unknown",
      authorUsername: author?.username || "unknown",
      authorImageUrl: author?.imageUrl || null,
      comments: enrichedComments,
    };
  },
});

/**
 * Create a new post
 */
export const createPost = mutation({
  args: {
    content: v.string(),
    imageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find user by Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const postId = await ctx.db.insert("posts", {
      authorId: user._id,
      content: args.content.trim(),
      imageUrl: args.imageUrl,
      likes: [],
      comments: [],
      createdAt: now,
      updatedAt: now,
    });

    return postId;
  },
});

/**
 * Like a post
 */
export const likePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const userId = user._id.toString();
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike: remove user ID from likes array
      await ctx.db.patch(args.postId, {
        likes: post.likes.filter((id) => id !== userId),
        updatedAt: Date.now(),
      });
    } else {
      // Like: add user ID to likes array
      await ctx.db.patch(args.postId, {
        likes: [...post.likes, userId],
        updatedAt: Date.now(),
      });
    }

    return !isLiked;
  },
});

/**
 * Add a comment to a post
 */
export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const newComment = {
      userId: user._id,
      content: args.content.trim(),
      createdAt: Date.now(),
    };

    await ctx.db.patch(args.postId, {
      comments: [...post.comments, newComment],
      updatedAt: Date.now(),
    });

    return {
      ...newComment,
      userName: user.name,
      userImageUrl: user.imageUrl || null,
    };
  },
});

/**
 * Delete a post (only by author)
 */
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const profile = await ctx.auth.getUserIdentity();

    if (!profile) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", profile.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Only author can delete their post
    if (post.authorId !== user._id) {
      throw new Error("Unauthorized: Only the author can delete this post");
    }

    await ctx.db.delete(args.postId);
    return true;
  },
});
