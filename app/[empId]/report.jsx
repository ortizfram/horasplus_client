import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { fetchEmployeeWithId } from "../../services/organization/fetchEmployees";
import { fetchShiftWithId } from "../../services/userShift/fetchShifts";
import { useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import Logo from "../../components/Logo";

const Report = () => {
  const viewRef = useRef();
  const { empId } = useLocalSearchParams();
  const [employee, setEmployee] = useState({});
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

  const [horasBono, setHorasBono] = useState("0h 0m");

  const formatMinutesToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Función para formatear las fechas
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son de 0 a 11
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Formatear fechas de inicio y fin
  const fStartDate = formatDate(new Date(startDate));
  const fEndDate = formatDate(new Date(endDate));

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeWithId(empId);
        setEmployee(data);
        if (data.declared_hours) {
          setHorasBono(formatMinutesToHours(data.declared_hours));
        }
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

    loadEmployee();
    loadShiftForEmployee();
  }, [empId, startDate, endDate, bonus, advance]);

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

    // Sum up the total hours and minutes from the shifts
    shifts.forEach((shift) => {
      const [h, m] = shift.total_hours.split(" ");
      hours += parseInt(h.replace("h", ""));
      minutes += parseInt(m.replace("m", ""));

      if (shift.shift_mode === "holiday") {
        holidayMinutes +=
          parseInt(h.replace("h", "")) * 60 + parseInt(m.replace("m", ""));
      }
    });

    // Adjust hours and minutes
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    setTotalHours(hours);
    setTotalMinutes(minutes);

    const workedMinutes = hours * 60 + minutes;
    setWorkedTimeMinutes(workedMinutes);

    const hourlyFee = employee.hourly_fee || 0;
    const travelCost = employee.travel_cost || 0;
    const bonusPrize = employee.bonus_prize || 0; // Add bonus_prize

    const regularCost = (workedMinutes / 60) * hourlyFee;
    const holidayCostValue = (holidayMinutes / 60) * hourlyFee;
    setHolidayCost(Math.floor(holidayCostValue));

    // Calculating total cost (including bonus, advance, and bonus_prize)
    const totalCostValue =
      regularCost +
      holidayCostValue +
      travelCost +
      parseFloat(bonus) +
      parseFloat(bonusPrize) - // Include bonus_prize in total
      parseFloat(advance);

    setTotalCost(totalCostValue.toFixed(2));

    // Handle declared hours and excedente
    const declaredMinutes = employee.declared_hours || 0;
    const excedenteMinutes = workedMinutes - declaredMinutes;

    if (excedenteMinutes <= 0) {
      setExcedente("0h 0m");
      setExcedenteCost("0");
      return; // No excedente if worked time is less than declared time
    }

    // Convert excedenteMinutes to hours and minutes
    const excedenteHours = Math.floor(excedenteMinutes / 60);
    const excedenteRemainingMinutes = excedenteMinutes % 60;
    setExcedente(`${excedenteHours}h ${excedenteRemainingMinutes}m`);

    setExcedenteMin(convertExcedenteToMinutes(excedente));

    setExcedenteCost(
      (
        (excedenteHours * 60 + excedenteRemainingMinutes) * (hourlyFee / 60) +
        travelCost
      ).toFixed(2)
    );
  };

  // Método para descargar o compartir el reporte según la plataforma
  const downloadReport = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });

      console.log("Reporte generado en:", uri);

      if (Platform.OS === "web") {
        downloadWeb(uri);
      } else {
        await downloadMobile(uri);
      }
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
      Alert.alert("Error", "No se pudo descargar el reporte.");
    }
  };

  // Lógica específica para descarga en web
  const downloadWeb = (uri) => {
    const link = document.createElement("a");
    link.href = uri;
    link.download = `${employee.firstname}_${employee.lastname}_desde_${fStartDate}_hasta_${fEndDate}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Reporte descargado en Web");
  };

  // Lógica específica para iOS y Android
  const downloadMobile = async (uri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Se requiere permiso para guardar el archivo."
      );
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}${employee.firstname}_${employee.lastname}_desde_${fStartDate}_hasta_${fEndDate}.png`;

    // Guardar el archivo en el sistema de archivos local
    await FileSystem.copyAsync({
      from: uri,
      to: fileUri,
    });

    if (Platform.OS === "ios") {
      // Usar el componente de compartir para iOS
      await Sharing.shareAsync(fileUri);
    } else {
      // Guardar el archivo en la galería en Android
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Reportes", asset, false);
      Alert.alert(
        "Reporte Guardado",
        "El reporte se ha guardado en tu galería."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ViewShot ref={viewRef} style={styles.container}>
        <Text style={styles.title}>Reporte de Horas</Text>
        <Text style={styles.title}>INFORMACION PRIVADA EMPLEADOR</Text>
        <View style={styles.titleContainer}>
          <Logo />
          {/* <Text style={styles.title}>----------HORAS PLUS----------</Text> */}
        </View>
        <Text style={styles.title}>
          {employee?.firstname && employee?.lastname ? (
            <Text style={styles.employeeText}>
              {employee?.firstname} {employee?.lastname}
            </Text>
          ) : (
            <Text style={styles.employeeText}>{employee?.email}</Text>
          )}
        </Text>

        {employee && employee.email ? (
          <View>
            <View style={styles.reportContainer}>
              <Text style={styles.title}>
                Horas Totales: {totalHours}h {totalMinutes}m
              </Text>

              <Text style={styles.detailsText}>
                Valor Hora: ${employee.hourly_fee || 0} | Viaticos: $
                {employee.travel_cost || 0} | Premio: $
                {employee.bonus_prize || 0} | Horas Bono : {horasBono} | Horas
                Excedente Bono : {excedente} | Feriados: ${holidayCost || 0}
              </Text>

              <Text style={styles.excedenteText}>
                Excedente Bono: ${excedenteCost}
              </Text>

              <Text style={styles.totalText}>Total: ${totalCost}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>
            No se encontraron datos del empleado
          </Text>
        )}

        {Platform.OS !== "web" && (
          <View style={styles.buttonContainer}>
            {" "}
            {/* Centering container */}
            <Pressable
              style={styles.button}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.buttonText}>Seleccionar Fecha de Inicio</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.buttonText}>Seleccionar Fecha de Fin</Text>
            </Pressable>
          </View>
        )}

        {showStartDatePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        {showEndDatePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}

        {Platform.OS === "web" && (
          <View style={styles.datePickerContainer}>
            {" "}
            {/* Centering for web */}
            <Text style={styles.label}>Seleccionar Fecha de Inicio</Text>
            <DatePicker selected={startDate} onChange={onStartDateChange} />
            <Text style={styles.label}>Seleccionar Fecha de Fin</Text>
            <DatePicker selected={endDate} onChange={onEndDateChange} />
          </View>
        )}

        {shifts.length > 0 && (
          <Pressable style={styles.downloadButton} onPress={downloadReport}>
            <Text style={styles.downloadButtonText}>Descargar Reporte</Text>
          </Pressable>
        )}
        {shifts.length > 0 ? (
          shifts.map((shift, index) => {
            console.log(
              "Original shift.date:",
              shift.date,
              "type:",
              typeof shift.date
            ); // Log date and its type

            // Split the date and increment the day portion
            const [day, month, year] = shift.date.split("/");
            const incrementedDay = String(parseInt(day) + 1).padStart(2, "0"); // Add 1 to the day, ensuring it's two digits
            const updatedDate = `${incrementedDay}/${month}/${year}`;

            console.log("Updated shift.date:", updatedDate); // Log the updated date

            return (
              <View key={index} style={styles.shiftContainer}>
                <View
                  style={
                    shift.shift_mode === "holiday" ? styles.star : styles.circle
                  }
                >
                  <Text
                    style={
                      shift.shift_mode === "holiday"
                        ? styles.starText
                        : styles.circleText
                    }
                  >
                    {shift.shift_mode === "holiday" ? "F" : "R"}
                  </Text>
                </View>
                <Text style={styles.shiftText}>
                  {updatedDate} - <Text style={styles.inText}>{shift.in}</Text>{" "}
                  - <Text style={styles.outText}>{shift.out}</Text> - Horas:{" "}
                  {shift.total_hours}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.errorText}></Text>
        )}
      </ViewShot>
    </ScrollView>
  );
};

export default Report;
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 15, // Reduced padding
  //   backgroundColor: "#f5f5f5",
  //   marginBottom: 80,
  //   marginTop: "8%",
  //   marginHorizontal: "5%",
  //   marginStart: "8%",
  // },
  scrollContainer: { flexGrow: 1 },
  container: {
    padding: 16,
    alignItems: "center",
    marginBottom: 80,
    marginTop: "5%",
    marginHorizontal: "8%",
  },
  shiftContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the contents horizontally
    alignItems: "center", // Vertically center the content if needed
    marginBottom: 15,
  },

  smallImage: {
    width: "100%", // Makes the image take full width of the container
    maxWidth: 600, // Set a max width to prevent it from becoming too large
    height: 240,
    alignSelf: "center", // Center the image horizontally
    marginBottom: 15, // Optional: Add spacing below the image
  },

  star: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  downloadButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#4caf50",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  downloadButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  starText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  circleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  shiftText: {
    fontSize: 16,
    color: "#333",
  },
  inText: {
    color: "green",
    fontWeight: "bold",
  },
  outText: {
    color: "red",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5, // Reduced vertical space
  },
  datePickerContainer: {
    alignItems: "center",
    marginVertical: 5, // Reduced vertical space
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15, // Reduced margin
    textAlign: "center",
  },
  employeeText: {
    fontSize: 18,
    marginBottom: 5, // Reduced margin
    textAlign: "center",
  },
  largeText: {
    fontSize: 28, // Slightly smaller size
    marginTop: 5, // Reduced margin
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 5, // Reduced margin
    textAlign: "center",
  },
  editableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5, // Reduced margin
  },
  label: {
    fontSize: 16, // Slightly smaller size
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8, // Reduced padding
    fontSize: 16,
    height: 35, // Slightly smaller height
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 15, // Reduced padding
    borderRadius: 5,
    marginTop: 5, // Reduced margin
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  shiftText: {
    fontSize: 14, // Slightly smaller size
    marginVertical: 4, // Reduced margin
    textAlign: "center",
  },
  shiftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4, // Reduced margin
  },
  circle: {
    width: 25, // Slightly smaller size
    height: 25, // Slightly smaller size
    borderRadius: 12.5, // Adjusted for new size
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8, // Reduced margin
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, // Slightly smaller size
  },
  star: {
    width: 25, // Slightly smaller size
    height: 25, // Slightly smaller size
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8, // Reduced margin
    backgroundColor: "yellow",
    borderRadius: 12.5, // Adjusted for new size
    overflow: "hidden",
    position: "relative",
  },
  starText: {
    color: "black",
    fontSize: 16, // Slightly smaller size
    fontWeight: "900",
    position: "absolute",
    top: "15%",
    left: "35%",
  },
  excedenteText: {
    fontSize: 16, // Smaller font size for excedente
    color: "gray", // Optional color to differentiate
    textAlign: "center",
    marginTop: 10, // Add space above
  },
  reportContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  detailsText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  editableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    flex: 2,
    marginLeft: 10,
  },
  excedenteText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#c00",
  },
  totalText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28a745",
  },
});
