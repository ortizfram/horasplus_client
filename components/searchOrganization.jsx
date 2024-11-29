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

export default function SearchOrganization({
  userId,
  token,
  onSelectOrg,
  isAdmin,
  isSuperAdmin,
  organizationIds, // Pass organization IDs the admin has access to
}) {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${RESP_URL}/api/organization?userId=${userId}&isAdmin=${isAdmin}&isSuperAdmin=${isSuperAdmin}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        let organizationsData = response.data;

        // owners only see their orgs isAdmin
        if (isAdmin && !isSuperAdmin) {
          // Admins see only organizations they "own" (user_id matches their ID)
          organizationsData = organizationsData.filter(
            (org) => org.user_id.toString() === userId // Compare IDs as strings
          );
        }
        
        // isSuperAdmin see all organizations (no filtering)

        setOrganizations(organizationsData);
        setFilteredOrganizations(organizationsData); // Show all initially
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        setError("Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [userId, token, isAdmin, isSuperAdmin, organizationIds]);

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
                borderRadius: 8,
              },
              styles.itemContainer,
            ]}
          >
            <Image
              source={
                item.image
                  ? { uri: `${RESP_URL}/${item.image}` }
                  : require("../assets/images/org_placeholder.jpg")
              }
              style={styles.image}
            />
            <Text>{item.name}</Text>
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#F0F0F0", // Same as container to blend
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listBg: {
    width: "100%",
  },
  listContainer: {
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
  noResults: {
    marginTop: 20,
    color: "red",
  },
});
