import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import Logo from "../components/Logo";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const Bienvenido = () => {
  const videoSource = { uri: "https://www.example.com/video.mp4" }; // Replace with your video URL
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });
  const router = useRouter();

  const scrollRef = useRef(null);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carousel Data
  const carouselData = [
    {
      image: require("../assets/images/baker.png"),
      title: "Control Horario Para Empleados",
    },
    // {
    //   image: "https://via.placeholder.com/1080x1920",
    //   title: "Genera Reportes",
    // },
    // {
    //   image: "https://via.placeholder.com/1080x1920",
    //   title: "Privacidad de Datos",
    // },
  ];

  const handleScrollToBeneficios = () => {
    scrollRef.current?.scrollTo({ y: 500, animated: true });
  };

  // Auto-scrolling logic
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselData.length;
      carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const beneficios = [
    {
      icon: "access-time",
      title: "Control horario sin instalaciones extrañas",
    },
    {
      icon: "report",
      title: "Generación de reportes precisos y transparentes",
    },
    {
      icon: "play-arrow",
      title: "Implementalo desde el 1er día",
    },
    {
      icon: "location-city",
      title: "Distingue reportes por establecimientos",
    },
    {
      icon: "attach-money",
      title: "Liquida sin pagar demás",
    },
    {
      icon: "privacy-tip",
      title: "Privacidad de datos",
    },
    {
      icon: "devices",
      title: "Accesible desde cualquier dispositivo",
    },
    { 
      icon: "thumb-up",
      title: "Fácil de usar",
    },
    {
      icon: "support",
      title: "Soporte técnico y Academia Virtual",
    },
  ];

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % carouselData.length;
    carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + carouselData.length) % carouselData.length;
    carouselRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    setCurrentIndex(prevIndex);
  };

  return (
    <ScrollView style={styles.container} ref={scrollRef}>
      {/* Header */}
      <View style={styles.header}>
        <FlatList
          ref={carouselRef}
          data={carouselData}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Logo style={styles.logo} />
              <View style={styles.carouselTextContainer}>
                <Text style={styles.imageTitle}>{item.title}</Text>
              </View>
              <Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                style={styles.carouselImage}
              />
            </View>
          )}
        />
      </View>

      {/* Beneficios Section */}
      <View style={styles.beneficios}>
        <Text style={styles.beneficiosHeader}>Beneficios Principales</Text>
        <View style={styles.beneficioGrid}>
          {beneficios.map((item, index) => (
            <View key={index} style={styles.beneficioItem}>
              <MaterialIcons name={item.icon} size={40} color="#4CAF50" />
              <Text style={styles.beneficioText}>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={
          () => Linking.openURL("https://wa.me/2613005849") // Replace with your WhatsApp number
        }
      >
        <MaterialIcons name="whatsapp" size={24} color="#fff" />
        <Text style={styles.whatsappButtonText}>Contactar por WhatsApp</Text>
      </TouchableOpacity>

       {/* Full-Screen Image Section */}
  <View style={styles.fullScreenImageContainer}>
    <Image
      source={require("../assets/images/baker.png")} // Replace with your image
      style={styles.fullScreenImage}
    />
    <View style={styles.imageTextContainer}>
      <Text style={styles.imageHeader}>Nos entusiasma ayudarte</Text>
      <Text style={styles.imageSubHeader}>
        Te ayudamos en tu día a día a través de nuestra Academia virtual, Email
        y WhatsApp
      </Text>
    </View>
  </View>

  {/* 3 Simple Steps Section */}
  <View style={styles.stepsSection}>
    <Text style={styles.stepsHeader}>Marca 3 simples pasos</Text>
    <View style={styles.stepsContainer}>
      <View style={styles.step}>
        <Image
           source={require("../assets/images/scan.png")}
          style={styles.stepImage}
        />
        <Text style={styles.stepText}>Escanea</Text>
      </View>
      <View style={styles.step}>
        <Image
          source={require("../assets/images/ingresa.jpg")}
          style={styles.stepImage}
        />
        <Text style={styles.stepText}>Ingresa</Text>
      </View>
      <View style={styles.step}>
        <Image
          source={require("../assets/images/marca.png")}
          style={styles.stepImage}
        />
        <Text style={styles.stepText}>Marca</Text>
      </View>
    </View>
  </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 10,
    textAlign: "center",
  },
  imageSubHeader: {
    fontSize: 16,
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: "center",
  },
  stepsSection: {
    padding: 20,
    alignItems: "center",
  },
  imageTextContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366", // WhatsApp green
    padding: 10,
    borderRadius: 5,
    margin: 20,
    elevation: 3,
  },
  whatsappButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  fullScreenImageContainer: {
    width: "100%",
    height: Dimensions.get("window").height,
    position: "relative",
  },
  stepsSection: {
    padding: 20,
    alignItems: "center",
  },
  stepsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  step: {
    alignItems: "center",
  },
  stepImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  header: {
    width,
    height,
    backgroundColor: "#fff",
    alignItems: "center",
    position: "relative",
  },
  imageTitle: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  logo: {
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Crystal-blurred effect
    padding: 10,
    borderRadius: 10,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  menuButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#ffffff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuButtonText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  headerTextContainer: {
    marginTop: 20, // Below the carousel
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  carouselItem: {
    width,
    height,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  carouselImage: {
    width: "100%",
    height: height * 0.75,
    resizeMode: "cover",
  },
  carouselTextContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  carouselText: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    borderRadius: 5,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    top: height / 2 - 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    top: height / 2 - 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  videoContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  video: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  beneficios: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  beneficiosHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  beneficioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  beneficioItem: {
    width: "48%",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  beneficioText: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Bienvenido;
