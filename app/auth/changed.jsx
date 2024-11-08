import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Sent = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👏</Text>
      <Text style={styles.title}>Has cambiado tu contraseña con exito </Text>
      <Text style={styles.message}>Ahora ingresemos a tu cuenta!</Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.buttonText}>Ingreso</Text>
      </Pressable>
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
  button: { padding: 10, backgroundColor: "blue", marginVertical:20 },
  buttonText: { color: "white" },
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
