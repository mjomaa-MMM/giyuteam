import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Upload, ShoppingBag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Sensei Info
  const [senseiData, setSenseiData] = useState({
    name: '',
    rank: '',
    bio: '',
    experience_years: 0,
    image_url: ''
  });
  
  // Dojo Info
  const [dojoData, setDojoData] = useState({
    mission: '',
    classes: '',
    location: ''
  });
  
  // Contact Info
  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    address: '',
    facebook: '',
    instagram: ''
  });
  
  // Core Values
  const [coreValues, setCoreValues] = useState<any[]>([]);
  
  // Hero Text
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    description: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadAllContent();
  }, [user, navigate]);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      // Load Sensei Info
      const { data: sensei } = await (supabase as any)
        .from('sensei_info')
        .select('*')
        .single();
      if (sensei) {
        setSenseiData({
          name: sensei.name || '',
          rank: sensei.rank || '',
          bio: sensei.bio || '',
          experience_years: sensei.experience_years || 0,
          image_url: sensei.image_url || ''
        });
      }

      // Load Dojo Info
      const { data: dojoInfo } = await (supabase as any)
        .from('dojo_info')
        .select('*');
      if (dojoInfo) {
        const dojoMap: any = {};
        dojoInfo.forEach((item: any) => {
          dojoMap[item.section_key] = item.content;
        });
        setDojoData({
          mission: dojoMap.mission || '',
          classes: dojoMap.classes || '',
          location: dojoMap.location || ''
        });
      }

      // Load Contact Info
      const { data: contactInfo } = await (supabase as any)
        .from('contact_info')
        .select('*');
      if (contactInfo) {
        const contactMap: any = {};
        contactInfo.forEach((item: any) => {
          contactMap[item.info_key] = item.info_value;
        });
        setContactData({
          phone: contactMap.phone || '',
          email: contactMap.email || '',
          address: contactMap.address || '',
          facebook: contactMap.facebook || '',
          instagram: contactMap.instagram || ''
        });
      }

      // Load Core Values
      const { data: values } = await (supabase as any)
        .from('core_values')
        .select('*')
        .order('display_order', { ascending: true });
      if (values) setCoreValues(values);

      // Load Hero/Site Settings
      const { data: settings } = await (supabase as any)
        .from('site_settings')
        .select('*');
      if (settings) {
        const settingsMap: any = {};
        settings.forEach((item: any) => {
          settingsMap[item.setting_key] = item.setting_value;
        });
        setHeroData({
          title: settingsMap.hero_title || '',
          subtitle: settingsMap.hero_subtitle || '',
          description: settingsMap.hero_description || ''
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSenseiInfo = async () => {
    try {
      const { error } = await (supabase as any)
        .from('sensei_info')
        .upsert({
          name: senseiData.name,
          rank: senseiData.rank,
          bio: senseiData.bio,
          experience_years: senseiData.experience_years,
          image_url: senseiData.image_url
        });
      
      if (error) throw error;
      toast({ title: 'Sensei info saved successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const saveDojoInfo = async () => {
    try {
      const updates = [
        { section_key: 'mission', title: 'Mission', content: dojoData.mission },
        { section_key: 'classes', title: 'Classes', content: dojoData.classes },
        { section_key: 'location', title: 'Location', content: dojoData.location }
      ];

      for (const update of updates) {
        await (supabase as any)
          .from('dojo_info')
          .upsert(update, { onConflict: 'section_key' });
      }

      toast({ title: 'Dojo info saved successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const saveContactInfo = async () => {
    try {
      const updates = Object.entries(contactData).map(([key, value]) => ({
        info_key: key,
        info_value: value
      }));

      for (const update of updates) {
        await (supabase as any)
          .from('contact_info')
          .upsert(update, { onConflict: 'info_key' });
      }

      toast({ title: 'Contact info saved successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const saveCoreValues = async () => {
    try {
      for (const value of coreValues) {
        await (supabase as any)
          .from('core_values')
          .upsert(value);
      }

      toast({ title: 'Core values saved successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const saveHeroData = async () => {
    try {
      const updates = Object.entries(heroData).map(([key, value]) => ({
        setting_key: `hero_${key}`,
        setting_value: value
      }));

      for (const update of updates) {
        await (supabase as any)
          .from('site_settings')
          .upsert(update, { onConflict: 'setting_key' });
      }

      toast({ title: 'Hero section saved successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/subscribers')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold">Manage Website Content</h1>
          </div>
          <Button onClick={() => navigate('/admin/shop')} className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            Manage Shop
          </Button>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="dojo">About Dojo</TabsTrigger>
            <TabsTrigger value="sensei">Sensei</TabsTrigger>
            <TabsTrigger value="values">Core Values</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Edit the main hero section content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={heroData.title}
                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                    placeholder="Master Kyokushin Karate"
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                    placeholder="Build Strength, Discipline & Confidence"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={heroData.description}
                    onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                    rows={4}
                    placeholder="Join Giyu Team By Jomaa..."
                  />
                </div>
                <Button onClick={saveHeroData}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Hero Section
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dojo">
            <Card>
              <CardHeader>
                <CardTitle>About Dojo Section</CardTitle>
                <CardDescription>Edit dojo information and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Mission Statement</Label>
                  <Textarea
                    value={dojoData.mission}
                    onChange={(e) => setDojoData({ ...dojoData, mission: e.target.value })}
                    rows={4}
                    placeholder="Our mission is to..."
                  />
                </div>
                <div>
                  <Label>Classes Description</Label>
                  <Textarea
                    value={dojoData.classes}
                    onChange={(e) => setDojoData({ ...dojoData, classes: e.target.value })}
                    rows={4}
                    placeholder="We offer classes for..."
                  />
                </div>
                <div>
                  <Label>Location Information</Label>
                  <Textarea
                    value={dojoData.location}
                    onChange={(e) => setDojoData({ ...dojoData, location: e.target.value })}
                    rows={3}
                    placeholder="Located in..."
                  />
                </div>
                <Button onClick={saveDojoInfo}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Dojo Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensei">
            <Card>
              <CardHeader>
                <CardTitle>Sensei Information</CardTitle>
                <CardDescription>Edit sensei profile and credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={senseiData.name}
                    onChange={(e) => setSenseiData({ ...senseiData, name: e.target.value })}
                    placeholder="Sensei Mohammad Jomaa"
                  />
                </div>
                <div>
                  <Label>Rank</Label>
                  <Input
                    value={senseiData.rank}
                    onChange={(e) => setSenseiData({ ...senseiData, rank: e.target.value })}
                    placeholder="Black Belt 1st Dan"
                  />
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    value={senseiData.experience_years}
                    onChange={(e) => setSenseiData({ ...senseiData, experience_years: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Biography</Label>
                  <Textarea
                    value={senseiData.bio}
                    onChange={(e) => setSenseiData({ ...senseiData, bio: e.target.value })}
                    rows={6}
                    placeholder="Sensei's background and achievements..."
                  />
                </div>
                <div>
                  <Label>Image URL (from assets)</Label>
                  <Input
                    value={senseiData.image_url}
                    onChange={(e) => setSenseiData({ ...senseiData, image_url: e.target.value })}
                    placeholder="/src/assets/sensei-portrait.png"
                  />
                </div>
                <Button onClick={saveSenseiInfo}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Sensei Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="values">
            <Card>
              <CardHeader>
                <CardTitle>Core Values</CardTitle>
                <CardDescription>Edit the four core values displayed on the website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="border p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold">Value {index + 1}</h3>
                    <div>
                      <Label>Icon (lucide-react name)</Label>
                      <Input
                        value={coreValues[index]?.icon || ''}
                        onChange={(e) => {
                          const newValues = [...coreValues];
                          newValues[index] = { ...newValues[index], icon: e.target.value, display_order: index };
                          setCoreValues(newValues);
                        }}
                        placeholder="Shield, Target, Heart, Users"
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={coreValues[index]?.title || ''}
                        onChange={(e) => {
                          const newValues = [...coreValues];
                          newValues[index] = { ...newValues[index], title: e.target.value, display_order: index };
                          setCoreValues(newValues);
                        }}
                        placeholder="Discipline"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={coreValues[index]?.description || ''}
                        onChange={(e) => {
                          const newValues = [...coreValues];
                          newValues[index] = { ...newValues[index], description: e.target.value, display_order: index };
                          setCoreValues(newValues);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={saveCoreValues}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Core Values
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Edit contact details and social media links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="+961-70520091"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="GiyuTeamByJomaa@gmail.com"
                  />
                </div>
                <div>
                  <Label>Physical Address</Label>
                  <Input
                    value={contactData.address}
                    onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                    placeholder="Houmin al Fawka, Nabatiyeh, Lebanon"
                  />
                </div>
                <div>
                  <Label>Facebook URL</Label>
                  <Input
                    value={contactData.facebook}
                    onChange={(e) => setContactData({ ...contactData, facebook: e.target.value })}
                    placeholder="https://www.facebook.com/..."
                  />
                </div>
                <div>
                  <Label>Instagram URL</Label>
                  <Input
                    value={contactData.instagram}
                    onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                    placeholder="https://www.instagram.com/..."
                  />
                </div>
                <Button onClick={saveContactInfo}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Contact Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContent;