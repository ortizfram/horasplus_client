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

export default function SearchOrganizationQR({
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

  const fetchOrganizations = async () => {
    setLoading(true);
    console.log("User ID being sent to API:", userId); // Debug log
    try {
      const response = await axios.get(`${RESP_URL}/api/organization`, {
        params: { userId, isAdmin, isSuperAdmin },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const organizationsData = response.data;
      setOrganizations(organizationsData);
      setFilteredOrganizations(organizationsData); // Show all initially
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

  // lupa
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
      <FlatList
        contentContainerStyle={styles.listContainer}
        style={styles.listBg}
        data={filteredOrganizations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/${item._id}/downloadQR`)}
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
            <MaterialIcons
              name="qr-code"
              size={24}
              color="#000"
              style={styles.icon}
            />
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
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
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
    flexGrow: 0, // Ensures it does not expand indefinitely
    maxHeight: 300, // Sets a fixed height for the scrollable list area
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
