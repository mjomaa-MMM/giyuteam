import { MessageCircle, Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-dojo-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Dojo Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              {t('footer.dojo')}
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {t('footer.description')}
            </p>
            <Button 
              variant="whatsapp" 
              onClick={() => window.open('https://wa.me/0096170520091', '_blank')}
            >
              <MessageCircle className="w-4 h-4" />
              {t('nav.register')}
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-dojo-red">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('sensei')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('footer.aboutSensei')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.classes')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-dojo-red">{t('footer.contactInfo')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-dojo-red" />
                <span className="text-gray-300">+961-70520091</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-dojo-red" />
                <span className="text-gray-300">GiyuTeamByJomaa@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-dojo-red mt-1" />
                <span className="text-gray-300">Houmin al Fawka, Nabatiyeh, Lebanon</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3 text-dojo-red">{t('footer.followUs')}</h5>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open('https://www.facebook.com/people/GIYU-team/61575069417497/', '_blank')}
                  className="text-gray-300 hover:text-white hover:bg-blue-600"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open('https://www.instagram.com/p/DMIrux_sPsE/?utm_source=ig_web_copy_link', '_blank')}
                  className="text-gray-300 hover:text-white hover:bg-pink-600"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;