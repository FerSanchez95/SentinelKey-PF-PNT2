import React from "react";
import { useNavigate } from "react-router";
import { obtenerDatosUsuario } from "../service/usuario.service.js";

export default function Usuario(user) {
  
  const navigate = useNavigate();

  // Manejador de edición de perfil.
  const handleEditProfile = () => {
    navigate("/editar-perfil"); // Agregar
  };

  // Manejador para redirigir a la página principal.
  const handleGoHome = () => {
    navigate("/");
  };

   // Manejador para cerrar sesión.
  const handleSingOut = () => {
    navigate("/singout");
  }

  const usuario = obtenerDatosUsuario(user.id)

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          className="mx-auto h-16 w-16 rounded-full border-2 border-indigo-600"
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            usuario.nombre
          )}&background=4f46e5&color=fff`}
          alt={`Avatar de ${usuario.nombre}`}
        />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
          Perfil de {usuario.nombre}
        </h2>
        <p className="mt-1 text-sm text-gray-600">Información de tu cuenta</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        <div className="space-y-4 text-base text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Nombre:</span>
            <span>{usuario.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Correo electrónico:</span>
            <span>{usuario.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Contraseñas almacenadas:</span>
            <span>{usuario.cantidadPass}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleEditProfile}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Editar perfil
          </button>
          <button
            onClick={handleSingOut}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Cerrar sesión
          </button>
          <button
            onClick={handleGoHome}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Volver a la página principal
          </button>
        </div>
      </div>
    </div>
  );
}
