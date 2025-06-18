import React from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../../stores/authStore.js";

export default function RutaProtegida({ children, redirecionarA }) {

    const estaAutenticado = useAuthStore((state) => state.isAuthenticated);

    console.log("Autenticado:", estaAutenticado);

	if (!estaAutenticado) {
        return <Navigate to={redirecionarA} />;
    }

	return children;
};

