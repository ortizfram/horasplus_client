import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchOrganization from "../../services/organization/fetchOrganization";
import { fetchEmployees } from "../../services/organization/fetchEmployees";
import { fetchShiftWithId } from "../../services/userShift/fetchShifts";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DownloadReports = () => {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await fetchOrganization(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    };

    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees(orgId);
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadOrganization();
    loadEmployees();
  }, [orgId]);

  const onStartDateChange = (event, selectedDate) => {
    if (Platform.OS === "web") {
      // For web, selectedDate is passed directly
      setStartDate(event); // The 'event' is the date selected in react-datepicker for web
    } else {
      const currentDate = selectedDate || startDate;
      setStartDate(currentDate);
      setShowStartDatePicker(Platform.OS === "ios");
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    if (Platform.OS === "web") {
      // For web, selectedDate is passed directly
      setEndDate(event); // The 'event' is the date selected in react-datepicker for web
    } else {
      const currentDate = selectedDate || endDate;
      setEndDate(currentDate);
      setShowEndDatePicker(Platform.OS === "ios");
    }
  };

  const handleDownloadClick = async () => {
    for (let employee of employees) {
      let csvContent = `${"INFORMACION PRIVADA EMPLEADOR"}\n${"----------HORAS PLUS----------"}\n\n${
        employee.firstname
      } ${employee.lastname}\n\n`;

      csvContent += "Fecha,Entrada,Salida,Horas,Feriado\n"; // Updated CSV headers

      try {
        const shiftsData = await fetchShiftWithId(
          employee._id,
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        );

        let totalWorkedMinutes = 0;
        let holidayCost = 0;

        shiftsData.forEach((shift) => {
          const [h, m] = shift.total_hours.split(" ");
          const hours = parseInt(h.replace("h", ""), 10) || 0;
          const minutes = parseInt(m.replace("m", ""), 10) || 0;
          const shiftMinutes = hours * 60 + minutes;
          totalWorkedMinutes += shiftMinutes;

          // Increment the day in shift.date
          const [day, month, year] = shift.date.split("/");
          const incrementedDay = String(parseInt(day) + 1).padStart(2, "0"); // Increment and pad day
          const updatedDate = `${incrementedDay}/${month}/${year}`;

          const shiftMode = shift?.shift_mode === "holiday" ? "Si" : "";

          const shiftCost =
            shift.shift_mode === "holiday"
              ? hours * (employee.hourly_fee || 0)
              : 0;
          holidayCost += shiftCost;

          csvContent += `${updatedDate},${shift.in},${shift.out},${shift.total_hours},${shiftMode},,\n`;
        });

        // Totales y cálculos finales
        const workedHours = Math.floor(totalWorkedMinutes / 60);
        const remainingMinutes = totalWorkedMinutes % 60;
        const hourlyFee = employee.hourly_fee || 0;
        const travelCost = employee.travel_cost || 0;
        const bonusPrize = employee.bonus_prize || 0;

        const declaredMinutes = employee.declared_hours || 0;
        const excedenteMinutes = Math.max(
          0,
          totalWorkedMinutes - declaredMinutes
        );
        const excedenteCost = Math.floor(
          excedenteMinutes * (hourlyFee / 60) + travelCost
        );
        const excedenteHours = Math.floor(excedenteMinutes / 60); // Get the integer number of hours
        const excedenteRemainingMinutes = Math.round(excedenteMinutes % 60); // Get the remaining minutes

        const excedenteHM = `${excedenteHours}h ${excedenteRemainingMinutes}m`;

        const totalFinal =
          (totalWorkedMinutes / 60) * hourlyFee +
          holidayCost +
          travelCost +
          parseFloat(bonusPrize);

        // Línea de resumen para el empleado
        csvContent += `\n
        Valor Hora,,,Horas Bono
        $${hourlyFee},,,${employee.declared_hours ? employee.declared_hours / 60 : ""}
        Viaticos,,,Horas Excedente Bono
        $${travelCost},,,${excedenteHM}
        Premio,,,Horas Totales
        $${bonusPrize},,,${workedHours}h ${remainingMinutes}m
        Feriados,,,
        $${holidayCost}
        Excedente Bono,,,
        $${excedenteCost}
        Total,,,
        $${totalFinal.toFixed(
          2
        )}
        ----------------------------------------\n`;
      } catch (error) {
        console.error(
          `Error fetching shifts for employee ${employee._id}:`,
          error
        );
      }

      // Descargar el archivo CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${employee.firstname}_${employee.lastname}_${
          startDate.toISOString().split("T")[0]
        }_${endDate.toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Descargar reporte mensual de {organization?.name}
      </Text>
      <Text>
        Selecciona las fechas para filtrar los reportes haciendo doble click
        para mostrar el calendario
      </Text>
      {organization && (
        <View style={{ marginTop: 10 }}>
          {Platform.OS !== "web" && (
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.button}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.buttonText}>
                  Seleccionar Fecha de Inicio
                </Text>
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
              style={styles.datePicker}
            />
          )}

          {showEndDatePicker && Platform.OS !== "web" && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
              style={styles.datePicker}
            />
          )}

          {Platform.OS === "web" && (
            <View style={styles.datePickerContainer}>
              <Text style={styles.label}>Seleccionar Fecha de Inicio</Text>
              <View style={styles.datePickerWrapper}>
                <DatePicker
                  selected={startDate}
                  onChange={onStartDateChange}
                  style={styles.datePicker}
                />
              </View>
              <Text style={styles.label}>Seleccionar Fecha de Fin</Text>
              <View style={styles.datePickerWrapper}>
                <DatePicker
                  selected={endDate}
                  onChange={onEndDateChange}
                  style={styles.datePicker}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadClick}
          >
            <Text style={styles.downloadButtonText}>Descargar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DownloadReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 80,
    marginTop: "10%",
    marginHorizontal: "15%",
  },
  // date pickers
  datePickerContainer: {
    marginVertical: 10,
  },
  datePickerWrapper: {
    position: "relative",
  },
  datePicker: {
    position: "absolute",
    top: 0, // Adjust as needed
    left: 0,
    zIndex: 1, // Keep above other content when open
  },
  downloadButton: {
    marginTop: 40, // Increase margin to ensure distance from date pickers
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "36%",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // date pickers end
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
});
