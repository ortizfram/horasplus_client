import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Linking } from "react-native";

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => Linking.openURL("/")}
      >
        <Text style={styles.navButtonText}>Acceder</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() =>
          Linking.openURL(
            "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+demo+de+Horas+Mas"
          )
        }
      >
        <Text style={styles.navButtonText}>Contactar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f4f4f4",
  },
  navButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  navButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
