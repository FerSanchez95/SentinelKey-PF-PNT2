import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Boton from '../Button/Button.jsx';
import {agregarPassword} from '../../features/password/service/password.service.js';

export default function PasswordModal({
  isOpen,
  onClose,
  //onSave, // Función que recibe los datos del formulario: { usuario_id, título, sitio_relacionado, password }
  initialData = {}, // Para modo edición (opcional)
}) {
  const dialogRef = useRef();
  const [formData, setFormData] = useState({
    usuario_id: initialData.usuario_id,
    titulo: '',
    sitio_relacionado: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Inicializar datos si estamos en modo edición
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
    if (!formData.título.trim()) newErrors.título = 'El título es requerido';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
        agregarPassword(formData);
      //onSave(formData);
      onClose();
    }
  };

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
          {initialData ? 'Editar contraseña' : 'Agregar nueva contraseña'}
        </h2>
        
        <form onSubmit={handleSubmit}>

          <input type="hidden" name="usuario_id" value={formData.usuario_id} />

          <div className="space-y-4">
            {/* Campo: Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                name="título"
                value={formData.título}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.título ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ej: Correo personal"
              />
              {errors.título && <p className="text-red-500 text-xs mt-1">{errors.título}</p>}
            </div>

            {/* Campo: Sitio relacionado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sitio web</label>
              <input
                type="url"
                name="sitio_relacionado"
                value={formData.sitio_relacionado}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: https://gmail.com"
              />
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <Boton tipo="default" onClick={onClose}>
              Cancelar
            </Boton>
            <Boton tipo="guardar" type="submit">
              {initialData ? 'Guardar cambios' : 'Agregar'}
            </Boton>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}