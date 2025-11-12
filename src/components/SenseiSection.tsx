import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, Users2, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import senseiImage from "@/assets/sensei-portrait.png";

const SenseiSection = () => {
  const { t } = useTranslation();

  return (
    <section id="sensei" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('sensei.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('sensei.guidance')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img 
                src={senseiImage} 
                alt="Sensei Mohammad Jomaa, Black Belt 1st Dan" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dojo-black/30 to-transparent"></div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 left-6 right-6">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Award className="w-5 h-5 text-dojo-red" />
                    <span className="font-bold text-dojo-black">{t('sensei.rank')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:pl-8">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              {t('sensei.name')}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-dojo-red/10 text-dojo-red hover:bg-dojo-red/20">
                {t('sensei.rank')}
              </Badge>
              <Badge variant="secondary" className="bg-dojo-red/10 text-dojo-red hover:bg-dojo-red/20">
                Kyokushin Karate
              </Badge>
              <Badge variant="secondary" className="bg-dojo-red/10 text-dojo-red hover:bg-dojo-red/20">
                Experienced Instructor
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t('sensei.description')}
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-dojo-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-dojo-red" />
                </div>
                <div className="text-2xl font-bold text-dojo-red">1st Dan</div>
                <div className="text-sm text-muted-foreground">{t('hero.blackBelt')}</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-dojo-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users2 className="w-6 h-6 text-dojo-red" />
                </div>
                <div className="text-2xl font-bold text-dojo-red">{t('sensei.allAgesTeaching')}</div>
                <div className="text-sm text-muted-foreground">Students Welcome</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-dojo-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-dojo-red" />
                </div>
                <div className="text-2xl font-bold text-dojo-red">{t('sensei.guidance')}</div>
                <div className="text-sm text-muted-foreground">Expert</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SenseiSection;