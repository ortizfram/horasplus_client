import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons"; // Adjust the icon set if needed
import { RESP_URL } from "../../config";
import fetchOrganization from "../../services/organization/fetchOrganization";
import LocationIcon from "../../icons/LocationIcon";

export default function Dashboard() {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await fetchOrganization(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    };

    loadOrganization();
  }, [orgId]);

  const deleteOrg = async () => {
    try {
      const response = await axios.delete(
        `${RESP_URL}/api/organization/${orgId}`
      );
      if (response.status === 200) {
        console.log("Organization deleted");
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  const confirmDelete = () => {
    if (Platform.OS === "web") {
      // Web-specific alert using native confirm dialog
      if (
        window.confirm(
          "Seguro quieres eliminar esta organizacion? No puedes deshacer esta accion."
        )
      ) {
        deleteOrg();
      }
    } else {
      // Native mobile alert for iOS/Android
      Alert.alert(
        "Confirmar",
        "Seguro quieres eliminar esta organizacion? No puedes deshacer esta accion.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: deleteOrg,
            style: "destructive", // iOS only: highlights the "Delete" button in red
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {organization ? (
        <View style={styles.header}>
          <Image
            source={
              organization.image
                ? { uri: `${RESP_URL}/${organization.image}` }
                : require("../../assets/images/org_placeholder.jpg")
            }
            style={styles.image}
          />
          <Text style={styles.orgName}>{organization.name}</Text>
        </View>
      ) : (
        <Text>Loading organization details...</Text>
      )}
      <View style={styles.gridContainer}>
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${organization?._id}/employees`)}
        >
          <Icon name="people" size={30} color="#007bff" />
          <Text style={styles.gridText}>
            Descargar Reporte Individual - Configurar empleado
          </Text>
        </Pressable>
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${organization?._id}/downloadReports`)}
        >
          <Icon name="assessment" size={30} color="#007bff" />
          <Text style={styles.gridText}>
            Descargar todos tus reportes de {organization?.name}
          </Text>
        </Pressable>

        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${orgId}/fixRecord`)}
        >
          <Icon name="edit" size={30} color="#007bff" />
          <Text style={styles.gridText}>Corrige o Agrega un Registro</Text>
        </Pressable>
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${organization?._id}/verifyLocation`)}
        >
          <LocationIcon size={30} color="#007bff" />
          <Text style={styles.gridText}>Ubicación de Marcaciones</Text>
        </Pressable>
      </View>
      <Pressable style={styles.removeButton} onPress={confirmDelete}>
        <Icon name="delete" size={24} color="white" />
        <Text style={styles.removeButtonText}>Eliminar Organización</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
    marginTop: "2%",
  },
  removeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF4C4C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    alignSelf: "center",
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  orgName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  gridItem: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  gridText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "red",
    opacity: "10%",
    padding: 3,
    borderRadius: 5,
    marginTop: 20, // Ensures it's at the bottom
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "20%",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});
