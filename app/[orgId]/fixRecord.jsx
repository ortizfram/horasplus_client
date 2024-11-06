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
  Modal,
} from "react-native";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ViewShot from "react-native-view-shot";
import {
  fetchEmployees,
  fetchEmployeeWithId,
} from "../../services/organization/fetchEmployees";
import {
  addShiftFromUpdateView,
  fetchShift,
  updateShift,
} from "../../services/userShift/fetchShifts";
import { useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const FixARecord = () => {
  const viewRef = useRef();
  const { empId: initialEmpId, orgId } = useLocalSearchParams();
  const [empId, setEmpId] = useState(initialEmpId);
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(true);
  const [shiftDetails, setShiftDetails] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [shiftType, setShiftType] = useState("regular");

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
    setModalVisible(false);
  };

  const handleSaveShift = async () => {
    try {
      const { in: inTime, out: outTime } = shiftDetails;
      let updatedShift;

      try {
        updatedShift = await updateShift(
          empId,
          startDate.toISOString().split("T")[0],
          inTime,
          outTime,
          shiftType
        );
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Shift not found, so we create it
          updatedShift = await addShiftFromUpdateView(
            empId,
            startDate.toISOString().split("T")[0],
            inTime,
            outTime,
            shiftType,
            userInfo?.user?.data?.organization_id 
          );
        } else {
          throw error;
        }
      }

      setShiftDetails(updatedShift);
      alert("Shift updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error saving shift:", error);
      alert("Failed to save shift.");
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
              <TouchableOpacity
                onPress={() => handleEmployeeSelect(item._id)}
                style={styles.employeeItemContainer}
              >
                <Text style={styles.employeeItemText}>
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
              <Text style={styles.label}>Fecha:</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.dateText}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <Modal
              transparent={true}
              animationType="slide"
              visible={isModalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.overlay}>
                <View style={styles.datePickerContainer}>
                  <DatePicker
                    selected={startDate}
                    onChange={onStartDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                  />
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {shiftDetails ? (
              <View style={styles.shiftDetailsContainer}>
                <Text style={styles.shiftDetailsText}>
                  Detalles del registro existente:
                </Text>

                <Text style={styles.label}>Modo del Turno:</Text>
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

                <Text style={styles.label}>Hora de Salida:</Text>
                <TextInput
                  style={styles.input}
                  value={shiftDetails.out}
                  onChangeText={(text) =>
                    setShiftDetails({ ...shiftDetails, out: text })
                  }
                />

                <Pressable style={styles.button} onPress={handleSaveShift}>
                  <Text style={styles.buttonText}>Actualizar Registro</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.shiftDetailsContainer}>
                <Text style={styles.shiftDetailsText}>
                  No hay registro Existente, estas por agregar uno nuevo:
                </Text>

                <Text style={styles.label}>Modo del Turno:</Text>
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
                  value={shiftDetails ? shiftDetails?.in : "00:00:00"}
                  onChangeText={(text) =>
                    setShiftDetails({ ...shiftDetails, in: text })
                  }
                />

                <Text style={styles.label}>Hora de Salida:</Text>
                <TextInput
                  style={styles.input}
                  value={shiftDetails ? shiftDetails?.out : "00:00:00"}
                  onChangeText={(text) =>
                    setShiftDetails({ ...shiftDetails, out: text })
                  }
                />

                <Pressable style={styles.button} onPress={handleSaveShift}>
                  <Text style={styles.buttonText}>Agregar Registro</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <Text style={{ color: "blue" }}>
            Por favor selecciona un empleado
          </Text>
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
    marginTop: "5%",
    marginHorizontal: "8%",
  },
  dateContainer: {
    marginBottom: 16,
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: "blue",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    color: "blue",
    fontSize: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 16 },
  employeeItemContainer: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  employeeItemText: {
    fontSize: 16,
    color: "#444",
  },
  employeeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#4CAF50",
  },
  dateContainer: {
    marginBottom: 16,
    alignItems: "center",
    width: "100%",
  },
  shiftDetailsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#e9f7ef",
    borderRadius: 8,
    width: "100%",
  },
  shiftDetailsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginVertical: 8,
    backgroundColor: "#fff",
    width: "100%",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 6,
  },
  info: { marginTop: 50 },
});

export default FixARecord;
