"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import PlatoCard from "@/components/PlatoCard"; // <-- Importamos el nuevo componente

// Asegúrate de que tenga "export" al inicio
export interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempoPreparacion: number;
  categoria: string;
  imagenUrl: string;
  disponible: boolean;
}

export default function MenuPublico() {
  const [productos, setProductos] = useState<Producto[]>(
    [],
  );
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<
    string | null
  >(null);
  const [terminoBusqueda, setTerminoBusqueda] =
    useState("");

  useEffect(() => {
    const obtenerMenu = async () => {
      try {
        const data = await getDocs(
          collection(db, "productos"),
        );
        const lista = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Producto[];
        setProductos(
          lista.filter(
            (plato) => plato.disponible === true,
          ),
        );
      } catch (error) {
        console.error("Error obteniendo el menú:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerMenu();
  }, []);

  const busquedaActiva = terminoBusqueda.trim().length > 0;

  const productosFiltrados = productos.filter((plato) => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      plato.nombre.toLowerCase().includes(busqueda) ||
      plato.descripcion.toLowerCase().includes(busqueda)
    );
  });

  const menuAgrupado = productos.reduce(
    (acc, producto) => {
      if (!acc[producto.categoria])
        acc[producto.categoria] = [];
      acc[producto.categoria].push(producto);
      return acc;
    },
    {} as Record<string, Producto[]>,
  );

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-orange-600 font-bold animate-pulse">
          Cargando el menú...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex flex-col font-sans">
      <Header
        terminoBusqueda={terminoBusqueda}
        setTerminoBusqueda={setTerminoBusqueda}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto">
        {Object.keys(menuAgrupado).length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Pronto agregaremos platos deliciosos.
          </p>
        ) : busquedaActiva ? (
          <div className="p-4 md:p-6 animate-fade-in pb-8">
            <h2 className="text-2xl font-black text-gray-800 uppercase border-b-4 border-[#CCFF00] inline-block mb-6">
              Resultados para "{terminoBusqueda}"
            </h2>

            {productosFiltrados.length === 0 ? (
              <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">
                No encontramos ningún plato con esos
                ingredientes o nombre.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Usamos el componente PlatoCard para los resultados de búsqueda */}
                {productosFiltrados.map((plato) => (
                  <PlatoCard
                    key={plato.id}
                    plato={plato}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {!categoriaActiva && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:p-6 w-full">
                {Object.entries(menuAgrupado).map(
                  ([categoria, platos]) => (
                    <Card
                      key={categoria}
                      onClick={() =>
                        setCategoriaActiva(categoria)
                      }
                      imagenUrl={platos[0].imagenUrl}
                      categoria={categoria}
                    />
                  ),
                )}
              </div>
            )}

            {categoriaActiva && (
              <div className="p-4 md:p-6 animate-fade-in pb-8">
                <div className="flex items-center mb-6 mt-2">
                  <button
                    onClick={() => setCategoriaActiva(null)}
                    className="text-[#E8751A] font-bold text-lg mr-4 hover:scale-110 transition-transform">
                    ◀ Volver
                  </button>
                  <h2 className="text-2xl font-black text-gray-800 uppercase border-b-4 border-[#CCFF00] inline-block">
                    {categoriaActiva}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Usamos el componente PlatoCard para la vista de categorías */}
                  {menuAgrupado[categoriaActiva].map(
                    (plato) => (
                      <PlatoCard
                        key={plato.id}
                        plato={plato}
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/573177535468?text=Hola,%20vengo%20del%20menú%20digital%20y%20me%20gustaría%20hacer%20un%20pedido."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 md:bottom-28 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300 z-50 flex items-center justify-center group"
        aria-label="Pedir por WhatsApp">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 relative z-10">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.418-.099.824z" />
          <path d="M12.031 2c5.466 0 9.904 4.437 9.904 9.904 0 5.463-4.438 9.904-9.904 9.904-1.74 0-3.364-.452-4.735-1.235l-5.296 1.39 1.411-5.162c-.856-1.415-1.309-3.056-1.309-4.795 0-5.466 4.437-9.904 9.903-9.906zm0 1.584c-4.593 0-8.322 3.729-8.322 8.322 0 1.5.389 2.923 1.127 4.197l-.929 3.398 3.483-.915c1.236.666 2.635 1.019 4.093 1.019 4.593 0 8.32-3.728 8.32-8.32 0-4.591-3.728-8.32-8.32-8.321z" />
        </svg>
      </a>
    </div>
  );
}
