export default function Cuadro({ cuadrito }: { cuadrito: string }) {
  return (
    <div className="w-full max-w-[800px] mx-auto font-serif">
      <div className="relative w-full h-[300px] overflow-hidden">
        <img
          src={cuadrito}
          alt="Hamburguesas deliciosas"
          className="w-full h-full object-cover object-center block"
        />

        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#d1f165] text-4xl sm:text-6xl font-bold tracking-[2px] text-center w-full [text-shadow:-2px_-2px0#222,2px_-2px0#222,-2px_2px0#222,2px_2px0#222,4px_4px_8px_rgba(0,0,0,0.8)]">
          HAMBURGUESAS
        </h1>
      </div>
    </div>
  );
}
