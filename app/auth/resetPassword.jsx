import { useState } from "react";
import axios from "axios";
import { RESP_URL } from "../../config";
import { useLocalSearchParams } from "expo-router";


const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useLocalSearchParams(); // Captura el token de la URL

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(`${RESP_URL}/api/users/reset-password/${token}`, { newPassword });
      alert(res.data.message);
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      alert("Error al restablecer contraseña");
    }
  };

  return (
    // Formulario para introducir la nueva contraseña
    <Text>Nueva Contraseña</Text>

  );
};
