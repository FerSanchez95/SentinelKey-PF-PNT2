import CryptoJS from 'crypto-js';
import { supabase } from '../auth/supabaseAuth.js';


const getUserEncryptionKey = async (userId) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('userSalt')
      .eq('id', userId)
      .single();
  
    if (error) {
      console.error('Error al obtener la userEncryptionKey:', error.message);
      throw error;
    }
  
    if (!data || !data.userSalt) {
      throw new Error("No se encontró userEncryptionKey para el usuario. Asegúrate de que el usuario exista en la tabla 'usuarios' y tenga un 'userSalt' (clave de cifrado).");
    }

    return data.userSalt;
};

export const hashPassword = async (userId, password) => {
    const userEncryptionKey = await getUserEncryptionKey(userId);
    const encryptedPassword = CryptoJS.AES.encrypt(password, userEncryptionKey).toString();
    return encryptedPassword
}

export const unhashPassword = async (userId, hashPassword) => {
    const userEncryptionKey = await getUserEncryptionKey(userId);
    console.log(userEncryptionKey)
    const decryptedBytes = CryptoJS.AES.decrypt(hashPassword, userEncryptionKey);
    const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedPassword
} 


