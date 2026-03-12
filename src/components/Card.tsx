export default function Card({
  onClick,
  imagenUrl,
  categoria,
}: {
  onClick: any;
  imagenUrl: string;
  categoria: string;
}) {
  return (
    <div
      onClick={onClick}
      className="relative w-full h-32 md:h-48 cursor-pointer overflow-hidden border-b-2 border-white md:border-none md:rounded-2xl md:shadow-lg group">
      {/* Imagen de fondo */}
      <img
        src={imagenUrl}
        alt={categoria}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Capa oscura (opcional, para que el texto resalte más) */}
      <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-colors duration-300"></div>

      {/* Texto Verde Limón (Basado en tu imagen) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h2
          className="text-4xl md:text-5xl font-black tracking-wide text-[#CCFF00]"
          style={{
            textShadow:
              "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 rgba(0,0,0,0.5)",
          }} // Borde oscuro para legibilidad
        >
          {categoria}
        </h2>
      </div>
    </div>
  );
}
