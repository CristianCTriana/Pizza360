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
  doc,
  deleteDoc,
  updateDoc,
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

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [tiempoPreparacion, setTiempoPreparacion] =
    useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [modoNuevaCategoria, setModoNuevaCategoria] =
    useState(false);
  const [imagen, setImagen] = useState<File | null>(null);

  // NUEVO ESTADO: Guarda el ID del plato que estamos editando
  const [idEdicion, setIdEdicion] = useState<string | null>(
    null,
  );
  // NUEVO ESTADO: Guarda la URL de la imagen actual en caso de no subir una nueva al editar
  const [imagenActual, setImagenActual] = useState("");

  const productosRef = collection(db, "productos");

  const categoriasExistentes = Array.from(
    new Set(productos.map((p) => p.categoria)),
  );

  const productosAgrupados = productos.reduce(
    (acc, producto) => {
      if (!acc[producto.categoria])
        acc[producto.categoria] = [];
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

  // --- LECTURA ---
  const obtenerProductos = async () => {
    try {
      const data = await getDocs(productosRef);
      const lista = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Producto[];
      setProductos(lista);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) obtenerProductos();
  }, [isAuthenticated]);

  // --- CREAR O ACTUALIZAR (SUBMIT) ---
  const handleSubmitProducto = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    // Si estamos creando nuevo, la imagen es obligatoria. Si estamos editando, es opcional.
    if (!idEdicion && !imagen) {
      alert(
        "Por favor, selecciona una imagen para el plato.",
      );
      return;
    }

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
      let urlDescarga = imagenActual;

      // Solo subimos a Cloudinary si el usuario seleccionó un archivo nuevo
      if (imagen) {
        const formData = new FormData();
        formData.append("file", imagen);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
        );
        const cloudName =
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

        const resCloudinary = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData },
        );
        const cloudData = await resCloudinary.json();

        if (!resCloudinary.ok)
          throw new Error(
            cloudData.error?.message || "Error Cloudinary",
          );
        urlDescarga = cloudData.secure_url;
      }

      const datosProducto = {
        nombre,
        descripcion,
        precio: Number(precio),
        tiempoPreparacion: Number(tiempoPreparacion),
        categoria: categoriaFinal,
        imagenUrl: urlDescarga,
      };

      if (idEdicion) {
        // ACTUALIZAR PLATO EXISTENTE
        const docRef = doc(db, "productos", idEdicion);
        await updateDoc(docRef, datosProducto);
        alert("¡Plato actualizado con éxito!");
      } else {
        // CREAR PLATO NUEVO
        await addDoc(productosRef, {
          ...datosProducto,
          disponible: true,
        });
        alert("¡Plato agregado con éxito!");
      }

      // Limpiar formulario
      cancelarEdicion();
      obtenerProductos();
    } catch (error) {
      console.error("Error guardando el producto: ", error);
      alert("Hubo un error al guardar el plato.");
    } finally {
      setCargando(false);
    }
  };

  // --- ELIMINAR ---
  const eliminarProducto = async (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este plato definitivamente?",
      )
    ) {
      try {
        await deleteDoc(doc(db, "productos", id));
        obtenerProductos();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Hubo un error al eliminar el plato.");
      }
    }
  };

  // --- CAMBIAR DISPONIBILIDAD (AGOTADO/DISPONIBLE) ---
  const toggleDisponibilidad = async (
    id: string,
    estadoActual: boolean,
  ) => {
    try {
      await updateDoc(doc(db, "productos", id), {
        disponible: !estadoActual,
      });
      obtenerProductos();
    } catch (error) {
      console.error(
        "Error al cambiar disponibilidad:",
        error,
      );
    }
  };

  // --- PREPARAR MODO EDICIÓN ---
  const cargarParaEdicion = (plato: Producto) => {
    setIdEdicion(plato.id!);
    setNombre(plato.nombre);
    setDescripcion(plato.descripcion);
    setPrecio(plato.precio.toString());
    setTiempoPreparacion(
      plato.tiempoPreparacion.toString(),
    );
    setCategoriaSeleccionada(plato.categoria);
    setImagenActual(plato.imagenUrl);
    setModoNuevaCategoria(false);
    // Hacemos scroll suave hacia el formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setIdEdicion(null);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setTiempoPreparacion("");
    setCategoriaSeleccionada("");
    setNuevaCategoria("");
    setImagenActual("");
    setImagen(null);
    setModoNuevaCategoria(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md border-t-4 border-orange-500">
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
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            {errorAuth && (
              <p className="text-red-500 text-sm text-center">
                {errorAuth}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium">
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
            Gestión del Menú
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium">
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
          {/* Formulario */}
          <div
            className={`bg-white p-6 rounded shadow-sm border-t-4 lg:col-span-1 h-fit transition-colors duration-300 ${idEdicion ? "border-blue-500 bg-blue-50" : "border-green-600"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-xl font-semibold ${idEdicion ? "text-blue-700" : "text-gray-800"}`}>
                {idEdicion
                  ? "Editando Plato"
                  : "Agregar Nuevo Plato"}
              </h2>
              {idEdicion && (
                <button
                  onClick={cancelarEdicion}
                  className="text-sm text-red-500 hover:underline font-semibold">
                  Cancelar Edición
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmitProducto}
              className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre del plato"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded outline-none"
              />
              <textarea
                placeholder="Descripción"
                required
                rows={3}
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(e.target.value)
                }
                className="w-full p-2 border rounded outline-none"
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
                  className="w-1/2 p-2 border rounded outline-none"
                />
                <input
                  type="number"
                  placeholder="Minutos prep."
                  required
                  value={tiempoPreparacion}
                  onChange={(e) =>
                    setTiempoPreparacion(e.target.value)
                  }
                  className="w-1/2 p-2 border rounded outline-none"
                />
              </div>

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
                      className="w-full p-2 border rounded bg-white outline-none"
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
                      className="bg-gray-200 px-3 rounded text-sm shrink-0">
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
                      className="w-full p-2 border rounded outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setModoNuevaCategoria(false);
                        setNuevaCategoria("");
                      }}
                      className="bg-gray-200 px-3 rounded text-sm shrink-0">
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Foto del plato{" "}
                  {idEdicion &&
                    "(Opcional si no la cambias)"}
                </label>
                {idEdicion && imagenActual && (
                  <img
                    src={imagenActual}
                    alt="Actual"
                    className="w-16 h-16 object-cover rounded mb-2 border"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImagen(
                      e.target.files
                        ? e.target.files[0]
                        : null,
                    )
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className={`w-full text-white p-2 rounded transition font-bold disabled:bg-gray-400 mt-2 ${idEdicion ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"}`}>
                {cargando
                  ? "Guardando..."
                  : idEdicion
                    ? "Actualizar Plato"
                    : "Guardar Plato"}
              </button>
            </form>
          </div>

          {/* Lista de Platos */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Menú Actual
            </h2>
            {Object.keys(productosAgrupados).length ===
            0 ? (
              <p className="text-gray-500">
                No hay platos registrados todavía.
              </p>
            ) : (
              Object.entries(productosAgrupados).map(
                ([categoria, platos]) => (
                  <details
                    key={categoria}
                    className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 group"
                    open>
                    <summary className="font-bold text-gray-800 bg-gray-50 p-4 cursor-pointer rounded-lg hover:bg-gray-100 border-l-4 border-orange-500 list-none flex justify-between items-center">
                      <span className="uppercase tracking-wider">
                        {categoria}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {platos.length} platos
                      </span>
                    </summary>
                    <div className="p-4 grid grid-cols-1 gap-4">
                      {platos.map((plato) => (
                        <div
                          key={plato.id}
                          className={`border rounded p-3 flex gap-4 items-center shadow-sm transition-opacity ${plato.disponible ? "bg-white" : "bg-gray-100 opacity-60"}`}>
                          <img
                            src={plato.imagenUrl}
                            alt={plato.nombre}
                            className="w-24 h-24 object-cover rounded-md border"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-gray-800 text-lg">
                                {plato.nombre}
                              </h3>
                              <button
                                onClick={() =>
                                  toggleDisponibilidad(
                                    plato.id!,
                                    plato.disponible,
                                  )
                                }
                                className={`text-xs px-2 py-1 rounded-full font-bold transition-colors ${plato.disponible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>
                                {plato.disponible
                                  ? "✅ Disponible"
                                  : "❌ Agotado"}
                              </button>
                            </div>
                            <p className="text-green-600 font-bold mb-2">
                              $
                              {plato.precio.toLocaleString(
                                "es-CO",
                              )}
                            </p>

                            {/* Botones de acción */}
                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() =>
                                  cargarParaEdicion(plato)
                                }
                                className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() =>
                                  eliminarProducto(
                                    plato.id!,
                                  )
                                }
                                className="text-sm font-semibold text-red-500 hover:text-red-700">
                                🗑️ Eliminar
                              </button>
                            </div>
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
