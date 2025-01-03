import { Stack } from "expo-router";
import BePart from "./bePart";
import verifyLocation from "./verifyLocation";

export default function OrgLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="bePart"
        component={BePart}
        screenOptions={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="bePartSent"
        screenOptions={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="dashboard"
        screenOptions={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="downloadQR"
        screenOptions={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="downloadReports"
        screenOptions={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="employees"
        screenOptions={{ headerShown: false, title: "" }}
      />
       <Stack.Screen
        name="fixRecord"
        screenOptions={{ headerShown: false, title: "" }}
      />
       <Stack.Screen
        name="settings"
        screenOptions={{ headerShown: false, title: "" }}
      />
       <Tab.Screen
        name="verifyLocation"
        component={verifyLocation}
        screenOptions={{ headerShown: false, title: "" }}
      />
    </Stack>
  );
}
