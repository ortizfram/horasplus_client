import { Slot, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useContext, useState } from "react";
import "react-native-reanimated";

import { AuthContext, AuthProvider } from "../context/AuthContext";
import BackButtonLayout from "../components/GoBackButton";
import Loader from "../components/Loader";
import { StyleSheet } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout style={styles.container} />
    </AuthProvider>
  );
}

function AppLayout() {
  const { userInfo, splashLoading } = useContext(AuthContext) || {};
  const router = useRouter();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const currentUrl = window.location.href;

    if (isMounted && !splashLoading) {
      const currentUrl = window.location.href;

      if (currentUrl.includes("bienvenido")) {
        // Do nothing if "bienvenido" is in the URL
        console.log("Bienvenido link detected, no action taken:", currentUrl);
        return;
      }

      if (!userInfo) {
        if (currentUrl.includes("/auth/reset?token=")) {
          // Allow the user to continue with the reset link
          console.log("Continuing with reset link:", currentUrl);
        } else {
          // Redirect to login page
          router.push("/auth/login");
        }
      } else {
        // Redirect to home page
        router.push("/");
      }
    }
  }, [isMounted, userInfo, splashLoading]);

  if (!isMounted || splashLoading) {
    return <Loader />;
  }

  return (
    <>
      <Layout />
      <BackButtonLayout />
    </>
  );
}

function Layout() {
  const { userInfo, splashLoading } = useContext(AuthContext) || {};

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
            <Stack.Screen
              name="bienvenido"
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
            <Stack.Screen
              name="bienvenido"
              screenOptions={{ headerShown: false, title: "" }}
            />
          </>
        )}
        <Stack.Screen name="+not-found" />
        <Slot />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
