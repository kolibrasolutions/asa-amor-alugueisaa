
const CategoryGallery = () => {
  const categories = [
    {
      name: "Vestido de Noiva",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Modelos únicos para o seu grande dia"
    },
    {
      name: "Terno Masculino", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Elegância e sofisticação"
    },
    {
      name: "Vestido de Festa",
      image: "https://images.unsplash.com/photo-1566479179817-65e64c5b8b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      description: "Para ocasiões especiais"
    },
    {
      name: "Vestido Leve",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Conforto e estilo"
    },
    {
      name: "Traje Chinês",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Tradição oriental"
    },
    {
      name: "Vestido para Mães",
      image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Elegância para mães especiais"
    }
  ];

  return (
    <section id="categorias" className="py-20 bg-asa-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-asa-dark mb-4">
            Nossa Coleção
          </h2>
          <p className="text-lg text-asa-gray max-w-2xl mx-auto">
            Descubra nossa seleção exclusiva de peças para cada ocasião especial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.name}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold text-asa-dark mb-2">
                  {category.name}
                </h3>
                <p className="text-asa-gray text-sm">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGallery;
