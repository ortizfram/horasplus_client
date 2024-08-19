import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { RESP_URL } from "../../config";

export default function OrganizationList() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      const fetchOrganizations = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${RESP_URL}/api/organization`, {
            params: { userId: userInfo._id },
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          setOrganizations(response.data);
        } catch (error) {
          console.error("Failed to fetch organizations:", error);
          setError("Failed to fetch organizations");
        } finally {
          setLoading(false);
        }
      };

      fetchOrganizations();
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/auth/login");
    }
  }, [userInfo]);

  const handleSelectOrg = (orgId) => {
    // Implement the logic for handling organization selection
    // For example, navigate to a details page for the selected organization
    router.push(`/${orgId}/dashboard`);
  };

  if (authLoading || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <Pressable style={styles.createBtn}>
          <Text
            style={styles.createText}
            onPress={() => {
              router.push("/organization/create");
            }}
          >
            (+) Create an Organization
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.welcome}>Welcome {userInfo?.email || ""}</Text>
      {organizations.length > 0 ? (
        <>
          <Text>Elige tu Establecimiento, o</Text>
          <Pressable style={styles.createBtn}>
            <Text
              style={styles.createText}
              onPress={() => {
                router.push("/organization/create");
              }}
            >
              (+) Crea otra organizacion 
            </Text>
          </Pressable>
          <FlatList
            data={organizations}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectOrg(item._id)}
                style={({ pressed }) => [
                  {
                    padding: 20,
                    backgroundColor: pressed ? "#ddd" : "#f5f5f5",
                    margin: 5,
                  },
                  styles.itemContainer,
                ]}
              >
                <Text>{item.name}</Text>
              </Pressable>
            )}
          />
        </>
      ) : (
        <View style={styles.container}>
          <Text>No organizations found for this account yet!</Text>
          <Pressable style={styles.createBtn}>
            <Text
              style={styles.createText}
              onPress={() => {
                router.push("/organization/create");
              }}
            >
              (+) Create an Organization
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    marginTop: 15,
    color: "blue",
    fontSize: 20,
  },
  itemContainer: {
    borderRadius: 8,
  },
  createBtn: {
    padding: 10,
    backgroundColor: "blue",
    marginVertical: 10,
  },
  createText: {
    color: "white",
  },
});
