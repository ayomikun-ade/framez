import { ThemedText } from "@/components/themed-text";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SignOutButton } from "@/components/sign-out-button";

export default function ProfileScreen() {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentUser.imageUrl }} style={styles.profileImage} />
      <ThemedText type="title" style={styles.name}>
        {currentUser.name}
      </ThemedText>
      <ThemedText style={styles.username}>@{currentUser.username}</ThemedText>
      <ThemedText style={styles.email}>{currentUser.email}</ThemedText>
      <SignOutButton />
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
});
