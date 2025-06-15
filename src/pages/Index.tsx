
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import IntroSection from "@/components/IntroSection";
import CategoryGallery from "@/components/CategoryGallery";
import ServiceHighlights from "@/components/ServiceHighlights";
import RentalPackages from "@/components/RentalPackages";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-asa-white">
      <Navigation />
      <Hero />
      <IntroSection />
      <CategoryGallery />
      <ServiceHighlights />
      <RentalPackages />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
