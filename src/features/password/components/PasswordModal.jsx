import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Boton from "../../../components/Button/Button.jsx";
import { manageSubmit, validateData } from "../service/password.service.js";

export default function PasswordModal({
  isOpen,
  onClose,
  edicion,
  datosIniciales = {}, // Puede recibir el Id del asuario como el Id de la password a editar.
}) {
  const dialogRef = useRef();
  const [formData, setFormData] = useState({
    usuario_id: datosIniciales.usuario_id,
    id: datosIniciales.id,
    titulo: "",
    sitio_relacionado: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  /*
  Inicializar datos si estamos en modo edición
  Si se ingresan los datos desde 'password' 
  se deben actualizar solo los que se ingresan 
  por el formulario del modal.
  */

  useEffect(() => {
    if (datosIniciales) {
      setFormData(datosIniciales);
    }
  }, [datosIniciales]);

  // Cerrar con ESC o clic fuera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateData(formData);

    if (Object.keys(newErrors).length === 0) {
      try {
        await manageSubmit(formData);
        setFormData({ titulo: "", sitio_relacionado: "", password: "" });
        onClose();
      } catch (error) {
        console.error("Error al procesar la contraseña:", error.message);
        alert("Error al procesar la contraseña. Inténtalo de nuevo.");
      }
    } else {
      setErrors(newErrors);
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
          {edicion ? "Editar contraseña" : "Agregar nueva contraseña"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="usuario_id" value={formData.usuario_id} />

          <div className="space-y-4">
            {/* Campo: Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                defaultValue={formData.titulo}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.titulo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: SentinelKey "
              />
              {errors.titulo && (
                <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
              )}
            </div>

            {/* Campo: Sitio relacionado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio web
              </label>
              <input
                type="text"
                name="sitio_relacionado"
                defaultValue={formData.sitio_relacionado}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded-md ${
                  errors.sitio_relacionado
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Ej: https://sentinelkey.com"
              />
              {errors.sitio_relacionado && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sitio_relacionado}
                </p>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                defaultValue={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <Boton tipo="default" type="button" onClick={onClose}>
              Cancelar
            </Boton>
            <Boton tipo="guardar" type="submit">
              {edicion ? "Guardar cambios" : "Agregar"}
            </Boton>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
