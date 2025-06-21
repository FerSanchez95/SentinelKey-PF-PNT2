import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../auth/supabaseAuth.js';
import { useAuthStore } from '../../../stores/authStore.js';
import {
  fetchPasswordsByUserId,
  deletePasswordsByIds,
  updatePasswordById,
  agregarPassword
} from '../service/password.service.js';
import classNames from 'classnames';
import Boton from '../../../components/Button/Button.jsx';
import PasswordModal from '../../../components/PasswordModal/PasswordModal.jsx';


export default function Password() {
  const [passwords, setPasswords] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ titulo: "", valor: "" });
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState({ titulo: "", valor: "", sitio_relacionado: "" });
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef(null);
  const LONG_PRESS_THRESHOLD = 2000;

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


  const handleCopyToClipboard = (passwordToCopy) => {

    navigator.clipboard.writeText(passwordToCopy)
      .then(() => {
        alert(`¡Contraseña copiada al porta-papeles!`);
      })
      .catch(err => {
        console.error('Falló la obtención de la contraseña: ', err);
        alert('Error al copiar la información, intentelo nuevamente!');
      });
  }
  
  //Función que controla que pasa cuando se mantien presinado  
  //el componente.
  const handlePointerDown = (id) => {

    if(!id) throw new Error(`El ID proporcionado es ${id.type}`);

    setIsPressing(true);
    
    pressTimer.current = setTimeout(() => {
      handleSelect(id); 
      setIsPressing(false);

      if (pressTimer.current) {
          clearTimeout(pressTimer.current);
          pressTimer.current = null;
      }
    }, LONG_PRESS_THRESHOLD);
  };

  //Función que controla que pasa cuando se deja de presionar 
  //el component
  const handleClick = (passwordObtenida) => {
    
    if (pressTimer.current) {
      clearTimeout(pressTimer.current); 
      pressTimer.current = null;

      if (isPressing) {
        handleCopyToClipboard(passwordObtenida);
      }
    }
    setIsPressing(false);
  };

  //Función que controla que pasa cuando se deja de presionar 
  //el componente moviendo le mouse fuera del área del mismo.
  const handlePointerLeave = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsPressing(false); // Reset pressing state
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
    setFormData({ titulo: password.titulo, valor: password.valor });
  };

  const handleUpdate = async () => {
    try {
      await updatePasswordById(user.id, editingId, formData);
      setEditingId(null);
      fetchPasswords(user.id);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddNewPassword = async () => {
    if (!newPassword.titulo || !newPassword.valor) {
      // Basic validation
      alert("Por favor, completa el título y la contraseña.");
      return;
    }

    try {
      await agregarPassword(user.id, newPassword); 
      setNewPassword({ titulo: "", valor: "", sitio_relacionado: "" }); 
      setShowModal(false); 
      fetchPasswords(user.id); 
    } catch (error) {
      console.error("Error al agregar nueva contraseña:", error.message);
      alert("Error al guardar la contraseña. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestor de Contraseñas</h1>

      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500"
      >
        ➕ Agregar nueva contraseña
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">
              Agregar nueva contraseña
            </h2>

            <input
              type="text"
              placeholder="Nombre del servicio (Ej: Gmail)"
              value={newPassword.titulo}
              onChange={(e) =>
                setNewPassword({ ...newPassword, titulo: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Sitio relacionado"
              value={newPassword.sitio_relacionado}
              onChange={(e) =>
                setNewPassword({ ...newPassword, sitio_relacionado: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Contraseña"
              value={newPassword.valor}
              onChange={(e) =>
                setNewPassword({ ...newPassword, valor: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
              onClick={handleAddNewPassword}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500"
            >
              Guardar
            </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {passwords.length === 0 && <p>No hay contraseñas cargadas.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passwords.map((pwd) => (
          <div
            key={pwd.id}
            className={classNames(
              "rounded-xl border p-4 shadow-md cursor-pointer hover:shadow-lg transition",
              selectedIds.includes(pwd.id)
                ? "bg-blue-100 border-blue-500"
                : "bg-white"
            )}
          >
            {editingId === pwd.id ? (
              <div>
                <label>Título</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  className="w-full mb-2 p-1 border rounded"
                />
                <label>Password</label>
                <input
                  type="password"
                  value={formData.valor}
                  onChange={(e) =>
                    setFormData({ ...formData, valor: e.target.value })
                  }
                  className="w-full mb-2 p-1 border rounded"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div
              >
                <h2 className="font-semibold text-lg">🔐 {pwd.titulo}</h2>
                <div className="flex justify-between mt-2">
                  
                  <Boton
                  tipo='editar'
                  onClick={() => {handleEdit(pwd)}}
                  >
                    Editar
                  </Boton>
                    
                  <Boton
                  onPointerDown={() => {handlePointerDown(pwd.id)}}
                  onPointerLeave={handlePointerLeave}
                  //onPointerUp={() => handlePointerUp(pwd.id)}
                  onClick={(e) => {
                    e.preventDefault(); // Evita conflictos con el long press
                    handleClick(pwd.valor);
                  }}>
                    {selectedIds.includes(pwd.id) ? "Selecionado": "Obtener"}
                  </Boton>

                  <Boton 
                    tipo='eliminar'
                    onClick={async (e) => {
                      e.stopPropagation(); 
                      const { error } = await supabase
                        .from("passwords")
                        .delete()
                        .eq("id", pwd.id);
                      if (!error) fetchPasswords(user.id);
                    }}
                    className="text-red-600 text-sm"
                  >
                    Eliminar
                  </Boton>
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