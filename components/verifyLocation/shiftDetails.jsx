import React from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import { GOOGLE_MAPS_API_KEY } from "../../config";

const ShiftDetails = ({ shiftDetails, startDate }) => {
  return (
    <View>
      <Text style={styles.label}>Hora de Ingreso:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={shiftDetails?.in || "NO EXISTE"}
        editable={false}
      />

      <Text style={styles.label}>Ubicación de Ingreso:</Text>
      <Text style={{ textAlign: "center", color: "gray" }}>
        {shiftDetails?.location?.latitude_in ? (
          <Text>
            Latitude: {shiftDetails?.location?.latitude_in} Longitude:{" "}
            {shiftDetails?.location?.longitude_in}
          </Text>
        ) : (
          "NO EXISTE"
        )}
      </Text>

      {shiftDetails?.location?.latitude_in && Platform.OS === "web" && (
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          style={styles.map}
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${shiftDetails?.location?.latitude_in},${shiftDetails?.location?.longitude_in}`}
          allowFullScreen
        ></iframe>
      )}

      <Text style={styles.label}>Hora de Salida:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={shiftDetails?.out || "NO EXISTE"}
        editable={false}
      />

      <Text style={styles.label}>Ubicación de Egreso:</Text>
      <Text style={{ textAlign: "center", color: "gray" }}>
        {shiftDetails?.location?.latitude_out ? (
          <Text>
            Latitude: {shiftDetails?.location?.latitude_out} Longitude:{" "}
            {shiftDetails?.location?.longitude_out}
          </Text>
        ) : (
          "NO EXISTE"
        )}
      </Text>

      {shiftDetails?.location?.latitude_out && Platform.OS === "web" && (
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          style={styles.map}
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${shiftDetails?.location?.latitude_out},${shiftDetails?.location?.longitude_out}`}
          allowFullScreen
        ></iframe>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  readOnlyInput: {
    backgroundColor: "#f9f9f9",
  },
  map: {
    width: "100%",
    height: 300,
    marginTop: 16,
  },
});

export default ShiftDetails;
