import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

const NotificacionManager = () => {
  const [actividades, setActividades] = useState([]);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [responsableData, setResponsableData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "actividades"),
      where("estado", "==", "En progreso")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const actividadesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActividades(actividadesData);
    }, (error) => {
      console.error("Error al obtener las actividades:", error);
      Alert.alert("Error", "No se pudieron cargar las actividades.");
    });

    return () => unsubscribe(); // Desuscribirse cuando el componente se desmonta
  }, []);

  const fetchResponsableData = async (idUserResponsable) => {
    try {
      const responsableDocRef = doc(db, "usuarios", idUserResponsable);
      const responsableDoc = await getDoc(responsableDocRef);
      if (responsableDoc.exists()) {
        const data = responsableDoc.data();
        setResponsableData({ nombre: data.nombre, email: data.email });
      } else {
        setResponsableData({ nombre: "No encontrado", email: "No disponible" });
      }
    } catch (error) {
      console.error("Error al obtener datos del responsable:", error);
      setResponsableData({ nombre: "Error", email: "Error al cargar datos" });
    }
  };

  const handleSelectActividad = (actividad) => {
    setSelectedActividad(actividad);
    fetchResponsableData(actividad.idUserResponsable);
    setModalVisible(true);
  };

  const handleEstadoChange = async () => {
    if (selectedActividad) {
      try {
        const actividadRef = doc(db, "actividades", selectedActividad.id);
        await updateDoc(actividadRef, { estado: "Completada" });
        Alert.alert("Éxito", "La actividad ha sido actualizada a 'Completada'.");
        setModalVisible(false);
      } catch (error) {
        console.error("Error al actualizar la actividad:", error);
        Alert.alert("Error", "No se pudo actualizar la actividad.");
      }
    }
  };

  const renderActividad = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectActividad(item)}
      style={styles.row}
    >
      <Text style={styles.cell}>Nombre: {item.nombreActividad}</Text>
      <Text style={styles.cell}>Tipo: {item.tipoActividad}</Text>
      <Text style={styles.cell}>
        Responsable: {responsableData ? responsableData.nombre : "Cargando..."}
      </Text>
      <Text style={styles.cell}>Fecha Asignación: {item.fechaAsignacion}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actividades en Progreso</Text>

      {actividades.length === 0 ? (
        <Text style={styles.noDataText}>No hay actividades en progreso</Text>
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
                <Text style={styles.modalLabel}>Nombre:</Text>{" "}
                {selectedActividad.nombreActividad}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Tipo:</Text>{" "}
                {selectedActividad.tipoActividad}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Estado:</Text>{" "}
                {selectedActividad.estado}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Responsable:</Text>{" "}
                {responsableData ? responsableData.nombre : "Cargando..."}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Correo:</Text>{" "}
                {responsableData ? responsableData.email : "Cargando..."}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleEstadoChange}
              >
                <Text style={styles.modalButtonText}>
                  Marcar como Completada
                </Text>
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

export default NotificacionManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cell: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "tomato",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
});
