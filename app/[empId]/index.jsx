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

  const inputContainerWidth = !isMobile ? "50%" : "100%";
  const inputWidth = !isMobile ? "100%" : "100%";
  const inputContainerPadding = !isMobile && 16;

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

        <View
          style={[
            styles.inputContainer,
            {  width: inputContainerWidth },
          ]}
        >
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
              horas excedentes. Se ingresa en minutos. Ejemplo : 1.5hs se
              ingresa como 90.
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
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSaveChanges}
          disabled={loading}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Guardando..." : "Guardar"}
          </Text>
        </Pressable>

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
  container: {
    flexGrow: 1,
    justifyContent: "center", // Centrar contenido verticalmente
    alignItems: "center", // Centrar contenido horizontalmente
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    width: "90%", // Ancho máximo relativo al contenedor padre
    maxWidth: 500, // Limitar el ancho máximo para pantallas grandes
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center", // Centrar todos los elementos internos horizontalmente
  },
  inputContainer: {
    width: "100%", // Ocupa todo el ancho del formulario
    alignItems: "center", // Centrar los inputs dentro del contenedor
  },
  input: {
    width: "90%", // Ancho relativo dentro del contenedor
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 10, // Espaciado uniforme entre inputs
  },
  fieldGroup: {
    marginBottom: 15,
    width: "100%", // Mantener la alineación dentro del contenedor
    alignItems: "center", // Centrar texto e inputs
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center", // Centrar los títulos de los campos
  },
  fieldDescription: {
    fontSize: 12,
    marginBottom: 10,
    color: "#666",
    textAlign: "center", // Centrar descripciones
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#4caf50",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
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
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
});
