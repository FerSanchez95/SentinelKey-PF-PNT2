import { supabase } from "../../../auth/supabaseAuth";
import { useAuthStore } from "../../../stores/authStore";



export const cargarDatosUsuario = async ({ estaRegistrado = false, user = null } = {}) => {
    
  const store = useAuthStore.getState()

    // 1. Si es un nuevo usuario (signUp), seteamos user y limpiamos favoritos
    if (estaRegistrado) {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new Error("No se pudo obtener el usuario recién registrado.")
        }

        store.login(data.user)
        
        return {
          user: data.user,
          message: "¡Bienvenido!"
        }
    }

    // 2. Buscar user actual si no se pasa explícitamente
    let currentUser = user

    if (!currentUser) {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            throw new Error("No se pudo obtener el usuario actual.")
        }
        currentUser = data.user
    }

    // 3. Setear user en el store
    store.login(currentUser)

    return {
      user: currentUser,  
      message: `¡Hola ${currentUser.email}! Se cargaron tus recetas favoritas.`
        
    }
}



export async function obtenerDatosUsuario(usuarioId) {

  try {
    const { nombre, email } = await obtenerDatos(usuarioId);
    const cantidadPass = await obtenerCantidadPasswords(usuarioId);

    const datosUsuario = {
      nombre,
      email,
      cantidadPass,
    };

    return datosUsuario;

  } catch (error) {

   throw new Error(error.message);

  }
  
}

async function obtenerCantidadPasswords(usuarioId) {
  const { cantidadPass, error } = await supabase
    .from("Password")
    .select("*", { count: "exact", head: true })
    .eq("id", usuarioId);

  if (error) {
    throw new Error(error.message);
  }

  return cantidadPass;
}

async function obtenerDatos(usuarioId) {
  const { nombre, email, error } = await supabase
    .from("usuarios")
    .select(nombre, email)
    .eq("id", usuarioId);

  if (error) {
    throw new Error(error.message);
  }

  const datos = { nombre, email };

  return datos;
}
