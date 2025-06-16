import { supabase } from "./supabaseAuth"
import {
  generarSaltEnBruto,
  crearSaltBase64,
} from "../service/saltHandler.js";
//import { cargarDatosUsuario } from '../features/usuario/service/usuario.service.js'
import { useAuthStore } from "../stores/authStore.js";
import { cargarDatosUsuario } from "../features/usuario/service/usuario.service.js";

export async function registrarUsuario( email, password) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  const user = data.user;

  if (error) {
    throw new Error(error.message);
  }

  // Devulevo el ususrio registrado.
  return { user } ;
}

export async function completarRegistro(user, nombre){
  
  //Genero tanto el salt como la masterKey
  const salt = generarSaltEnBruto();
  const saltBase64 = crearSaltBase64(salt);

  // Agrego los datos del uasuario registrado a la tabla 'usuarios'.
  const { data, error } = await supabase.from("usuarios").insert({
    id: user.id, // relaciona con auth.users.id. (Mismo Id)
    email: user.email,
    nombre,
    userSalt: saltBase64,
  });
  
  if (error) throw new Error(error.message);

  return { data }
}

export async function IniciarSesion(email, password){
  const { data, error} = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  return await cargarDatosUsuario({ estaRegistrado: true, user: data.user});
}

export const signOut = async () => {
    await supabase.auth.signOut();
    useAuthStore.getState().logout();
};
