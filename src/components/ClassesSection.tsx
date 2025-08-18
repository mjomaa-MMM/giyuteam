import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, User, MessageCircle } from "lucide-react";

const ClassesSection = () => {
  const privateClasses = {
    title: "Private Training Sessions",
    days: "Monday - Thursday",
    description: "One-on-one personalized training sessions",
    features: ["Personalized attention", "All skill levels welcome", "Flexible scheduling", "Custom training program"],
    icon: User,
    color: "bg-dojo-red"
  };

  const groupClasses = [
    {
      time: "4:00 PM - 5:00 PM",
      group: "Girls (5-10 years old)",
      day: "Friday & Saturday",
      color: "bg-pink-500"
    },
    {
      time: "5:00 PM - 6:00 PM", 
      group: "Boys (5-10 years old)",
      day: "Friday & Saturday",
      color: "bg-blue-500"
    },
    {
      time: "6:00 PM - 7:15 PM",
      group: "Boys (10-18 years old)",
      day: "Friday & Saturday", 
      color: "bg-green-500"
    },
    {
      time: "7:15 PM - 9:00 PM",
      group: "Men (18+ years old)",
      day: "Friday & Saturday",
      color: "bg-dojo-red"
    }
  ];

  return (
    <section id="classes" className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Training <span className="text-dojo-red">Schedule</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose between personalized private sessions or dynamic group classes
          </p>
        </div>

        {/* Private Classes */}
        <div className="mb-12">
          <Card className="border-dojo-red/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 ${privateClasses.color} rounded-full flex items-center justify-center`}>
                  <privateClasses.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">{privateClasses.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{privateClasses.days}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">{privateClasses.description}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {privateClasses.features.map((feature, index) => (
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
                  Book Private Session
                </Button>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  By appointment only - Contact us to schedule
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Group Classes */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Group Classes - <span className="text-dojo-red">Friday & Saturday</span>
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {groupClasses.map((classInfo, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                <CardHeader className="pb-3">
                  <div className={`w-full h-2 ${classInfo.color} rounded-full mb-3`}></div>
                  <CardTitle className="text-lg text-foreground text-center">
                    {classInfo.group}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{classInfo.time}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{classInfo.day}</span>
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
              Register for Group Classes
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