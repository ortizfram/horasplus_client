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

const { width, height } = Dimensions.get("window");

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
      <TouchableOpacity
        style={styles.accederButton}
        onPress={() => {
          Linking.openURL("/");
        }}
      >
        <Text style={styles.accederButtonText}>Acceder</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contactarButton}
        onPress={() => {
          Linking.openURL(
            "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+demo+de+Horas+Mas"
          );
        }}
      ></TouchableOpacity>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.accederButton}
          onPress={() => {
            Linking.openURL("/");
          }}
        >
          <Text style={styles.accederButtonText}>Acceder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactarButton}
          onPress={() => {
            Linking.openURL(
              "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+demo+de+Horas+Mas"
            );
          }}
        >
          <Text style={styles.contactarButtonText}>Contactar</Text>
        </TouchableOpacity>
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
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
                  Conoce el software de control horario que prioriza la
                  privacidad de datos
                </Text>
                <Text style={styles.subHeaderText}>
                  Mucho mejor que un reloj de control horario, y accesible desde
                  cualquier dispositivo
                </Text>
              </View>
            </View>
          )}
        />
      </View> */}

      <View style={styles.header}>
        {/* FlatList en la mitad superior */}
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

        {/* Rectángulo blanco con texto en la mitad inferior */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>
            Conoce el software de control horario que prioriza la privacidad de
            datos
          </Text>
          <Text style={styles.subHeaderText}>
            Mucho mejor que un reloj de control horario, y accesible desde
            cualquier dispositivo
          </Text>
        </View>
      </View>

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
    height: Dimensions.get("window").height, // Increased height to allow space for header and carousel
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTextContainer: {
    position: "absolute",
    bottom: 0, // Fija el texto en la mitad inferior
    width: "100%",
    height: "50%", // Ocupa la mitad inferior
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  accederButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  accederButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  contactarButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  contactarButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  carouselContainer: { height: 250 },
  carouselItem: { width: Dimensions.get("window").width, alignItems: "center" },
  carouselImage: { width: "100%", height: "50%", resizeMode: "cover" },
  carouselTextContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 5,
  },
  carouselText: { marginTop: 10, fontSize: 16, color: "#333" },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    marginHorizontal: 5,
  },
  imageTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 20,
  },
  beneficios: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  beneficiosHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333", // Change the color to #333 for consistency
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
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  beneficioText: {
    fontSize: 14,
    color: "#333", // Change the text color to #333
    textAlign: "center",
    marginTop: 5,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
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
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  imageSubHeader: {
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
  },
  stepsSection: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  stepsHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  step: {
    alignItems: "center",
    width: "30%",
  },
  stepImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Bienvenido;
