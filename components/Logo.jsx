import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";

const Logo = ({ style }) => {
  const [screenSize, setScreenSize] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = ({ window }) => setScreenSize(window);
    Dimensions.addEventListener("change", onChange);

    return () => Dimensions.removeEventListener("change", onChange);
  }, []);

  const isMobile = screenSize.width < 768;

  const logoWidth = isMobile ? 465 * 0.8 : 465;
  const logoHeight = isMobile ? 186 * 0.8 : 186;

  return (
    <View
      style={[
        styles.logoContainer,
        { marginTop: isMobile ? 40 : 0 }, // Add marginTop based on screen size
      ]}
    >
      <Image
        source={require("../assets/images/app_logo_no_description_appbannerlogo.png")}
        style={[
          {
            width: logoWidth,
            height: logoHeight,
            alignSelf: "center",
            marginBottom: 15,
            borderWidth: 1,
            borderColor: "red",
          },
          style,
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
});

export default Logo;
