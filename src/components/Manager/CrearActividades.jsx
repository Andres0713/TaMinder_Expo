import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { getAuth } from "firebase/auth";
import DateTimePicker from "@react-native-community/datetimepicker";

const CrearActividades = () => {
  const [nombreActividad, setNombreActividad] = useState("");
  const [tipoActividad, setTipoActividad] = useState("Limpieza");
  const [estado, setEstado] = useState("En progreso");
  const [fechaAsignacion, setFechaAsignacion] = useState(new Date());
  const [fechaTermino, setFechaTermino] = useState(new Date());
  const [usuarios, setUsuarios] = useState([]);
  const [idUserResponsable, setIdUserResponsable] = useState("");
  const [idUserGerente, setIdUserGerente] = useState("");
  const [showAsignacionPicker, setShowAsignacionPicker] = useState(false);
  const [showTerminoPicker, setShowTerminoPicker] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
          rol: doc.data().rol,
        }));
        setUsuarios(users);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    const fetchGerenteActual = () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        setIdUserGerente(currentUser.uid); // Seleccionar automáticamente el gerente conectado
      }
    };

    fetchUsuarios();
    fetchGerenteActual();
  }, []);

  const handleCrearActividad = async () => {
    if (!nombreActividad) {
      Alert.alert("Error", "Por favor, ingresa el nombre de la actividad.");
      return;
    }
    if (!idUserResponsable) {
      Alert.alert("Error", "Por favor, selecciona un usuario responsable.");
      return;
    }
    if (!idUserGerente) {
      Alert.alert("Error", "No se ha detectado un gerente conectado.");
      return;
    }
    if (fechaTermino <= fechaAsignacion) {
      Alert.alert(
        "Error",
        "La fecha de término debe ser posterior a la fecha de asignación."
      );
      return;
    }

    try {
      await addDoc(collection(db, "actividades"), {
        nombreActividad,
        tipoActividad,
        estado,
        fechaAsignacion: fechaAsignacion.toISOString().split("T")[0],
        fechaTermino: fechaTermino.toISOString().split("T")[0],
        idUserResponsable,
        idUserGerente,
      });
      Alert.alert("Éxito", "La actividad ha sido creada correctamente.");
      // Limpiar los campos excepto el del gerente
      setNombreActividad("");
      setTipoActividad("Limpieza");
      setEstado("En progreso");
      setFechaAsignacion(new Date());
      setFechaTermino(new Date());
      setIdUserResponsable("");
    } catch (error) {
      console.error("Error al crear la actividad:", error);
      Alert.alert("Error", "No se pudo crear la actividad. Inténtalo de nuevo.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Actividad</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la actividad"
        value={nombreActividad}
        onChangeText={setNombreActividad}
      />

      <Text style={styles.label}>Tipo de Actividad</Text>
      <Picker
        selectedValue={tipoActividad}
        onValueChange={(itemValue) => setTipoActividad(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Limpieza" value="Limpieza" />
        <Picker.Item label="Mantenimiento" value="Mantenimiento" />
        <Picker.Item label="Restauración" value="Restauración" />
      </Picker>

      <Text style={styles.label}>Estado</Text>
      <Picker
        selectedValue={estado}
        onValueChange={(itemValue) => setEstado(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="En progreso" value="En progreso" />
        <Picker.Item label="Completada" value="Completada" />
      </Picker>

      <Text style={styles.label}>Fecha de Asignación</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowAsignacionPicker(true)}
      >
        <Text>{fechaAsignacion.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>
      {showAsignacionPicker && (
        <DateTimePicker
          value={fechaAsignacion}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowAsignacionPicker(false);
            if (selectedDate) {
              setFechaAsignacion(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>Fecha de Término</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTerminoPicker(true)}
      >
        <Text>{fechaTermino.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>
      {showTerminoPicker && (
        <DateTimePicker
          value={fechaTermino}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowTerminoPicker(false);
            if (selectedDate) {
              setFechaTermino(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>Usuario Responsable</Text>
      <Picker
        selectedValue={idUserResponsable}
        onValueChange={(itemValue) => setIdUserResponsable(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un usuario" value="" />
        {usuarios
          .filter((usuario) => usuario.rol !== "Gerente")
          .map((usuario) => (
            <Picker.Item
              key={usuario.id}
              label={usuario.nombre}
              value={usuario.id}
            />
          ))}
      </Picker>

      <Text style={styles.label}>Gerente</Text>
      <Picker
        selectedValue={idUserGerente}
        enabled={false}
        style={styles.picker}
      >
        {usuarios
          .filter((usuario) => usuario.id === idUserGerente)
          .map((usuario) => (
            <Picker.Item
              key={usuario.id}
              label={usuario.nombre}
              value={usuario.id}
            />
          ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleCrearActividad}>
        <Text style={styles.buttonText}>Crear Actividad</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CrearActividades;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
