import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  FlatList,
  Dimensions,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import Logo from "../components/Logo";
import { Link, useRouter } from "expo-router";
import { Svg, Path } from "react-native-svg";
import Navbar from "../components/bienvenido/NavbarBienvenido";
import HeaderTextContainer from "../components/bienvenido/HeaderTextContainer";
import Carousel from "../components/bienvenido/Carousel";

const { width, height } = Dimensions.get("window");
const isMobile = Dimensions.get("window").width < 768;


const Bienvenido = () => {
  const videoSource = { uri: "https://www.example.com/video.mp4" }; // Replace with your video URL
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }} // Ensures scrollable content isn't cut off
      ref={scrollRef}
    >
      <Navbar />
      <Carousel carouselData={carouselData} />
      <HeaderTextContainer />

      {/* Video Section */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
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
          () =>
            Linking.openURL(
              "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+demo+de+Horas+Mas"
            ) // Replace with your WhatsApp number
        }
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 0C5.372 0 0 5.372 0 12c0 2.12.552 4.106 1.512 5.832L0 24l6.336-1.512A11.94 11.94 0 0012 24c6.628 0 12-5.372 12-12S18.628 0 12 0zm6.336 17.664c-.264.744-1.536 1.44-2.112 1.512-.552.072-1.224.096-1.944-.12-.456-.12-1.056-.36-1.824-.72-3.192-1.392-5.28-4.824-5.448-5.064-.168-.24-1.296-1.728-1.296-3.288 0-1.56.816-2.328 1.104-2.664.288-.336.624-.408.84-.408.216 0 .432.008.624.012.192.008.456-.072.72.552.264.624.888 2.16.96 2.328.072.168.12.336.024.552-.096.216-.144.336-.288.528-.144.192-.288.336-.432.552-.144.216-.288.432-.12.744.168.312.744 1.224 1.584 1.968 1.08.96 1.992 1.272 2.304 1.416.312.144.48.12.672-.072.192-.192.768-.888.96-1.2.192-.312.384-.24.648-.144.264.096 1.68.792 1.968.936.288.144.48.216.552.336.072.12.072.696-.192 1.44z"
            fill="#fff"
          />
        </Svg>
        <Text style={styles.whatsappButtonText}>Contactar por WhatsApp</Text>
      </TouchableOpacity>

      {/* Full-Screen Image Section */}
      <View style={styles.fullScreenImageContainer}>
        <Image
          source={require("../assets/images/handshake.jpg")} // Replace with your image
          style={styles.fullScreenImage}
        />
        <View style={styles.imageTextContainer}>
          <Text style={styles.imageHeader}>Nos entusiasma ayudarte</Text>
          <Text style={styles.imageSubHeader}>
            Te ayudamos en tu día a día a través de nuestra Academia virtual,
            Email y WhatsApp
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
  header: {
    width: "100%",
    height: height, // Occupy full screen height
    backgroundColor: "#ffffff",
  },
  carouselContainer: {
    flex: 1, // Occupies the top 50% of the header
    width: "100%",
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
    height: 1080,
  },
  headerTextContainer: {
    flex: 1, // Occupies the bottom 50% of the header
    width: "100%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headerText: {
    fontSize: isMobile ? 20 : 26, // Responsive font size
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: isMobile ? 14 : 18, // Responsive font size
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  accederButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  accederButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  contactarButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contactarButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  
  carouselItem: {
    width: width,
    height:1080,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", 
  },
  carouselTextContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  imageTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  logo: {
    position: "absolute",
    top: 20, // Espaciado desde la parte superior
    left: "50%",
    transform: [{ translateX: -75 }], // Centrado horizontalmente (asumiendo un ancho de 150px)
    width: 150,
    height: 50,
  },
  beneficios: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  beneficiosHeader: {
    fontSize: isMobile ? 28 : 40,
    fontWeight: "700",
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
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  beneficioText: {
    fontSize: isMobile ? 16 : 26,
    color: "#333",
    textAlign: "center",
    marginTop: 8,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    padding: 12,
    borderRadius: 8,
    margin: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  whatsappButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginLeft: 10,
  },
  fullScreenImageContainer: {
    width: "100%",
    height: height,
    position: "relative",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageTextContainer: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  imageHeader: {
    fontSize: isMobile ? 26 : 40,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  imageSubHeader: {
    fontSize: isMobile ? 18 : 26,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  // 3 Simple Steps Section///////////////////////////////////////////////
  stepsSection: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  stepsHeader: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  stepsContainer: {
    flexDirection: isMobile ? "column" : "row", // Column on mobile, row on larger screens
    alignItems: isMobile ? "center" : "flex-start",
    justifyContent: isMobile ? "center" : "space-between",
  },
  step: {
    alignItems: "center",
    width: isMobile ? "100%" : "30%", // Full width on mobile
    marginBottom: isMobile ? 20 : 0,
  },
  stepImage: {
    width: isMobile ? 180 : 420, // Larger images on mobile
    height: isMobile ? 180 : 420,
    borderRadius: isMobile ? 50 : 30, // Circular images
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Adds shadow on Android
  },
  stepText: {
    fontSize: isMobile ? 26 : 16, // Larger font size on mobile
    color: "#333",
    textAlign: "center",
  },
});

export default Bienvenido;