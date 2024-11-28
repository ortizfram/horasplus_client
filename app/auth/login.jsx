import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { Link, useLocalSearchParams } from "expo-router";
import Logo from "../../components/Logo";

const Login = () => {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { isIn, userInfo } = useContext(AuthContext); // Ensure splashLoading is available

  const { next } = useLocalSearchParams();

  useEffect(() => {
    console.log("login screen| userInfo ", userInfo?._id);
    console.log("isIn ", isIn);
    console.log("next: ", next, "\n\n");
  }, [next, isIn]);

  const handleLogin = async () => {
    setError(""); // Reset error state before login
    try {
      await login(email, password, next, setError); // Pass setError as onError
    } catch (e) {
      console.error("Unexpected error:", e);
      setError(e.message || "Error inesperado al iniciar sesión.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Logo style={{  width: "100%", // Makes the image take full width of the container
          maxWidth: 600, // Set a max width to prevent it from becoming too large
          height: 240,
          alignSelf: "center", // Center the image horizontally
          marginBottom: 15}}/>
        <Text style={styles.header}>Ingreso</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <Spinner visible={isLoading} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
        />
        <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.toggleText}>
            {passwordVisible ? "Ocultar" : "Mostrar"}
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.textButton}>Ingresar</Text>
      </Pressable>
      <Pressable style={styles.link}>
        <Link href="/auth/signup">
          <Text style={{ color: "blue" }}>No tengo una cuenta aun!</Text>
        </Link>
      </Pressable>
      <Pressable style={styles.link}>
        <Link href="/auth/forgot">
          <Text style={{ color: "blue" }}>Olvide la contraseña</Text>
        </Link>
      </Pressable>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginHorizontal: "10%",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  toggleText: {
    color: "#007BFF",
    marginLeft: 10,
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
  link: {
    marginTop: 20,
  },
  error: {
    color: "red",
    marginVertical: 20,
    textAlign: "center",
    fontSize: 16,
  },
});
