import axios from "axios";
import { RESP_URL } from "../../config";

export const fetchShiftWithId = async (uid, startDate, endDate) => {
  try {
    const response = await axios.get(`${RESP_URL}/api/shift/${uid}`, {
      params: { startDate, endDate }, // Send the start and end dates as query parameters
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shift Id:", error);
    throw error;
  }
};
export const fetchShift = async (empId, selectedDate) => {
  try {
    const response = await axios.get(`${RESP_URL}/api/shift/${empId}/fetch`, {
      params: { date: selectedDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shift:", error);
    throw error;
  }
};

export const updateShift = async (empId, selectedDate, inTime, outTime,mode) => {
  try {
    const response = await axios.put(`${RESP_URL}/api/shift/${empId}`, {
      date: selectedDate,
      inTime,
      outTime,
      mode
    });
    return response.data.shift;
  } catch (error) {
    console.error("Error updating shift:", error);
    throw error;
  }
};
