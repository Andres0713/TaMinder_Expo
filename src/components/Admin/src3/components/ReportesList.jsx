import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { db } from "../../../../utils/firebaseConfig";
import { doc, collection, onSnapshot, deleteDoc, setDoc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';

const ReportesList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "usuarios"), (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalVisible(false);
  };

  const handleEditUser = () => {
    setEditUser(selectedUser);
    setIsEditing(true);
    setModalVisible(false);
  };

  const handleSaveUser = async () => {
    if (editUser) {
      try {
        await setDoc(doc(db, "usuarios", editUser.id), editUser);
        Alert.alert("Éxito", "Usuario actualizado correctamente.");
        setIsEditing(false);
        setEditUser(null);
      } catch (error) {
        Alert.alert("Error", "No se pudo guardar la información.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Reportes</Text>

      <FlatList
        data={users.filter((user) => user.estado === "Activo")}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectUser(item)}
          >
            <Text style={styles.cardText}>Nombre: {item.nombre}</Text>
            <Text style={styles.cardText}>Rol: {item.rol}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedUser && (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalles del Usuario</Text>
              <ScrollView>
                <Text style={styles.modalText}>Nombre: {selectedUser.nombre}</Text>
                <Text style={styles.modalText}>Apellido Paterno: {selectedUser.apellidoPaterno}</Text>
                <Text style={styles.modalText}>Apellido Materno: {selectedUser.apellidoMaterno}</Text>
                <Text style={styles.modalText}>Rol: {selectedUser.rol}</Text>
                <Text style={styles.modalText}>Estado: {selectedUser.estado}</Text>
              </ScrollView>
              <View style={styles.buttonContainer}> 
                <TouchableOpacity style={styles.button} onPress={handleEditUser}>
                  <Text style={styles.buttonText}>Modificar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCancel} onPress={closeModal}>
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {isEditing && (
        <Modal
          visible={isEditing}
          animationType="slide"
          transparent
          onRequestClose={() => setIsEditing(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Usuario</Text>
              <TextInput
                style={styles.input}
                value={editUser?.nombre}
                onChangeText={(text) => setEditUser({ ...editUser, nombre: text })}
                placeholder="Nombre"
              />
              <TextInput
                style={styles.input}
                value={editUser?.apellidoPaterno}
                onChangeText={(text) =>
                  setEditUser({ ...editUser, apellidoPaterno: text })
                }
                placeholder="Apellido Paterno"
              />
              <TextInput
                style={styles.input}
                value={editUser?.apellidoMaterno}
                onChangeText={(text) =>
                  setEditUser({ ...editUser, apellidoMaterno: text })
                }
                placeholder="Apellido Materno"
              />
              <Text style={styles.modalText}>Rol:</Text>
              <Picker
                selectedValue={editUser?.rol}
                onValueChange={(itemValue) =>
                  setEditUser({ ...editUser, rol: itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un rol" value="" />
                <Picker.Item label="Administrador" value="Administrador" />
                <Picker.Item label="Gerente" value="Gerente" />
                <Picker.Item label="Staff" value="Staff" />
              </Picker>
              <Text style={styles.modalText}>Estatus:</Text>
              <Picker
                selectedValue={editUser?.estado}
                onValueChange={(itemValue) =>
                  setEditUser({ ...editUser, estado: itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un estado" value="" />
                <Picker.Item label="Activo" value="Activo" />
                <Picker.Item label="Inactivo" value="Inactivo" />
              </Picker>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSaveUser}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#f3f3f3" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 16, 
    textAlign: "center" 
  },
  card: { 
    backgroundColor: "#fff", 
    padding: 16, 
    borderRadius: 8, 
    marginVertical: 8, 
    width: 250,
  },
  cardText: { 
    fontSize: 16, 
    color: "#333" 
  },
  modalBackground: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 8, 
    width: "90%" 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 16 
  },
  modalText: { 
    fontSize: 16, 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 10, 
    marginVertical: 8, 
    backgroundColor: "#fff" 
  },
  picker: { 
    marginVertical: 8 
  },
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 16 
  },
  button: { 
    backgroundColor: "#007BFF", 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginHorizontal: 4 
  },
  buttonCancel: { 
    backgroundColor: "#FF0000", 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginHorizontal: 4 
  },
  buttonText: { 
    color: "#fff", 
    textAlign: "center", 
    fontWeight: "bold" 
  },
});

export default ReportesList;
