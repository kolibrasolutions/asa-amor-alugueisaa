import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contato" className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagem */}
          <div className="relative">
            <img
              src="/noivos.jpg"
              alt="Casal de Noivos"
              className="w-full h-[600px] object-cover rounded-2xl"
            />
          </div>

          {/* Texto e Botão */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif text-asa-dark">
              Lorem Ipsum Dolor Sit:<br />
              Consectetur Adipiscing<br />
              Elit Sed Do
            </h2>
            
            <p className="text-lg text-asa-gray">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation.
            </p>

            <p className="text-lg text-asa-gray">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
            </p>

            <Button 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-6 px-8 rounded-full transition-all duration-300 text-lg"
              size="lg"
              asChild
            >
              <a href="https://wa.me/5535991479232" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-6 h-6 mr-3" />
                Fale Conosco pelo WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
