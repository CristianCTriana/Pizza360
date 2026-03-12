"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Ajusta la ruta a tu archivo de configuración
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header";

// La misma interfaz que usaste en el panel admin
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

  useEffect(() => {
    const obtenerMenu = async () => {
      try {
        const productosRef = collection(db, "productos");
        const data = await getDocs(productosRef);

        const lista = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Producto[];

        // EL FILTRO MÁGICO: Solo guardamos los que están disponibles
        const platosDisponibles = lista.filter(
          (plato) => plato.disponible === true,
        );

        setProductos(platosDisponibles);
      } catch (error) {
        console.error("Error obteniendo el menú:", error);
      } finally {
        setCargando(false); // Apagamos el estado de carga al terminar
      }
    };

    obtenerMenu();
  }, []);

  // Agrupamos por categoría tal como lo hicimos en el panel de administrador
  const menuAgrupado = productos.reduce(
    (acc, producto) => {
      if (!acc[producto.categoria]) {
        acc[producto.categoria] = [];
      }
      acc[producto.categoria].push(producto);
      return acc;
    },
    {} as Record<string, Producto[]>,
  );

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-orange-500 font-semibold animate-pulse">
          Preparando el menú...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* Encabezado del Menú */}
      <Header />

      {/* Contenedor Principal */}
      <main className="max-w-4xl mx-auto px-4">
        {Object.keys(menuAgrupado).length === 0 ? (
          <p className="text-center text-gray-500">
            Pronto agregaremos platos deliciosos.
          </p>
        ) : (
          Object.entries(menuAgrupado).map(
            ([categoria, platos]) => (
              <div
                key={categoria}
                className="mb-12">
                <div>{/* Categorias clickeables */}</div>
              </div>
            ),
          )
        )}
      </main>
    </div>
  );
}
