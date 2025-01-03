import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity } from "react-native";
import ViewShot from "react-native-view-shot";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocalSearchParams } from "expo-router";
import EmployeeList from "../../components/verifyLocation/employeeList";
import EmployeeDetails from "../../components/verifyLocation/employeeDetails";
import ShiftDetails from "../../components/verifyLocation/shiftDetails";
import { fetchEmployees, fetchEmployeeWithId } from "../../services/organization/fetchEmployees";
import { fetchShift } from "../../services/userShift/fetchShifts";
import * as Location from 'expo-location'; 

const VerifyLocation = () => {
  const viewRef = useRef();
  const { empId: initialEmpId, orgId } = useLocalSearchParams();
  const [empId, setEmpId] = useState(initialEmpId);
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(true);
  const [shiftDetails, setShiftDetails] = useState(null);
  const [location, setLocation] = useState(null)
  const [startDate, setStartDate] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);

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
        const shiftData = await fetchShift(empId, startDate.toISOString().split("T")[0]);
        setShiftDetails(shiftData);
         // If location exists in shiftData, fetch the location details
         if (shiftData?.location) {
          const { latitude, longitude } = shiftData.location;
          // Reverse geocode to get a readable address (optional)
          const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
          const address = reverseGeocode[0]?.formattedAddress || 'Ubicacion no disponible';
          setLocation(address);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        if (error.response?.status === 404) {
          setShiftDetails({
            shift_mode: "NO EXISTE",
            in: "NO EXISTE",
            out: "NO EXISTE",
            location: "NO EXISTE",
          });
        } else {
          setShiftDetails(null); // Handle other errors
        }
      }
    };
    

    loadEmployees();
    if (empId) {
      loadEmployee();
      loadShiftForEmployee();
    }
  }, [empId, startDate]);

  const handleEmployeeSelect = (id) => {
    setEmpId(id);
    setShowEmployeeList(false);
  };

  const onStartDateChange = (date) => {
    setStartDate(date || startDate);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ViewShot ref={viewRef} style={styles.container}>
        <Text style={styles.title}>Controlar Ubicación de Marcación</Text>

        {showEmployeeList ? (
          <EmployeeList employees={employees} onSelect={handleEmployeeSelect} />
        ) : (
          <EmployeeDetails employee={employee} />
        )}

        {!showEmployeeList && (
          <>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Fecha:</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
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

            <ShiftDetails shiftDetails={shiftDetails} startDate={startDate} />
          </>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
    alignItems: "center",
  },
  dateContainer: {
    marginBottom: 16,
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    borderColor: "#25D366",  
    marginVertical: 5,
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
});

export default VerifyLocation;
