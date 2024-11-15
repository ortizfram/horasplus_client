import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { RESP_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();

  const updateUserInfo = (updatedUser) => {
    const updatedUserInfo = {
      ...userInfo, // Mantener los campos existentes
      user: {
        ...userInfo.user, // Mantener los campos del objeto `user`
        ...updatedUser, // Sobrescribir con los nuevos datos del usuario
      },
    };

    // Actualizar el estado con los nuevos datos
    setUserInfo(updatedUserInfo);

    // Guardar el nuevo userInfo en AsyncStorage
    AsyncStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
  };

  const register = async (email, password, firstname, lastname, next, onError) => {
    console.log("Handling signup");
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${RESP_URL}/api/users/register`,
        { email, password, firstname, lastname },
        { withCredentials: true }
      );
  
      if (res.status === 201) {
        let userInfo = res.data;
        console.log(userInfo);
        setUserInfo(userInfo);
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        next ? router.push(`/auth/login?next=${next}`) : router.push("/auth/login");
      } else {
        console.log("Unexpected status code:", res.status);
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 409) {
          onError("El usuario ya existe");
        } else if (status === 400) {
          onError("Todos los campos son obligatorios");
        } else {
          onError(data.message || "Error al registrarse");
        }
      } else {
        onError("Error de conexión. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const login = async (email, password, next, onError) => {
    setIsLoading(true);
    try {
      console.log("Sending login request");
      const res = await axios.post(
        `${RESP_URL}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );
  
      if (res.status === 200) {
        console.log("Response received, setting token");
        let userInfo = res.data;
        setUserInfo(userInfo);
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        next ? router.push(next) : router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          onError("Credenciales inválidas. Verifica tu email y contraseña.");
        } else {
          onError(data.message || "Error inesperado al iniciar sesión.");
        }
      } else {
        onError("Error de conexión. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Sending logout request");
      await axios
        .post(`${RESP_URL}/api/users/logout`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            AsyncStorage.removeItem("userInfo");
            setUserInfo({});
            setIsLoading(false);
            alert("Logged out");
            router.push("/auth/login");
          }
        })
        .catch((e) => {
          console.log(`logout error: ${e}`);
          setIsLoading(false);
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`Error loggin out: ${error.response.data.message}`);
          console.log("Error response data:", error.response.data.message);
        }
      }
    }
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        register,
        updateUserInfo,
        login,
        logout,
        isLoading,
        userInfo,
        splashLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
