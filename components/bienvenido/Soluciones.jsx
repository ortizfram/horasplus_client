import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");
const isMobile = Dimensions.get("window").width < 768;

const Soluciones = () => {
  const features = [
    {
      title: "Ubicacion en Tiempo Real",
      description: "Mejora la operación de tu negocio. Tus empleados podrán realiza asistencia en tiempo real.",
      icon: <MaterialIcons name="location-pin" size={40} color="#000" />,
    },
    {
      title: "Disminuye probabilidad de juicios en un 90%",
      description: "Mejora la operación de tu negocio. Eliminando cualquier tipo de pruebas como planillas de asistencia en papel",
      icon: <MaterialIcons name="print-disabled" size={40} color="#000" />,
    },
    {
      title: "Configuraciones Inteligentes",
      description: "Configura reglas y valor horario de cada uno de tus empleados.",
      icon: <AntDesign name="calendar" size={40} color="#000" />,
    },
    {
      title: "Reportes de Control Horario",
      description: "Exporta planillas de asistencia y liquidaciones en un solo click en formatos PNG o XLSX.",
      icon: <FontAwesome5 name="file-alt" size={40} color="#000" />,
    },
    {
      title: "Liquidación de Horas Trabajadas",
      description: "Calcula rápidamente las horas extras trabajadas, y horas declaradas ahorrando tiempo y costos.",
      icon: <AntDesign name="clockcircleo" size={40} color="#000" />,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Soluciones de control horario que mejoran tu negocio</Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.feature}>
            {feature.icon}
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  feature: {
    width: "45%",
    alignItems: "center",
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
});

export default Soluciones;
