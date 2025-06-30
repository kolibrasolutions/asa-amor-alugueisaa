
import { Instagram, Facebook, MapPin, Phone, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-asa-dark text-white py-16 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              Noivas Cirlene
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Transformando sonhos em realidade através de peças únicas e atendimento personalizado. 
              Seu dia especial merece toda nossa dedicação.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-asa-blush rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <Instagram className="w-5 h-5 text-asa-dark" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-asa-blush rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <Facebook className="w-5 h-5 text-asa-dark" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6">
              Contato
            </h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-asa-blush mr-3 flex-shrink-0" />
                <span className="text-gray-300">
                  Rua Fausto Martiniano, 105<br />
                  Centro - Muzambinho, MG
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-asa-blush mr-3 flex-shrink-0" />
                <span className="text-gray-300">
                  (35) 99147-9232
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6">
              Links Rápidos
            </h4>
            <div className="space-y-3">
              <a href="#noiva" className="block text-gray-300 hover:text-asa-blush transition-colors duration-300">
                Vestidos de Noiva
              </a>
              <a href="#ternos" className="block text-gray-300 hover:text-asa-blush transition-colors duration-300">
                Ternos Masculinos
              </a>
              <a href="#festa" className="block text-gray-300 hover:text-asa-blush transition-colors duration-300">
                Trajes de Festa
              </a>
              <a href="#contato" className="block text-gray-300 hover:text-asa-blush transition-colors duration-300">
                Contato
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Noivas Cirlene. Todos os direitos reservados.
          </p>
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
