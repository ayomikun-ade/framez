import { ThemedText } from "@/components/themed-text"; // Assuming this is imported
import { api } from "@/convex/_generated/api";
import { useSignUp } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DIGITS = 6;

export default function VerifyEmailPage() {
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""));
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const onlyDigits = value.replace(/\D/g, "");
    if (!onlyDigits) {
      updateDigit(index, "");
      return;
    }

    if (onlyDigits.length > 1) {
      const next = [...digits];
      const chunk = onlyDigits.slice(0, DIGITS - index).split("");
      for (let i = 0; i < chunk.length; i++) {
        next[index + i] = chunk[i];
      }
      setDigits(next);
      const lastFilled = Math.min(index + chunk.length, DIGITS - 1);
      inputsRef.current[lastFilled]?.focus();
      if (next.join("").length === DIGITS) {
        Keyboard.dismiss();
      }
      return;
    }

    updateDigit(index, onlyDigits);
    if (onlyDigits && index < DIGITS - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (index === DIGITS - 1) {
      Keyboard.dismiss();
    }
  };

  const updateDigit = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace") {
      if (digits[index] === "" && index > 0) {
        inputsRef.current[index - 1]?.focus();
        updateDigit(index - 1, "");
      }
    }
  };

  const getCode = () => digits.join("");

  const verifyCode = async () => {
    const code = getCode();

    if (code.length !== DIGITS) {
      Alert.alert("Invalid code", `Please enter a ${DIGITS}-digit code.`);
      return;
    }

    if (!isLoaded || !signUp) {
      Alert.alert(
        "Error",
        "Authentication is not ready yet. Please try again shortly."
      );
      return;
    }
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        await createOrUpdateUser({
          name: signUp.firstName ?? undefined,
          email: signUp.emailAddress ?? undefined,
        });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const resendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Success", "Verification code has been resent to your email");
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to resend code");
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
    <View style={styles.container}>
      <ThemedText
        type="title"
        style={{ textAlign: "center", fontSize: 48, marginBottom: 20 }}
      >
        Framez
      </ThemedText>
      <ThemedText style={styles.title}>Enter verification code</ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter the 6-digit code sent to your email.
      </ThemedText>
      <View style={styles.inputsRow}>
        {Array.from({ length: DIGITS }).map((_, i) => (
          <TextInput
            key={i}
            ref={(ref) => {
              inputsRef.current[i] = ref;
            }}
            value={digits[i]}
            onChangeText={(v) => handleChange(i, v)}
            onKeyPress={(e) => handleKeyPress(i, e)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.input, digits[i] ? styles.inputFilled : null]}
            textAlign="center"
            autoComplete="one-time-code"
            placeholder="•"
            placeholderTextColor="#555" // Darker placeholder for visibility
            returnKeyType={i === DIGITS - 1 ? "done" : "next"}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.verifyButton,
          getCode().length !== DIGITS && styles.disabled,
        ]}
        onPress={verifyCode}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.verifyText}>Verify</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={resendCode} style={styles.resend}>
        <ThemedText type="link" style={styles.resendText}>
          Resend code
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center", // Centered content vertically
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#aeaeae", // Light gray for subtitle
    marginBottom: 20,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24, // Adjust width to not fill all space, mimicking the centered look
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
  },
  input: {
    width: 40, // Smaller width to fit 6 in a row
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#aeaeae", // Border matches textInput in SignIn
    fontSize: 24,
    color: "white",
    backgroundColor: "transparent", // Transparent background
    marginHorizontal: 2,
  },
  inputFilled: {
    borderColor: "white", // White border on focus/fill
    backgroundColor: "#333", // Slightly darker fill
  },
  verifyButton: {
    backgroundColor: "white", // White button like in SignIn
    marginHorizontal: "auto",
    marginVertical: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  verifyText: {
    color: "black", // Black text on white button
    fontWeight: "600",
    fontSize: 16,
  },
  resend: {
    marginTop: 12,
    alignItems: "center",
  },
  resendText: {
    color: "white", // White link text
    fontSize: 14,
  },
});
