import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Dimensions, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/organizationListIndex/Header";
import SearchAndCreate from "../../components/organizationListIndex/SearchAndCreate";
import InOutClockWithSwitch from "../../components/organizationListIndex/InOutClockWithSwitch";
import LoadingIndicator from "../../components/organizationListIndex/LoadingIndicator";
import { RESP_URL } from "../../config";
import axios from "axios";

export default function OrganizationList() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext) || {};
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !userInfo?.user?._id) {
      router.push("/auth/login");
    }
  }, [userInfo, isMounted]);

  const handleSelectOrg = async (orgId) => {
    if (!orgId) return console.error("Organization ID is missing");

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

      if (!response.data?._id) throw new Error("Invalid organization data");
      setOrganization(response.data);

      const isAdminOrOwner =
        response.data.user_id === userInfo?.user?._id ||
        userInfo?.user?.isAdmin ||
        userInfo?.user?.isSuperAdmin;

      router.push(
        isAdminOrOwner
          ? `/${response.data._id}/dashboard`
          : `/${response.data._id}/bePart`
      );
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
    }
  };

  useEffect(() => {
    const updateScreenWidth = () =>
      setScreenWidth(Dimensions.get("window").width);
    Dimensions.addEventListener("change", updateScreenWidth);
    return () => Dimensions.removeEventListener("change", updateScreenWidth);
  }, []);

  if (authLoading || !userInfo?.user)
    return <LoadingIndicator color="#0000ff" />;

  const isMobile = screenWidth < 768;

  return (
    <ScrollView
      style={[styles.container, { marginBottom: isMobile ? 100 : 80 }]}
    >
      <Header userInfo={userInfo} />
      {showSearch ? (
        <SearchAndCreate
          userInfo={userInfo}
          handleSelectOrg={handleSelectOrg}
        />
      ) : (
        <InOutClockWithSwitch
          userInfo={userInfo}
          setShowSearch={setShowSearch}
          handleSelectOrg={handleSelectOrg}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
