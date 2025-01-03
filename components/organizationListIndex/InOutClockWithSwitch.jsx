import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import InOutClock from "../../components/InOutClock";
import SearchOrganization from "../../components/searchOrganization";

export default function InOutClockWithSwitch({
  userInfo,
  setShowSearch,
  handleSelectOrg,
}) {
  const hasOrganization = !!userInfo?.user?.data?.organization_id;

  return (
    <View>
      {hasOrganization ? (
        <>
          <InOutClock orgId={userInfo?.user?.data?.organization_id} />
          <Pressable
            style={styles.switchButton}
            onPress={() => setShowSearch(true)}
          >
            <Text style={styles.switchButtonText}>
              Hoy estoy en otro establecimiento
            </Text>
          </Pressable>
        </>
      ) : (
        <View>
          {!userInfo?.user?.isAdmin && !userInfo?.user?.isSuperAdmin ? (
            <Text style={styles.infoText}>
              Busca el nombre de la organización o nombre del dueño, para enviar
              la solicitud y ser parte de la organización
            </Text>
          ) : (
            <Text style={styles.infoText}>
              Busca el nombre de tu organización o seleccionala para ingresar
            </Text>
          )}
          <SearchOrganization
            userId={userInfo?.user?.data?._id}
            token={userInfo.token}
            onSelectOrg={handleSelectOrg}
            isAdmin={userInfo?.user?.isAdmin}
            isSuperAdmin={userInfo?.user?.isSuperAdmin}
            organizationIds={userInfo?.user?.data?.organization_id || []}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  switchButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  switchButtonText: {
    color: "white",
    textAlign: "center",
  },
  infoText: {
    color: "blue",
    marginBottom: 10,
    textAlign: "center",
  },
});
