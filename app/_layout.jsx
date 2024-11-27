import { router, Slot, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useContext } from "react";
import "react-native-reanimated";

import { AuthContext, AuthProvider } from "../context/AuthContext";
import { ActivityIndicator, Text } from "react-native-web";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButtonLayout from "../components/GoBackButton";
import Loader from "../components/Loader";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    < Loader />
  }

  return (
    <AuthProvider style={styles.container}>
      <Layout />
      <BackButtonLayout />
    </AuthProvider>
  );
}

function Layout() {
  const { userInfo, splashLoading } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo == null) {
      // router.push("/auth/login");
    }
  }, [splashLoading, userInfo]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {splashLoading ? (
          <Stack.Screen
            name="splashScreen"
            screenOptions={{ headerShown: false, title: "" }}
          />
        ) : userInfo?.token ? (
          <>
            <Stack.Screen
              name="(tabs)"
              screenOptions={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="organization"
              screenOptions={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="[orgId]"
              screenOptions={{ headerShown: false, title: "" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="auth/signup"
              screenOptions={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="auth/login"
              screenOptions={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="auth/forgot"
              screenOptions={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="auth/sent"
              screenOptions={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="auth/reset"
              screenOptions={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="auth/changed"
              screenOptions={{ headerShown: false, title: "" }}
            />
          </>
        )}

        <Stack.Screen name="+not-found" />
      </Stack>
      <Slot />
      {/* This Slot will render the dynamic route based on the navigation */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
