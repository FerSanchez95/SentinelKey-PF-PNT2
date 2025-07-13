import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { obtenerDatosUsuario } from "../service/usuario.service.js";
import Boton from "../../../components/Button/Button.jsx";
import Tag from '../../../components/Tag/Tag.jsx';
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
  };


  useEffect(() => {

    const cargaDeDatos = async() => {

      if (!data?.usuario?.id) {
        setError("Id delusuario inválido.")
        return
      }
      try{
        setCargando(true);
        const datosObtenidos = await obtenerDatosUsuario(data?.usuario?.id);
        
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

    cargaDeDatos();

  },[]); //<- ESLint te sugiere sacar el array de dependencias vacío... No lo hagas, se rompe todo :)


  if (cargando) {
    return (
      <div className="flex justify-center mt-8 mb-4">
        <Tag type='info'>Cargando datos...</Tag>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-8 mb-4">
        <Tag type='error'>{error}</Tag>
      </div>
    );
  }

  if (!datosUsuario) {
    return (
      <div className="flex justify-center mt-8 mb-4">
        <Tag type='warning'>No se encontraron datos del usuario</Tag>
      </div>
    );
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
        <h2 className="mt-4 mb-2 text-3xl font-bold tracking-tight text-gray-900">
          {datosUsuario?.nombre}
        </h2>
        <Tag type="info">Información de tu cuenta</Tag>
      </div>

      {cargando && <Tag type='info'>Cargando datos...</Tag> }

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        <div className="space-y-4 text-base text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Nombre: </span>
            <span>{datosUsuario?.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Correo: </span>
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
          <Boton tipo="cerrarSesion" onClick={handleSingOut}>Cerrar Sesion</Boton>
          <Boton onClick={handleGoHome} iconoPersonalizado={<Home className="w-4 h-4 mr-2" />}> Volver</Boton>
        </div>
      </div>
    </div>
  );
}
