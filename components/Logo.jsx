import React from "react";
import { View, StyleSheet, Image } from "react-native";

const Logo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("../assets/images/app_logo_no_description_appbannerlogo.png")}
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
    width: 450, // Adjusted width for better fit
    height: 200, // Adjusted height for aspect ratio
    marginBottom: -50, // Optional: Add spacing below the image
  },
});

export default Logo;
