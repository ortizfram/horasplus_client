import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HeaderTextContainer() {
  return (
    <View style={styles.headerTextContainer}>
      <Text style={styles.headerText}>
        Conoce el software de control horario que prioriza la privacidad de datos
      </Text>
      <Text style={styles.subHeaderText}>
        Mucho mejor que un reloj de control horario, y accesible desde cualquier dispositivo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTextContainer: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
