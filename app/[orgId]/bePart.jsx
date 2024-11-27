import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { RESP_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import Logo from "../../components/Logo";

const BePart = () => {
  const { orgId } = useLocalSearchParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true); // Handles initial loader
  const router = useRouter();
  const { userInfo, splashLoading } = useContext(AuthContext);

  // Fetch organization details
  const fetchOrganization = async () => {
    try {
      const response = await axios.get(`${RESP_URL}/api/organization/${orgId}`);
      setOrganization(response.data);
    } catch (error) {
      console.error("Error fetching organization:", error);
    } finally {
      setLoading(false); // Stop loader regardless of success
    }
  };

  useEffect(() => {
    if (!userInfo == null || !orgId) {
      console.log("Redirecting to signup...");
      router.replace(`/auth/signup?next=/${orgId}/bePart`);
    } else {
      fetchOrganization();
    }
  }, [splashLoading, userInfo, orgId]);

  const associate = async () => {
    try {
      const res = await axios.post(
        `${RESP_URL}/api/organization/${orgId}/bePart`,
        { uid: userInfo.user._id }
      );
      if (res.status === 200 || res.status === 201) {
        console.log("Association successful:", res.data);
        router.push(`/${orgId}/bePartSent`);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.error("Already associated:", error.response.data);
        router.push("/");
      } else {
        console.error("Error during association:", error);
      }
    }
  };

  if (loading || splashLoading || !orgId || !userInfo) {
    return <Loader />; // Show loader until everything is ready
  }

  return (
    <View style={styles.container}>
      {organization ? (
        <View style={styles.content}>
          <Logo />
          <Text style={styles.title}>
            Hola {userInfo?.user?.data?.firstname || userInfo?.user?.email}, sé
            parte de:
          </Text>
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
          <Pressable style={styles.button} onPress={associate}>
            <Text style={styles.buttonText}>Enviar solicitud</Text>
          </Pressable>
        </View>
      ) : (
        <Text>Organización no encontrada</Text>
      )}
    </View>
  );
};

export default BePart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  orgName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
