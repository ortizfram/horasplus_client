import {
  StyleSheet,
  Text,
  View,
  Picker,
  Button,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  fetchAllEmployees,
  updateEmployee,
} from "../../services/employee/employee";
import { MaterialIcons } from "@expo/vector-icons";

const Roles = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      const data = await fetchAllEmployees();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    try {
      await updateEmployee(userId, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      alert("Role updated successfully!");
      await loadUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(text.toLowerCase()) ||
        user.lastname.toLowerCase().includes(text.toLowerCase()) ||
        user.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lista de Usuarios y Roles</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={24}
          color="#8E8E93"
          style={styles.icon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, apellido o email"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      {filteredUsers.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <Text style={styles.userName}>
            {user.firstname} {user.lastname}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Picker
            selectedValue={user.role}
            style={styles.picker}
            onValueChange={(value) => handleRoleChange(user._id, value)}
          >
            <Picker.Item label="Administrador" value="Admin" />
            <Picker.Item label="Empleado" value="User" />
          </Picker>
        </View>
      ))}
    </ScrollView>
  );
};

export default Roles;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    marginBottom:80
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#F0F0F0", // Same as container to blend
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  userCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  picker: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
});
