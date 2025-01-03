import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const ShiftDetails = ({ shiftDetails, shiftType }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  return (
    <View>
      <Text style={styles.label}>Modo del Turno:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={shiftDetails.shift_mode || shiftType}
        editable={false}
      />

      <Text style={styles.label}>Hora de Ingreso:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={shiftDetails.in || "No disponible"}
        editable={false}
      />

      <Text style={styles.label}>Hora de Salida:</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={shiftDetails.out || "No disponible"}
        editable={false}
      />

      <Text style={styles.label}>Ubicación del Registro:</Text>
      <View style={{ height: 200, marginVertical: 10 }}>
        {location ? (
          <MapView
            style={{ flex: 1 }}
            initialRegion={location}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Ubicación Actual"
            />
          </MapView>
        ) : (
          <Text style={{ textAlign: "center", color: "gray" }}>
            {errorMsg || "Cargando mapa..."}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ShiftDetails;
