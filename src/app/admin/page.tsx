"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorAuth, setErrorAuth] = useState("");

  const [productos, setProductos] = useState<Producto[]>(
    [],
  );
  const [cargando, setCargando] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [tiempoPreparacion, setTiempoPreparacion] =
    useState("");

  // Nuevos estados para manejar las categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [modoNuevaCategoria, setModoNuevaCategoria] =
    useState(false);

  const [imagen, setImagen] = useState<File | null>(null);

  const productosRef = collection(db, "productos");

  // --- LÓGICA DE AGRUPACIÓN DE CATEGORÍAS ---
  // Extraemos las categorías únicas de los productos existentes
  const categoriasExistentes = Array.from(
    new Set(productos.map((p) => p.categoria)),
  );

  // Agrupamos los productos por categoría para el acordeón
  const productosAgrupados = productos.reduce(
    (acc, producto) => {
      if (!acc[producto.categoria]) {
        acc[producto.categoria] = [];
      }
      acc[producto.categoria].push(producto);
      return acc;
    },
    {} as Record<string, Producto[]>,
  );

  // --- FUNCIONES DE AUTENTICACIÓN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAuth("");
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setIsAuthenticated(true);
    } catch (err) {
      setErrorAuth("Correo o contraseña incorrectos.");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  // --- FUNCIONES DEL CRUD ---
  const obtenerProductos = async () => {
    try {
      const data = await getDocs(productosRef);
      const lista = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Producto[];
      console.log(lista);
      setProductos(lista);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      obtenerProductos();
    }
  }, [isAuthenticated]);

  const handleSubmitProducto = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    if (!imagen) {
      alert(
        "Por favor, selecciona una imagen para el plato.",
      );
      return;
    }

    // Determinamos qué categoría usar (la seleccionada de la lista o la nueva escrita a mano)
    const categoriaFinal = modoNuevaCategoria
      ? nuevaCategoria.trim()
      : categoriaSeleccionada;

    if (!categoriaFinal) {
      alert(
        "Por favor, selecciona o escribe una categoría.",
      );
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("file", imagen);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      ); // Ajustar con tu preset
      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // Ajustar con tu cloud name

      const resCloudinary = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      const cloudData = await resCloudinary.json();

      if (!resCloudinary.ok) {
        throw new Error(
          cloudData.error?.message || "Error Cloudinary",
        );
      }

      const nuevoProducto = {
        nombre,
        descripcion,
        precio: Number(precio),
        tiempoPreparacion: Number(tiempoPreparacion),
        categoria: categoriaFinal, // Usamos la categoría validada
        imagenUrl: cloudData.secure_url,
        disponible: true,
      };

      await addDoc(productosRef, nuevoProducto);

      // Limpiamos los campos
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setTiempoPreparacion("");
      setImagen(null);
      setCategoriaSeleccionada("");
      setNuevaCategoria("");
      setModoNuevaCategoria(false);

      obtenerProductos();
      alert("¡Plato agregado con éxito!");
    } catch (error) {
      console.error("Error agregando el producto: ", error);
      alert("Hubo un error al guardar el plato.");
    } finally {
      setCargando(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-black border-t-4 border-orange-500">
          <img
            className="h-20 object-contain block mx-auto mb-4"
            src="assets/logo.png"
            alt="Logo"
          />
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
                className="w-full border border-gray-300 rounded p-2 focus:ring-green-500"
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
                className="w-full border border-gray-300 rounded p-2 focus:ring-green-500"
                required
              />
            </div>
            {errorAuth && (
              <p className="text-red-500 text-sm text-center">
                {errorAuth}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-2 font-medium">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">
            Panel de Gestión del Menú
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium">
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
          {/* Formulario de Creación */}
          <div className="bg-white p-6 rounded shadow-sm border-t-4 border-green-600 lg:col-span-1 h-fit">
            <h2 className="text-xl font-semibold mb-4">
              Agregar Nuevo Plato
            </h2>

            <form
              onSubmit={handleSubmitProducto}
              className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre del plato"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <textarea
                placeholder="Descripción"
                required
                rows={3}
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Precio ($)"
                  required
                  value={precio}
                  onChange={(e) =>
                    setPrecio(e.target.value)
                  }
                  className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Minutos prep."
                  required
                  value={tiempoPreparacion}
                  onChange={(e) =>
                    setTiempoPreparacion(e.target.value)
                  }
                  className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Selector de Categorías Dinámico */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Categoría
                </label>
                {!modoNuevaCategoria ? (
                  <div className="flex gap-2">
                    <select
                      value={categoriaSeleccionada}
                      onChange={(e) =>
                        setCategoriaSeleccionada(
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"
                      required>
                      <option
                        value=""
                        disabled>
                        Seleccionar...
                      </option>
                      {categoriasExistentes.map((cat) => (
                        <option
                          key={cat}
                          value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        setModoNuevaCategoria(true)
                      }
                      className="bg-green-100 text-green-700 px-3 rounded hover:bg-green-200 text-sm font-semibold shrink-0">
                      + Nueva
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej: Entradas"
                      required
                      value={nuevaCategoria}
                      onChange={(e) =>
                        setNuevaCategoria(e.target.value)
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setModoNuevaCategoria(false);
                        setNuevaCategoria("");
                      }}
                      className="bg-gray-200 text-gray-700 px-3 rounded hover:bg-gray-300 text-sm font-semibold shrink-0">
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Foto del plato
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setImagen(
                      e.target.files
                        ? e.target.files[0]
                        : null,
                    )
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition font-bold disabled:bg-gray-400 mt-2">
                {cargando
                  ? "Guardando..."
                  : "Guardar Plato"}
              </button>
            </form>
          </div>

          {/* Lista de Platos con Acordeón */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Menú Actual
            </h2>
            {Object.keys(productosAgrupados).length ===
            0 ? (
              <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <p className="text-gray-500">
                  No hay platos registrados todavía.
                </p>
              </div>
            ) : (
              Object.entries(productosAgrupados).map(
                ([categoria, platos]) => (
                  <details
                    key={categoria}
                    className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 group"
                    open>
                    <summary className="font-bold text-gray-800 bg-gray-50 p-4 cursor-pointer rounded-lg group-open:rounded-b-none hover:bg-gray-100 border-l-4 border-orange-500 list-none flex justify-between items-center transition-colors">
                      <span className="uppercase tracking-wider">
                        {categoria}
                      </span>
                      <span className="text-sm text-gray-500 font-normal bg-gray-200 px-2 py-1 rounded-full">
                        {platos.length}{" "}
                        {platos.length === 1
                          ? "plato"
                          : "platos"}
                      </span>
                    </summary>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-b-lg">
                      {platos.map((plato) => (
                        <div
                          key={plato.id}
                          className="border border-gray-100 rounded p-3 flex gap-4 items-center bg-gray-50 shadow-sm hover:shadow transition-shadow">
                          <img
                            src={plato.imagenUrl}
                            alt={plato.nombre}
                            className="w-20 h-20 object-cover rounded-md border border-gray-200"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 leading-tight mb-1">
                              {plato.nombre}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">
                              ⏱ {plato.tiempoPreparacion}{" "}
                              min
                            </p>
                            <p className="text-green-600 font-bold">
                              $
                              {plato.precio.toLocaleString(
                                "es-CO",
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ),
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
