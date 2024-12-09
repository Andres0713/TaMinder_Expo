import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import AltasForm from "./src3/components/AltasForm";
import ReportesList from "./src3/components/ReportesList";
import Bajas from "./src3/components/Bajas";
import apps from "../../utils/firebaseConfig"; // Ruta a tu configuración de Firebase
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

// Función para cerrar sesión
function logOut(navigation) {
  const auth = getAuth(apps);
  signOut(auth)
    .then(() => {
      console.log("Cerró sesión");
      navigation.replace("Login");
    })
    .catch((error) => {
      console.log("Error al cerrar sesión", error.message);
    });
}

// Pantallas
function AltasScreen() {
    const navigation = useNavigation();
  return (
    <View style={styles.screen}>
      <AltasForm />
      <TouchableOpacity style={styles.button} onPress={() => logOut(navigation)}>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function BajasScreen() {
    const navigation = useNavigation();
  return (
    <View style={styles.screen}>
      <Bajas />
      <TouchableOpacity style={styles.button} onPress={() => logOut(navigation)}>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function ReportesScreen() {
    const navigation = useNavigation();
  return (
    <View style={styles.screen}>
      <ReportesList />
      <TouchableOpacity style={styles.button} onPress={() => logOut(navigation)}>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// Exporta directamente el Tab Navigator
const App = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Altas") {
            iconName = focused ? "person-add" : "person-add-outline";
          } else if (route.name === "Bajas") {
            iconName = focused ? "trash" : "trash-outline";
          } else if (route.name === "Reportes") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Altas" component={AltasScreen} />
      <Tab.Screen name="Bajas" component={BajasScreen} />
      <Tab.Screen name="Reportes" component={ReportesScreen} />
    </Tab.Navigator>
  );
};

export default App;

// Estilos
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  title: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
