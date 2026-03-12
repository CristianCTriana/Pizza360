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
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

      {/* MODIFICACIÓN AQUÍ: Añadimos p-4 al contenedor */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* MODIFICACIÓN AQUÍ: text-3xl en móvil, break-words y leading-tight */}
        {categoria.split(" ")[0].length > 11 ? (
          <h2
            className="text-3xl md:text-2xl font-black tracking-wide text-[#CCFF00] text-center break-words max-w-full leading-tight"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 rgba(0,0,0,0.5)",
            }}>
            {categoria.toUpperCase()}
          </h2>
        ) : (
          <h2
            className="text-3xl font-black tracking-wide text-[#CCFF00] text-center break-words max-w-full leading-tight"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 rgba(0,0,0,0.5)",
            }}>
            {categoria.toUpperCase()}
          </h2>
        )}
      </div>
    </div>
  );
}
