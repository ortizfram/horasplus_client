import {
 Dimensions,
 Platform,
 Pressable,
 StyleSheet,
 Text,
 View,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Logo from "../../components/Logo";
import fetchOrganization from "../../services/organization/fetchOrganization";
import QRCode from "react-qr-code";
import { REQ_URL } from "../../config";
import { captureScreen } from "react-native-view-shot"; // Import view-shot for capturing the screen
import * as FileSystem from "expo-file-system"; // For mobile saving the image

const downloadQr = () => {
 const { orgId } = useLocalSearchParams();
 const router = useRouter();
 const [organization, setOrganization] = useState(null);
 const viewRef = useRef(); // Reference to the container view

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

 // Dynamic margin based on platform and screen width
 const getDynamicMargin = () => {
   if (Platform.OS === "web" && Dimensions.get("window").width > 1024) {
     return "35%"; // For larger web screens (PC/Laptop)
   }
   return "8%"; // For Android/iOS or smaller screens
 };

 const getDynamicMarginTop = () => {
   if (Platform.OS === "web" && Dimensions.get("window").width > 1024) {
     return "5%"; // For larger web screens
   }
   return "28%"; // For Android/iOS or smaller screens
 };

 // Function to capture the headerContainer and download the image
 const handleDownload = async () => {
   try {
     // Capture only the headerContainer with transparent background
     const uri = await captureScreen({
       format: "png", // Save as PNG
       quality: 0.8,
       transparent: true, // Make the background transparent
       result: "tmpfile",
       captureRef: viewRef, // Capture the content of the referenced view
     });

     if (Platform.OS === "web") {
       // For web: Create a download link and trigger the download
       const response = await fetch(uri);
       const blob = await response.blob();
       const link = document.createElement("a");
       link.href = URL.createObjectURL(blob);
       link.download = `${organization?.name}_qr_code.png`; // Naming the file as PNG
       link.click();
     } else {
       // For mobile (Android/iOS): Save the image to the file system
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
   <View
     // Assign ref to the view we want to capture
     style={[styles.container, { marginHorizontal: getDynamicMargin(), marginTop: getDynamicMarginTop() }]}
   >
     <View ref={viewRef} style={styles.headerContainer}>
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
           fgColor="#2793d5" // Set the QR code color
           bgColor="#ffffff" // Optional: Set background color (default is white)
         />
       </View>
       <Pressable onPress={handleDownload} style={styles.downloadButton}>
         <Text style={styles.downloadText}>Descargar Imagen</Text>
       </Pressable>
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
   backgroundColor: "transparent", // Ensure the background is transparent
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
