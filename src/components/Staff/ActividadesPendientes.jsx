import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { getAuth } from "firebase/auth";

const ActividadesPendientes = () => {
  const [actividades, setActividades] = useState([]);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        if (!currentUser) {
          Alert.alert("Error", "Usuario no autenticado.");
          return;
        }

        const q = query(
          collection(db, "actividades"),
          where("estado", "==", "En progreso"),
          where("idUserResponsable", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const actividadesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActividades(actividadesData);
      } catch (error) {
        console.error("Error al obtener las actividades:", error);
        Alert.alert("Error", "No se pudieron cargar las actividades.");
      }
    };

    fetchActividades();
  }, [currentUser]);

  const handleCompletarActividad = async (actividadId) => {
    try {
      const actividadRef = doc(db, "actividades", actividadId);
      await updateDoc(actividadRef, { estado: "Completada" });
      Alert.alert("Éxito", "La actividad ha sido marcada como completada.");
      setModalVisible(false);
      setActividades((prev) =>
        prev.filter((actividad) => actividad.id !== actividadId)
      );
    } catch (error) {
      console.error("Error al completar la actividad:", error);
      Alert.alert("Error", "No se pudo completar la actividad.");
    }
  };

  const getBorderColor = (tipoActividad) => {
    switch (tipoActividad) {
      case "Limpieza":
        return "#28a745"; 
      case "Mantenimiento":
        return "#c39110"; 
      case "Restauración":
        return "#e74c3c"; 
      default:
        return "#bdc3c7"; 
    }
  };

  const renderActividad = ({ item }) => (
    <TouchableOpacity
      style={[styles.row, { borderLeftColor: getBorderColor(item.tipoActividad) }]}
      onPress={() => {
        setSelectedActividad(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.cell}> {item.nombreActividad}</Text>
      <Text style={styles.cellTipo}>Tipo: {item.tipoActividad}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actividades Pendientes</Text>

      {actividades.length === 0 ? (
        <Text style={styles.noDataText}>
          No tienes actividades pendientes asignadas.
        </Text>
      ) : (
        <FlatList
          data={actividades}
          keyExtractor={(item) => item.id}
          renderItem={renderActividad}
        />
      )}

      {selectedActividad && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalles de la Actividad</Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Nombre:</Text> {selectedActividad.nombreActividad}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Tipo:</Text> {selectedActividad.tipoActividad}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Estado:</Text> {selectedActividad.estado}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Fecha Asignación:</Text> {selectedActividad.fechaAsignacion}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Fecha Término:</Text> {selectedActividad.fechaTermino}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleCompletarActividad(selectedActividad.id)}
              >
                <Text style={styles.modalButtonText}>Marcar como Completada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ActividadesPendientes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eef2f3",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  noDataText: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#007bff",
  },
  cell: {
    fontSize: 20,
    color: "#000",
    marginBottom: 5,
    fontWeight: "bold",
  },
  cellTipo: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2c3e50",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#34495e",
  },
  modalLabel: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    marginTop: 10,
  },
});
