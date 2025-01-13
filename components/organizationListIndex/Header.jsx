import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Ensure you're using expo-linear-gradient
import Logo from "../../components/Logo";

export default function Header({ userInfo }) {
  return (
    <LinearGradient
      colors={["#1d2936", "#32a891"]} // Gradient colors inspired by the uploaded image
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Logo />
      <Text style={styles.welcome}>
        <Text style={styles.header}>Bienvenid@</Text>{" "}
        {userInfo?.user?.isAdmin && <Text style={styles.role}>Admin</Text>}{" "}
        {userInfo?.user?.isSuperAdmin && (
          <Text style={styles.role}>Super Admin</Text>
        )}{" "}
        {userInfo?.user?.data?.firstname
          ? `${userInfo.user.data.firstname} ${userInfo.user.data.lastname}`
          : userInfo?.user?.email || ""}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20, // Rounded edges
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF", // White text for the header
    marginBottom: 10,
  },
  welcome: {
    textAlign: "center",
    color: "#FFFFFF", // White text for better contrast
    fontSize: 18,
    marginBottom: 20,
  },
  role: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00FF00", // Green for roles (similar to the checkmark color in the image)
  },
});
