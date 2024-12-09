import { router, Slot, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useContext, useState } from "react";
import "react-native-reanimated";

import { AuthContext, AuthProvider } from "../context/AuthContext";
import { Pressable, StyleSheet, View } from "react-native";
import BackButtonLayout from "../components/GoBackButton";
import Loader from "../components/Loader";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { userInfo, splashLoading } = useContext(AuthContext);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      if (userInfo === null || userInfo === undefined) {
        router.push("/auth/login");
      } else {
        router.push("/");
      }
    }
  }, [isMounted, userInfo]);

  if (!isMounted) {
    return <Loader />;
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <AuthProvider style={styles.container}>
      <Layout />
      <BackButtonLayout />
    </AuthProvider>
  );
}

function Layout() {
  const { userInfo, splashLoading } = useContext(AuthContext);

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
        <Slot />
      </Stack>
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
