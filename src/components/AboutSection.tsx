import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section id="sobre" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-asa-dark mb-6">
            Love Brought You Here, Us Too.
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Nothing marks love as it's most spectacular. All are forever where it is private everyone — from the engaged to 
            the married to the young and old. We have something for every body and every style. We have something 
            everyone some Monique bergeron, Enea very select brands, such we should open an antiques of edition. Designed 
            from the heart, to make your wedding utterly unforgettable.
          </p>
        </div>

        {/* Grid de Imagens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="space-y-2">
            <img 
              src="/noivos.jpg" 
              alt="Flower Girls" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-center text-sm font-medium text-gray-700">FLOWER GIRLS</p>
          </div>
          <div className="space-y-2">
            <img 
              src="/casal-noivos.png" 
              alt="Mother Looks" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-center text-sm font-medium text-gray-700">MOTHER LOOKS</p>
          </div>
          <div className="space-y-2">
            <img 
              src="/noivos.jpg" 
              alt="Bridal" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-center text-sm font-medium text-gray-700">BRIDAL</p>
          </div>
          <div className="space-y-2">
            <img 
              src="/casal-noivos.png" 
              alt="Groom Tuxedos" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-center text-sm font-medium text-gray-700">GROOM TUXEDOS</p>
          </div>
          <div className="space-y-2">
            <img 
              src="/noivos.jpg" 
              alt="Bridesmaid Dresses" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-center text-sm font-medium text-gray-700">BRIDESMAID DRESSES</p>
          </div>
        </div>

        {/* Seção Inspiration */}
        <div className="text-center bg-gray-50 py-12 rounded-lg">
          <h3 className="text-3xl font-serif text-asa-dark mb-4">Inspiration</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your wedding inspiration starts from dreams or from a beautiful bride, to which other 
            brides want to see to begin your wedding journey.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 