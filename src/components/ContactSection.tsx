import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, MessageCircle, Calendar } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <img 
              src="/noivos.jpg" 
              alt="Detalhes de Casamento" 
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-serif">
              Lorem Ipsum Dolor Sit:<br />
              Consectetur Adipiscing<br />
              Elit Sed Do
            </h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
            <p className="text-gray-600">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
            </p>
            <a
              href="https://wa.me/5535991479232?text=Olá! Vim através do site noivascirlene.com.br e gostaria de mais informações sobre os serviços."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Fale Conosco pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
