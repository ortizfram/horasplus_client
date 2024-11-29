import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import OrganizationList from ".";
import Settings from "./settings";
import { AuthContext } from "../../context/AuthContext";
import Roles from "./roles";
import { View, Animated, Platform } from "react-native";
import QRDashboard from "./QRDashboard";

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const { userInfo } = useContext(AuthContext) || {};
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Set mounted to true when the component mounts
  }, []);

  useEffect(() => {
    if (isMounted && !userInfo?.user?._id) {
      // Only attempt to navigate after mounting
      router.push("/auth/login");
    }
  }, [userInfo, isMounted]);

  // Wait until userInfo is loaded before rendering the tabs
  if (!userInfo?.user?._id) {
    return null; // Or display a loading state
  }

  const customTabBarStyle = {
    position: "absolute",
    bottom: 10,
    left: 500,
    right: 500,
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

  const renderIcon = (name, focused) => {
    return (
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
            size={focused ? 28 : 24}
            color={focused ? "#4CAF50" : "#8E8E93"}
          />
        </Animated.View>
      </View>
    );
  };

  if (userInfo?.user?.isSuperAdmin) {
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
        <Tab.Screen
          name="Roles"
          component={Roles}
          options={{
            title: "Roles",
            headerShown: false,
            tabBarIcon: ({ focused }) => renderIcon("flag", focused),
          }}
        />
        <Tab.Screen
          name="QR"
          component={QRDashboard}
          options={{
            title: "Gererar QR",
            headerShown: false,
            tabBarIcon: ({ focused }) => renderIcon("qr-code", focused),
          }}
        />
        <Tab.Screen
          name="settings"
          component={Settings}
          options={{
            title: "Perfil",
            headerShown: false,
            tabBarIcon: ({ focused }) => renderIcon("person", focused),
          }}
        />
      </Tab.Navigator>
    );
  } else {
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
            headerShown: false,
            tabBarIcon: ({ focused }) => renderIcon("home", focused),
          }}
        />
        <Tab.Screen
          name="settings"
          component={Settings}
          options={{
            title: "Perfil",
            headerShown: false,
            tabBarIcon: ({ focused }) => renderIcon("person", focused),
          }}
        />
      </Tab.Navigator>
    );
  }
}
