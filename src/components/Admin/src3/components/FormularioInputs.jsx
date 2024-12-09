import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';

const FormularioInputs = ({ formData, onInputChange, onSubmit }) => {
  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.nombre}
        onChangeText={(text) => onInputChange("nombre", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido paterno"
        value={formData.apellido_paterno}
        onChangeText={(text) => onInputChange("apellido_paterno", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido materno"
        value={formData.apellido_materno}
        onChangeText={(text) => onInputChange("apellido_materno", text)}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.rol}
          onValueChange={(itemValue) => onInputChange("rol", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona un rol" value="" />
          <Picker.Item label="Administrador" value="Administrador" />
          <Picker.Item label="Gerente" value="Gerente" />
          <Picker.Item label="Staff" value="Staff" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.estado}
          onValueChange={(itemValue) => onInputChange("estado", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona un estado" value="" />
          <Picker.Item label="Activo" value="Activo" />
          <Picker.Item label="Inactivo" value="Inactivo" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Agregar Usuario</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    alignItems: "center",
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerContainer: {
    width: 300,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
    height: "100%",
  },
});

export default FormularioInputs;
