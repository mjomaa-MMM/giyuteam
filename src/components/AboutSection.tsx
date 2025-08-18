import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Heart, Users } from "lucide-react";
import dojoImage from "@/assets/dojo-interior.jpg";

const AboutSection = () => {
  const values = [
    {
      icon: Shield,
      title: "Discipline",
      description: "Building self-control and mental strength through traditional martial arts training."
    },
    {
      icon: Target,
      title: "Focus",
      description: "Developing concentration and determination to achieve personal goals."
    },
    {
      icon: Heart,
      title: "Respect",
      description: "Honoring the traditions of Kyokushin Karate and respecting others."
    },
    {
      icon: Users,
      title: "Community",
      description: "Creating a supportive environment where everyone can grow together."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            About <span className="text-dojo-red">Giyu Team By Jomaa</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            More than just a sport – it's a way of life
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Our Mission</h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At <strong>Giyu Team By Jomaa</strong>, we believe that karate is more than just a sport – 
              it is a way of life. Our dojo provides a space where students learn self-defense, respect, 
              discipline, and perseverance.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Whether you are looking to improve fitness, gain self-confidence, or train for competition, 
              we welcome everyone from beginners to advanced practitioners.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Located in <strong>Houmin al Fawka, Nabatiyeh, Lebanon</strong>, our dojo offers both 
              private and group classes for children, teens, and adults.
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
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-border/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-dojo-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-dojo-red" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">{value.title}</h4>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;