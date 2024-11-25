import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import SearchOrganization from "../../components/searchOrganization";
import InOutClock from "../../components/InOutClock";
import { RESP_URL } from "../../config";
import axios from "axios";
import Logo from "../../components/Logo";

export default function OrganizationList() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext) || {};
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    console.log(userInfo.user);
    console.log("index screen");
    setIsMounted(true); // Set mounted to true when the component mounts

    organization?.user_id === userInfo?.user?._id &&
      console.log("organization owner");
    userInfo?.user?.isAdmin && console.log("isAdmin");
    userInfo?.user?.isSuperAdmin && console.log("isSuperAdmin");
  }, []);

  useEffect(() => {
    if (isMounted && !userInfo?.user?._id) {
      // Only attempt to navigate after mounting
      router.push("/auth/login");
    }
  }, [userInfo, isMounted]);

  if (!userInfo?.user)
    return <ActivityIndicator size="large" color="#0000ff" />;

  const handleSelectOrg = async (orgId) => {
    if (!orgId) {
      console.error("Organization ID is missing");
      return;
    }
  
    try {
      const response = await axios.get(`${RESP_URL}/api/organization/${orgId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      if (!response.data || !response.data._id) {
        throw new Error("Invalid organization data");
      }
  
      const orgData = response.data;
      setOrganization(orgData);
  
      if (
        orgData?.user_id === userInfo?.user?._id ||
        userInfo?.user?.isAdmin ||
        userInfo?.user?.isSuperAdmin
      ) {
        router.push(`/${orgData?._id}/dashboard`);
      } else {
        router.push(`/${orgData?._id}/bePart`);
      }
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
    }
  };
  

  if (authLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.welcome}>
        Bienvenido {userInfo?.user?.isAdmin && <Text>Admin</Text>}{" "}
        {userInfo?.user?.isSuperAdmin && <Text>Super Admin</Text>}{" "}
        {userInfo?.user?.data?.firstname
          ? userInfo?.user?.data?.firstname
          : userInfo?.user?.email || ""}
      </Text>

      {/* Check if showSearch is true */}
      {showSearch ? (
        <SearchOrganization
          userId={userInfo?._id}
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
              <Text style={styles.blue}>Elige tu Establecimiento, o</Text>
              <Pressable style={styles.createBtn}>
                <Text
                  style={styles.createText}
                  onPress={() => {
                    router.push("/organization/create");
                  }}
                >
                  (+) Crea un nuevo establecimiento
                </Text>
              </Pressable>
              <SearchOrganization
                userId={userInfo?._id}
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
                <View>
                  <InOutClock orgId={userInfo?.user?.data?.organization_id} />
                  <Pressable
                    style={styles.redButton}
                    onPress={() => setShowSearch(true)}
                  >
                    <Text style={styles.redButtonText}>
                      Hoy estoy en otro establecimiento
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{}}>
                  {!userInfo?.user?.isAdmin || !userInfo?.user?.isSuperAdmin ? (
                    <Text style={styles.blue}>
                      Busca el nombre de la organización o nombre del dueño,
                      para enviar la solicitud y ser parte de la organización
                    </Text>
                  ) : (
                    <Text style={styles.blue}>
                      Busca el nombre de tu organización o seleccionala para
                      ingresar
                    </Text>
                  )}

                  <SearchOrganization
                    userId={userInfo?._id}
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
    padding: 10,
    marginBottom: 80,
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
