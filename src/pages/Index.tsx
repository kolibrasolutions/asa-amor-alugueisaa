import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CategoriesSection from "@/components/CategoriesSection";
import ClientGallery from "@/components/ClientGallery";
import WhatsAppSection from "@/components/WhatsAppSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />
      <Hero />
      <CategoriesSection />
      <ClientGallery />
      <WhatsAppSection />
      <Footer />
    </div>
  );
};

export default Index;
