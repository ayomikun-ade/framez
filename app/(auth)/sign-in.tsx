import { ThemedText } from "@/components/themed-text";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
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

  const onSignInPress = async () => {
    if (!isLoaded) return;

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
      <TouchableOpacity
        onPress={onSignInPress}
        style={{
          backgroundColor: "white",
          marginHorizontal: "auto",
          marginVertical: 8,
          paddingHorizontal: 24,
          paddingVertical: 4,
          borderRadius: 8,
        }}
      >
        <ThemedText style={{ textAlign: "center", color: "black" }}>
          Continue
        </ThemedText>
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
  },
});
