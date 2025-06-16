import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { obtenerDatosUsuario } from "../service/usuario.service.js";
import Boton from "../../../components/Button/Button.jsx";
import { Home } from 'lucide-react';

export default function Usuario(data) {
  
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [cargando, setCargando] = useState(false);

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
    navigate("/signout");
  }


  const cargaDeDatos = async() =>{

    if (!data?.usuario?.id) {
      setError("Id delusuario inválido.")
      return
    }

    try{
      setCargando(true);
      const datosObtenidos = await obtenerDatosUsuario(data?.usuario?.id);
      console.log(datosObtenidos);

      if (!datosObtenidos){
        throw new Error();
      }
      setDatosUsuario(datosObtenidos);
    } catch (er) {
      console.log(er.message);
      setError(er.message ?? "No se pudieron obtener los datos del usurio.")
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargaDeDatos();
  }, []);


    if (cargando) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!datosUsuario) {
    return <p>No se encontraron datos del usuario.</p>;
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
          <div className="flex justify-between">
            <span className="font-medium">Nombre: </span>
            <span>{datosUsuario?.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Correo electrónico: </span>
            <span>{datosUsuario?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Contraseñas almacenadas: </span>
            <span>{datosUsuario?.cantidadPass}</span>
          </div>
        </div>
        {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

        <div className="flex flex-col space-y-3 gap-4">
          <Boton tipo="editar" onClick={handleEditProfile}>Editar Perfil</Boton>
          <button
            onClick={handleSingOut}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Cerrar sesión
          </button>
          <Boton onClick={handleGoHome} iconoPersonalizado={<Home className="w-4 h-4 mr-2" />}> Volver</Boton>
        </div>
      </div>
    </div>
  );
}
