import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import app from "./firebaseConfig"; // Asegúrate de importar la configuración de Firebase

const auth = getAuth(app);

/**
 * Inicia sesión con correo electrónico y contraseña
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<object>} - Devuelve el usuario autenticado o un error
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error; // Maneja el error en el componente que lo llama
  }
};

/**
 * Registra un nuevo usuario con correo electrónico y contraseña
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<object>} - Devuelve el usuario registrado o un error
 */
export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error; // Maneja el error en el componente que lo llama
  }
};

/**
 * Cierra la sesión del usuario autenticado
 * @returns {Promise<void>} - Devuelve void si la sesión se cierra correctamente
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error; // Maneja el error en el componente que lo llama
  }
};

/**
 * Obtiene el estado de autenticación actual
 * @param {function} callback - Callback que recibe el usuario autenticado o null
 */
export const onAuthStateChangedListener = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export default {
  login,
  register,
  logout,
  onAuthStateChangedListener,
};
