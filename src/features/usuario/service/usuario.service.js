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



export const obtenerDatosUsuario = async(usuarioId) => {

  if (!usuarioId || typeof usuarioId !== 'string') {
    throw new Error("ID de usuario inválido");
  }

  try {
    const datos = await obtenerDatos(usuarioId);
    let cantidadPass = await obtenerCantidadPasswords(usuarioId);


    if(!cantidadPass){
      cantidadPass = 0;
    }

    // console.log("Datos:", datos);
    // console.log("Contraseñas:", cantidadPass)

    const datosUsuario = {
      nombre: datos?.data?.nombre,
      email: datos?.data?.email,
      cantidadPass,
    };

    return datosUsuario;

  } catch (err) {

   throw new Error(err.message);

  }
  
}
const obtenerDatos = async(usuarioId) => {

  console.log(usuarioId)
  const { data, error } = await supabase
    .from("usuarios")
    .select("nombre, email")
    .eq("id", usuarioId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {data, error};
}

const obtenerCantidadPasswords= async(usuarioId) => {
  const { count, error } = await supabase
    .from("Password")
    .select("*", { count: "exact", head: true })
    .eq('usuario_id', usuarioId)

  if (error) {
    throw new Error(error.message);
  }

  return count;
}

