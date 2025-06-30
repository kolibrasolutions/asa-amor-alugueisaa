const ClientGallery = () => {
  const clientImages = [
    {
      src: "/noivos.jpg",
      alt: "Cliente 1",
      category: "Vestido de Noiva"
    },
    {
      src: "/casal-noivos.png",
      alt: "Cliente 2", 
      category: "Terno Masculino"
    },
    {
      src: "/noivos.jpg",
      alt: "Cliente 3",
      category: "Vestido de Festa"
    },
    {
      src: "/casal-noivos.png",
      alt: "Cliente 4",
      category: "Look Completo"
    },
    {
      src: "/noivos.jpg",
      alt: "Cliente 5",
      category: "Vestido de Noiva"
    },
    {
      src: "/casal-noivos.png",
      alt: "Cliente 6",
      category: "Terno Masculino"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-asa-dark mb-4">
            Nossos Clientes Felizes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja alguns dos momentos especiais que tivemos o prazer de fazer parte.
            Cada história é única e especial para nós.
          </p>
        </div>

        {/* Grid de Imagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{image.alt}</h3>
                  <p className="text-sm opacity-90">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Quer fazer parte da nossa galeria de clientes felizes?
          </p>
          <a 
            href="#contato"
            className="inline-block bg-asa-primary hover:bg-asa-primary/90 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            Agendar Consulta
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClientGallery; 