import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { registrarUsuario, completarRegistro} from '../../auth/auth.service.js';
import { Link } from 'react-router';


export default function SignUp() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nombreRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const emailOk = emailRef.current.value;
      const passwordOk = passwordRef.current.value;
      const nombreOk = nombreRef.current.value;

      const { user, error: signUpError } = await registrarUsuario(
        emailOk,
        passwordOk
      );

      if (signUpError) {
        throw signUpError;
      }

      // completo el registro pasando las varables faltantes  alatabla 'usuarios'
      const { error: insertError } = await completarRegistro(user, nombreOk);

      if (insertError){
        throw insertError;
      }

      navigate("/perfil");

    } catch(err) {
      setError(err.message ?? 'Ocurrio un error durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img></img>
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Registrar usuario
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-900">
              Nombre de usuario
            </label>
            <div className="mt-2">
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                autoComplete="nombre"
                ref={nombreRef}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Dirección de e-Mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                ref={emailRef}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                ref={passwordRef}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              onClick={handleSignUp}
              disabled={loading}
              className={`flex w-full justify-center rounded-md ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600'
              } px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {loading ? 'Creando cuenta...' : 'Registrate!'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          ¿Ya posees una cuenta?{' '}
           <Link to="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Ingresar al sitio
            </Link>
        </p>
      </div>
    </div>
  );
}
