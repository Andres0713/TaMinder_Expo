import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../utils/firebaseConfig";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { jsPDF } from "jspdf";

const Historial = () => {
  const [actividades, setActividades] = useState([]);
  const [gerenteId, setGerenteId] = useState("");

  useEffect(() => {
    const fetchGerenteId = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        setGerenteId(currentUser.uid);
      } else {
        Alert.alert("Error", "No se pudo identificar al gerente conectado.");
      }
    };

    const fetchActividades = async () => {
      if (!gerenteId) return;
      try {
        const q = query(
          collection(db, "actividades"),
          where("idUserGerente", "==", gerenteId)
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

    fetchGerenteId();
    fetchActividades();
  }, [gerenteId]);

  const generarReportePDF = async () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Actividades", 20, 20);

      actividades.forEach((actividad, index) => {
        const y = 40 + index * 10;
        doc.text(
          `Nombre: ${actividad.nombreActividad}, Tipo: ${actividad.tipoActividad}, Estado: ${actividad.estado}, Fecha Asignación: ${actividad.fechaAsignacion}, Fecha Término: ${actividad.fechaTermino}`,
          10,
          y
        );
      });

      const pdfOutput = doc.output("datauristring");
      const fileUri = FileSystem.documentDirectory + "reporte_actividades.pdf";

      await FileSystem.writeAsStringAsync(fileUri, pdfOutput.split(",")[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartir Reporte PDF",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error al generar el reporte PDF:", error);
      Alert.alert("Error", "No se pudo generar el reporte en PDF.");
    }
  };

  const renderActividad = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nombreActividad}</Text>
        <Text
          style={[
            styles.status,
            item.estado === "Completada" ? styles.statusCompleted : styles.statusInProgress,
          ]}
        >
          {item.estado}
        </Text>
      </View>
      <Text style={styles.cardText}>Tipo: {item.tipoActividad}</Text>
      <Text style={styles.cardText}>Fecha Asignación: {item.fechaAsignacion}</Text>
      <Text style={styles.cardText}>Fecha Término: {item.fechaTermino}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Actividades</Text>

      {actividades.length === 0 ? (
        <Text style={styles.noDataText}>No hay actividades asignadas.</Text>
      ) : (
        <FlatList
          data={actividades}
          keyExtractor={(item) => item.id}
          renderItem={renderActividad}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={generarReportePDF}>
        <Text style={styles.buttonText}>Generar Reporte en PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Historial;

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
    color: "#333",
  },
  noDataText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  statusCompleted: {
    backgroundColor: "#28a745", // Verde para completadas
  },
  statusInProgress: {
    backgroundColor: "#ffc107", // Amarillo para en progreso
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
