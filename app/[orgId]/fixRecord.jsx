import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ViewShot from "react-native-view-shot";
import {
  fetchEmployees,
  fetchEmployeeWithId,
} from "../../services/organization/fetchEmployees";
import { fetchShift, updateShift } from "../../services/userShift/fetchShifts";
import { useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker"; // Asegúrate de instalar este paquete

const FixARecord = () => {
  const viewRef = useRef();
  const { empId: initialEmpId, orgId } = useLocalSearchParams();
  const [empId, setEmpId] = useState(initialEmpId);
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(true);
  const [shiftDetails, setShiftDetails] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [shiftType, setShiftType] = useState("regular"); // Default value

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees(orgId);
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeWithId(empId);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    const loadShiftForEmployee = async () => {
      try {
        const shiftData = await fetchShift(
          empId,
          startDate.toISOString().split("T")[0]
        );
        setShiftDetails(shiftData);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    loadEmployees();
    if (empId) {
      loadEmployee();
      loadShiftForEmployee();
    }
  }, [empId, startDate]);

  // Update shiftType when shiftDetails changes
  useEffect(() => {
    if (shiftDetails) {
      setShiftType(shiftDetails.shift_mode);
    }
  }, [shiftDetails]);

  const handleEmployeeSelect = (id) => {
    setEmpId(id);
    setShowEmployeeList(false);
  };

  const onStartDateChange = (event, selectedDate) => {
    setStartDate(Platform.OS === "web" ? event : selectedDate || startDate);
  };

  const handleSaveShift = async () => {
    try {
      const { in: inTime, out: outTime } = shiftDetails;
      const updatedShift = await updateShift(
        empId,
        startDate.toISOString().split("T")[0],
        inTime,
        outTime,
        shiftType // Include shift type in the update
      );
      setShiftDetails(updatedShift);
      alert("Shift updated successfully!");

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating shift:", error);
      alert("Failed to update shift.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ViewShot ref={viewRef} style={styles.container}>
        <Text style={styles.title}>Corrige un Registro</Text>

        {showEmployeeList && (
          <FlatList
            data={employees}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEmployeeSelect(item._id)}>
                <Text style={styles.employeeItem}>
                  {item.firstname} {item.lastname} - {item.email}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        {employee && employee.email ? (
          <View>
            <Text style={styles.employeeText}>
              {employee.firstname} {employee.lastname}
            </Text>

            <View style={styles.dateContainer}>
              <Text>Fecha:</Text>
              <DatePicker
                selected={startDate}
                onChange={onStartDateChange}
                dateFormat="dd/MM/yyyy"
              />
            </View>

            {shiftDetails ? (
              <View style={styles.shiftDetailsContainer}>
                <Text style={styles.shiftDetailsText}>Detalle de Turno:</Text>
                <Text style={styles.label}>Tipo de Turno:</Text>
                <Picker
                  selectedValue={shiftType}
                  style={styles.picker}
                  onValueChange={(itemValue) => setShiftType(itemValue)}
                >
                  <Picker.Item label="Regular" value="regular" />
                  <Picker.Item label="Feriado" value="holiday" />
                </Picker>

                <Text style={styles.label}>Hora de Ingreso:</Text>
                <TextInput
                  style={styles.input}
                  value={shiftDetails.in}
                  onChangeText={(text) =>
                    setShiftDetails({ ...shiftDetails, in: text })
                  }
                />

                <Text style={styles.label}>Hora de salida:</Text>
                <TextInput
                  style={styles.input}
                  value={shiftDetails.out}
                  onChangeText={(text) =>
                    setShiftDetails({ ...shiftDetails, out: text })
                  }
                />

                <Pressable style={styles.button} onPress={handleSaveShift}>
                  <Text style={styles.buttonText}>Actualizar</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.info}></Text>
            )}
          </View>
        ) : (
          <Text>Seleccione un empleado</Text>
        )}
      </ViewShot>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    padding: 16,
    alignItems: "center",
    marginBottom: 80,
    marginTop: "2%",
    marginHorizontal: "8%",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  employeeItem: {
    fontSize: 16,
    padding: 8,
    backgroundColor: "#f0f0f0",
    marginVertical: 4,
  },
  employeeText: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: "100%",
    marginVertical: 8,
  },
  dateContainer: { marginBottom: 16, alignItems: "center" },
  info: { fontSize: 16, marginVertical: 4 },
  shiftDetailsContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  shiftDetailsText: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  shiftInfo: { fontSize: 16, marginBottom: 2 },
  label: { fontSize: 16, marginBottom: 4 }, // Añadido para el estilo del label
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  picker: { height: 50, width: "100%", marginVertical: 8 }, // Estilo para el picker
});

export default FixARecord;
