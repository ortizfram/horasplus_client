import React from "react";
import { FlatList, View, Image, Text, StyleSheet } from "react-native";

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
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselItem: {
    width: 300, // Adjust width to fit your design
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  carouselImage: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
  },
  carouselTextContainer: {
    marginTop: 10,
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
