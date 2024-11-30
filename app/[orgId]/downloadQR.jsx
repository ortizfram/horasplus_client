import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchOrganization from "../../services/organization/fetchOrganization";
import QRCode from "react-qr-code";
import { REQ_URL } from "../../config";
import { captureScreen } from "react-native-view-shot"; // Import view-shot for capturing the screen
import * as FileSystem from "expo-file-system"; // For mobile saving the image
import Logo from "../../components/Logo";

const downloadQr = () => {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const viewRef = useRef(); // Reference to the container view

  const [isMobile, setIsMobile] = useState(Dimensions.get("window").width < 768); // Track if screen is mobile-sized

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

  // Listen for screen size changes
  useEffect(() => {
    const onChange = ({ window }) => setIsMobile(window.width < 768);
    Dimensions.addEventListener("change", onChange);
    return () => Dimensions.removeEventListener("change", onChange);
  }, []);

  // Dynamic margin based on platform and screen width
  const getDynamicMargin = () => {
    if (Platform.OS === "web" && Dimensions.get("window").width > 1024) {
      return "35%"; // For larger web screens (PC/Laptop)
    }
    return "8%"; // For Android/iOS or smaller screens
  };

  const getDynamicMarginTop = () => {
    if (isMobile) {
      return "15%"; // For mobile-sized screens
    }
    if (Platform.OS === "web" && Dimensions.get("window").width > 1024) {
      return "5%"; // For larger web screens
    }
    return "28%"; // For Android/iOS or smaller screens
  };

  const getContainerStyle = () => {
    return {
      ...styles.headerContainer,
      borderColor: isMobile ? "transparent" : "blue", // Remove border for mobile
      paddingTop: isMobile ? 15 : 30, // Decrease padding top for mobile
    };
  };

  // Function to capture the headerContainer and download the image
  const handleDownload = async () => {
    try {
      const uri = await captureScreen({
        format: "png", // Save as PNG
        quality: 0.8,
        transparent: true, // Make the background transparent
        result: "tmpfile",
        captureRef: viewRef, // Capture the content of the referenced view
      });

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${organization?.name}_qr_code.png`;
        link.click();
      } else {
        const fileUri = FileSystem.documentDirectory + `${orgId}_qr_code.png`;
        await FileSystem.moveAsync({
          from: uri,
          to: fileUri,
        });
        console.log("File saved to:", fileUri);
        alert("QR code image downloaded!");
      }
    } catch (error) {
      console.error("Failed to capture screen:", error);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          marginHorizontal: getDynamicMargin(),
          marginTop: getDynamicMarginTop(),
        },
      ]}
    >
      <View ref={viewRef} style={getContainerStyle()}>
        <Logo />
        <Text style={styles.header}>QR de Ingreso a {organization?.name}</Text>
        <Pressable onPress={() => router.push(`${orgId}/bePart`)}>
          <Text style={{ color: "#2793d5", marginTop: 10 }}>Link</Text>
        </Pressable>
        <View style={styles.qrContainer}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={`${REQ_URL}/${orgId}/bePart`}
            viewBox={`0 0 256 256`}
            fgColor="#2793d5"
            bgColor="#ffffff"
          />
        </View>
        <Pressable onPress={handleDownload} style={styles.downloadButton}>
          <Text style={styles.downloadText}>Descargar Imagen</Text>
        </Pressable>
      </View>
    </ScrollView>
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
    borderRadius: 10, // Rounded corners
    paddingBottom: 30,
    backgroundColor: "transparent",
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
  downloadButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2793d5",
    borderRadius: 5,
  },
  downloadText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
