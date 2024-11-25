import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  Pressable,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { RESP_URL } from "../../config";
import { useRouter } from "expo-router";

const CreateOrganizationView = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const { userInfo, updateUserInfo } = useContext(AuthContext);

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Validation Error", "Organization name is required");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("userId", userInfo?.user?._id);
  
    if (imageUri) {
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "organization-image.jpg",
      });
    }
  
    try {
      const response = await axios.post(
        `${RESP_URL}/api/organization`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      if (response.status === 201) {
        const newOrgId = response.data.organization._id;
  
        // Update userInfo with the new organization_id
        const updatedUserInfo = {
          ...userInfo.user,
          data: {
            ...userInfo.user.data,
            organization_id: newOrgId,
          },
        };
  
        updateUserInfo(updatedUserInfo); // Update AuthContext
  
        Alert.alert("Success", "Organization created successfully");
        setName("");
        setImageUri(null);
        router.push("/"); // Navigate to the home or relevant page
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to create organization");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crear una Organización</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de Organización"
        value={name}
        onChangeText={setName}
      />
      <Pressable onPress={handleChooseImage} style={styles.imagePicker}>
        <Text style={styles.imageText}>🏞️ Elige una imagen</Text>
      </Pressable>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <Image
          source={require("../../assets/images/org_placeholder.jpg")}
          style={styles.imagePreview}
        />
      )}
      <Button title="Continuar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
  },
  imagePicker: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageText: {
    color: "#007bff",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default CreateOrganizationView;
