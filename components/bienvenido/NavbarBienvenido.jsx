import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import Logo from "../Logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768; // Define mobile screen width

  return (
    <View style={styles.navbar}>
      {/* Logo on the center-left */}
      <View style={styles.logoContainer}>
        <Logo style={[styles.logo, isMobile ? null : styles.logoWeb]} />
      </View>

      {/* Buttons or Hamburger Menu */}
      {isMobile ? (
        <TouchableOpacity
          style={styles.hamburgerMenu}
          onPress={() => setIsMenuOpen(!isMenuOpen)}
        >
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => Linking.openURL("/")}
          >
            <Text style={styles.navButtonText}>Acceder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButtonContact}
            onPress={() =>
              Linking.openURL(
                "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+demo+de+Horas+Mas"
              )
            }
          >
            <Text style={styles.navButtonContactText}>Contactar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Dropdown Menu for Hamburger */}
      {isMobile && isMenuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => Linking.openURL("/")}
          >
            <Text style={styles.dropdownText}>Acceder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() =>
              Linking.openURL(
                "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+demo+de+Horas+Mas"
              )
            }
          >
            <Text style={styles.dropdownText}>Contactar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f4f4f4",
    zIndex: 10, // Ensure navbar stays on top of other elements
  },
  logoContainer: {
    flex: 1, // Allow the logo container to take available space
    alignItems: "flex-start", // Align logo to the left
  },
  logo: {
    marginLeft: 30, // Default margin for mobile
  },
  logoWeb: {
    marginLeft: 50, // Move the logo 20px more to the right for web
  },
  buttonContainer: {
    flexDirection: "row", // Arrange buttons horizontally
    alignItems: "center",
  },
  navButton: {
    borderColor: "#4CAF50",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10, // Add spacing between the buttons
  },
  navButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  navButtonContact: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10, // Add spacing between the buttons
  },
  navButtonContactText: {
    color: "#fff",
    fontWeight: "bold",
  },
  hamburgerMenu: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  hamburgerLine: {
    width: 25,
    height: 3,
    backgroundColor: "#333",
    marginVertical: 3,
  },
  dropdownMenu: {
    position: "absolute",
    top: 140,
    left: 0,
    width: "100%", // Full screen width
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    paddingVertical: 10,
    zIndex: 20, // Ensure it appears above the carousel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 15,
    alignItems: "center", // Center align text in each menu item
  },
  dropdownText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center", // Ensure text is centered
  },
});
