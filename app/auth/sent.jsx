import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Sent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📫📧</Text>
      <Text style={styles.title}>Correo enviado </Text>
      <Text style={styles.message}>
        Chequea tu bandeja de entrada y/o spam para continuar al siguiente paso.
        Esta ventana ya puedes cerrala
      </Text>
    </View>
  );
};

export default Sent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginHorizontal: "8%",
    marginBottom: 80,
    marginTop: "2%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
