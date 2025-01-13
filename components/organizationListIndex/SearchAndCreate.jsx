import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import SearchOrganization from "../../components/searchOrganization";

export default function SearchAndCreate({ userInfo, handleSelectOrg }) {
  return (
    <View style={styles.wrapper}>
      {userInfo?.user?.isAdmin && (
        <Pressable style={styles.createBtn}>
          <Text
            style={styles.createText}
            onPress={() => router.push("/organization/create")}
          >
            Crea un nuevo establecimiento
          </Text>
        </Pressable>
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
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  createBtn: {
    backgroundColor: "#32a891", // Green matching the image gradient
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },
  createText: {
    color: "#FFFFFF", // White text for contrast
    fontWeight: "bold",
    fontSize: 16,
  },
});