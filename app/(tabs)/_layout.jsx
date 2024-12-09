import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import OrganizationList from ".";
import Settings from "./settings";
import { AuthContext } from "../../context/AuthContext";
import Roles from "./roles";
import QRDashboard from "./QRDashboard";
import { View, Animated, Dimensions } from "react-native";

// Create Tab Navigator
const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const { userInfo } = useContext(AuthContext) || {};
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  // Listen for screen size changes
  useEffect(() => {
    const onChange = ({ window }) => setScreenWidth(window.width);
    Dimensions.addEventListener("change", onChange);

    return () => Dimensions.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setIsMounted(true)
    if (isMounted) {
      if (!userInfo?.user?._id) {
        router.push("/auth/login");
      } else {
        router.push("/")
      }
    }
  }, [isMounted, userInfo]);

  if (!isMounted) {
    return <Loader />
  }
  // Check if the screen is mobile-sized
  const isMobile = screenWidth < 768;

  // Tab bar styles for mobile and desktop
  const customTabBarStyle = {
    position: "absolute",
    bottom: isMobile ? 5 : 10,
    left: isMobile ? 10 : 500,
    right: isMobile ? 10 : 500,
    borderRadius: 25,
    height: 60,
    backgroundColor: "#fff",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
  };

  // Icon renderer with animations
  const renderIcon = (name, focused) => (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={{
          transform: [
            {
              scale: focused ? 1.2 : 1,
            },
          ],
        }}
      >
        <MaterialIcons
          name={name}
          size={focused ? (isMobile ? 26 : 28) : 24}
          color={focused ? "#4CAF50" : "#8E8E93"}
        />
      </Animated.View>
    </View>
  );

  // If mobile, use a different layout (like a drawer or simpler tab menu)
  if (isMobile) {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: customTabBarStyle,
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="OrganizationList"
          component={OrganizationList}
          options={{
            title: "Organizaciones",
            tabBarIcon: ({ focused }) => renderIcon("home", focused),
          }}
        />

        {userInfo?.user?.isSuperAdmin && (
          <Tab.Screen
            name="Roles"
            component={Roles}
            options={{
              title: "Roles",
              tabBarIcon: ({ focused }) => renderIcon("flag", focused),
            }}
          />
        )}

        {userInfo?.user?.isSuperAdmin && (
          <Tab.Screen
            name="QR"
            component={QRDashboard}
            options={{
              title: "Generar QR",
              tabBarIcon: ({ focused }) => renderIcon("qr-code", focused),
            }}
          />
        )}

        <Tab.Screen
          name="settings"
          component={Settings}
          options={{
            title: "Perfil",
            tabBarIcon: ({ focused }) => renderIcon("person", focused),
          }}
        />
      </Tab.Navigator>
    );
  }

  // Desktop layout or larger screen devices
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: customTabBarStyle,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="OrganizationList"
        component={OrganizationList}
        options={{
          title: "Organizaciones",
          tabBarIcon: ({ focused }) => renderIcon("home", focused),
        }}
      />

      {userInfo?.user?.isSuperAdmin && (
        <Tab.Screen
          name="Roles"
          component={Roles}
          options={{
            title: "Roles",
            tabBarIcon: ({ focused }) => renderIcon("flag", focused),
          }}
        />
      )}

      {userInfo?.user?.isSuperAdmin && (
        <Tab.Screen
          name="QR"
          component={QRDashboard}
          options={{
            title: "Generar QR",
            tabBarIcon: ({ focused }) => renderIcon("qr-code", focused),
          }}
        />
      )}

      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => renderIcon("person", focused),
        }}
      />
    </Tab.Navigator>
  );
}
