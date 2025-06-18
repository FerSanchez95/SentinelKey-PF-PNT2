import CryptoJS from 'crypto-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getAuthenticatedUserId = async () => {
    const data = useAuthStore((state) => state.user);
    return data?.user?.id;
};

/*
const getAuthenticatedUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? user.id : null;
};
*/

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

export const savePassword = async (password, title, relatedSite = null) => {
    const userId = await getAuthenticatedUserId();
  
    if (!userId) {
      throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
    }
  
    const userEncryptionKey = await getUserEncryptionKey(userId);
  
    const encryptedPassword = CryptoJS.AES.encrypt(password, userEncryptionKey).toString();
  
    const dataToInsert = {
      usuario_id: userId,
      password_cifrada: encryptedPassword,
      titulo: title,
      sitio_relacionado: relatedSite,
    };
  
    try {
      const { data, error } = await supabase
        .from('passwords')
        .insert([dataToInsert]);
  
      if (error) {
        console.error('Error al guardar la contraseña en Supabase:', error.message);
        throw error;
      } else {
        console.log('Contraseña guardada exitosamente en Supabase:', data);
        return data;
      }
    } catch (error) {
      console.error('Ocurrió un error inesperado al guardar la contraseña:', error.message);
      throw error;
    }
};

export const getPasswordsTitlesAndIds = async () => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
        console.warn("No hay usuario autenticado. No se pueden obtener contraseñas.");
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('passwords')
            .select('id, titulo')
            .eq('usuario_id', userId);

        if (error) {
            console.error('Error al obtener títulos e IDs de contraseñas:', error.message);
            throw error;
        } else {
            console.log('Títulos e IDs de contraseñas obtenidos:', data);
            return data;
        }
    } catch (error) {
        console.error('Ocurrió un error inesperado al obtener contraseñas:', error.message);
        throw error;
    }
};

export const getPasswordDetailsById = async (passwordId) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
        throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
    }

    const userEncryptionKey = await getUserEncryptionKey(userId);

    try {
        const { data, error } = await supabase
            .from('passwords')
            .select('password_cifrada, titulo, sitio_relacionado')
            .eq('id', passwordId)
            .eq('usuario_id', userId) // Aseguramos que la contraseña pertenezca al usuario autenticado
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.warn(`No se encontró la contraseña con ID ${passwordId} para el usuario ${userId}.`);
                return null;
            }
            console.error(`Error al obtener los detalles de la contraseña con ID ${passwordId}:`, error.message);
            throw error;
        } else if (data && data.contraseña_cifrada) {
            const decryptedBytes = CryptoJS.AES.decrypt(data.contraseña_cifrada, userEncryptionKey);
            const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8); // Convertir a texto UTF-8

            return {
                id: passwordId,
                password_plana: decryptedPassword,
                titulo: data.titulo,
                sitio_relacionado: data.sitio_relacionado
            };
        }
        return null;
    } catch (error) {
        console.error('Ocurrió un error inesperado al obtener o descifrar la contraseña:', error.message);
        throw error;
    }
};

export const getPasswordsDetailsByIds = async (passwordsIds) => {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
  }
  const userEncryptionKey = await getUserEncryptionKey(userId);
  try {
    const { data, error } = await supabase
            .from('passwords')
            .select('password_cifrada, titulo, sitio_relacionado')
            .in('id', passwordsIds)
            .eq('usuario_id', userId) // Aseguramos que la contraseña pertenezca al usuario autenticado
            .single();

    const decryptedBytes = CryptoJS.AES.decrypt(data.contraseña_cifrada, userEncryptionKey);
    const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8); // Convertir a texto UTF-8

    return {
      id: passwordId,
      password_plana: decryptedPassword,
      titulo: data.titulo,
      sitio_relacionado: data.sitio_relacionado
    };
  } catch (error) {
    console.error('Ocurrió un error inesperado al obtener o descifrar la contraseña:', error.message);
    throw error;
  }
}

export const updatePasswordById = async (passwordId, newPassword) => {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
      throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
  }

  const userEncryptionKey = await getUserEncryptionKey(userId);

  const encryptedNewPassword = CryptoJS.AES.encrypt(newPassword, userEncryptionKey).toString();

  const dataToUpdate = {
      password_cifrada: encryptedNewPassword,
  };

  try {
      const { data, error } = await supabase
          .from('passwords')
          .update(dataToUpdate)
          .eq('id', passwordId)
          .eq('usuario_id', userId)
          .select();

      if (error) {
          console.error(`Error al actualizar la contraseña con ID ${passwordId}:`, error.message);
          throw error;
      } else if (data && data.length > 0) {
          console.log(`Contraseña con ID ${passwordId} actualizada exitosamente:`, data);
          return data[0];
      } else {
          console.warn(`No se encontró la contraseña con ID ${passwordId} para actualizar o no hubo cambios.`);
          return null; 
      }
  } catch (error) {
      console.error('Ocurrió un error inesperado al actualizar la contraseña:', error.message);
      throw error;
  }
};
