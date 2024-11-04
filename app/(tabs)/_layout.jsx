import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import OrganizationList from ".";
import Settings from "./settings";
import { AuthContext } from "../../context/AuthContext";
import Roles from "./roles";

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

  if (userInfo?.user?.isSuperAdmin) {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="OrganizationList"
          component={OrganizationList}
          options={{
            title: "Organizaciones",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={"home"} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Roles"
          component={Roles}
          options={{
            title: "Roles",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={"flag"} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={Settings}
          options={{
            title: "Perfil",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={"person"} size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="OrganizationList"
          component={OrganizationList}
          options={{
            title: "Organizaciones",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={"home"} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={Settings}
          options={{
            title: "Perfil",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={"person"} size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
