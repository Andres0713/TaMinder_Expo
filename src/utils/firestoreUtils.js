// Importar las funciones necesarias de Firebase
import { getFirestore } from "firebase/firestore";
import app from "./firebaseConfig"; // Asegúrate de que este archivo sea tu configuración de Firebase

// Inicializar Firestore
const firestore = getFirestore(app);

export default firestore;