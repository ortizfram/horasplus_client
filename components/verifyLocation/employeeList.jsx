import React from "react";
import { FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";

const EmployeeList = ({ employees, onSelect }) => {
  return (
    <FlatList
      data={employees}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelect(item._id)}
          style={styles.itemContainer}
        >
          <Text style={styles.itemText}>
            {item.firstname} {item.lastname} - {item.email}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#444",
  },
});

export default EmployeeList;
