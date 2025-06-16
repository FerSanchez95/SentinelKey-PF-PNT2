import React from "react";
import { Routes, Route } from 'react-router';
//import { useAuthStore } from '../stores/authStore.js';
import RutaProtegida from '../components/RutaProtegida/RutaProtegida.jsx'
import Usuario from '../features/usuario/pages/Usuario.jsx'
import SignIn from "../components/SignIn/SignIn.jsx";   
import SignUp from "../components/SignUp/SignUp.jsx";

export default function Router() {

  //const usuario = useAuthStore((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/perfil" element={<Usuario />} />
      {/* <Route 
        path="/perfil" 
        element={
        <RutaProtegida redirecionarA="/">
          <Usuario user={usuario}/>
        </RutaProtegida>}
      /> */}
    </Routes>
  );
}