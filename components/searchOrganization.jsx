import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { RESP_URL } from "../config";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchEmployees } from "../services/organization/fetchEmployees";

export default function SearchOrganization({
  userId,
  token,
  onSelectOrg,
  isAdmin,
  isSuperAdmin,
  organizationIds,
}) {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${RESP_URL}/api/organization`, {
        params: { userId, isAdmin, isSuperAdmin },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const organizationsData = await Promise.all(
        response.data.map(async (org) => {
          try {
            const employees = await fetchEmployees(org._id); // Fetch employees for the org
            return { ...org, employeeCount: employees.length };
          } catch (err) {
            console.error(`Error fetching employees for ${org.name}:`, err);
            return { ...org, employeeCount: 0 }; // Default to 0 if an error occurs
          }
        })
      );

      setOrganizations(organizationsData);
      setFilteredOrganizations(organizationsData);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      setError("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [userId, token, isAdmin, isSuperAdmin]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    } else {
      setFilteredOrganizations(organizations);
    }
  }, [searchQuery, organizations]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isAdmin && (
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            color="#8E8E93"
            style={styles.icon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar organización"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.listContainer}
        style={styles.listBg}
        data={filteredOrganizations}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelectOrg(item._id)}
            style={({ pressed }) => [
              {
                padding: 20,
                backgroundColor: pressed ? "#ddd" : "#f5f5f5",
                margin: 5,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between", // Space between elements
                borderRadius: 8,
              },
              styles.itemContainer,
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={
                  item.image
                    ? { uri: `${RESP_URL}/${item.image}` }
                    : require("../assets/images/org_placeholder.jpg")
                }
                style={styles.image}
              />
              <Text>{item.name}</Text>
            </View>
            <View style={styles.employeeInfo}>
              <MaterialIcons name="person" size={20} color="#8E8E93" />
              <Text style={styles.employeeCount}>{item.employeeCount}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>No se encontraron organizaciones</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  listBg: {
    flexGrow: 0,
    maxHeight: 300,
    width: "100%",
  },
  listContainer: {
    paddingBottom: 10,
    alignItems: "center",
  },
  itemContainer: {
    borderRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  employeeCount: {
    marginLeft: 5,
    fontSize: 16,
    color: "#8E8E93",
  },
  noResults: {
    marginTop: 20,
    color: "red",
  },
});
