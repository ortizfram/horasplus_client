import React, { useState, useEffect } from "react";
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
import Loader from "../../components/Loader";  // Import the Loader component

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const router = useRouter();
  const { token } = useLocalSearchParams();

  useEffect(() => {
    console.log("token ", token);
  }, [token]);

  const handleResetPassword = async () => {
    setIsLoading(true);  // Start loading when request begins
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
    } finally {
      setIsLoading(false);  // End loading when request completes
    }
  };

  return (
    <View style={styles.screenContainer}>
      {isLoading && <Loader />}  {/* Display loader when loading */}

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
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    position: "relative",  // Ensure the loader can overlay the entire screen
  },
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
