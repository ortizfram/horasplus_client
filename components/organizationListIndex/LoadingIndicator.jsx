import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingIndicator({ color = "#0000ff", size = "large" }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
