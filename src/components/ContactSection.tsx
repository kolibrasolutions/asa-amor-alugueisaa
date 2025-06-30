
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, MessageCircle, Calendar } from "lucide-react";

const ContactSection = () => {

  return (
    <section id="contato" className="py-20 bg-asa-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-asa-dark mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-asa-gray max-w-2xl mx-auto">
            Estamos prontos para ajudar você a encontrar a peça perfeita para o seu momento especial
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Buttons */}
          <div>
            <h3 className="text-2xl font-serif font-semibold text-asa-dark mb-8">
              Fale Conosco
            </h3>
            
            <div className="space-y-4 mb-8">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 rounded-full transition-all duration-300 text-lg"
                size="lg"
                asChild
              >
                <a href="https://wa.me/5535991479232" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  WhatsApp
                </a>
              </Button>
              <Button 
                variant="outline"
                className="w-full border-asa-dark text-asa-dark hover:bg-asa-dark hover:text-white font-medium py-6 rounded-full transition-all duration-300 text-lg"
                size="lg"
                asChild
              >
                <a href="tel:+5535991479232">
                  <Phone className="w-6 h-6 mr-3" />
                  Ligar Agora
                </a>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="text-lg font-semibold text-asa-dark mb-4">
                Informações de Contato
              </h4>
              <div className="space-y-3 text-asa-gray">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-asa-blush mr-3" />
                  <span>(35) 99147-9232</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-asa-blush mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p>Rua Fausto Martiniano, 105</p>
                    <p>Centro - Muzambinho, MG</p>
                  </div>
                </div>
              </div>
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
                      placeholder="(35) 99147-9232"
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
