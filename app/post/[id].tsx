import { ThemedText } from "@/components/themed-text";
import { formatTimeAgo } from "@/constants/functions";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = id as Id<"posts">;
  const post = useQuery(api.posts.getPostById, { postId });
  const addComment = useMutation(api.posts.addComment);
  const currentUser = useQuery(api.users.getCurrentUser);

  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser || loading) return;
    setLoading(true);
    try {
      await addComment({
        postId: postId,
        content: newComment,
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <FlatList
        ListHeaderComponent={
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <View style={styles.authorContainer}>
                {post.authorImageUrl && (
                  <Image
                    source={{ uri: post.authorImageUrl }}
                    style={styles.authorImage}
                  />
                )}
                <View>
                  <ThemedText style={styles.authorName}>
                    {post.authorName}
                  </ThemedText>
                  <ThemedText style={styles.authorUsername}>
                    @{post.authorUsername}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.timestamp}>
                {new Date(post.createdAt).toLocaleString()}
              </ThemedText>
            </View>
            <ThemedText style={styles.postContent}>{post.content}</ThemedText>
            {post.imageUrl && (
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            )}
            <ThemedText style={styles.commentsTitle}>
              Comments ({post.comments.length})
            </ThemedText>
          </View>
        }
        data={post.comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.userImageUrl && (
                <Image
                  source={{ uri: item.userImageUrl }}
                  style={styles.authorImage}
                />
              )}
              <View>
                <ThemedText style={styles.commentAuthor}>
                  {item.userName}
                </ThemedText>
                <ThemedText>{item.content}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.timestamp}>
              {formatTimeAgo(item.createdAt)}
            </ThemedText>
          </View>
        )}
        ListEmptyComponent={
          <ThemedText style={styles.noCommentsText}>
            No comments yet.
          </ThemedText>
        }
      />

      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor="#999"
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.buttonDisabled]}
          onPress={handleAddComment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Ionicons name="send" size={20} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  authorName: {
    fontWeight: "bold",
  },
  authorUsername: {
    color: "#999",
  },
  postContent: {
    marginTop: 8,
    color: "#fff",
  },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginTop: 12,
  },
  timestamp: {
    color: "#999",
    fontSize: 12,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    color: "#fff",
  },
  commentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#fff",
  },
  noCommentsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginBottom: 64,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});
