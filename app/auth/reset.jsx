import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { RESP_URL } from "../../config";
import { useLocalSearchParams, useRouter } from "expo-router";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const { token } = useLocalSearchParams();

  useEffect(() => {
    console.log("token ", token);
  });

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(`${RESP_URL}/api/users/reset-password`, {
        token,
        newPassword,
      });
      if (res.status === 200) {
        console.log("Nueva contraseña ha sido exitosa");
        router.push("auth/changed");
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      Alert.alert("Error", "No se pudo restablecer la contraseña");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablece tu contraseña</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu nueva contraseña"
          secureTextEntry={!passwordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.toggleText}>
            {passwordVisible ? "Ocultar" : "Mostrar"}
          </Text>
        </Pressable>
      </View>
      <Pressable style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Restablecer</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    marginHorizontal: "8%",
    marginBottom: 80,
    marginTop: "2%",
  },
  title: { fontSize: 24, marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: { flex: 1, paddingVertical: 10 },
  toggleText: {
    color: "#007BFF",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500", // Match the font style with the button text
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    alignItems: "center",
    borderRadius: 5, // Optional: Add rounded corners for a better look
  },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default ResetPassword;
