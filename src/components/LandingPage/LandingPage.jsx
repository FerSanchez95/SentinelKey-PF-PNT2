import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ShieldCheck, LockKeyhole } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const buttonBase = "px-4 py-2 rounded font-semibold transition-colors";
  const buttonVariants = {
    default: `${buttonBase} bg-purple-600 text-white hover:bg-purple-700`,
    ghost: `${buttonBase} text-purple-700 hover:bg-purple-100`,
    outline: `${buttonBase} border border-purple-600 text-purple-600 hover:bg-purple-50`
  };

  return (   
    <>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mt-16"
      >
        <h2 className="text-4xl font-extrabold mb-4 text-purple-700">
          Protegé tus contraseñas de forma simple y segura
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          SentinelKey es tu gestor de contraseñas con cifrado de última generación. Todo bajo tu control, desde cualquier dispositivo.
        </p>
        <div className="flex justify-center gap-4">
          <button className={buttonVariants.default} onClick={() => navigate("/signup")}>Empezar ahora</button>
          <button className={buttonVariants.outline} onClick={() => navigate("/signin")}>Ya tengo cuenta</button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left"
      >
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-purple-700 w-6 h-6 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Cifrado avanzado</h3>
            <p className="text-gray-600 text-sm">Utilizamos algoritmos como Argon2 y AES para garantizar máxima seguridad en cada acceso.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <LockKeyhole className="text-purple-700 w-6 h-6 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Privacidad garantizada</h3>
            <p className="text-gray-600 text-sm">Solo vos podés ver tus contraseñas. No almacenamos ni accedemos a tus claves maestras.</p>
          </div>
        </div>
      </motion.section>
    </>      
  );
}