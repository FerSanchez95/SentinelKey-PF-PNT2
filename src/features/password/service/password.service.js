import React from "react";
import { supabase } from "../../../auth/supabaseAuth.js";
import {
  hashPassword,
  unhashPassword,
} from "../../../service/passwordHandler.js";

/* Devuelve las contraseñas guardadas por el usuario.*/
export const fetchPasswordsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("usuario_id", userId);
  if (error) throw error;

  // const processedData = await Promise.all(data.map(async (password) => {
  //   password.valor = await unhashPassword(userId, password.password_cifrada);
  //   return password;
  // }));

  // return processedData;
  return data;
};

const fetchSinglePassword = async (userId, passwordId) => {
  const { data, error } = await supabase
    .from("passwords")
    .select("password_cifrada")
    .eq("id", passwordId)
    .eq("usuario_id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const validateData = (formData) => {
  const newErrors = {};
  const protocoloSeguro = "https://";

  if (!formData.titulo || formData.titulo.trim() === "") {
    newErrors.titulo = "El titulo es requerido";
  }
  if (
    formData.sitio_relacionado &&
    !formData.sitio_relacionado.includes(protocoloSeguro)
  ) {
    newErrors.sitio_relacionado = `La dirección URL debe contener "${protocoloSeguro}"`;
  }
  // Si no se ingresa un 'id' es porque no se almacenón anteriormente en la BD.
  if (!formData.id) {
    if (!formData.password || formData.password.trim() === "") {
      newErrors.password = "La contraseña es requerida";
    }
  }

  return newErrors;
};

export const manageSubmit = async (formData) => {
  // Toma la información desde 'formData' para decidir que acción tomar

  // Si 'formData' trae un 'id' quiere decir que es un password existente
  // que se está editando.
  try {
    if (formData.id !== undefined) {
      updatePasswordById(formData);
    } else {
      AddPassword(formData);
    }
  } catch (error) {
    console.warn("Error al manejar la solicitud: ", error.message);
    throw error;
  }
};

export const revealPassword = async (password) => {
  const datoProcesado = await unhashPassword(
    password.usuario_id,
    password.password_cifrada
  );
  return datoProcesado;
};

export const deletePasswordById = async (id) => {
  const { error } = await supabase.from("passwords").delete().eq("id", id);
  if (error) throw error;
};

export const deletePasswordsByIds = async (ids) => {
  const { error } = await supabase.from("passwords").delete().in("id", ids);
  if (error) throw error;
};

export const updatePasswordById = async (formData) => {
  // Obtengo la password almacenada desde la Bd usando el id.
  const fetchedData = await fetchSinglePassword(
    formData.usuario_id,
    formData.id
  );


  const dataToUpdate = { ...formData };
  if (!dataToUpdate.password) {
    dataToUpdate.password_cifrada = fetchedData.password_cifrada;
  } else {
    // Si llega una password empiezo por obtener el valor de la contraseña almacenda.
    const storedPassword = await unhashPassword(
      formData.usuario_id,
      fetchedData.password_cifrada
    );

    // Comparo los valores
    if (dataToUpdate.password !== storedPassword) {
      // Si los valores son distintos almaceno la nueva contraseña.
      dataToUpdate.password_cifrada = await hashPassword(
        dataToUpdate.usuario_id,
        dataToUpdate.password
      );
    } else {
      dataToUpdate.password_cifrada = fetchedData.password_cifrada;
    }
    delete { storedPassword };
  }
  // De todos modos elimino la contraseña que se ingresó en el fomulario.
  delete dataToUpdate.password;

  const { error } = await supabase
    .from("passwords")
    .update(dataToUpdate)
    .eq("id", formData.id)
    .eq("usuario_id", dataToUpdate.usuario_id);
  if (error) throw error;
};

export const AddPassword = async (passwordData) => {
  if (!passwordData || typeof passwordData.password === "undefined") {
    throw new Error("no se recibio password.");
  }

  const dataToInsert = {
    usuario_id: passwordData.usuario_id,
    titulo: passwordData.titulo,
    sitio_relacionado: passwordData.sitio_relacionado,
    password_cifrada: await hashPassword(
      passwordData.usuario_id,
      passwordData.password
    ),
  };

  const { data, error } = await supabase
    .from("passwords")
    .insert([dataToInsert])
    .select();

  if (error) throw new Error(`Error al agregar contraseña: ${error.message}`);
  return data[0];
};
