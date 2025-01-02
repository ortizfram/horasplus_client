import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import Logo from "../Logo";

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      {/* Logo in the middle */}
      <Logo style={styles.logo} />

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
          <Text style={styles.navButtonText}>Contactar</Text>
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
  logo: {
    position: "absolute", // Position the logo in the middle
    top: 10,
    left: "50%",
    transform: [{ translateX: -75 }], // Adjust the translation based on the logo width (150px)
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row", // Arrange buttons horizontally
    alignItems: "center",
  },
  navButtonContact: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10, // Add spacing between the buttons
  },
  navButton: {
    borderColor: "#4CAF50",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10, // Add spacing between the buttons
  },
  navButtonContactText: {
    color: "#fff",
    fontWeight: "bold",
  },
  navButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
