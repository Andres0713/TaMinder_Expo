import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import FormularioInputs from "./FormularioInputs"; // Importa el componente de los inputs
import { db } from "../../../../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AltasForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    rol: "",
    estado: ""
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAdd = async () => {
    const { nombre, apellido_paterno, apellido_materno, rol, estado } = formData;

    // Validación de campos
    if (nombre && apellido_paterno && apellido_materno && rol && estado) {
      try {
        console.log("Enviando datos a Firestore:", formData); // Para depuración
        await addDoc(collection(db, "usuarios"), {
          nombre,
          apellido_paterno: apellido_paterno, 
          apellido_materno: apellido_materno, 
          rol: rol, 
          estado: estado
        });
        alert("Usuario agregado con éxito");
        // Limpia el formulario
        setFormData({
          nombre: "",
          apellido_paterno: "",
          apellido_materno: "",
          rol: "",
          estado: ""
        });
      } catch (error) {
        console.error("Error al guardar en Firestore:", error);
        alert("Error al agregar el usuario: " + error.message);
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Altas</Text>
      <FormularioInputs
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleAdd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default AltasForm;
