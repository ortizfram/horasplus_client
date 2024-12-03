import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchOrganization from "../../services/organization/fetchOrganization";
import { fetchEmployees } from "../../services/organization/fetchEmployees";
import { fetchShiftWithId } from "../../services/userShift/fetchShifts";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ViewShot from "react-native-view-shot";

const DownloadReports = () => {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const { width } = useWindowDimensions();

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

  function decimalToHM(declaredMinutes = 0, padding = 20) {
    const hours = Math.floor(declaredMinutes / 60);
    const minutes = declaredMinutes % 60;
    return `${hours}h ${minutes}m`.padEnd(padding, " ");
  }

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
      let csvContent = `${"INFORMACION PRIVADA EMPLEADOR"}\n${"----------HORAS MAS----------"}\n\n${
        employee.firstname
      } ${employee.lastname}\n\n`;

      // Add headers with padding to ensure left alignment in CSV
      csvContent +=
        "Fecha, Feriado                ,Entrada            ,Salida            ,Horas              \n";

      const declared_hs = decimalToHM(employee.declared_hours);

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

          // Add shift data with padding for left alignment
          csvContent += `${updatedDate.padEnd(20)}${shiftMode.padEnd(
            20
          )}${shift.in.padEnd(20)}${shift.out.padEnd(
            20
          )}${shift.total_hours.padEnd(20)}\n`;
        });

        // Totals and final calculations
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

        // Summary line with padding for left alignment
        csvContent += `\nValor Hora,Viaticos,Premio,Feriados, Excedente Bono, Total,,Horas Bono\n`;
        csvContent += `$${hourlyFee.toFixed(2).padEnd(20)} , $${travelCost
          .toFixed(2)
          .padEnd(20)} , $${bonusPrize.toFixed(2).padEnd(20)} , $${holidayCost
          .toFixed(2)
          .padEnd(20)} , $${excedenteCost.toFixed(2).padEnd(20)} , $${totalFinal
          .toFixed(2)
          .padEnd(20)} ,, ${declared_hs}\n`;
        csvContent += `             ,,,,,,,Horas Excedente Bono\n`;
        csvContent += ` ,,,,,,,${excedenteHM.padEnd(20)}\n`;
        csvContent += `               ,,,,,,,Horas Totales\n`;
        csvContent += ` ,,,,,,,${workedHours}h ${remainingMinutes}m\n`;
      } catch (error) {
        console.error(
          `Error fetching shifts for employee ${employee._id}:`,
          error
        );
      }

      // Download the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${employee.firstname}_${employee.lastname}_desde_${fStartDate}_hasta_${fEndDate}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isMobile = width <= 768;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            <TouchableOpacity
              style={[
                styles.downloadButton,
                !isMobile
                  ? { marginVertical: 40, alignSelf: "center" }
                  : { marginVertical: 20 },
              ]}
              onPress={handleDownloadClick}
            >
              <Text style={styles.downloadButtonText}>Descargar</Text>
            </TouchableOpacity>
            <View
              style={[
                styles.datePickerContainer,
                !isMobile && styles.datePickerContainerLarge,
              ]}
            >
              <View
                style={[
                  styles.datePickerWrapper,
                  !isMobile && styles.datePickerWrapperLarge,
                ]}
              >
                <Text style={styles.label}>Seleccionar Fecha de Inicio</Text>
                <DatePicker
                  selected={startDate} // Asegúrate de pasar el estado actualizado
                  onChange={onStartDateChange}
                  style={[
                    styles.datePicker,
                    !isMobile && styles.datePickerLarge,
                  ]}
                />
              </View>
              <View
                style={[
                  styles.datePickerWrapper,
                  !isMobile && styles.datePickerWrapperLarge,
                ]}
              >
                <Text style={styles.label}>Seleccionar Fecha de Fin</Text>
                <DatePicker
                  selected={endDate} // Asegúrate de pasar el estado actualizado
                  onChange={onEndDateChange}
                  style={[
                    styles.datePicker,
                    !isMobile && styles.datePickerLarge,
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DownloadReports;

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    padding: 16,
    alignItems: "center",
    marginBottom: 80,
    marginTop: "5%",
    marginHorizontal: "8%",
  },
  // date pickers
  datePickerContainer: {
    marginVertical: 10,
    width: "100%",
  },
  datePickerContainerLarge: {
    flexDirection: "row", // Para colocar los `DatePickers` lado a lado
    justifyContent: "space-between",
  },
  datePickerWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  datePickerWrapperLarge: {
    flex: 1, // Ocupa igual espacio cuando están lado a lado
    marginHorizontal: 10,
    marginBottom: 0, // Elimina margen extra
  },
  datePicker: {
    alignSelf: "center",
    width: "100%",
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
  downloadButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  // date pickers end
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
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
    color: "#555",
  },
});
