import { ThemedText } from "@/components/themed-text"; // Assuming this is imported
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        username,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push("/(auth)/verify-email");
    } catch (err: unknown) {
      console.error(err);
      const errAny = err as any;
      const message =
        errAny?.errors?.[0]?.message ||
        errAny?.message ||
        "An unexpected error occurred";
      Alert.alert(message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <ThemedText type="title" style={{ textAlign: "center", fontSize: 48 }}>
        Framez
      </ThemedText>
      <ThemedText
        type="subtitle"
        style={{ textAlign: "center", marginVertical: 8 }}
      >
        Create your account
      </ThemedText>
      <View style={{ marginVertical: 12 }}>
        <ThemedText>Email</ThemedText>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#999"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <ThemedText>Username</ThemedText>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          value={username}
          placeholder="Enter username"
          placeholderTextColor="#999"
          onChangeText={(username) => setUsername(username)}
        />
        <ThemedText>Password</ThemedText>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#999"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity onPress={onSignUpPress} style={styles.continueButton}>
        <ThemedText style={{ textAlign: "center", color: "black" }}>
          Continue
        </ThemedText>
      </TouchableOpacity>
      <View>
        <ThemedText style={{ textAlign: "center" }}>
          Already have an account?
          <Link href="/sign-in">
            <ThemedText type="link"> Sign in</ThemedText>
          </Link>
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    color: "white",
    paddingHorizontal: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#aeaeae",
    borderRadius: 12,
    width: "100%",
    height: 40, // Added height for consistency
  },
  continueButton: {
    backgroundColor: "white",
    marginHorizontal: "auto",
    marginVertical: 8,
    paddingHorizontal: 24,
    paddingVertical: 8, // Adjusted padding for better look
    borderRadius: 8,
  },
});
