import React from "react";
import { View, StyleSheet, Image } from "react-native";

const Logo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("../assets/images/app_logo_no_description.png")}
      style={styles.smallImage}
      resizeMode="contain" // Ensure the image maintains aspect ratio
    />
  </View>
);

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3, // Add margin from the top
  },
  smallImage: {
    width: 400, // Adjusted width for better fit
    height: 150, // Adjusted height for aspect ratio
    marginBottom: 0, // Optional: Add spacing below the image
  },
});

export default Logo;
