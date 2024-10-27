import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { fetchEmployees, fetchEmployeeWithId } from "../../services/organization/fetchEmployees";
import { fetchShiftWithId } from "../../services/userShift/fetchShifts";
import { useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

const FixARecord = () => {
  const viewRef = useRef();
  const { empId: initialEmpId, orgId } = useLocalSearchParams();
  const [empId, setEmpId] = useState(initialEmpId);
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);
  const [holidayCost, setHolidayCost] = useState(0);
  const [excedente, setExcedente] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [excedenteCost, setExcedenteCost] = useState(0);
  const [workedTimeMinutes, setWorkedTimeMinutes] = useState(0);
  const [excedenteMin, setExcedenteMin] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [advance, setAdvance] = useState(0);

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
        const data = await fetchShiftWithId(
          empId,
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        );
        setShifts(data);
        calculateTotalHours(data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    loadEmployees();
    if (empId) {
      loadEmployee();
      loadShiftForEmployee();
    }
  }, [empId, startDate, endDate, bonus, advance]);

  const handleEmployeeSelect = (id) => {
    setEmpId(id);
  };

  const onStartDateChange = (event, selectedDate) => {
    if (Platform.OS === "web") {
      setStartDate(event);
    } else {
      const currentDate = selectedDate || startDate;
      setShowStartDatePicker(Platform.OS === "ios");
      setStartDate(currentDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    if (Platform.OS === "web") {
      setEndDate(event);
    } else {
      const currentDate = selectedDate || endDate;
      setShowEndDatePicker(Platform.OS === "ios");
      setEndDate(currentDate);
    }
  };

  const convertExcedenteToMinutes = (excedenteString) => {
    const [hoursPart, minutesPart] = excedenteString.split(" ");
    const hours = parseInt(hoursPart.replace("h", ""), 10) || 0;
    const minutes = parseInt(minutesPart.replace("m", ""), 10) || 0;
    return hours * 60 + minutes;
  };

  const calculateTotalHours = (shifts) => {
    let hours = 0;
    let minutes = 0;
    let holidayMinutes = 0;

    shifts.forEach((shift) => {
      const [h, m] = shift.total_hours.split(" ");
      hours += parseInt(h.replace("h", ""));
      minutes += parseInt(m.replace("m", ""));

      if (shift.shift_mode === "holiday") {
        holidayMinutes += parseInt(h.replace("h", "")) * 60 + parseInt(m.replace("m", ""));
      }
    });

    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
    setTotalHours(hours);
    setTotalMinutes(minutes);

    const workedMinutes = hours * 60 + minutes;
    setWorkedTimeMinutes(workedMinutes);

    const hourlyFee = employee.hourly_fee || 0;
    const travelCost = employee.travel_cost || 0;
    const bonusPrize = employee.bonus_prize || 0;

    const regularCost = (workedMinutes / 60) * hourlyFee;
    const holidayCostValue = (holidayMinutes / 60) * hourlyFee;
    setHolidayCost(Math.floor(holidayCostValue));

    const totalCostValue = regularCost + holidayCostValue + travelCost + parseFloat(bonus) + parseFloat(bonusPrize) - parseFloat(advance);
    setTotalCost(totalCostValue.toFixed(2));

    const declaredMinutes = employee.declared_hours || 0;
    const excedenteMinutes = workedMinutes - declaredMinutes;

    if (excedenteMinutes <= 0) {
      setExcedente("0h 0m");
      setExcedenteCost("0");
      return;
    }

    const excedenteHours = Math.floor(excedenteMinutes / 60);
    const excedenteRemainingMinutes = excedenteMinutes % 60;
    setExcedente(`${excedenteHours}h ${excedenteRemainingMinutes}m`);

    setExcedenteMin(convertExcedenteToMinutes(excedente));

    setExcedenteCost(Math.floor(excedenteMin * (employee.hourly_fee / 60) + employee.travel_cost));
  };

  const downloadReport = async () => {
    try {
      const uri = await captureRef(viewRef, { format: "png", quality: 0.8 });
      if (Platform.OS === "web") {
        downloadWeb(uri);
      } else {
        await downloadMobile(uri);
      }
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
    }
  };

  const downloadWeb = (uri) => {
    const link = document.createElement("a");
    link.href = uri;
    link.download = "reporte.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadMobile = async (uri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se requiere permiso para guardar el archivo.");
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}reporte.png`;
    await FileSystem.copyAsync({ from: uri, to: fileUri });

    if (Platform.OS === "ios") {
      await Sharing.shareAsync(fileUri);
    } else {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Reportes", asset, false);
      Alert.alert("Reporte Guardado", "El reporte se ha guardado en tu galería.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ViewShot ref={viewRef} style={styles.container}>
        <Text style={styles.title}>Corrige un Registro</Text>

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

        {employee && employee.email ? (
          <View>
            <Text style={styles.employeeText}>
              {employee.firstname} {employee.lastname}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Bono"
              value={bonus}
              onChangeText={setBonus}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Adelanto"
              value={advance}
              onChangeText={setAdvance}
              keyboardType="numeric"
            />

            {/* Date Picker Component */}
            <View style={styles.dateContainer}>
              <Text>Fecha de inicio:</Text>
              {Platform.OS === "web" ? (
                <DatePicker
                  selected={startDate}
                  onChange={onStartDateChange}
                  dateFormat="dd/MM/yyyy"
                />
              ) : (
                <Pressable onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.dateText}>
                    {startDate.toLocaleDateString()}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Date Picker Component */}
            <View style={styles.dateContainer}>
              <Text>Fecha de fin:</Text>
              {Platform.OS === "web" ? (
                <DatePicker
                  selected={endDate}
                  onChange={onEndDateChange}
                  dateFormat="dd/MM/yyyy"
                />
              ) : (
                <Pressable onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.dateText}>
                    {endDate.toLocaleDateString()}
                  </Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.info}>Horas trabajadas: {totalHours}h {totalMinutes}m</Text>
            <Text style={styles.info}>Excedente: {excedente}</Text>
            <Text style={styles.info}>Costo total: ${totalCost}</Text>

            <Pressable onPress={downloadReport} style={styles.button}>
              <Text style={styles.buttonText}>Descargar reporte</Text>
            </Pressable>
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
  container: { padding: 16, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  employeeItem: { fontSize: 16, padding: 8, backgroundColor: "#f0f0f0", marginVertical: 4 },
  employeeText: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, width: "100%", marginVertical: 8 },
  dateContainer: { marginBottom: 16, alignItems: "center" },
  dateText: { fontSize: 16, color: "blue" },
  info: { fontSize: 16, marginVertical: 4 },
  button: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 8, marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});

export default FixARecord;
