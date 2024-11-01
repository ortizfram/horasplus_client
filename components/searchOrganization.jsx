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
        const response = await axios.get(`${RESP_URL}/api/organization`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        let organizationsData = response.data;

        if (isAdmin && !isSuperAdmin) {
          // Admins only see organizations with IDs in organizationIds
          organizationsData = organizationsData.filter((org) =>
            organizationIds.includes(org._id)
          );
        }
        // Super admins see all organizations (no filtering)

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
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar organización"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      )}
      <FlatList
        contentContainerStyle={styles.listContainer}
        style={styles.listBg}
        data={filteredOrganizations}
        keyExtractor={(item) => item._id}
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    width: "90%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
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
