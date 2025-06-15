
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const RentalPackages = () => {
  return (
    <section className="py-20 bg-asa-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-asa-dark mb-4">
            Pacotes Especiais
          </h2>
          <p className="text-lg text-asa-gray max-w-2xl mx-auto">
            Ofertas exclusivas para casais que buscam economia e praticidade
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-asa-beige to-asa-blush p-8 md:p-12 rounded-3xl shadow-xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-asa-dark mb-4">
                Pacote Noiva 2024
              </h3>
              <div className="text-4xl md:text-5xl font-bold text-asa-dark mb-2">
                R$ 3.500
              </div>
              <p className="text-asa-gray">Pacote completo para o casal</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-xl font-serif font-semibold text-asa-dark mb-4">
                  Inclui:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center text-asa-gray">
                    <Check className="w-5 h-5 text-asa-dark mr-3 flex-shrink-0" />
                    2 Vestidos de Noiva para escolha
                  </li>
                  <li className="flex items-center text-asa-gray">
                    <Check className="w-5 h-5 text-asa-dark mr-3 flex-shrink-0" />
                    2 Ternos Masculinos para escolha
                  </li>
                  <li className="flex items-center text-asa-gray">
                    <Check className="w-5 h-5 text-asa-dark mr-3 flex-shrink-0" />
                    Consultoria personalizada
                  </li>
                  <li className="flex items-center text-asa-gray">
                    <Check className="w-5 h-5 text-asa-dark mr-3 flex-shrink-0" />
                    Ajustes inclusos
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-serif font-semibold text-asa-dark mb-4">
                  Benefícios:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center text-asa-gray">
                    <Check className="w-5 h-5 text-asa-dark mr-3 flex-shrink-0" />
                    Economia de até 30%
                  </li>
                  <li className="flex items-center text-asa-gray">
                    <Check className="w-5 h-5 text-asa-dark mr-3 flex-shrink-0" />
                    Prioridade no agendamento
                  </li>
                  <li className="flex items-center text-asa-gray">
                    <Check className="w-5 h-5 text-asa-dark mr-3 flex-shrink-0" />
                    Suporte completo
                  </li>
                  <li className="flex items-center text-asa-gray">
                    <Check className="w-5 h-5 text-asa-dark mr-3 flex-shrink-0" />
                    Flexibilidade nas datas
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Button 
                size="lg"
                className="bg-asa-dark hover:bg-asa-dark/90 text-white font-medium px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                Solicitar Orçamento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalPackages;
