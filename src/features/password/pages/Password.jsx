import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../../../stores/authStore.js';
import {
  fetchPasswordsByUserId,
  revealPassword,
  deletePasswordById,
  deletePasswordsByIds,
} from '../service/password.service.js';
import classNames from 'classnames';
import Boton from '../../../components/Button/Button.jsx';
import Tag from '../../../components/Tag/Tag.jsx';
import PasswordModal from '../components/PasswordModal.jsx';
import { toast } from 'react-toastify';


export default function Password() {
  const [passwords, setPasswords] = useState([]); //Almacena las contraseñas del usuario
  const [selectedIds, setSelectedIds] = useState([]); //lista de paswordId seleccionados.
  const [editingId, setEditingId] = useState(null); //Id de password a editar
  const [error, setError] = useState(null);
  const [eliminacion, setEliminacion] = useState(null);
  const [showModal, setShowModal] = useState(false); //abre o cierra el modal
  const [isPressing, setIsPressing] = useState(false); //para saber si uno de los botones está presionado.
  const pressTimer = useRef(null);
  const LONG_PRESS_THRESHOLD = 2000;

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) fetchPasswords(user.id);
  }, [user, passwords]);
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
        toast.success(`¡Contraseña copiada al porta-papeles!`);
      })
      .catch(err => {
        console.error('Falló la obtención de la contraseña: ', err);
        toast.error('Error al copiar la información, intentelo nuevamente!');
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
  const handleClick = async(passwordObtenida) => {
    
    if (pressTimer.current) {
      clearTimeout(pressTimer.current); 
      pressTimer.current = null;

      if (isPressing) {
        const valordescifrado = await revealPassword(passwordObtenida);
        handleCopyToClipboard(valordescifrado);
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


  const handleDelete = async(id) => {
    try {
      await deletePasswordById(id);
      setEliminacion(true);
      fetchPasswords(user.id);
      await timeOut(2000);
      setEliminacion(false);      
    } catch(error){
      console.log("Error al eliminar la constraseña: ", error.message);
      setError("Ocurrió un error al intentar eliminar la constraseña. Intentelo nuevamente.")
    }
  }
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
    setShowModal(true);
    //setFormData({ titulo: password.titulo, valor: password.valor });
  };

  const handleModalClose = () =>{
    setShowModal(false);
    setEditingId(null);
    fetchPasswords(user.id);
  }

  const timeOut = async(delay) =>{
    await new Promise( resolve => {
      setTimeout(resolve, delay)
    })
  }

  return (
    <div className="p-4">

      <div className="mb-4">
        <h1 className="text-3xl font-bold text-purple-700 tracking-tight">Tu Bóveda de Contraseñas Segura</h1>
        <p className="text-sm text-gray-500">Almacena, protege y gestiona tus claves fácilmente</p>
      </div>

      <div className='flex justify-center'>
        <Boton tipo='agregar' onClick={() => setShowModal(true)}>
          Agregar nueva contraseña
        </Boton>
      </div>

      {error && <Tag type='error'>{error}</Tag>}

      <PasswordModal 
        isOpen={showModal} 
        onClose={handleModalClose}
        datosIniciales={{usuario_id: user.id}}
      />

      <div className='flex mt-5 mb-3 justify-center'>
        {passwords.length === 0 && <Tag type='info'>No hay contraseñas almacenadas actualmente</Tag>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passwords.map((pwd) => (
          <div
            key={pwd.id}
            className={classNames(
              "rounded-xl border border-gray-200 p-4 shadow-md cursor-pointer hover:shadow-lg transition",
              selectedIds.includes(pwd.id)
                ? "bg-blue-100 border-blue-500"
                : "bg-white"
            )}
          >
            {editingId === pwd.id ? (
              
              <PasswordModal 
                isOpen={showModal}
                onClose={handleModalClose}
                edicion={true}
                datosIniciales={pwd}
              />
            ) : ( !eliminacion ? 
              (<div>
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
                    onClick={(e) => {
                      e.preventDefault(); // Evita conflictos con el long press
                      handleClick(pwd);
                    }}>
                      {selectedIds.includes(pwd.id) ? "Selecionado": "Obtener"}
                  </Boton>

                  <Boton 
                    tipo='eliminar'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(pwd.id);
                    }}
                    className="text-red-600 text-sm"
                  >
                    Eliminar
                  </Boton>
                </div>
              </div>) : (<Tag type='error'>Eliminando</Tag>)
            )}
          </div>
        ))}
      </div>
      <div className='mt-6'>
        <p className="text-sm text-gray-500">Presiona y mantén 'Obtener' para alternar la selección de ítems.</p>

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