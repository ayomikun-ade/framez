import { ThemedText } from "@/components/themed-text";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
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

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      console.error(err);
      const errAny = err as any;
      const message =
        errAny?.errors?.[0]?.message ||
        errAny?.message ||
        "An unexpected error occurred";
      Alert.alert(message);
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
        <ThemedText type="title" style={{ textAlign: "center", fontSize: 48 }}>
          Framez
        </ThemedText>
        <ThemedText
          type="subtitle"
          style={{ textAlign: "center", marginVertical: 8 }}
        >
          Welcome back
        </ThemedText>
        <View style={{ marginVertical: 12 }}>
          <ThemedText>Username or email</ThemedText>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor="#999"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
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
          <View style={{ alignItems: "flex-end" }}>
            <Link href="/(auth)/forgot-password">
              <ThemedText type="link">Forgot password?</ThemedText>
            </Link>
          </View>
        </View>
        <TouchableOpacity
          onPress={onSignInPress}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <ThemedText style={{ textAlign: "center", color: "black" }}>
              Continue
            </ThemedText>
          )}
        </TouchableOpacity>
        <View>
          <ThemedText style={{ textAlign: "center" }}>
            Don&apos;t have an account?
            <Link href="/sign-up">
              <ThemedText type="link"> Sign up</ThemedText>
            </Link>
          </ThemedText>
        </View>
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
  button: {
    backgroundColor: "white",
    marginHorizontal: "auto",
    marginVertical: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 36,
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});
