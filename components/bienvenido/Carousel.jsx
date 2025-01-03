import React from "react";
import { FlatList, View, Image, Text, StyleSheet, Dimensions } from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

export default function Carousel({ carouselData }) {
  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={carouselData}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image
              source={typeof item.image === "string" ? { uri: item.image } : item.image}
              style={styles.carouselImage}
            />
            <View style={styles.carouselTextContainer}>
              <Text style={styles.imageTitle}>{item.title}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    backgroundColor: "#000", // Black background for better image fit
  },
  carouselItem: {
    width, // Use full screen width
    height, // Use full screen height
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImage: {
    width, // Full screen width
    height, // Full screen height
    resizeMode: "cover", // Cover to occupy the entire space
  },
  carouselTextContainer: {
    position: "absolute",
    bottom: 20, // Position text at the bottom of the image
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  imageTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
