import { supabase } from '../../../auth/supabaseAuth.js';

export const fetchPasswordsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('passwords')
    .select('*')
    .eq('usuario_id', userId);
  if (error) throw error;
  return data;
};

export const deletePasswordsByIds = async (ids) => {
  const { error } = await supabase
    .from('passwords')
    .delete()
    .in('id', ids);
  if (error) throw error;
};

export const updatePasswordById = async (id, formData) => {
  const { error } = await supabase
    .from('passwords')
    .update(formData)
    .eq('id', id);
  if (error) throw error;
};