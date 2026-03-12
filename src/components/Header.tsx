// components/Header.tsx
"use client";

interface HeaderProps {
  terminoBusqueda: string;
  setTerminoBusqueda: (termino: string) => void;
}

export default function Header({
  terminoBusqueda,
  setTerminoBusqueda,
}: HeaderProps) {
  return (
    <header className="bg-[#E8751A] w-full py-3 px-4 md:px-8 flex justify-between items-center shadow-md sticky top-0 z-40">
      {/* Lado Izquierdo: Barra de Búsqueda */}
      <div className="w-full max-w-xs md:max-w-md mr-4">
        <input
          type="text"
          placeholder="Buscar platos o ingredientes..."
          value={terminoBusqueda}
          onChange={(e) =>
            setTerminoBusqueda(e.target.value)
          }
          className="w-full p-2.5 pl-4 rounded-full border-none focus:ring-4 focus:ring-[#CCFF00] outline-none text-gray-800 shadow-inner text-sm md:text-base transition-all"
        />
      </div>

      {/* Lado Derecho: Logo */}
      <div className="shrink-0">
        <img
          src="/assets/logo.png"
          alt="Comidas Rápidas 360"
          className="h-14 md:h-16 object-contain drop-shadow-md"
        />
      </div>
    </header>
  );
}
