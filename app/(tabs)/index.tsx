import { ThemedText } from "@/components/themed-text";
import { formatTimeAgo } from "@/constants/functions";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const posts = useQuery(api.posts.getAllPosts);

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Feed
      </ThemedText>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
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
            <ThemedText style={styles.postContent}>{item.content}</ThemedText>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
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
  timestamp: {
    color: "#999",
    fontSize: 12,
  },
});
