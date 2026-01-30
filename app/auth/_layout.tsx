// app/auth/_layout.tsx
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Stack, useSegments } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const segments = useSegments();
  const colorScheme = useColorScheme();

  // Remove 'auth' from segments and get the current page segment
  const authSegments = segments.filter((segment) => segment !== "auth");
  const currentPage = authSegments[authSegments.length - 1] ?? "role";

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor:
            colorScheme === "dark" ? Colors.dark.background : Colors.light.background,
        },
      }}
      initialRouteName={currentPage}
    >
      <Stack.Screen name="role" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="confirmEmail" />
      <Stack.Screen name="forgotPassword" />
    </Stack>
  );
}
