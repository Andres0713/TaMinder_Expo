import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import apps from "../../utils/firebaseConfig"; // Ruta a tu configuración de Firebase

// Importar los componentes
import InicioManager from "./InicioManager";
import Perfil from "./Perfil";
import CrearActividades from "./CrearActividades";
import NotificacionManager from "./NotificacionManager";
import Historial from "./Historial";

const Tab = createBottomTabNavigator();

const ViewManager = () => {
  const navigation = useNavigation();

  // Función para cerrar sesión
  const logOut = () => {
    const auth = getAuth(apps);
    signOut(auth)
      .then(() => {
        console.log("Cerró sesión");
        navigation.replace("Login"); // Navega a la pantalla de Login
      })
      .catch((error) => {
        console.log("Error al cerrar sesión", error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Navegador de pestañas */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Asignar iconos según la pestaña
            if (route.name === "Inicio") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Perfil") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "CrearActividades") {
              iconName = focused ? "create" : "create-outline";
            } else if (route.name === "Notificaciones") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (route.name === "Historial") {
              iconName = focused ? "book" : "book-outline";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Inicio" component={InicioManager} />
        <Tab.Screen name="Perfil" component={Perfil} />
        <Tab.Screen name="CrearActividades" component={CrearActividades} />
        <Tab.Screen name="Notificaciones" component={NotificacionManager} />
        <Tab.Screen name="Historial" component={Historial} />
      </Tab.Navigator>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <Icon name="log-out" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ViewManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    position: "absolute",
    top: 45,
    right: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 25,
    zIndex: 1000,
  },
});
