import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Logo from "../../components/Logo";

export default function Header({ userInfo }) {
  return (
    <View>
      <Logo />
      <Text style={styles.welcome}>
        <Text style={styles.header}>Bienvenid@</Text>{" "}
        {userInfo?.user?.isAdmin && <Text>Admin</Text>}{" "}
        {userInfo?.user?.isSuperAdmin && <Text>Super Admin</Text>}{" "}
        {userInfo?.user?.data?.firstname
          ? `${userInfo.user.data.firstname} ${userInfo.user.data.lastname}`
          : userInfo?.user?.email || ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  welcome: { textAlign: "center", color: "blue", fontSize: 20, marginBottom: 20 },
});
