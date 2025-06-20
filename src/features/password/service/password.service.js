import { supabase } from '../../../auth/supabaseAuth.js';
import {
  hashPassword,
  unhashPassword
} from '../../../service/passwordHandler.js'

export const fetchPasswordsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('passwords')
    .select('*')
    .eq('usuario_id', userId);
  if (error) throw error;

  const processedData = await Promise.all(data.map(async (password) => {
    password.valor = await unhashPassword(userId, password.password_cifrada);
    return password; 
  }));

  console.log("Fetched and processed password data:", processedData);
  return processedData;
};


export const deletePasswordsByIds = async (ids) => {
  const { error } = await supabase
    .from('passwords')
    .delete()
    .in('id', ids);
  if (error) throw error;
};

export const updatePasswordById = async (userId, id, formData) => {
  const dataToUpdate = { ...formData }; 
  if(dataToUpdate.valor) { 
    dataToUpdate.password_cifrada = await hashPassword(userId, dataToUpdate.valor);
    delete dataToUpdate.valor; 
  }
  const { error } = await supabase
    .from('passwords')
    .update(dataToUpdate) 
    .eq('id', id)
    .eq('usuario_id', userId);
  if (error) throw error;
};


export const agregarPassword = async (userId, passwordData) => {
  if (!passwordData || typeof passwordData.valor === 'undefined') {
    throw new Error("no se recibio password.");
  }

  const dataToInsert = {
    usuario_id: userId,
    titulo: passwordData.titulo,
    sitio_relacionado: passwordData.sitio_relacionado,
    password_cifrada: await hashPassword(userId, passwordData.valor),
  };

console.log(dataToInsert)

  const { data, error } = await supabase
    .from('passwords')
    .insert([dataToInsert])
    .select();

  if (error) throw new Error(`Error al agregar contraseña: ${error.message}`);
  return data[0];
};
  