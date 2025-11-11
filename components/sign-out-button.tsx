import { ManropeFonts } from "@/constants/theme";
import { useClerk } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/(auth)/sign-in");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "red",
        marginHorizontal: "auto",
        marginVertical: 8,
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 8,
      }}
      onPress={handleSignOut}
    >
      <ThemedText
        style={{
          color: "white",
          fontFamily: ManropeFonts.bold,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="log-out-outline" size={20} /> Sign out
      </ThemedText>
    </TouchableOpacity>
  );
};
