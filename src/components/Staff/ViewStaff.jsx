import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import InicioStaff from "./InicioStaff";
import ActividadesPendientes from "./ActividadesPendientes";
import PerfilStaff from "./PerfilStaff";
import { View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HeaderRight = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
                navigation.replace("Login"); // Redirigir a la pantalla de Login
            })
            .catch((error) => {
                Alert.alert("Error", "Hubo un problema al cerrar la sesión.");
                console.error("Error al cerrar sesión:", error);
            });
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="log-out-outline" size={24} color="#007bff" />
        </TouchableOpacity>
    );
};



const ViewStaff = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "InicioStaff") {
                    iconName = focused ? "home" : "home-outline";
                } else if (route.name === "ActividadesPendientes") {
                    iconName = focused ? "list" : "list-outline";
                } else if (route.name === "PerfilStaff") {
                    iconName = focused ? "person" : "person-outline";
                }
                return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#007bff",
            tabBarInactiveTintColor: "gray",
        })}
    >
        <Tab.Screen
            name="InicioStaff"
            component={InicioStaff}
            options=
            {
                {
                    headerRight: () => <HeaderRight />,
                    headerTitle: "Inicio",
                    headerStyle: {
                        backgroundColor: "#f7f7f7",
                    },
                    headerTintColor: "#333",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }
            }
        />
        <Tab.Screen
            name="PerfilStaff"
            component={PerfilStaff}
            options=
            {
                {
                    headerRight: () => <HeaderRight />,
                    headerTitle: "Perfil",
                    headerStyle: {
                        backgroundColor: "#f7f7f7",
                    },
                    headerTintColor: "#333",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }
            }
        />
        <Tab.Screen
            name="ActividadesPendientes"
            component={ActividadesPendientes}
            options=
            {
                {
                    headerRight: () => <HeaderRight />,
                    headerTitle: "Pendientes",
                    headerStyle: {
                        backgroundColor: "#f7f7f7",
                    },
                    headerTintColor: "#333",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }
            }
        />
    </Tab.Navigator>
);

export default ViewStaff;

const styles = StyleSheet.create({
    logoutButton: {
        marginRight: 15,
    },
});
