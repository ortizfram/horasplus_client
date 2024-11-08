import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const Loader = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#007BFF" />
    <Text style={styles.loadingText}>Cargando...</Text>
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
});

export default Loader;
