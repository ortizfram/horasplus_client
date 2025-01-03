import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import SearchOrganization from "../../components/SearchOrganization";

export default function SearchAndCreate({ userInfo, handleSelectOrg }) {
  return (
    <View>
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
  createBtn: { backgroundColor: "blue", padding: 10 },
  createText: { color: "white" },
});
