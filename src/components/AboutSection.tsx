import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Heart, Users } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import dojoImage from "@/assets/dojo-interior.jpg";

interface CoreValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  display_order: number;
}

interface DojoInfo {
  id: string;
  section_key: string;
  title: string;
  content: string;
}

const AboutSection = () => {
  const { t } = useTranslation();
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [dojoInfo, setDojoInfo] = useState<DojoInfo[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      const [valuesRes, infoRes] = await Promise.all([
        supabase.from('core_values').select('*').order('display_order'),
        supabase.from('dojo_info').select('*')
      ]);

      if (valuesRes.data) setCoreValues(valuesRes.data);
      if (infoRes.data) setDojoInfo(infoRes.data);
    };

    loadContent();
  }, []);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Target;
  };

  const missionInfo = dojoInfo.find(info => info.section_key === 'mission');
  const locationInfo = dojoInfo.find(info => info.section_key === 'location');

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('about.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">{missionInfo?.title || t('about.title')}</h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {missionInfo?.content || t('about.mission')}
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {t('about.classes')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {locationInfo?.content || t('about.location')}
            </p>
          </div>
          
          <div className="relative">
            <img 
              src={dojoImage} 
              alt="Giyu Team By Jomaa dojo interior" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dojo-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value) => {
            const Icon = getIcon(value.icon);
            return (
              <Card key={value.id} className="text-center hover:shadow-lg transition-shadow duration-300 border-border/50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-dojo-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-dojo-red" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-3">{value.title}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
