import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, User, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ClassesSection = () => {
  const { t } = useTranslation();
  
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['training-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_schedules')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const privateClass = schedules?.find(s => s.type === 'private');
  const groupClasses = schedules?.filter(s => s.type === 'group') || [];

  if (isLoading) {
    return (
      <section id="classes" className="py-20 bg-gradient-to-b from-muted to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading schedules...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="classes" className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('classes.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('classes.subtitle')}
          </p>
        </div>

        {/* Private Classes */}
        {privateClass && (
          <div className="mb-12">
            <Card className="border-dojo-red/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 ${privateClass.color || 'bg-dojo-red'} rounded-full flex items-center justify-center`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">{privateClass.title}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{privateClass.days}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground mb-6">{t('classes.private.description')}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    t('classes.private.personalized'),
                    t('classes.private.flexible'),
                    t('classes.private.focused'),
                    t('classes.private.rapid')
                  ].map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-dojo-red/10 text-dojo-red hover:bg-dojo-red/20 justify-center py-2">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="dojo" 
                    onClick={() => window.open('https://wa.me/96170520091', '_blank')}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t('classes.private.book')}
                  </Button>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    By appointment only - Contact us to schedule
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Group Classes */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            {t('classes.group.title')} - <span className="text-dojo-red">Friday & Saturday</span>
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {groupClasses.map((classInfo) => (
              <Card key={classInfo.id} className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                <CardHeader className="pb-3">
                  <div className={`w-full h-2 ${classInfo.color || 'bg-blue-500'} rounded-full mb-3`}></div>
                  <CardTitle className="text-lg text-foreground text-center">
                    {classInfo.age_group || classInfo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3">
                    {classInfo.time_start && classInfo.time_end && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{classInfo.time_start} - {classInfo.time_end}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{classInfo.days}</span>
                    </div>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      Group Training
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="dojo" 
              size="lg"
              onClick={() => window.open('https://wa.me/96170520091', '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              {t('classes.group.register')}
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Contact us to confirm availability and start your martial arts journey
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;