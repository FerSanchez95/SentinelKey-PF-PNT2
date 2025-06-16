import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { signOut } from '../../auth/auth.service';
import { useAuthStore } from '../../stores/authStore.js';
import Boton from '../Button/Button.jsx';
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
  const cerrarModal = () => setModalAbierto(false);

  const confirmarAccion = () => {
    handleSignOut();
    cerrarModal();
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
