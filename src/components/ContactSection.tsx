import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
}

const ContactSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    facebook: '',
    instagram: ''
  });

  useEffect(() => {
    const loadContactInfo = async () => {
      const { data } = await supabase.from('contact_info').select('*');
      
      if (data) {
        const infoMap: any = {};
        data.forEach(item => {
          infoMap[item.info_key] = item.info_value;
        });
        setContactInfo(infoMap);
      }
    };

    loadContactInfo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`Contact from ${formData.name} - Giyu Team By Jomaa`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Message Prepared",
      description: "Your email client should open with the message ready to send.",
    });
    
    setFormData({ name: '', email: '', message: '' });
  };

  const contactDetails = [
    {
      icon: Phone,
      title: "Phone",
      detail: contactInfo.phone,
      action: () => window.open(`tel:${contactInfo.phone.replace(/\D/g, '')}`)
    },
    {
      icon: Mail,
      title: "Email", 
      detail: contactInfo.email,
      action: () => window.open(`mailto:${contactInfo.email}`)
    },
    {
      icon: MapPin,
      title: "Location",
      detail: contactInfo.address,
      action: () => window.open(`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`)
    }
  ];

  const socialLinks = [
    {
      icon: Facebook,
      name: "Facebook",
      url: contactInfo.facebook,
      color: "text-blue-600 hover:text-blue-700"
    },
    {
      icon: Instagram, 
      name: "Instagram",
      url: contactInfo.instagram,
      color: "text-pink-600 hover:text-pink-700"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">{t('contact.info')}</h3>
            
            <div className="space-y-6 mb-8">
              {contactDetails.map((info, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300 cursor-pointer border-border/50" onClick={info.action}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-dojo-red/10 rounded-full flex items-center justify-center">
                        <info.icon className="w-6 h-6 text-dojo-red" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{info.title}</h4>
                        <p className="text-muted-foreground">{info.detail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-green-50 border-green-200 mb-8">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-green-800 mb-2">Quick Registration</h4>
                <p className="text-green-700 mb-4">Get instant responses via WhatsApp</p>
                <Button 
                  variant="whatsapp" 
                  size="lg"
                  onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank')}
                  className="w-full"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message on WhatsApp
                </Button>
              </CardContent>
            </Card>

            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(social.url, '_blank')}
                    className={`${social.color} border-current hover:bg-current hover:text-white transition-colors`}
                  >
                    <social.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">{t('contact.form.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-foreground">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your interest in martial arts, questions about classes, or any other inquiries..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <Button type="submit" variant="dojo" size="lg" className="w-full">
                    <Mail className="w-5 h-5" />
                    Send Message
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    This will open your email client with the message ready to send
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
