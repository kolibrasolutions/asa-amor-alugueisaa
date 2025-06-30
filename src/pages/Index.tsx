import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import SustainableSection from "@/components/SustainableSection";
import ClientGallery from "@/components/ClientGallery";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div id="home">
        <Hero />
      </div>
      <AboutSection />
      <SustainableSection />
      <ClientGallery />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
