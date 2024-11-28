import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const logoWidth = width * 0.8; // The width will be 80% of the screen.
const logoHeight = logoWidth / 2.85; // Maintains the original aspect ratio of the image.

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../assets/images/app_logo_no_description_appbannerlogo.png")}
        style={{ width: logoWidth, height: logoHeight }}
        resizeMode="contain"
      />
    </View>
  );
};

const LogoBanner = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../assets/images/app_logo_rectangle_appbanner.jpg")}
        style={{ width: logoWidth, height: logoHeight }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Spacing below the logo.
  },
});

// Use named exports
export { Logo, LogoBanner };
