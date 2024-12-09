import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Button,
} from "react-native";
import { db } from "../../../../utils/firebaseConfig";
import { doc, collection, onSnapshot, deleteDoc } from "firebase/firestore";

export default function Bajas() {
    const [users, setUsers] = useState([]);

    // Escucha los datos de la colección y filtra por estado "Inactivo"
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "usuarios"), (querySnapshot) => {
            const data = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((user) => user.estado === "Inactivo"); // Filtrar usuarios inactivos
            setUsers(data);
        });

        return () => unsubscribe();
    }, []);


    const eliminar = async (id) => {
        try {
            await deleteDoc(doc(db, "usuarios", id));
            Alert.alert("Usuario eliminado", "El usuario ha sido eliminado permanentemente.");
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el usuario.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Usuarios Inactivos</Text>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.item}>
                            <Text style={styles.detail}>Nombre: {item.nombre}</Text>
                            <Text style={styles.detail}>Apellido Paterno: {item.apellidoPaterno}</Text>
                            <Text style={styles.detail}>Apellido Materno: {item.apellidoMaterno}</Text>
                            <Text style={styles.detail}>Rol: {item.rol}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => eliminar(item.id)} // Llama a la función de eliminación
                        >
                            <Text style={styles.deleteButtonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay usuarios inactivos</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f3f4f6",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        color: "#2c3e50",
        marginBottom: 20,
    },
    itemContainer: {
        backgroundColor: "#ffffff",
        padding: 20,
        width: 300,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    item: {
        marginBottom: 10,
    },
    detail: {
        fontSize: 16,
        color: "#34495e",
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: "#ff0000",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    deleteButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: "#7f8c8d",
        textAlign: "center",
        fontStyle: "italic",
    },
});

