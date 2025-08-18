import DojoNavigation from "@/components/DojoNavigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SenseiSection from "@/components/SenseiSection";
import ClassesSection from "@/components/ClassesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DojoNavigation />
      <HeroSection />
      <AboutSection />
      <SenseiSection />
      <ClassesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
