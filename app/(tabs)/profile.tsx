import { SignOutButton } from "@/components/sign-out-button";
import { ThemedText } from "@/components/themed-text";
import { formatTimeAgo } from "@/constants/functions";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import {
  Alert,
  FlatList,
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
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: currentUser.imageUrl }}
        style={styles.profileImage}
      />
      <ThemedText type="title" style={styles.name}>
        {currentUser.name}
      </ThemedText>
      <ThemedText style={styles.username}>@{currentUser.username}</ThemedText>
      <ThemedText style={styles.email}>{currentUser.email}</ThemedText>
      <SignOutButton />
      <ThemedText
        type="title"
        style={{ textAlign: "left", fontSize: 24, marginTop: 16 }}
      >
        My Posts
      </ThemedText>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <ThemedText style={styles.postContent}>{item.content}</ThemedText>
            <View style={styles.postFooter}>
              <ThemedText style={styles.timestamp}>
                {formatTimeAgo(item.createdAt)}
              </ThemedText>
              <TouchableOpacity onPress={() => handleDeletePost(item._id)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.postsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
  },
  username: {
    color: "#999",
    marginBottom: 8,
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
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  timestamp: {
    color: "#999",
    fontSize: 12,
  },
});
