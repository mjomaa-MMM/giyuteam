import { Button } from "@/components/ui/button";
import { MessageCircle, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/karate-team-header.jpg";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Karate team performing synchronized kata" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dojo-black/80 via-dojo-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-dojo-red fill-current" />
            <span className="text-dojo-red font-semibold text-sm uppercase tracking-wide">
              Kyokushin Karate Dojo
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-4 font-medium">
            {t('hero.subtitle')}
          </p>
          
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="dojo" 
              size="lg"
              onClick={() => window.open('https://wa.me/96170520091', '_blank')}
              className="text-lg px-8 py-6"
            >
              <MessageCircle className="w-5 h-5" />
              {t('nav.register')}
            </Button>
            <Button 
              variant="outline-dojo" 
              size="lg"
              onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-dojo-black"
            >
              {t('hero.viewClasses')}
            </Button>
          </div>
          
          <div className="mt-12 flex items-center gap-8 text-white">
            <div>
              <div className="text-2xl font-bold text-dojo-red">1st Dan</div>
              <div className="text-sm text-gray-300">{t('hero.blackBelt')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-dojo-red">{t('hero.allAges')}</div>
              <div className="text-sm text-gray-300">Welcome</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;