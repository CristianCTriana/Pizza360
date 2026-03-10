"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Asegúrate de que esta ruta coincida con donde creaste firebase.ts

export default function AdminPage() {
  // Estados para el formulario y la autenticación
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Función que se ejecuta al enviar el formulario
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiamos errores previos

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setIsAuthenticated(true);
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
      console.error(err);
    }
  };

  // Pantalla 1: Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-black">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Acceso Administrador
          </h1>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-2 font-medium">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Pantalla 2: Panel de Control (Lo armaremos en el siguiente paso)
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Panel de Gestión del Menú
        </h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium">
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded text-black shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">
          Agregar Nuevo Plato
        </h2>
        <p>
          ¡Login exitoso! Aquí irá el formulario para
          Cloudinary + Firestore.
        </p>
      </div>
    </div>
  );
}
