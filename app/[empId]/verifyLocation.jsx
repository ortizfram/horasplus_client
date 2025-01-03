import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import ViewShot from "react-native-view-shot";
import { useLocalSearchParams } from "expo-router";
import EmployeeList from "../../components/verifyLocation/employeeList";
import EmployeeDetails from "../../components/verifyLocation/employeeDetails";
import ShiftDetails from "../../components/verifyLocation/shiftDetails";
import DatePickerModal from "../../components/verifyLocation/datePickerModal";
import {
  fetchEmployees,
  fetchEmployeeWithId,
} from "../../services/organization/fetchEmployees";
import { fetchShift } from "../../services/userShift/fetchShifts";

const VerifyLocation = () => {
  const viewRef = useRef();
  const { empId: initialEmpId, orgId } = useLocalSearchParams();
  const [empId, setEmpId] = useState(initialEmpId);
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(true);
  const [shiftDetails, setShiftDetails] = useState(null);
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

  const handleEmployeeSelect = (id) => {
    setEmpId(id);
    setShowEmployeeList(false);
  };

  const onStartDateChange = (event, selectedDate) => {
    setStartDate(selectedDate || startDate);
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
            <DatePickerModal
              isVisible={isModalVisible}
              date={startDate}
              onChange={onStartDateChange}
              onClose={() => setModalVisible(false)}
            />

            <ShiftDetails
              shiftDetails={shiftDetails}
              setShiftDetails={setShiftDetails}
              startDate={startDate}
              empId={empId}
            />
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
});

export default VerifyLocation;
