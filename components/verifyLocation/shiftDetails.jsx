import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const ShiftDetails = ({ shiftDetails, startDate }) => {
  return (
    <View>
      <Text style={styles.label}>Fecha de Turno:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={startDate ? startDate.toLocaleDateString() : "No disponible"}
        editable={false}
      />

      <Text style={styles.label}>Modo del Turno:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={shiftDetails?.shift_mode || "No disponible"}
        editable={false}
      />

      <Text style={styles.label}>Hora de Ingreso:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={shiftDetails?.in || "No disponible"}
        editable={false}
      />

      <Text style={styles.label}>Hora de Salida:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={shiftDetails?.out || "No disponible"}
        editable={false}
      />

      <Text style={styles.label}>Ubicación del Registro:</Text>
      <Text style={{ textAlign: "center", color: "gray" }}>
        {shiftDetails?.location || "No disponible"}
      </Text>
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
});

export default ShiftDetails;
