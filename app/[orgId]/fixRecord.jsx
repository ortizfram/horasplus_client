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
  };

  const handleSaveShift = async () => {
    try {
      const { in: inTime, out: outTime } = shiftDetails;
      const updatedShift = await updateShift(
        empId,
        startDate.toISOString().split("T")[0],
        inTime,
        outTime,
        shiftType
      );
      setShiftDetails(updatedShift);
      alert("Shift updated successfully!");
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
              <DatePicker
                selected={startDate}
                onChange={onStartDateChange}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
              />
            </View>

            {shiftDetails ? (
              <View style={styles.shiftDetailsContainer}>
                <Text style={styles.shiftDetailsText}>Detalles:</Text>

                <Text style={styles.label}>Modo del Turno:</Text>
                <Picker
                  selectedValue={shiftType}
                  style={styles.picker}
                  onValueChange={(itemValue) => setShiftType(itemValue)}
                >
                  <Picker.Item label="Regular" value="regular" />
                  <Picker.Item label="Holiday" value="holiday" />
                </Picker>

                <Text style={styles.label}>Start Time:</Text>
                <TextInput
                  style={styles.input}
                  value={shiftDetails.in}
                  onChangeText={(text) =>
                    setShiftDetails({ ...shiftDetails, in: text })
                  }
                />

                <Text style={styles.label}>End Time:</Text>
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
              <Text style={styles.info}></Text>
            )}
          </View>
        ) : (
          <Text style={{color:"blue"}}>Por favor selecciona un empleado</Text>
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
  info:{marginTop:50}
});

export default FixARecord;
