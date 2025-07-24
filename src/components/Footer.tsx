import { Instagram, Facebook, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1D1D1D] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">Noivas Cirlene</h3>
            <p className="text-gray-400 text-sm">
              Realizando sonhos desde 1989 através de peças únicas e atendimento personalizado. São 35 anos de experiência cuidando dos momentos mais especiais da sua vida com dedicação e carinho.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">Contato</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Rua Barão do Rio Branco, Oito 855</p>
              <p>Muzambinho/MG</p>
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
    </footer>
  );
};

export default Footer;
