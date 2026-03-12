export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 w-full pt-10 pb-6 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Columna 1: Contacto */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-[#CCFF00] font-black text-lg mb-4 uppercase tracking-wider">
            Contáctanos
          </h3>
          <p className="flex items-center gap-2 mb-3">
            <span className="text-xl">📍</span> Calle 46 sur
            # 72 D 68 local 1
          </p>
          <p className="flex items-center gap-2 mb-3">
            <span className="text-xl">📞</span> TEL: 317 753
            5488 / 320 306 6373
          </p>
          <p className="flex items-center gap-2">
            <span className="text-xl">💬</span> WhatsApp:
            +57 317 753 5468
          </p>
        </div>

        {/* Columna 2: Horarios */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-[#CCFF00] font-black text-lg mb-4 uppercase tracking-wider">
            Horarios de Atención
          </h3>
          <p className="mb-2 text-white font-medium">
            Lunes a Jueves:
          </p>
          <p className="mb-4">3:00 PM - 10:00 PM</p>
          <p className="mb-2 text-white font-medium">
            Viernes a Domingo y Festivos:
          </p>
          <p>1:00 PM - 10:00 PM</p>
        </div>

        {/* Columna 3: Medios de Pago */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-[#CCFF00] font-black text-lg mb-4 uppercase tracking-wider">
            Medios de Pago
          </h3>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-1 shadow-sm">
              💵 Efectivo
            </span>
            <span className="bg-[#4a148c] text-white px-3 py-1.5 rounded-lg border border-[#6a1b9a] flex items-center gap-1 shadow-sm">
              📱 Nequi
            </span>
            <span className="bg-[#b71c1c] text-white px-3 py-1.5 rounded-lg border border-[#d32f2f] flex items-center gap-1 shadow-sm">
              📱 DaviPlata
            </span>
            <span className="bg-blue-900 text-white px-3 py-1.5 rounded-lg border border-blue-700 flex items-center gap-1 shadow-sm mt-1">
              💳 Tarjetas
            </span>
            <span className="bg-green-900 text-white px-3 py-1.5 rounded-lg border border-blue-700 flex items-center gap-1 shadow-sm mt-1">
              🔑 Bre-B
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-xs font-medium tracking-wide mb-2">
          Las imágenes usadas en este menú son solamente de
          referencia
        </p>
        <p className="text-gray-500 text-xs font-medium tracking-wide">
          © {new Date().getFullYear()} Comidas Rápidas 360.
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
