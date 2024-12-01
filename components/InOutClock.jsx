import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import axios from "axios";
import { RESP_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { format } from "date-fns-tz";
import { fetchLastShiftUid } from "../services/userShift/fetchShifts";

const InOutClock = ({ orgId }) => {
  const { userInfo } = useContext(AuthContext);
  const [org, setOrg] = useState(null);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [wasIn, setWasIn] = useState(false);

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
      const shiftData = await fetchLastShiftUid(userInfo?.user?.data?._id); // uid
      console.log("shiftData ", shiftData);
      if (shiftData?.in !== null && shiftData.out === null) {
        setWasIn(true);
      } else if (shiftData?.in == null && shiftData.out === null) {
        setWasIn(false);
      } else if (!shiftData) {
        console.error("no current shift found"); // Log en caso de que no haya turno
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
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

  const handleIngresoPress = async () => {
    const now = new Date();
    const currentInTime = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });
    setInTime(currentInTime);

    try {
      const response = await axios.post(
        `${RESP_URL}/api/shift/${userInfo.user._id}/${org._id}`,
        {
          inTime: currentInTime,
          shiftMode: "regular",
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
        window.location.reload();
      } else {
        console.log("Failed to create shift");
        Alert.alert("Error", "Failed to clock in. Please try again.");
      }
    } catch (error) {
      console.log("Error during handleIngresoPress:", error);
      Alert.alert(
        "Error",
        "An error occurred during clock in. Please try again."
      );
    }
  };

  const handleIngresoFeriadoPress = async () => {
    const now = new Date();
    const currentInTime = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });
    setInTime(currentInTime);

    try {
      const response = await axios.post(
        `${RESP_URL}/api/shift/${userInfo.user._id}/${org._id}`,
        {
          inTime: currentInTime,
          shiftMode: "holiday",
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
        window.location.reload();
      } else {
        console.log("Failed to create holiday shift");
        Alert.alert("Error", "Failed to clock in (holiday). Please try again.");
      }
    } catch (error) {
      console.log("Error during handleIngresoFeriadoPress:", error);
      Alert.alert(
        "Error",
        "An error occurred during holiday clock in. Please try again."
      );
    }
  };

  const handleEgresoPress = async () => {
    const now = new Date();
    const currentOutTime = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone,
    });
    setOutTime(currentOutTime);

    try {
      const response = await axios.put(
        `${RESP_URL}/api/shift/${userInfo.user._id}/${org._id}`,
        {
          outTime: currentOutTime,
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
        window.location.reload();

        setInTime(null);
        setOutTime(null);
      } else {
        console.log("Failed to complete shift");
        Alert.alert("Error", "Failed to clock out. Please try again.");
      }
    } catch (error) {
      console.log("Error during handleEgresoPress:", error);
      Alert.alert(
        "Error",
        "An error occurred during clock out. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
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
        <Text>cargando detalles...</Text>
      )}
      <Text>{new Date().toLocaleString()}</Text>
      {wasIn === false && (
        <View>
          <Pressable style={styles.actionBtn} onPress={handleIngresoPress}>
            <Text style={styles.actionText}>Ingreso</Text>
          </Pressable>
          <Pressable
            style={styles.actionBtn}
            onPress={handleIngresoFeriadoPress}
          >
            <Text style={styles.actionText}>Ingreso Feriado</Text>
          </Pressable>
        </View>
      )}
      {wasIn ===
        true(
          <Pressable style={styles.actionBtnL} onPress={handleEgresoPress}>
            <Text style={styles.actionText}>Egreso</Text>
          </Pressable>
        )}
    </View>
  );
};

export default InOutClock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  actionBtn: {
    width: "100%",
    marginVertical: 15,
    paddingVertical: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionBtnL: {
    width: "100%",
    marginVertical: 15,
    paddingVertical: 15,
    backgroundColor: "red",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
