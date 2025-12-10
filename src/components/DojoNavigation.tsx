import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DojoNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/welcome');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-dojo-red">Giyu Team</span>
            <span className="text-lg text-dojo-black ml-2 font-medium">By Jomaa</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <LanguageToggle />
            <button 
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-dojo-red transition-colors font-medium"
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-dojo-red transition-colors font-medium"
            >
              {t('nav.about')}
            </button>
            <button 
              onClick={() => scrollToSection('sensei')}
              className="text-foreground hover:text-dojo-red transition-colors font-medium"
            >
              {t('nav.sensei')}
            </button>
            <button 
              onClick={() => scrollToSection('classes')}
              className="text-foreground hover:text-dojo-red transition-colors font-medium"
            >
              {t('nav.classes')}
            </button>
            <button 
              onClick={() => scrollToSection('shop')}
              className="text-foreground hover:text-dojo-red transition-colors font-medium"
            >
              Shop
            </button>
            <button 
              onClick={() => scrollToSection('payment')}
              className="text-foreground hover:text-dojo-red transition-colors font-medium"
            >
              {t('nav.payment')}
            </button>
            <button 
              onClick={() => navigate('/news')}
              className="text-foreground hover:text-dojo-red transition-colors font-medium"
            >
              News
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-dojo-red transition-colors font-medium"
            >
              {t('nav.contact')}
            </button>
            <Button 
              variant="whatsapp" 
              size="sm"
              onClick={() => window.open('https://wa.me/96170520091', '_blank')}
            >
              <MessageCircle className="w-4 h-4" />
              {t('nav.register')}
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{user.username}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="border-dojo-red text-dojo-red hover:bg-dojo-red hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/welcome')}
                className="border-dojo-red text-dojo-red hover:bg-dojo-red hover:text-white"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-primary/10 rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{user.username}</span>
                </div>
              )}
              <div className="px-3 py-2">
                <LanguageToggle />
              </div>
              <button 
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-dojo-red transition-colors font-medium"
              >
                {t('nav.home')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-dojo-red transition-colors font-medium"
              >
                {t('nav.about')}
              </button>
              <button 
                onClick={() => scrollToSection('sensei')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-dojo-red transition-colors font-medium"
              >
                {t('nav.sensei')}
              </button>
              <button 
                onClick={() => scrollToSection('classes')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-dojo-red transition-colors font-medium"
              >
                {t('nav.classes')}
              </button>
              <button 
                onClick={() => scrollToSection('shop')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-dojo-red transition-colors font-medium"
              >
                Shop
              </button>
              <button 
                onClick={() => scrollToSection('payment')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-dojo-red transition-colors font-medium"
              >
                {t('nav.payment')}
              </button>
              <button 
                onClick={() => navigate('/news')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-dojo-red transition-colors font-medium"
              >
                News
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-dojo-red transition-colors font-medium"
              >
                {t('nav.contact')}
              </button>
              <div className="px-3 py-2">
                <Button 
                  variant="whatsapp" 
                  size="sm"
                  className="w-full"
                  onClick={() => window.open('https://wa.me/96170520091', '_blank')}
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('nav.register')}
                </Button>
              </div>
              <div className="px-3 py-2">
                {user ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-dojo-red text-dojo-red hover:bg-dojo-red hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-dojo-red text-dojo-red hover:bg-dojo-red hover:text-white"
                    onClick={() => navigate('/welcome')}
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DojoNavigation;
