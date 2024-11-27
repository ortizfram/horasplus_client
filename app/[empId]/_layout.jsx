import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../../context/AuthContext";
import Settings from "../(tabs)/settings";
import OrganizationList from "../(tabs)";
import Loader from "../../components/Loader";

const Tab = createBottomTabNavigator();

export default function EmpLayout() {
  const { userInfo } = useContext(AuthContext) || {};

  // Wait until userInfo is loaded before rendering the tabs
  if (!userInfo?.user?._id) {
    return <Loader />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        title: "",
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="OrganizationList"
        component={OrganizationList}
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          title: "",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
