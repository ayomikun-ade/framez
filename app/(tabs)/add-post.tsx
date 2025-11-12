import { ThemedText } from "@/components/themed-text";
import { api } from "@/convex/_generated/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddPostScreen() {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const createPost = useMutation(api.posts.createPost);
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to add images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      // Store as data URI for simplicity
      const base64 = result.assets[0].base64;
      const dataUri = `data:image/jpeg;base64,${base64}`;
      setImageUri(dataUri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Post content cannot be empty.");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      await createPost({
        content,
        imageUrl: imageUri || undefined,
      });
      setContent("");
      setImageUri(null);
      router.push("/(tabs)");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
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

        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
              <Ionicons name="close-circle" size={32} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="white" />
          <ThemedText style={styles.imageButtonText}>
            {imageUri ? "Change Image" : "Add Image"}
          </ThemedText>
        </TouchableOpacity>
        <ThemedText style={{ color: "#999", fontSize: 12, marginBottom: 12 }}>
          Images should be less than 1MB
        </ThemedText>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreatePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <ThemedText style={styles.buttonText}>Post</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
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
    minHeight: 38,
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#aeaeae",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginVertical: 8,
  },
  imageButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  imagePreviewContainer: {
    position: "relative",
    marginVertical: 12,
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
  },
});
