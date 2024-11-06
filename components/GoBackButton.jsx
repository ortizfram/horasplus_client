import React from "react";
import { useRouter, usePathname } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function BackButtonLayout() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route path

  // Check if the current route matches any path where the back button should be hidden
  const shouldHideBackButton = ["/", "/auth/login", "/auth/signup"].includes(
    pathname
  );

  // Handle back navigation
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/"); // Navigate to the home screen if no back action is possible
    }
  };

  // Conditionally render the back button
  if (shouldHideBackButton) {
    return null;
  }

  return (
    <Pressable onPress={handleGoBack} style={styles.backButton}>
      <MaterialIcons name="arrow-back" size={28} color="#4CAF50" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 40, // Distance from the top of the screen
    left: 20, // Distance from the left of the screen
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});
