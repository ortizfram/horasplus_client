import React from "react";
import { View, Text, Pressable, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import Video from "react-native-video";
import { useNavigation } from '@react-navigation/native';

const renderIcon = (name, focused) => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <Animated.View
      style={{
        transform: [
          {
            scale: focused ? 1.2 : 1,
          },
        ],
      }}
    >
      <MaterialIcons
        name={name}
        size={focused ? (isMobile ? 26 : 28) : 24}
        color={focused ? "#4CAF50" : "#8E8E93"}
      />
    </Animated.View>
  </View>
);

const Bienvenido = () => {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://www.example.com/logo.png' }} // Replace with your logo URL
          style={styles.logo}
        />
        <Text>
          Conoce el software de control horario que prioriza la privacidad de
          datos
        </Text>
        <Text>
          Mucho mejor que un reloj de control horario, y accesible desde
          cualquier dispositivo
        </Text>
        <Video
          source={{ uri: "https://www.example.com/video.mp4" }} // Replace with your video URL
          style={styles.video}
          controls={true}
        />
      </View>

      <Pressable
        onPress={() =>
          router.push(
            "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+agendar+una+demo+de+HorasMas"
          )
        }
        style={styles.whatsapp}
      >
        <Text>Contactar por WhatsApp</Text>
      </Pressable>
      <View style={styles.beneficios}>
        <Text>El software completo y flexible</Text>
        <View style={styles.beneficioItem}>
          {renderIcon("access-time", false)}
          <Text> Control horario sin instalaciones extrañas</Text>
        </View>
        <View style={styles.beneficioItem}>
          {renderIcon("report", false)}
          <Text> Generacion de reportes precisos y transparentes</Text>
        </View>
        <View style={styles.beneficioItem}>
          {renderIcon("play-arrow", false)}
          <Text> Implementalo desde el 1er día</Text>
        </View>
        <View style={styles.beneficioItem}>
          {renderIcon("location-city", false)}
          <Text> Distingue reportes por establecimientos</Text>
        </View>
        <View style={styles.beneficioItem}>
          {renderIcon("attach-money", false)}
          <Text> Liquida sin pagar demás</Text>
        </View>
        <View style={styles.beneficioItem}>
          {renderIcon("privacy-tip", false)}
          <Text> Privacidad de datos</Text>
        </View>
        <View style={styles.beneficioItem}>
          {renderIcon("devices", false)}
          <Text> Accesible desde cualquier dispositivo</Text>
        </View>
        <View style={styles.beneficioItem}>
          {renderIcon("thumb-up", false)}
          <Text> Fácil de usar</Text>
        </View>
        <View style={styles.beneficioItem}>
          {renderIcon("support", false)}
          <Text> Soporte técnico y Academia Virtual</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  logo: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  video: {
    width: '100%',
    height: 200,
  },
  whatsapp: {
    backgroundColor: "#25D366",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    color: "#fff",
  },
  beneficios: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Bienvenido;
