import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Linking,
} from "react-native";
import Logo from "../Logo";

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      {/* Logo on the center-left */}
      <View style={styles.logoContainer}>
        <Logo style={styles.logo} />
      </View>

      {/* Buttons on the right */}
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
  },
  logoContainer: {
    flex: 1, // Allow the logo container to take available space
    alignItems: "flex-start", // Align logo to the left
  },
  logo: {
    marginLeft: 10, // Add margin to position it slightly inward from the left edge
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
});
