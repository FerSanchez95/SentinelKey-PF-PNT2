import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Boton from '../../../components/Button/Button.jsx';
import {agregarPassword, updatePasswordById} from '../service/password.service.js';

export default function PasswordModal({
  isOpen,
  onClose,
  edicion,
  datosIniciales = {}, // Puede recibir el Id del asuario como el Id de la password a editar.
}) {
  const dialogRef = useRef();
  const [formData, setFormData] = useState({
    usuario_id: datosIniciales.usuario_id,
    titulo: '',
    sitio_relacionado: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Inicializar datos si estamos en modo edición
  useEffect(() => {
    if (datosIniciales) {
      setFormData(datosIniciales);
    }
  }, []);

  // Cerrar con ESC o clic fuera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.titulo || formData.titulo.trim() === "") newErrors.titulo = 'El titulo es requerido';
    if (!formData.password || formData.password.trim() === "") newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validate()) {
      if (edicion && datosIniciales.id !== undefined){
        await actualizarPassword();
      } else {
        await agregarContraseña();
      }  
    }
  };

  const agregarContraseña = async() =>{
      try {
        await agregarPassword(formData); 
        setFormData({ titulo: "", sitio_relacionado: "", password: ''}); 
        onClose();
      } catch (error) {
        console.error("Error al agregar nueva contraseña:", error.message);
        alert("Error al guardar la contraseña. Inténtalo de nuevo.");
      };
  }

  const actualizarPassword = async() => {
    try{
      await updatePasswordById(datosIniciales.id, formData)
      onClose();
    } catch(error){
      console.log("Error al actualizar la contraseña: ", error.message);
      alert("Error al actualizar la contraseña. Intentelo nuevamente.");
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // Cierra al hacer clic fuera
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {edicion ? 'Editar contraseña' : 'Agregar nueva contraseña'}
        </h2>
        
        <form onSubmit={handleSubmit}>

          <input type="hidden" name="usuario_id" value={formData.usuario_id} />

          <div className="space-y-4">
            {/* Campo: Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                name="titulo"
                defaultValue={formData.titulo}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.titulo ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ej: SentinelKey "
              />
              {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
            </div>

            {/* Campo: Sitio relacionado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sitio web</label>
              <input
                type="url"
                name="sitio_relacionado"
                defaultValue={formData.sitio_relacionado}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: https://sentinelkey.com"
              />
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
              <input
                type="password"
                name="password"
                defaultValue={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <Boton tipo="default" type="button" onClick={onClose}>
              Cancelar
            </Boton>
            <Boton tipo="guardar" type="submit">
              {edicion ? 'Guardar cambios' : 'Agregar'}
            </Boton>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}