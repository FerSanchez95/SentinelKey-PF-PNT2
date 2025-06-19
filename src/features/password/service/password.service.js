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
  data.forEach(password => {
    password.password = unhashPassword(userId, password.password_cifrada)
  });
  console.log(data)
  return data;
};

export const deletePasswordsByIds = async (ids) => {
  const { error } = await supabase
    .from('passwords')
    .delete()
    .in('id', ids);
  if (error) throw error;
};

export const updatePasswordById = async (userId, id, formData) => {
  if(formData.value) {
    formData.value = hashPassword(userId, formData.value)
  }
  const { error } = await supabase
    .from('passwords')
    .update(formData)
    .eq('id', id);
  if (error) throw error;
};

export const savePassword = async (formData) => {
  
  if (!formData) throw new Error("No se pudieron cargar los datos del formulario.");

  const dataToInsert = {
    usuario_id: formData.usuario_id,
    password_cifrada: hashPassword(formData.usuario_id, formData.password),
    titulo: formData.titulo,
    sitio_relacionado: formData.sitio_relacionado,
  };

  const { error } = await supabase
    .from('passwords')
    .insert([dataToInsert]);
    if (error) throw error;
}