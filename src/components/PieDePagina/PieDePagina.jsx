import React from "react";

export default function PieDePagina(){

    return(
        <footer className="mt-20 text-sm text-gray-500 border-t border-gray-200 pt-6 w-full text-center">
            © {new Date().getFullYear()} SentinelKey. Todos los derechos reservados.
        </footer>
    );
}


