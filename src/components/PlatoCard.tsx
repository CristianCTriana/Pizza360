// components/PlatoCard.tsx
import { Producto } from "@/app/page"; // Importamos la interfaz desde tu archivo principal

interface PlatoCardProps {
  plato: Producto;
}

export default function PlatoCard({
  plato,
}: PlatoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex gap-4 items-center hover:shadow-md transition-shadow">
      <img
        src={plato.imagenUrl}
        alt={plato.nombre}
        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md shadow-sm"
      />
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
          {plato.nombre}
        </h3>
        <p className="text-gray-500 text-xs md:text-sm mt-1 whitespace-pre-wrap">
          {plato.descripcion}
        </p>
        <div className="flex justify-between items-end mt-2 md:mt-4">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
            ⏱ {plato.tiempoPreparacion} min
          </span>
          <span className="text-lg md:text-xl font-black text-[#E8751A]">
            ${plato.precio.toLocaleString("es-CO")}
          </span>
        </div>
      </div>
    </div>
  );
}
