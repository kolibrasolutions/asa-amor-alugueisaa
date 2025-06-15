
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, MessageCircle, Calendar } from "lucide-react";

const ContactSection = () => {
  const consultants = [
    {
      name: "Jéssica",
      role: "Consultora de Noivas",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "João", 
      role: "Consultor Masculino",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section id="contato" className="py-20 bg-asa-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-asa-dark mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-asa-gray max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar a peça perfeita
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Consultants */}
          <div>
            <h3 className="text-2xl font-serif font-semibold text-asa-dark mb-8">
              Nossos Consultores
            </h3>
            
            <div className="space-y-6 mb-8">
              {consultants.map((consultant) => (
                <div key={consultant.name} className="flex items-center bg-white p-6 rounded-2xl shadow-lg">
                  <img
                    src={consultant.image}
                    alt={consultant.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-asa-dark">
                      {consultant.name}
                    </h4>
                    <p className="text-asa-gray text-sm">
                      {consultant.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 rounded-full transition-all duration-300"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="outline"
                className="w-full border-asa-dark text-asa-dark hover:bg-asa-dark hover:text-white font-medium py-4 rounded-full transition-all duration-300"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Ligar Agora
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-serif font-semibold text-asa-dark mb-8">
              Agendar Consulta
            </h3>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-asa-dark">Nome</Label>
                    <Input 
                      id="name" 
                      placeholder="Seu nome completo"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-asa-dark">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="(11) 99999-9999"
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-asa-dark">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="seu@email.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-asa-dark">Data do Evento</Label>
                  <Input 
                    id="date" 
                    type="date"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-asa-dark">Mensagem</Label>
                  <Textarea 
                    id="message"
                    placeholder="Conte-nos mais sobre o que você procura..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-asa-dark hover:bg-asa-dark/90 text-white font-medium py-4 rounded-full transition-all duration-300"
                  size="lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Consulta
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
