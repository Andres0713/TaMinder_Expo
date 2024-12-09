import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

const Perfil = () => {
  const [userData, setUserData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    rol: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const userDocRef = doc(db, "usuarios", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const { nombre, apellidoPaterno, apellidoMaterno, email, rol } = userDoc.data();
            setUserData({ nombre, apellidoPaterno, apellidoMaterno, email, rol });
          } else {
            console.log("El documento del usuario no existe");
          }
        } catch (error) {
          console.log("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Por favor, completa ambos campos.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      Alert.alert("Éxito", "La contraseña se ha actualizado correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error.message);
      Alert.alert("Error", "No se pudo cambiar la contraseña. Verifica tu contraseña actual.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen de usuario */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../../assets/images/user.png")} 
          style={styles.avatar}
        />
      </View>

      {/* Tarjeta de perfil */}
      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>Perfil de Usuario</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.infoText}>Nombre: <Text style={styles.infoValue}>{userData.nombre}</Text></Text>
          <Text style={styles.infoText}>Apellido Paterno: <Text style={styles.infoValue}>{userData.apellidoPaterno}</Text></Text>
          <Text style={styles.infoText}>Apellido Materno: <Text style={styles.infoValue}>{userData.apellidoMaterno}</Text></Text>
          <Text style={styles.infoText}>Correo Electrónico: <Text style={styles.infoValue}>{userData.email}</Text></Text>
          <Text style={styles.infoText}>Rol: <Text style={styles.infoValue}>{userData.rol}</Text></Text>
        </View>
      </View>

      {/* Botón para cambiar contraseña */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>

      {/* Modal para cambiar contraseña */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  profileCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  profileInfo: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  infoValue: {
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
});
