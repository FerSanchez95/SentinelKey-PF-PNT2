import React from 'react';
import { clsx } from 'clsx';
import { Pencil, Trash2, Plus, Home } from 'lucide-react'; // Iconos opcionales

const variantes = {
  agregar: {
    estilo: 'bg-green-600 hover:bg-green-700 text-white',
    icono: <Plus className="w-4 h-4 mr-2" />,
  },
  eliminar: {
    estilo: 'bg-red-600 hover:bg-red-700 text-white',
    icono: <Trash2 className="w-4 h-4 mr-2" />,
  },
  editar: {
    estilo: 'bg-blue-600 hover:bg-blue-700 text-white',
    icono: <Pencil className="w-4 h-4 mr-2" />,
  },
  default: {
    estilo: 'bg-gray-300 hover:bg-gray-400 text-black',
    icono: null,
  },
};

export default function Boton({
  tipo = 'default',        // 'agregar', 'eliminar', 'editar'
  onClick,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
  children,
  className = '',
  iconoPersonalizado = null,
  deshabilitado = false,
}) {
  const { estilo, icono } = variantes[tipo] || variantes.default;

  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      disabled={deshabilitado}
      className={clsx(
        'flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        estilo,
        className,
        deshabilitado && 'opacity-50 cursor-not-allowed'
      )}
    >
      {iconoPersonalizado || icono}
      {children}
    </button>
  );
}