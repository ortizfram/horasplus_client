import { Slot, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useContext } from "react";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

function AppNavigator() {
  const { userInfo, splashLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!splashLoading && !userInfo?.token) {
      router.replace("/auth/login");
    }
  }, [splashLoading, userInfo]);

  if (splashLoading) {
    return <Loader />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {userInfo?.token ? (
        <>
          <Stack.Screen name="index" />
          <Stack.Screen name="organization" />
          <Stack.Screen name="organization/create" />
        </>
      ) : (
        <>
          <Stack.Screen name="auth/reset" />
          <Stack.Screen name="auth/sent" />
          <Stack.Screen name="auth/changed" />
          <Stack.Screen name="auth/forgot" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/signup" />
        </>
      )}
    </Stack>
  );
}
