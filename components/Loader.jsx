import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import  {LogoBanner} from "../components/Logo"

const Loader = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator
      size="large"
      color="#007BFF"
      style={{ marginVertical: 20 }}
    />
    <LogoBanner />
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
  },
  smallImage: {
    width: "100%", // Makes the image take full width of the container
    maxWidth: 500, // Set a max width to prevent it from becoming too large
    height: 300,
    alignSelf: "center", // Center the image horizontally
    marginBottom: 15, // Optional: Add spacing below the image
  },
});

export default Loader;
