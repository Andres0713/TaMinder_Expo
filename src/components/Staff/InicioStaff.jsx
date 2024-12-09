import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

const InicioStaff = () => {
  const [userName, setUserName] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (!currentUser) {
          Alert.alert("Error", "Usuario no autenticado.");
          return;
        }

        const userDocRef = doc(db, "usuarios", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.nombre || "Usuario");
        } else {
          setUserName("Usuario no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        Alert.alert("Error", "No se pudo cargar el nombre del usuario.");
      }
    };

    fetchUserName();
  }, [currentUser]);

  return (
    <View style={styles.container}>
      {/* Rol del Usuario */}
      <Text style={styles.roleText}>
        <Text style={styles.highlight}>Staff</Text>

      </Text>
      {/* Imagen de Bienvenida */}
      <Image
        source={require("../../../assets/images/staff.png")} // Asegúrate de tener una imagen en esta ruta
        style={styles.image}
      />

      {/* Texto de Bienvenida */}
      <Text style={styles.welcomeText}>
        ¡Bienvenid@, <Text style={styles.highlight}>{userName}</Text>!
      </Text>



    </View>
  );
};

export default InicioStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
  },
  welcomeText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 10,
  },
  roleText: {
    fontSize: 30,
    color: "#34495e",
    textAlign: "center",
    marginBottom: 20,
  },
  highlight: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
