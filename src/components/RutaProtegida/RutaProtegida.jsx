import React from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../../stores/authStore.js";

export default function RutaProtegida({ children, redirecionarA }) {

    const estaAutenticado = useAuthStore((state) => state.isAuthenticated);

	if (!estaAutenticado) {
        return <Navigate to={redirecionarA} />;
    }

	return children;
};

