import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient"; // Asegúrate de instalar react-native-linear-gradient
import Logo from "../../components/Logo";
import { useRouter } from "expo-router";

const WelcomePage = () => {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#007BFF", "#0056b3"]} style={styles.header}>
        <Logo />
        <Text style={styles.title}>HorasMas</Text>
        <Text style={styles.subtitle}>
          El software que soluciona el control horario y realmente prioriza tu
          privacidad
        </Text>
      </LinearGradient>

      {/* Sección: Beneficios */}
      <LinearGradient
        colors={["#ff7e5f", "#feb47b"]}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Beneficios</Text>
        <Text style={styles.sectionText}>
          - Solo vos ves la información al detalle.{"\n"}- Ahorra tiempo y
          dinero.{"\n"}- Simplifica la gestión de horarios.{"\n"}- Aumenta la
          productividad.{"\n"}
        </Text>
      </LinearGradient>

      {/* Sección: Nuestras Soluciones */}
      <LinearGradient
        colors={["#6a11cb", "#2575fc"]}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Nuestras Soluciones</Text>
        <Text style={styles.subtitle}>
          Ofrecemos herramientas integrales para gestionar y optimizar el
          control horario de tu empresa.
        </Text>
        <Text style={styles.sectionText}>
          - Tecnología por marcación QR. Nada de instalaciones caras. Funciona
          desde el primer día.{"\n"}
        </Text>
      </LinearGradient>

      {/* Sección: Empresas que confían en nosotros */}
      <LinearGradient
        colors={["#43cea2", "#185a9d"]}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>
          Empresas que confían en nosotros
        </Text>
        <View style={styles.logosContainer}>
          <Image
            style={styles.logo}
            source={{
              uri: "https://lirp.cdn-website.com/03a87188/dms3rep/multi/opt/UVAS+Logo-02-127h.png",
            }}
          />
          <Image
            style={styles.logo}
            source={{ uri: "https://via.placeholder.com/100" }}
          />
          <Image
            style={styles.logo}
            source={{ uri: "https://via.placeholder.com/100" }}
          />
        </View>
      </LinearGradient>

      {/* Sección: Estamos para ayudarte */}
      <LinearGradient
        colors={["#f7971e", "#ffd200"]}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Estamos para ayudarte</Text>
        <Text style={styles.sectionText}>
          Contáctanos para resolver tus dudas y encontrar la mejor solución para
          tu empresa.
        </Text>
      </LinearGradient>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#007BFF" }]}
          onPress={() => router.push("https://tr.ee/uGnsMOolVq")}
        >
          <Text style={styles.buttonText}>Agenda tu demo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#28a745" }]}
          onPress={() =>
            router.push(
              "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+info+de+HORAS+MAS"
            )
          }
        >
          <Text style={styles.buttonText}>Contacto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    marginVertical: 10,
  },
  section: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
  },
  logosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default WelcomePage;
