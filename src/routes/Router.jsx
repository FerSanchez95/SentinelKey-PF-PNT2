import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "../components/SignIn/SignIn";   
import SignUp from "../components/SignUp/SignUp";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}