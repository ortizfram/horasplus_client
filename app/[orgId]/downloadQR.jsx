import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Logo from "../../components/Logo";
import fetchOrganization from "../../services/organization/fetchOrganization";
import QRCode from "react-qr-code";
import { REQ_URL, RESP_URL } from "../../config";

const downloadQr = () => {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await fetchOrganization(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    };

    loadOrganization();
  }, [orgId]);

   // Determine margin based on platform and screen width
   const getDynamicMargin = () => {
    if (Platform.OS === "web" && Dimensions.get("window").width > 1024) {
      return "35%"; // Assume web PC/laptop if screen width > 1024px
    }
    return "8%"; // Default for Android/iOS or smaller screens
  };
   const getDynamicMarginTop = () => {
    if (Platform.OS === "web" && Dimensions.get("window").width > 1024) {
      return "5%"; // Assume web PC/laptop if screen width > 1024px
    }
    return "28%"; // Default for Android/iOS or smaller screens
  };

  return (
    <View style={[styles.container, { marginHorizontal: getDynamicMargin(), marginTop:getDynamicMarginTop() }]}>
      <View style={styles.headerContainer}>
        <Logo />
        <Text style={styles.header}>QR de Ingreso a {organization?.name}</Text>
        <Pressable onPress={() => router.push(`${orgId}/bePart`)}>
          <Text style={{ color: "blue", marginTop: 10 }}>Link</Text>
        </Pressable>
        <View style={styles.qrContainer}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={`${REQ_URL}/${orgId}/bePart`}
            viewBox={`0 0 256 256`}
          />
        </View>
      </View>
    </View>
  );
};

export default downloadQr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
    
  },
  headerContainer: {
    alignItems: "center",
    borderWidth: 1, // Thin border
    borderColor: "blue", // Blue color
    borderRadius: 10, // Rounded corners
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  qrContainer: {
    height: "auto",
    margin: "0 auto",
    maxWidth: 250,
    width: "100%",
  },
});
