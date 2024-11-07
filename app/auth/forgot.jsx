import axios from "axios";
import { useState } from "react";
import { RESP_URL } from "../../config";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post(`${RESP_URL}/api/users/request-password-reset`, { email });
      Alert.alert("Recuperación de contraseña", res.data.message);
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      Alert.alert("Error", "Error al solicitar recuperación de contraseña");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recuperar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize="none"
      />
      <Pressable onPress={handleForgotPassword} style={styles.button}>
        <Text style={styles.textButton}>Enviar enlace de recuperación</Text>
      </Pressable>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginHorizontal: "10%",
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "blue",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 5,
  },
  textButton: {
    color: "#e3e3e3",
    fontSize: 16,
  },
});
