import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Boton from '../Button/Button.jsx';

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  mensaje = '¿Estás seguro?',
  textoCancelar = 'Cancelar',
  textoConfirmar = 'Aceptar',
  tipoConfirmar = 'eliminar',
}) {
  const dialogRef = useRef();

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Cerrar al hacer clic fuera del modal
  const handleClickOutside = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()} // evita que el click en el modal cierre el fondo
      >
        <p className="text-gray-800 text-center text-lg font-medium mb-6">{mensaje}</p>
        <div className="flex justify-center gap-4">
          <Boton tipo="default" onClick={onClose}>
            {textoCancelar}
          </Boton>
          <Boton tipo={tipoConfirmar} onClick={onConfirm}>
            {textoConfirmar}
          </Boton>
        </div>
      </div>
    </div>,
    document.body
  );
}