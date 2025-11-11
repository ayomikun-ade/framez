import { SignOutButton } from "@/components/sign-out-button";
import { ThemedText } from "@/components/themed-text";
import { formatTimeAgo } from "@/constants/functions";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const userPosts = useQuery(
    api.posts.getPostsByAuthor,
    currentUser ? { authorId: currentUser._id } : "skip"
  );
  const deletePost = useMutation(api.posts.deletePost);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleDeletePost = (postId: string) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          const convexPostId = postId as Id<"posts">;
          deletePost({ postId: convexPostId });
        },
        style: "destructive",
      },
    ]);
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading Profile...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: currentUser.imageUrl }}
          style={styles.profileImage}
        />
        <View>
          <ThemedText type="title" style={styles.name}>
            {currentUser.name}
          </ThemedText>
          <ThemedText style={styles.username}>
            @{currentUser.username}
          </ThemedText>
          <ThemedText style={styles.email}>{currentUser.email}</ThemedText>
        </View>
      </View>
      <View style={{ alignSelf: "flex-start", marginBottom: 16 }}>
        <SignOutButton />
      </View>
      <ThemedText
        type="title"
        style={{
          textAlign: "left",
          fontSize: 24,
          marginTop: 16,
          width: "100%",
        }}
      >
        My Posts ({userPosts?.length})
      </ThemedText>
      {userPosts && userPosts?.length <= 0 ? (
        <View>
          <Ionicons size={64} name="file-tray-outline" />
          <ThemedText style={{ textAlign: "center" }}>
            You don&apos;t have any posts yet
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const likeCount = item.likes.length;

            return (
              <View style={styles.postContainer}>
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
                  <View style={styles.postInfo}>
                    <ThemedText style={styles.timestamp}>
                      {formatTimeAgo(item.createdAt)}
                    </ThemedText>
                    <View style={styles.likesDisplay}>
                      <Ionicons name="heart" size={16} color="#ff4444" />
                      <ThemedText style={styles.likeCount}>
                        {likeCount}
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleDeletePost(item._id)}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          style={styles.postsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
  },
  username: {
    color: "#999",
  },
  email: {
    color: "#999",
    marginBottom: 24,
  },
  postsList: {
    width: "100%",
    marginTop: 24,
  },
  postContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
    padding: 16,
    borderRadius: 8,
  },
  postContent: {},
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginTop: 12,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  timestamp: {
    color: "#999",
    fontSize: 12,
  },
  postInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  likesDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeCount: {
    color: "#999",
    fontSize: 12,
  },
});
