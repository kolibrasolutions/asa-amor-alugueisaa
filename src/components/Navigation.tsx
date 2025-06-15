
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = [
    { name: "Início", href: "#home" },
    { name: "Sobre", href: "#sobre" },
    { name: "Categorias", href: "#categorias" },
    { name: "Catálogo", href: "/catalogo", external: true },
    { name: "Serviços", href: "#servicos" },
    { name: "Contato", href: "#contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-asa-gray-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div 
            className="text-2xl font-serif font-bold text-asa-dark cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            Noivas Cirlene
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.external) {
                    window.location.href = item.href;
                  } else {
                    scrollToSection(item.href.substring(1));
                  }
                }}
                className="text-asa-dark hover:text-asa-blush transition-colors duration-300 font-medium"
              >
                {item.name}
              </button>
            ))}
            <Button 
              className="bg-asa-blush hover:bg-asa-dark text-white"
              onClick={() => scrollToSection('contato')}
            >
              Fazer Orçamento
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-asa-dark hover:text-asa-blush transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-asa-gray-light bg-white">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.external) {
                      window.location.href = item.href;
                    } else {
                      scrollToSection(item.href.substring(1));
                    }
                  }}
                  className="block w-full text-left px-4 py-2 text-asa-dark hover:text-asa-blush transition-colors duration-300 font-medium"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-4 pt-2">
                <Button 
                  className="w-full bg-asa-blush hover:bg-asa-dark text-white"
                  onClick={() => scrollToSection('contato')}
                >
                  Fazer Orçamento
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
