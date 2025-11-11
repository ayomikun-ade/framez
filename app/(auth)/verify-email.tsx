import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DIGITS = 6;

export default function VerifyEmailPage() {
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""));
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

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
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      console.log(code);

      Alert.alert("Info", `${result}`);

      router.push("/(tabs)");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Verification failed",
        "Unable to verify the code. Please try again."
      );
      return;
    } finally {
      console.log(code);
    }
  };

  const resendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Success", "Verification code has been resent to your email");
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to resend code");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your email.
      </Text>

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
            placeholderTextColor="#bbb"
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
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resendCode} style={styles.resend}>
        <Text style={styles.resendText}>Resend code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  input: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 20,
    color: "#111",
    backgroundColor: "#FAFAFA",
  },
  inputFilled: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  verifyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  verifyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  resend: {
    marginTop: 12,
    alignItems: "center",
  },
  resendText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
