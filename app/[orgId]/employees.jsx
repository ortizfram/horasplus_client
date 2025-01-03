import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchOrganization from "../../services/organization/fetchOrganization";
import { fetchEmployees } from "../../services/organization/fetchEmployees";

const Employees = () => {
  const { orgId, next } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await fetchOrganization(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    };

    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees(orgId);
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadOrganization();
    loadEmployees();
  }, [orgId]);

  const handlePress = (empId, next) => {
    if (empId && !next) {
      router.push(`${empId}`);
    } else if (empId && next) {// go verify-location
      router.push(`${empId}/${next}?orgId=${orgId}`);
    }
  };

  const renderEmployee = ({ item }) => {
    console.log("Employee item:", item); // Log the item to see its structure

    const displayName =
      item.firstname && item.lastname
        ? `${item.firstname} ${item.lastname}`
        : item.email; // Fallback to email if names are not available

    return (
      <TouchableOpacity
        style={styles.employeeContainer}
        onPress={() => handlePress(item._id, next)}
      >
        <Text>{displayName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Mis empleados en {organization?.name}</Text>
        {organization && (
          <View>
            <Text style={{ color: "blue", marginVertical: 5 }}>
              organización: {organization._id}
            </Text>
            <FlatList
              data={employees}
              renderItem={renderEmployee}
              keyExtractor={(item) => item._id.toString()}
              style={styles.list} // Add a style for FlatList
              // Optional: If you want to specify a fixed height for the FlatList
              // contentContainerStyle={{ flexGrow: 1 }} // This helps with scrolling
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Employees;

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    padding: 16,
    alignItems: "center",
    marginBottom: 80,
    marginTop: "5%",
    marginHorizontal: "8%",
  },
  employeeContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  list: {
    maxHeight: 400, // Set a max height for the FlatList if needed
  },
});
