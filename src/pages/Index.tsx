import DojoNavigation from "@/components/DojoNavigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SenseiSection from "@/components/SenseiSection";
import ClassesSection from "@/components/ClassesSection";
import ContactSection from "@/components/ContactSection";
import PaymentSection from "@/components/PaymentSection";
import Footer from "@/components/Footer";
import DojoChatbot from "@/components/DojoChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DojoNavigation />
      <HeroSection />
      <AboutSection />
      <SenseiSection />
      <ClassesSection />
      <PaymentSection />
      <ContactSection />
      <Footer />
      <DojoChatbot />
    </div>
  );
};

export default Index;
