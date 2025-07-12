import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { signOut } from '../../auth/auth.service';
import { useAuthStore } from '../../stores/authStore.js';
import Modal from '../Modal/Modal.jsx';

export default function SignOut() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();

      logout(null);

      navigate("/signin");

    } catch (err) {
      console.error("Error al cerrar sesión:", err.message);
    } 
  };

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => {
    setModalAbierto(false);
    navigate(-1);
  };

  const confirmarAccion = () => {
    handleSignOut();
    cerrarModal();
    navigate("/");
  };

  useEffect(()=>{abrirModal();}, [])

  return (
      <Modal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onConfirm={confirmarAccion}
        mensaje="¿Estás seguro de que deseas cerrar sesión?"
        textoCancelar="Cancelar"
        textoConfirmar="Cerrar sesión"
        tipoConfirmar="eliminar"
      />
  );
}
