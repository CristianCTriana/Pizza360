"use client";
import Cuadro from "@/components/cuadroitem";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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
  const [items, setItems] = useState<Producto[]>([]);

  const productosRef = collection(db, "productos");

  const obtenerProductos = async () => {
    try {
      const data = await getDocs(productosRef);
      const lista = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Producto[];
      setItems(lista);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div>
      <Header />
      {items?.map((i, index) => {
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
