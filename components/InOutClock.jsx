import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Image, Alert } from "react-native";
import axios from "axios";
import { RESP_URL, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } from "../config";
import { AuthContext } from "../context/AuthContext";
import { format } from "date-fns-tz";
import { fetchLastShiftUid } from "../services/userShift/fetchShifts";
import * as Location from "expo-location";
import LoadingIndicator from "./organizationListIndex/LoadingIndicator";
import { getDistance } from "geolib";
import { toast, ToastContainer } from "react-toastify";
// import Twilio  from "twilio";

const InOutClock = ({ orgId, setShowSearch }) => {
  const { userInfo } = useContext(AuthContext);
  const [org, setOrg] = useState(null);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [wasIn, setWasIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screenMessage, setScreenMessage] = useState(null);
  // const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


  const fetchOrg = async () => {
    try {
      const response = await axios.get(
        `${RESP_URL}/api/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const foundOrg = response.data;
      setOrg(foundOrg);
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
    }
  };

  const loadCurrentShift = async () => {
    try {
      const shiftData = await fetchLastShiftUid(userInfo?.user?.data?._id);

      console.log("Shift Data:", shiftData);
      if (shiftData?.in && !shiftData?.out) {
        setWasIn(true);
      } else if (!shiftData?.in && !shiftData?.out) {
        setWasIn(false);
      }

      if (shiftData?.total_hours) {
        console.log("Total Hours:", shiftData.total_hours);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchOrg();
      await loadCurrentShift();
    };

    initialize();
  }, []);

  const timeZone = "America/Argentina/Buenos_Aires";

  const showScreenMessage = (message, color) => {
    setScreenMessage({ message, color });
    setTimeout(() => setScreenMessage(null), 4000);
  };

  const orgLocation = org
    ? { latitude: org.latitude, longitude: org.longitude }
    : null;

  const validarUbicacionAlerta = async (currentLocation, orgLocation) => {
    if (!orgLocation || !orgLocation.latitude || !orgLocation.longitude) {
      toast.error("No se encontraron coordenadas válidas del establecimiento.");
      return;
    }

    const { latitude_in, longitude_in, latitude_out, longitude_out } =
      currentLocation;
    const coords =
      latitude_in && longitude_in
        ? { latitude: latitude_in, longitude: longitude_in }
        : { latitude: latitude_out, longitude: longitude_out };

    if (!coords.latitude || !coords.longitude) {
      toast.error("No se encontraron coordenadas válidas.");
      return;
    }

    const distance = getDistance(coords, {
      latitude: orgLocation.latitude,
      longitude: orgLocation.longitude,
    });

    // toast(
    //   distance > 300
    //     ? `HorasMas | Error: ${userInfo?.user?.data?.firstname} ${userInfo?.user?.data?.lastname} ingresó a ${orgName} más de 300 metros del establecimiento.`
    //     : `HorasMas | Éxito: ${userInfo?.user?.data?.firstname} ${userInfo?.user?.data?.lastname} ingresó a ${orgName} a menos de 300 metros del establecimiento.`
    // );

    const message =
      distance > 300
        ? `Error: ${userInfo?.user?.data?.firstname} ${userInfo?.user?.data?.lastname} ingresó a ${orgName} más de 300 metros del establecimiento.`
        : `Éxito: ${userInfo?.user?.data?.firstname} ${userInfo?.user?.data?.lastname} ingresó a ${orgName} a menos de 300 metros del establecimiento.`;



    const orgAdminCellphones = org.admin_celphones.map((number) => number);
    orgAdminCellphones.forEach((phone) => {
      // client.messages
      //   .create({
      //     body: message,
      //     to: phone, // Text this number
      //     from: TWILIO_PHONE, // From a valid Twilio number
      //   })
      //   .then((message) => console.log(message.sid))
      //   .catch((error) => console.error(error));
      console.log("Message sent to:", phone);
    });
  };

  const handleIngresoPress = async () => {
    setLoading(true);
    const now = new Date();
    const currentInTime = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const currentLocation = {
        latitude_in: location.coords.latitude,
        longitude_in: location.coords.longitude,
      };

      setInTime(currentInTime);

      const response = await axios.post(
        `${RESP_URL}/api/shift/${userInfo.user._id}/${org._id}`,
        {
          inTime: currentInTime,
          shiftMode: "regular",
          location: currentLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Ingresaste OK");
        setLoading(false);
        validarUbicacionAlerta(currentLocation, orgLocation);
        showScreenMessage("INGRESASTE", "green");
        setWasIn(true);
      } else {
        Alert.alert("Error", "Failed to clock in. Please try again.");
      }
    } catch (error) {
      console.log("Error during handleIngresoPress:", error);
      Alert.alert(
        "Error",
        "An error occurred during clock in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleIngresoFeriadoPress = async () => {
    setLoading(true);
    const now = new Date();
    const currentInTime = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });
    setInTime(currentInTime);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude_in: location.coords.latitude,
        longitude_in: location.coords.longitude,
      };

      const response = await axios.post(
        `${RESP_URL}/api/shift/${userInfo.user._id}/${org._id}`,
        {
          inTime: currentInTime,
          shiftMode: "holiday",
          location: currentLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("IngresasteFeriado OK");
        setLoading(false);
        validarUbicacionAlerta(currentLocation, orgLocation);
        showScreenMessage("INGRESASTE", "green");
        setWasIn(true);
      } else {
        Alert.alert("Error", "Failed to clock in (holiday). Please try again.");
      }
    } catch (error) {
      console.log("Error during handleIngresoFeriadoPress:", error);
      Alert.alert(
        "Error",
        "An error occurred during holiday clock in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEgresoPress = async () => {
    setLoading(true);
    const now = new Date();
    const currentOutTime = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone,
    });
    setOutTime(currentOutTime);

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude_out: location.coords.latitude,
        longitude_out: location.coords.longitude,
      };

      // Send clock-out data
      const response = await axios.put(
        `${RESP_URL}/api/shift/${userInfo.user._id}/${org._id}`,
        {
          outTime: currentOutTime,
          location: currentLocation, // Include location data
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Egresaste OK");
        setLoading(false);
        validarUbicacionAlerta(currentLocation, orgLocation);
        showScreenMessage("SALISTE", "red");
        setWasIn(false);
        setInTime(null);
        setOutTime(null);
      } else {
        Alert.alert("Error", "Failed to clock out. Please try again.");
      }
    } catch (error) {
      console.log("Error during handleEgresoPress:", error);
      Alert.alert(
        "Error",
        "An error occurred during clock out. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ToastContainer />
      {screenMessage && (
        <View
          style={[
            styles.messageOverlay,
            { backgroundColor: screenMessage.color },
          ]}
        >
          <Text style={styles.messageText}>{screenMessage.message}</Text>
        </View>
      )}

      {org ? (
        <>
          <Image
            source={
              org.image
                ? { uri: `${RESP_URL}/${org.image}` }
                : require("../assets/images/org_placeholder.jpg")
            }
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>{org.name}</Text>
        </>
      ) : (
        <Text>Cargando detalles...</Text>
      )}

      {loading ? (
        <LoadingIndicator color="#007bff" />
      ) : (
        <>
          {wasIn === false && (
            <View>
              <Pressable
                style={styles.actionBtn}
                onPress={handleIngresoPress}
                disabled={loading}
              >
                <Text style={styles.actionText}>Ingreso</Text>
              </Pressable>
              <Pressable
                style={styles.actionBtn}
                onPress={handleIngresoFeriadoPress}
                disabled={loading}
              >
                <Text style={styles.actionText}>Ingreso Feriado</Text>
              </Pressable>
            </View>
          )}
          {wasIn === true && (
            <Pressable
              style={styles.actionBtnL}
              onPress={handleEgresoPress}
              disabled={loading}
            >
              <Text style={styles.actionText}>Egreso</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.switchButton}
            onPress={() => setShowSearch(true)}
          >
            <Text style={styles.switchButtonTextChange}>
              Hoy estoy en otro establecimiento
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default InOutClock;

const styles = StyleSheet.create({
  messageOverlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    padding: 10,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  switchButtonTextChange: {
    color: "#007bff",
    fontSize: 14,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  switchButton: {
    marginTop: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: 120, // Adjust width as needed
    height: 120, // Adjust height as needed
    borderRadius: 60, // Makes the image circular
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  actionBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  actionBtnIN: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 14,
  },
  actionBtnL: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
