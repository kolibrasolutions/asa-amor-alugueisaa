
import { DollarSign, Heart, Users, TrendingUp } from "lucide-react";

const ServiceHighlights = () => {
  const services = [
    {
      icon: DollarSign,
      title: "Preços Transparentes",
      description: "Sem taxas ocultas, valores justos e claros desde o primeiro contato"
    },
    {
      icon: Heart,
      title: "Roupas Bem Cuidadas", 
      description: "Peças higienizadas e conservadas com o máximo cuidado e carinho"
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description: "Consultoria especializada para encontrar a peça perfeita para você"
    },
    {
      icon: TrendingUp,
      title: "Tendência Atual",
      description: "Sempre atualizados com as últimas tendências da moda nupcial"
    }
  ];

  return (
    <section className="py-20 bg-asa-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-asa-dark mb-4">
            Por que Escolher a Asa Amor?
          </h2>
          <p className="text-lg text-asa-gray max-w-2xl mx-auto">
            Nosso compromisso é fazer do seu dia especial uma experiência única e inesquecível
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div 
              key={service.title}
              className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-asa-blush rounded-full mb-6">
                <service.icon className="w-8 h-8 text-asa-dark" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-asa-dark mb-4">
                {service.title}
              </h3>
              <p className="text-asa-gray text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
