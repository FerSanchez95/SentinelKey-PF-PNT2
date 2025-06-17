import React from "react";
import { useNavigate } from "react-router";

export default function Cabecera() {
    const navigate = useNavigate();

    const buttonBase = "px-4 py-2 rounded font-semibold transition-colors";
    const buttonVariants = {
        default: `${buttonBase} bg-purple-600 text-white hover:bg-purple-700`,
        ghost: `${buttonBase} text-purple-700 hover:bg-purple-100`,
        outline: `${buttonBase} border border-purple-600 text-purple-600 hover:bg-purple-50`
    }
    return(
        <header className="absolute top-0 left-0 w-full px-6 py-4 flex justify-between items-center border-b border-gray-200 bg-white/80 backdrop-blur-sm z-50">
        <h1 className="text-2xl font-bold text-purple-700">SentinelKey</h1>
        <nav className="space-x-4">
          <button className={buttonVariants.ghost} onClick={() => navigate("/signin")}>Ingresar</button>
          <button className={buttonVariants.default} onClick={() => navigate("/signup")}>Registrarse</button>
        </nav>
      </header>
    );
}