import { Stack } from "expo-router";

export default function CommentsPageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Comments" }} />
    </Stack>
  );
}
