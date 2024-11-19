import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import Logo from "../../components/Logo";

const Signup = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { isIn, userInfo } = useContext(AuthContext); // Ensure splashLoading is available


  const { register, isLoading } = useContext(AuthContext) || {};
  const router = useRouter();
  const { next } = useLocalSearchParams();

  useEffect(() => {
    console.log("Current userInfo:", userInfo?._id);

    if (isIn && next) {
      console.log("Redirecting to next:", next);
      if (next !== "/auth/signup") {
        router.push(next);
      }
    }
  }, [isIn, next, router]);
  

  const handleSignup = () => {
    setErrorMessage(null); // Clear previous errors
    register(email, password, firstname, lastname, next, setErrorMessage);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Logo />
        <Text style={styles.header}>Registro</Text>
      </View>
      <Spinner visible={isLoading} />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        inputMode="email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Contraseña"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstname}
        onChangeText={(text) => setFirstname(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastname}
        onChangeText={(text) => setLastname(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.textButton}>Registro</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text>Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={() => router.push(`/auth/login?next=${next}`)}>
          <Text style={styles.link}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    marginBottom: 10,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  link: {
    color: "blue",
  },
});

export default Signup;
