import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import SearchOrganizationQR from "../../components/searchOrganizationQR";
import InOutClock from "../../components/InOutClock";
import { RESP_URL } from "../../config";
import axios from "axios";
import Logo from "../../components/Logo";

export default function QRDashboard() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext) || {};
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    console.log("index screen");
    setIsMounted(true); // Set mounted to true when the component mounts
  }, []);

  useEffect(() => {
    if (isMounted && !userInfo?.user?._id) {
      // Only attempt to navigate after mounting
      router.push("/auth/login");
    }
  }, [userInfo, isMounted]);

  // Update screen width on dimension changes
  useEffect(() => {
    const onChange = ({ window }) => setScreenWidth(window.width);
    Dimensions.addEventListener("change", onChange);

    return () => Dimensions.removeEventListener("change", onChange);
  }, []);

  if (!userInfo?.user?._id || authLoading) {
    // Return loading indicator until userInfo is available
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleSelectOrg = async (orgId) => {
    try {
      const response = await axios.get(
        `${RESP_URL}/api/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const organization = response.data;
      if (
        organization?.user_id === userInfo?.user?._id ||
        userInfo?.user?.isAdmin ||
        userInfo?.user?.isSuperAdmin
      ) {
        router.push(`/${orgId}/dashboard`);
      } else {
        router.push(`/${orgId}/bePart`);
      }
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
    }
  };

  // Determine if screen is mobile-sized
  const isMobile = screenWidth < 768;

  return (
    <View style={[styles.container, { marginBottom: isMobile ? 100 : 80 }]}>
      <Logo />
      <Text style={styles.header}>Generar QR de Ingreso</Text>
      <Text style={styles.welcome}>
        <Text style={styles.header}>Bienvenid@</Text>
        {userInfo?.user?.isAdmin && <Text>Admin</Text>}{" "}
        {userInfo?.user?.isSuperAdmin && <Text>Super Admin</Text>}{" "}
        {userInfo?.user?.data?.firstname
          ? `${userInfo?.user?.data?.firstname} ${userInfo?.user?.data?.lastname}`
          : userInfo?.user?.email || ""}
      </Text>

      {/* Check if showSearch is true */}
      {showSearch ? (
        <SearchOrganizationQR
          userId={userInfo?.user?.data?._id}
          token={userInfo.token}
          onSelectOrg={handleSelectOrg}
          isAdmin={userInfo?.user?.isAdmin}
          isSuperAdmin={userInfo?.user?.isSuperAdmin}
          organizationIds={userInfo?.user?.data?.organization_id || []}
        />
      ) : (
        <>
          {userInfo?.user?.isAdmin ? (
            <View>
              <Text style={styles.blue}>
                Toca cada organizacion para ir a generar y descargar su codigo
                QR
              </Text>

              <SearchOrganizationQR
                userId={userInfo?.user?.data?._id}
                token={userInfo.token}
                onSelectOrg={handleSelectOrg}
                isAdmin={userInfo?.user?.isAdmin}
                isSuperAdmin={userInfo?.user?.isSuperAdmin}
                organizationIds={userInfo?.user?.data?.organization_id || []}
              />
            </View>
          ) : (
            <>
              {userInfo?.user?.data?.organization_id ? (
                // es empleado
                <View></View>
              ) : (
                <View style={{}}>
                  {!userInfo?.user?.isAdmin || !userInfo?.user?.isSuperAdmin ? (
                    <Text style={styles.blue}>
                      Toca cada organizacion para ir a generar y descargar su
                      codigo QR
                    </Text>
                  ) : (
                    // es owner
                    <Text style={styles.blue}>
                      Toca cada organizacion para ir a generar y descargar su
                      codigo QR
                    </Text>
                  )}

                  <SearchOrganizationQR
                    userId={userInfo?.user?.data?._id}
                    token={userInfo.token}
                    onSelectOrg={handleSelectOrg}
                    isAdmin={userInfo?.user?.isAdmin}
                    isSuperAdmin={userInfo?.user?.isSuperAdmin}
                    organizationIds={
                      userInfo?.user?.data?.organization_id || []
                    }
                  />
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginHorizontal: "10%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  blue: {
    color: "blue",
    marginBottom: 10,
  },
  welcome: {
    color: "blue",
    fontSize: 20,
  },
  createBtn: {
    padding: 10,
    backgroundColor: "blue",
    marginVertical: 10,
  },
  createText: {
    color: "white",
  },
  redButton: {
    padding: 10,
    borderRadius: 5,
  },
  redButtonText: {
    color: "red",
    textAlign: "center",
  },
});
