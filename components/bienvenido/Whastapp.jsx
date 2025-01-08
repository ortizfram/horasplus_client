import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Svg from "react-native-svg";

const Whastapp = () => {
  return (
    <TouchableOpacity
      style={styles.whatsappButton}
      onPress={
        () =>
          Linking.openURL(
            "https://web.whatsapp.com/send?phone=2613005849&text=Hola+quiero+demo+de+Horas+Mas"
          ) // Replace with your WhatsApp number
      }
    >
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 0C5.372 0 0 5.372 0 12c0 2.12.552 4.106 1.512 5.832L0 24l6.336-1.512A11.94 11.94 0 0012 24c6.628 0 12-5.372 12-12S18.628 0 12 0zm6.336 17.664c-.264.744-1.536 1.44-2.112 1.512-.552.072-1.224.096-1.944-.12-.456-.12-1.056-.36-1.824-.72-3.192-1.392-5.28-4.824-5.448-5.064-.168-.24-1.296-1.728-1.296-3.288 0-1.56.816-2.328 1.104-2.664.288-.336.624-.408.84-.408.216 0 .432.008.624.012.192.008.456-.072.72.552.264.624.888 2.16.96 2.328.072.168.12.336.024.552-.096.216-.144.336-.288.528-.144.192-.288.336-.432.552-.144.216-.288.432-.12.744.168.312.744 1.224 1.584 1.968 1.08.96 1.992 1.272 2.304 1.416.312.144.48.12.672-.072.192-.192.768-.888.96-1.2.192-.312.384-.24.648-.144.264.096 1.68.792 1.968.936.288.144.48.216.552.336.072.12.072.696-.192 1.44z"
          fill="#fff"
        />
      </Svg>
      <Text style={styles.whatsappButtonText}>Contactar por WhatsApp</Text>
    </TouchableOpacity>
  );
};

export default Whastapp;

const styles = StyleSheet.create({
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    padding: 12,
    borderRadius: 8,
    margin: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  whatsappButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginLeft: 10,
  },
});
