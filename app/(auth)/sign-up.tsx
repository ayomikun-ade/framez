import { ThemedText } from "@/components/themed-text"; // Assuming this is imported
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        firstName: name,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.innerContainer}
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
          <ThemedText>Name</ThemedText>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={name}
            placeholder="Enter email"
            placeholderTextColor="#999"
            onChangeText={(name) => setName(name)}
          />
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
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              autoCapitalize="none"
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color="#aeaeae"
              />
            </TouchableOpacity>
          </View>
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
      </ScrollView>
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
    paddingVertical: 48,
  },
  textInput: {
    color: "white",
    paddingHorizontal: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#aeaeae",
    borderRadius: 12,
    width: "100%",
    height: 40,
  },
  continueButton: {
    backgroundColor: "white",
    marginHorizontal: "auto",
    marginVertical: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 8,
    borderColor: "#aeaeae",
    borderWidth: 1,
    borderRadius: 12,
  },
  passwordInput: {
    color: "white",
    paddingHorizontal: 8,
    flex: 1,
    height: 40,
  },
  eyeIcon: {
    padding: 8,
  },
});
