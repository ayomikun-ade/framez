import { ThemedText } from "@/components/themed-text";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [successfulCreation, setSuccessfulCreation] = React.useState(false);

  const onRequestReset = async () => {
    if (!isLoaded) return;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      Alert.alert(err.errors[0].message);
    }
  };

  const onReset = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      Alert.alert("Password reset successfully");
      await setActive({ session: result.createdSessionId });
      router.replace("/");
    } catch (err: any) {
      Alert.alert(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Framez
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        {!successfulCreation
          ? "Reset your password"
          : "Check your email for a code"}
      </ThemedText>

      {!successfulCreation && (
        <>
          <View style={styles.inputContainer}>
            <ThemedText>Email</ThemedText>
            <TextInput
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={styles.textInput}
            />
          </View>
          <TouchableOpacity onPress={onRequestReset} style={styles.button}>
            <ThemedText style={styles.buttonText}>Send Code</ThemedText>
          </TouchableOpacity>
        </>
      )}

      {successfulCreation && (
        <>
          <View style={styles.inputContainer}>
            <ThemedText>Code</ThemedText>
            <TextInput
              value={code}
              placeholder="Enter the code"
              placeholderTextColor="#999"
              onChangeText={setCode}
              style={styles.textInput}
            />
            <ThemedText>New Password</ThemedText>
            <TextInput
              placeholder="Enter new password"
              placeholderTextColor="#999"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.textInput}
            />
          </View>
          <TouchableOpacity onPress={onReset} style={styles.button}>
            <ThemedText style={styles.buttonText}>Reset Password</ThemedText>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.footer}>
        <ThemedText style={{ textAlign: "center" }}>
          Remember your password?
          <Link href="/sign-in">
            <ThemedText type="link"> Sign in</ThemedText>
          </Link>
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 48,
  },
  subtitle: {
    textAlign: "center",
    marginVertical: 8,
  },
  inputContainer: {
    marginVertical: 12,
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
  button: {
    backgroundColor: "white",
    marginHorizontal: "auto",
    marginVertical: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    color: "black",
  },
  footer: {
    marginTop: 16,
  },
});
