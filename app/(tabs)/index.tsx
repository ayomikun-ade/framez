import { ThemedText } from "@/components/themed-text";
import { formatTimeAgo } from "@/constants/functions";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const posts = useQuery(api.posts.getAllPosts);
  const currentUser = useQuery(api.users.getCurrentUser);
  const likePost = useMutation(api.posts.likePost);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const convexPostId = postId as Id<"posts">;
      await likePost({ postId: convexPostId });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Feed
      </ThemedText>
      {!posts ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : posts.length <= 0 ? (
        <View
          style={{
            alignItems: "center",
            marginTop: 48,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Ionicons size={64} name="file-tray-outline" color={"#ecedee"} />
          <ThemedText style={{ textAlign: "center" }}>
            No posts available yet!
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const isLiked = currentUser
              ? item.likes.includes(currentUser._id)
              : false;
            const likeCount = item.likes.length;
            const commentCount = item.comments.length;

            return (
              <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                  <View style={styles.authorContainer}>
                    {item.authorImageUrl && (
                      <Image
                        source={{ uri: item.authorImageUrl }}
                        style={styles.authorImage}
                      />
                    )}
                    <View>
                      <ThemedText style={styles.authorName}>
                        {item.authorName}
                      </ThemedText>
                      <ThemedText style={styles.authorUsername}>
                        @{item.authorUsername}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.timestamp}>
                    {formatTimeAgo(item.createdAt)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.postContent}>
                  {item.content}
                </ThemedText>
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.postImage}
                  />
                )}
                <View style={styles.postFooter}>
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => handleLike(item._id)}
                  >
                    <Ionicons
                      name={isLiked ? "heart" : "heart-outline"}
                      size={20}
                      color={isLiked ? "#ff4444" : "#999"}
                    />
                    <ThemedText style={styles.footerButtonText}>
                      {likeCount}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() =>
                      router.push({
                        pathname: "/post/[id]",
                        params: { id: item._id },
                      })
                    }
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color={"#999"}
                    />
                    <ThemedText style={styles.footerButtonText}>
                      {commentCount}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    paddingTop: 24,
    fontSize: 48,
  },
  postContainer: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
    padding: 16,
    borderRadius: 8,
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
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerButtonText: {
    color: "#999",
    fontSize: 14,
  },
});
