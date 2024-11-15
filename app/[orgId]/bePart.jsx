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
  const [loading, setLoading] = useState(true); // New state to manage loading
  const router = useRouter();
  const { userInfo, splashLoading } = useContext(AuthContext); // Ensure splashLoading is available

  useEffect(() => {
    if (!splashLoading && !userInfo?.user?._id) {
      console.log("No userInfo found, redirecting to signup...");
      // Adding a 4-second delay before redirection
      setTimeout(() => {
        setLoading(false); // Hide loading screen after 4 seconds
        router.push(`/auth/signup?next=/${orgId}/bePart`);
      }, 4000); // 4 seconds delay
    } else if (!splashLoading) {
      console.log("userInfo found:", userInfo?.user?._id);
      setLoading(false); // Hide loading screen if user is found
    }
  }, [userInfo, router, orgId, splashLoading]);

  const associate = async () => {
    try {
      const res = await axios.post(
        `${RESP_URL}/api/organization/${orgId}/bePart`,
        { uid: userInfo.user._id }
      );

      if (res.status === 200 || res.status === 201) {
        console.log(
          "User successfully associated with the organization:",
          res.data
        );
        router.push(`/${orgId}/bePartSent`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(
          "User is already associated with the organization:",
          error
        );
        router.push("/");
      } else {
        console.error("Error during association:", error);
      }
    }
  };

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(
          `${RESP_URL}/api/organization/${orgId}`
        );
        setOrganization(response.data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    fetchOrganization();
  }, [orgId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View>
          <Loader />
        </View>
      ) : (
        organization && (
          <View style={styles.content}>
            <Logo />
            <Text style={styles.title}>Se parte de :</Text>
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
        )
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
    justifyContent: "center", // Ensure vertical alignment within content
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
    flexDirection: "column", // Adjusted to column for better centering
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 80, // Increased size for better visibility
    height: 80,
    borderRadius: 40, // Maintain circular shape
    marginBottom: 10, // Add spacing below the image
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
    marginTop: 20, // Add spacing from other elements
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

