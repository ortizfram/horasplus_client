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
import Loader from "../../components/Loader";  // Import the Loader component

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const router = useRouter();

  const handleForgotPassword = async () => {
    setIsLoading(true);  // Start loading when request begins
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
    } finally {
      setIsLoading(false);  // End loading when request completes
    }
  };

  return (
    <View style={styles.screenContainer}>
      {isLoading && <Loader />}  {/* Display loader when loading */}

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
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    position: "relative",  // Ensure the screen covers the entire space
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
  input: { borderColor: "#ccc", borderWidth: 1, padding: 10, marginBottom: 20 },
  button: { backgroundColor: "#007BFF", padding: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default ForgotPassword;
