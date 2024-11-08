import axios from "axios";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { RESP_URL } from "../../config";
import { useRouter } from "expo-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post(
        `${RESP_URL}/api/users/request-password-reset`,
        { email }
      );

      if (res.status === 201) {
        console.log("Recuperación de contraseña", res.data.message);
        router.push("auth/sent");
      } else {
        Alert.alert("Recuperación de contraseña", res.data.message);
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      Alert.alert("Error", "Error al solicitar recuperación de contraseña");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperación de contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo"
        value={email}
        onChangeText={setEmail}
      />
      <Pressable style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Enviar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderColor: "#ccc", borderWidth: 1, padding: 10, marginBottom: 20 },
  button: { backgroundColor: "#007BFF", padding: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default ForgotPassword;
