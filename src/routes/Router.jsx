import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router';
import { useAuthStore } from '../stores/authStore.js';
import RutaProtegida from '../components/RutaProtegida/RutaProtegida.jsx'
import Usuario from '../features/usuario/pages/Usuario.jsx'
import SignIn from "../components/SignIn/SignIn.jsx";   
import SignUp from "../components/SignUp/SignUp.jsx";
import SignOut from "../components/SignOut/SignOut.jsx";
import Password from "../features/password/pages/Password.jsx";
import LandingPage from "../components/LandingPage/LandingPage.jsx"
import NavBar from "../components/NavBar/NavBar.jsx";

export default function Router() {

  const userData = useAuthStore((state) => state.user);
  return (
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signout" element={<SignOut />} />
      <Route path="/passwords" element={<Password />} />
      <Route 
        path="/perfil" 
        element={
        <RutaProtegida redirecionarA="/">
          <Usuario usuario={userData}/>
        </RutaProtegida>}
      />
    </Routes>
    </BrowserRouter>
  );
}