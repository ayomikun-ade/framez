import { ThemedText } from "@/components/themed-text";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddPostScreen() {
  const [content, setContent] = useState("");
  const createPost = useMutation(api.posts.createPost);
  const router = useRouter();

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Post content cannot be empty.");
      return;
    }

    try {
      await createPost({ content });
      setContent("");
      router.push("/(tabs)");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create a new post
      </ThemedText>
      <TextInput
        style={styles.textInput}
        placeholder="What's on your mind?"
        placeholderTextColor="#999"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
        <ThemedText style={styles.buttonText}>Post</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  textInput: {
    color: "white",
    paddingHorizontal: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#aeaeae",
    borderRadius: 12,
    width: "100%",
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  button: {
    backgroundColor: "white",
    marginHorizontal: "auto",
    marginVertical: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
  },
});
