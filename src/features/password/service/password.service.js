
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
  
  return processedData;
};


export const deletePasswordsByIds = async (ids) => {
  const { error } = await supabase
    .from('passwords')
    .delete()
    .in('id', ids);
  if (error) throw error;
};

export const updatePasswordById = async (id, formData) => {
  console.log(id);
  console.log(formData)
  const dataToUpdate = { ...formData }; 
  if(dataToUpdate.password) { 
    dataToUpdate.password_cifrada = await hashPassword(dataToUpdate.usuario_id, dataToUpdate.password);
    delete dataToUpdate.password; 
  }
  const { error } = await supabase
    .from('passwords')
    .update(dataToUpdate) 
    .eq('id', id)
    .eq('usuario_id', dataToUpdate.usuario_id);
  if (error) throw error;
};


export const agregarPassword = async(passwordData) => {
  if (!passwordData || typeof passwordData.password === 'undefined') {
    throw new Error("no se recibio password.");
  }

  const dataToInsert = {
    usuario_id: passwordData.usuario_id,
    titulo: passwordData.titulo,
    sitio_relacionado: passwordData.sitio_relacionado,
    password_cifrada: await hashPassword(passwordData.usuario_id, passwordData.password),
  };

console.log(dataToInsert)

  const { data, error } = await supabase
    .from('passwords')
    .insert([dataToInsert])
    .select();

  if (error) throw new Error(`Error al agregar contraseña: ${error.message}`);
  return data[0];
};
  