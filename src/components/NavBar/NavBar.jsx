import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../auth/supabaseAuth.js';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const NavBar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        setUser(null);
        return;
      }
      setUser(user);
    };
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderEmailUser = (user) => user ? user.email.split("@")[0] : "Desconocido";

  const handleSignOut = async () => {
    setLoading(true);
    try {
      navigate("/signout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-200">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center">
                <button className="text-gray-700 font-bold hover:text-indigo-300" onClick={() => {navigate("/")}}>SentinelKey</button>
              </div>

              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <NavLink to="/passwords" className={({ isActive }) => classNames(
                    isActive ? 'bg-gray-700 text-white border-b-4 border-transparent hover:border-b-indigo-500' : 'text-gray-700 border-b-4 border-transparent  hover:bg-gray-700 hover:text-white  hover:border-b-indigo-500',
                    'rounded-md px-3 py-2 text-sm font-medium'
                  )}>
                    Bóveda
                  </NavLink>

                  {user ? (
                    <>
                      <NavLink to="/perfil" className={({ isActive }) => classNames(
                        isActive ? 'bg-gray-700 text-white border-b-4 border-transparent hover:border-b-indigo-500' : 'text-gray-700 border-b-4 border-transparent  hover:bg-gray-700 hover:text-white  hover:border-b-indigo-500',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}>
                        Perfil
                      </NavLink>

                      <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="text-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink to="/signin" className={({ isActive }) => classNames(
                        isActive ? 'bg-gray-700 text-white' : 'text-gray-700 border-b-4 border-transparent hover:bg-gray-700  hover:text-white hover:border-b-indigo-500',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}>
                        Ingresar
                      </NavLink>
                      <NavLink to="/signup" className={({ isActive }) => classNames(
                        isActive ? 'bg-gray-700 text-white' : 'text-gray-700 border-b-4 border-transparent hover:bg-gray-700  hover:text-white hover:border-b-indigo-500 ',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}>
                        Registrarse
                      </NavLink>
                    </>
                  )}
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {user && (
                  <span className="text-gray-700 mr-4 hidden sm:inline">
                    🟢 {renderEmailUser(user)}
                  </span>
                )}

                <Disclosure.Button className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <NavLink to="/passwords" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Bóveda
              </NavLink>

              {user ? (
                <>
                  <NavLink to="/perfil" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Perfil
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="block w-full text-center rounded-md px-3 py-2 text-base font-medium bg-red-600 text-white hover:bg-red-500"
                  >
                    {loading ? 'Cerrando...' : 'Cerrar sesión'}
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/signin" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Ingresar
                  </NavLink>
                  <NavLink to="/signup" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Registrarse
                  </NavLink>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default NavBar;
