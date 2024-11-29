import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const defaultLogoWidth = width * 0.8; // Default width (80% of screen width).
const defaultLogoHeight = defaultLogoWidth / 2.85; // Default height maintains aspect ratio.

const Logo = ({ style }) => {
  // Extract custom width and height if provided
  const customWidth = style?.width || defaultLogoWidth;
  const customHeight = style?.height || defaultLogoHeight;

  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../assets/images/app_logo_no_description_appbannerlogo.png")}
        style={[{ width: customWidth, height: customHeight }, style]} // Apply custom dimensions and other styles
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
export default Logo;
