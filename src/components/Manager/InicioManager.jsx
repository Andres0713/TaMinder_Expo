import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

const InicioManager = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const userDocRef = doc(db, "usuarios", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const { nombre, rol } = userDoc.data();
            setUserName(nombre);
            setUserRole(rol);
          } else {
            console.log("El documento del usuario no existe");
          }
        } catch (error) {
          console.log("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Rol del Usuario */}
      <Text style={styles.roleText}>
        <Text style={styles.highlight}>{userRole}</Text>
      </Text>
      
      {/* Imagen de Bienvenida */}
      <Image
        source={require("../../../assets/images/admin.png")} // Asegúrate de tener una imagen en esta ruta
        style={styles.image}
      />

      {/* Mensaje de Bienvenida */}
      <Text style={styles.welcomeText}>
        ¡Bienvenid@, <Text style={styles.highlight}>{userName}</Text>!
      </Text>  
    </View>
  );
};

export default InicioManager;

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
