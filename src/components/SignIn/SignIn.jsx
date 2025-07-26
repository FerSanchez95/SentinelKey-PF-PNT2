import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { IniciarSesion } from '../../auth/auth.service.js';
import { Link } from 'react-router';
//import { cargarDatosUsuario } from '../../features/usuario/service/usuario.service.js';

export default function SignIn() {
  
  const emailRef = useRef('');
  const passwordRef = useRef('');
  
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {

    e.preventDefault(); 
    setLoading(true);
    setError(null);
    try {

      const { error: inicioInvalido } = await IniciarSesion(emailRef.current.value, passwordRef.current.value);

      if (inicioInvalido) {
        console.log(inicioInvalido.message)
        setError("Ocurrió un error al iniciar sesión")
      }

      navigate("/perfil")

    } catch (err) {

      console.error(err.message);
      setError(err.message || 'Error during sign in');

    } finally {

      setLoading(false);

    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          /> */}
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Ingresa a tu cuenta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Dirección de E-Mail
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  ref={emailRef}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  ref={passwordRef}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                onClick={handleLogin}
                disabled={loading}
                className={`flex w-full justify-center rounded-md ${
                  loading ? 'bg-indigo-400' : 'bg-indigo-600'
                } px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                ¡Registrate!
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

