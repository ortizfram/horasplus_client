import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EmployeeDetails = ({ employee }) => {
  return (
    <View>
      <Text style={styles.title}>
        <Text style={styles.text}>
          {employee.firstname} {employee.lastname}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  text: {
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
});

export default EmployeeDetails;
