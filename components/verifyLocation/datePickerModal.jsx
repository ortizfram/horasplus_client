import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerModal = ({ visible, onClose, onChange, selectedDate }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <DatePicker
            selected={selectedDate}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  container: { backgroundColor: "white", padding: 20, borderRadius: 8, width: "80%", alignItems: "center" },
  closeButton: { marginTop: 10, color: "blue", fontSize: 16 },
});

export default DatePickerModal;
