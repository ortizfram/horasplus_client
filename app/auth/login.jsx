import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { Link, useLocalSearchParams } from "expo-router";
import Logo from "../../components/Logo";

const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook, isLoading } =
    useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { next } = useLocalSearchParams();
  useEffect(() => {
    console.log("next: ", next);
  });

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password, next);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Logo />
        <Text style={styles.header}>Ingreso</Text>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}

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
  link: {
    marginTop: 20,
  },
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
  error: {
    color: "red",
    marginBottom: 20,
  },
});
