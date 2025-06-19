import { useEffect, useState } from 'react';
import { supabase } from '../../../auth/supabaseAuth.js';
import { useAuthStore } from '../../../stores/authStore.js';
import {
  fetchPasswordsByUserId,
  deletePasswordsByIds,
  updatePasswordById,
} from '../service/password.service.js';
import classNames from 'classnames';

export default function Password() {
  const [passwords, setPasswords] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', valor: '' });

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) fetchPasswords(user.id);
  }, [user]);

  const fetchPasswords = async (userId) => {
    try {
      const data = await fetchPasswordsByUserId(userId);
      setPasswords(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await deletePasswordsByIds(selectedIds);
      setSelectedIds([]);
      fetchPasswords(user.id);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = (password) => {
    setEditingId(password.id);
    setFormData({ nombre: password.nombre, valor: password.valor });
  };

  const handleUpdate = async () => {
    try {
      await updatePasswordById(editingId, formData);
      setEditingId(null);
      fetchPasswords(user.id);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestor de Contraseñas</h1>

      {passwords.length === 0 && <p>No hay contraseñas cargadas.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passwords.map((pwd) => (
          <div
            key={pwd.id}
            onClick={() => handleSelect(pwd.id)}
            className={classNames(
              'rounded-xl border p-4 shadow-md cursor-pointer hover:shadow-lg transition',
              selectedIds.includes(pwd.id)
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white'
            )}
          >
            {editingId === pwd.id ? (
              <div>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full mb-2 p-1 border rounded"
                />
                <input
                  type="text"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="w-full mb-2 p-1 border rounded"
                />
                <button onClick={handleUpdate} className="bg-green-600 text-white px-2 py-1 rounded">
                  Guardar
                </button>
              </div>
            ) : (
              <div>
                <h2 className="font-semibold text-lg">🔐 {pwd.titulo}</h2>
                <p className="text-gray-700 break-words">{pwd.password_cifrada}</p>
                <div className="flex justify-between mt-2">
                  <button onClick={() => handleEdit(pwd)} className="text-blue-600 text-sm">Editar</button>
                  <button
                    onClick={async () => {
                      const { error } = await supabase.from('passwords').delete().eq('id', pwd.id);
                      if (!error) fetchPasswords(user.id);
                    }}
                    className="text-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-500"
          >
            Eliminar seleccionados
          </button>
        </div>
      )}
 </div>
);
}




// import React from 'react';
// import ServiceCard from '../../../components/Card/Card.jsx'

// export default function Password() {
//     /**
//      * ¿Tiene que trarer todas las contraseñas?
//      * - Modificar las tarjetas par que queden más presentables.
//      * - Cada elemento 'Card' tiene que poder ser seleccionado.
//      * - Las tarjetas deben poder selecionarse y editarse individualmente.
//      * - Las contraseñas, como entidad, tienen que poder ser:
//      *      - Editadas (individualmente)
//      *      - Eliminadas (individualmente o varias en una sola consulta)
//      * - Las consultas deben ser hechas a partir del 'id' o el 'usuario_id' (propiedades de la tabla en SB).
//      * - Agrupar la lógica de negocio en el servicio. 
//     */
//     return (                            
//         <ServiceCard serviceName={"Gmail"} serviceInfo={"this@email.com"} />
//     );
// } 