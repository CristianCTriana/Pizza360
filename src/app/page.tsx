"use client";
import Cuadro from "@/components/cuadroitem";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>(
    [],
  );

  const productosRef = collection(db, "productos");
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
        <p className="text-xl text-orange-500 font-semibold animate-pulse">
          Preparando el menú...
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {productos?.map((i, index) => {
        return (
          <Cuadro
            cuadrito={i.imagenUrl}
            key={index}
          />
        );
      })}
      <Footer />
    </div>
  );
}
