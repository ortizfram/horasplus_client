import React from "react";
import { View, StyleSheet, Image } from "react-native";

const Logo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("../assets/images/app_logo_no_description.png")}
      style={styles.smallImage}
    />
  </View>
);

const styles = StyleSheet.create({
  logoContainer: {
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
    width: 650, // Makes the image take full width of the container
    height: 375,
    alignSelf: "center", // Center the image horizontally
    marginBottom: 150, // Optional: Add spacing below the image
  },
});

export default Logo;
