import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../auth/auth.service';
import { useAuthStore } from '../../stores/authStore.js'

export default function SignOutButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthStore();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();

      logout(null);

      navigate("/signin");
    } catch (err) {
      console.error("Error al cerrar sesión:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`px-4 py-2 rounded-md font-semibold text-white ${
        loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-500'
      }`}
    >
      {loading ? 'Cerrando sesión...' : 'Se ha cerrado la sesión'}
    </button>
  );
}
