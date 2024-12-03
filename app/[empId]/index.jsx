import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Button,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchEmployeeWithId } from "../../services/organization/fetchEmployees";
import { updateEmployee } from "../../services/employee/employee";

const Index = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;
  const { empId } = useLocalSearchParams();
  const [employee, setEmployee] = useState({
    firstname: "",
    lastname: "",
    email: "",
    hourly_fee: 0,
    declared_hours: 0,
    travel_cost: 0,
    bonus_prize: 0,
    cash_advance: 0,
    cash_a_date: "",
    role: "User", // default role
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeWithId(empId);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };
    loadEmployee();
  }, [empId]);

  const handleInputChange = (field, value) => {
    setEmployee((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleRemoveFromOrganization = async () => {
    setLoading(true);
    const updatedData = await updateEmployee(empId, {
      ...employee,
      organization_id: null,
    });
    setEmployee(updatedData);
    setTimeout(() => {
      setLoading(false);
      alert("Empleado ha sido removido de la organizacion!");
    }, 2000);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const updatedData = await updateEmployee(empId, employee);
    setEmployee(updatedData);
    setTimeout(() => {
      setLoading(false);
      alert("Changes saved successfully!");
    }, 2000);
  };

  const inputWidth = isMobile ? "70%" : "100%"

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          Empleado:{" "}
          {employee?.firstname
            ? `${employee.firstname} ${employee.lastname}`
            : employee.email}
        </Text>

        {/* Reporte de Horas Button */}
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${empId}/report`)}
        >
          <Text style={styles.gridText}>🕒 Ver Reporte de Horas</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Editar valores</Text>

        {/* Editable Fields */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Nombre</Text>
          <TextInput
            style={[
              styles.input, // Base styles
              { width: inputWidth }, // Dynamic width
            ]}
            value={employee.firstname}
            onChangeText={(text) => handleInputChange("firstname", text)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Apellido</Text>
          <TextInput
           style={[
            styles.input, // Base styles
            { width: inputWidth }, // Dynamic width
          ]}
            value={employee.lastname}
            onChangeText={(text) => handleInputChange("lastname", text)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Email</Text>
          <TextInput
           style={[
            styles.input, // Base styles
            { width: inputWidth }, // Dynamic width
          ]}
            value={employee.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Precio Hora</Text>
          <TextInput
           style={[
            styles.input, // Base styles
            { width: inputWidth }, // Dynamic width
          ]}
            value={String(employee.hourly_fee)}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("hourly_fee", Number(text))
            }
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Horas Declaradas</Text>
          <Text style={styles.fieldDescription}>
            Ingresar unicamente si tiene bono de sueldo, para poder sacar las
            horas excedentes. Se ingresa en minutos. Ejemplo : 1.5hs se ingresa
            como 90.
          </Text>
          <TextInput
            style={[
              styles.input, // Base styles
              { width: inputWidth }, // Dynamic width
            ]}
            value={String(employee.declared_hours)}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("declared_hours", Number(text))
            }
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Viáticos</Text>
          <TextInput
            style={[
              styles.input, // Base styles
              { width: inputWidth }, // Dynamic width
            ]}
            value={String(employee.travel_cost)}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("travel_cost", Number(text))
            }
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Premio</Text>
          <TextInput
            style={[
              styles.input, // Base styles
              { width: inputWidth }, // Dynamic width
            ]}
            value={String(employee.bonus_prize)}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("bonus_prize", Number(text))
            }
          />
        </View>

        {/* Role Picker */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Roles</Text>
          <Picker
            selectedValue={employee.role}
            onValueChange={(value) => handleInputChange("role", value)}
            style={[
              styles.input, // Base styles
              { width: inputWidth }, // Dynamic width
            ]}
          >
            <Picker.Item label="Adminstrador" value="Admin" />
            <Picker.Item label="Empleado" value="User" />
          </Picker>
        </View>

        {/* Save Button */}
        <Button
          title={loading ? "Guardando..." : "Guardar"}
          onPress={handleSaveChanges}
          disabled={loading}
        />

        <Pressable
          style={[styles.removeButton, loading && styles.disabledButton]}
          onPress={handleRemoveFromOrganization}
          disabled={loading}
        >
          <Text style={styles.removeButtonText}>
            {loading ? "Removing..." : "Sacar de Organización"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  removeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF4C4C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    alignSelf: "center",
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "#FFB3B3",
  },
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 80,
    marginTop: "2%",
    marginHorizontal: "8%",
  },
  formContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  fieldDescription: {
    fontSize: 10,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  gridItem: {
    marginTop: 10,
    width: "80%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    alignSelf: "center",
  },
  gridText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
