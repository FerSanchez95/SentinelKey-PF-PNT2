import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { obtenerDatosUsuario } from "../service/usuario.service.js";
import Boton from "../../../components/Button/Button.jsx";
import { Home } from 'lucide-react';

export default function EditarPerfil(data){

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleConfirm = () => {
        // Aquí podrías agregar la lógica para confirmar los cambios del perfil.
        console.log("Cambios confirmados para el usuario:", datosUsuario);
        navigate("/perfil");
    }

    const handleReturn = () => {
        navigate("/perfil");
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <img
              className="mx-auto h-16 w-16 rounded-full border-2 border-indigo-600"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                datosUsuario?.nombre
              )}&background=4f46e5&color=fff`}
              alt={`Avatar de ${datosUsuario?.nombre}`}
            />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
              {datosUsuario?.nombre}
            </h2>
            <p className="mt-1 text-sm text-gray-600">Información de tu cuenta</p>
          </div>
    
          {cargando ? 'Cargando datos...' : ''}
    
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow space-y-6">
            <div className="space-y-4 text-base text-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-medium">Nombre: </span>
                <input
                  className="ml-2 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
                  value={datosUsuario?.username || 'No disponible'}
                />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Correo electrónico: </span>
                <input
                  className="ml-2 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
                  value={datosUsuario?.email || 'No disponible'}
                />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contraseña: </span>
                <input
                  className="ml-2 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
                  value={datosUsuario?.password || 'No disponible'}
                />
              </div>
            </div>
            {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}
    
            <div className="flex flex-col space-y-3 gap-4">
              <Boton onClick={handleConfirm}>Confirmar</Boton>
              <Boton onClick={handleReturn}>Volver</Boton>
            </div>
          </div>
        </div>
      );
}