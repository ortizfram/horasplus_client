import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import Index from "./index";
import Profile from "./profile";
import Report from "./report";

const Tab = createBottomTabNavigator();

export default function EmpLayout() {
  const { userInfo } = useContext(AuthContext) || {};

  // Wait until userInfo is loaded before rendering the tabs
  if (!userInfo?.user?._id) {
    return <Loader />;
  }

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="index"
        screenOptions={{ headerShown: false, title: "" }}
      />
      <Tab.Screen
        name="profile"
        screenOptions={{ headerShown: false, title: "" }}
      />
      <Tab.Screen
        name="report"
        screenOptions={{ headerShown: false, title: "" }}
      />
    </Tab.Navigator>
  );
}
