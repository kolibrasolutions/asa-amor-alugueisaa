import { Instagram, Facebook, MapPin, Phone, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1D1D1D] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">Noivas Cirlene</h3>
            <p className="text-gray-400 text-sm">
              Transformando sonhos em realidade através de peças únicas e atendimento personalizado. Seu dia especial merece toda nossa dedicação.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">Contato</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Rua Fausto Martiniano, 105</p>
              <p>Centro - Muzambinho, MG</p>
              <p>(35) 99147-9232</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/catalogo" className="hover:text-white">Vestidos de Noiva</a></li>
              <li><a href="/catalogo" className="hover:text-white">Ternos Masculinos</a></li>
              <li><a href="/catalogo" className="hover:text-white">Trajes de Festa</a></li>
              <li><a href="/contato" className="hover:text-white">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© 2024 Noivas Cirlene. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Admin Access - Discrete gear icon in bottom right */}
      <Link 
        to="/auth" 
        className="absolute bottom-4 right-4 w-8 h-8 bg-gray-700 bg-opacity-50 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
        title="Acesso Administrativo"
      >
        <Settings className="w-4 h-4 text-gray-300" />
      </Link>
    </footer>
  );
};

export default Footer;
