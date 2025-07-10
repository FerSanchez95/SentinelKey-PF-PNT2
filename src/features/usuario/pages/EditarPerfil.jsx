import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { obtenerDatosUsuario, actualizarUsuario } from "../service/usuario.service.js";
import Boton from "../../../components/Button/Button.jsx";
import { Home } from 'lucide-react';


export default function EditarPerfil(data){

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    //const [fieldError, setFieldError] = useState(null);
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [formData, setFormData] = useState({nombre: '', email: ''});

    useEffect(() => {cargarDatosparaActualizar()},[])
    
    const cargarDatosparaActualizar = async () =>{

      if (!data?.usuario?.id) {
        setError("Id delusuario inválido.")
        return
      }

      try{
        setCargando(true);
        const datosObtenidos = await obtenerDatosUsuario(data?.usuario?.id);  
        if (!datosObtenidos){
          throw new Error("No se pudieron obtener los datos del usuario.");
        }
        setDatosUsuario(datosObtenidos);
      } catch (er) {
        console.log(er.message);
        setError(er.message ?? "No se pudieron obtener los datos del usurio.")
      } finally {
        setCargando(false);
      }
    };
    
    const actualizar = async() => {
      try{
        await actualizarUsuario(data?.usuario?.id, formData);
        navigate("/perfil");
      } catch(error){
        console.log(error.message);
        setError(error.message);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      try {
        // Acá hay que validar que los datos que se pasaron no esten vacios.
        // sepuede usar una función para completar los campos vacíos para usar acá y en 'handleChange'.
        console.log(formData); //for debug
        if(!formData){
          throw new Error("Debe ingresar correctamente los campos solicitados")
        }
        actualizar();
        navigate("/perfil");
      }catch(err){
        console.log(err.message);
        setError(err.message);
      }
    }

    const handleChange = (e) => {
      let { name, value } = e.target;
      e.preventDefault();
      if (!value){
        value = datosUsuario[name];
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReturn = () => { 
      console.log("Saliendo");
      console.log("FormData: ", formData);
      navigate("/perfil");
    };

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
            <p className="mt-1 text-sm text-gray-400">Información de tu cuenta</p>
          </div>
    
          {cargando ? 'Cargando datos...' : ''}
    
          
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 text-base text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="ml-2 flex-1 font-medium">Nombre: </span>
                  <input 
                    type="text"
                    name="nombre" 
                    className="ml-2 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm" 
                    placeholder={datosUsuario?.nombre || 'No Disponible'} 
                    //value={formData.nombre}
                    onChange={handleChange}/> 
                </div>
                <div className="flex justify-between">
                  <span className="ml-2 flex-1 font-medium">Correo electrónico: </span>
                  <input 
                    type="email"
                    name="email" 
                    className="ml-2 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm" 
                    placeholder={datosUsuario?.email || 'No Disponible'} 
                    //value={formData.email}
                    onChange={handleChange}/>
                </div>
              </div>
              {error && (
                    <div className="text-red-500 text-sm">
                      {error}
                    </div>
                  )}
              <div className="flex flex-col space-y-3 mt-6 gap-4">
                <Boton type="submit" tipo="editar">Confirmar</Boton>
              </div>
            </form>
            <div className="flex flex-col space-y-3 gap-4">
              <Boton onClick={handleReturn}>Volver</Boton>
            </div>
          </div>
        </div>
      );
}