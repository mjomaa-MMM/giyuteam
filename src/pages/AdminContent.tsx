import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";

interface SenseiInfo {
  id: string;
  name: string;
  rank: string;
  experience_years: number;
  bio: string;
  image_url: string | null;
}

interface DojoInfo {
  id: string;
  section_key: string;
  title: string;
  content: string;
}

interface CoreValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  display_order: number;
}

interface ContactInfo {
  id: string;
  info_key: string;
  info_value: string;
}

const AdminContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [senseiInfo, setSenseiInfo] = useState<SenseiInfo | null>(null);
  const [dojoInfo, setDojoInfo] = useState<DojoInfo[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

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
      const [senseiRes, dojoRes, valuesRes, contactRes] = await Promise.all([
        supabase.from('sensei_info').select('*').limit(1).maybeSingle(),
        supabase.from('dojo_info').select('*'),
        supabase.from('core_values').select('*').order('display_order'),
        supabase.from('contact_info').select('*')
      ]);

      if (senseiRes.data) setSenseiInfo(senseiRes.data);
      if (dojoRes.data) setDojoInfo(dojoRes.data);
      if (valuesRes.data) setCoreValues(valuesRes.data);
      if (contactRes.data) setContactInfo(contactRes.data);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSenseiInfo = async () => {
    if (!senseiInfo) return;

    try {
      const { error } = await supabase
        .from('sensei_info')
        .update({
          name: senseiInfo.name,
          rank: senseiInfo.rank,
          experience_years: senseiInfo.experience_years,
          bio: senseiInfo.bio,
          image_url: senseiInfo.image_url,
        })
        .eq('id', senseiInfo.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sensei information updated successfully",
      });
    } catch (error) {
      console.error('Error saving sensei info:', error);
      toast({
        title: "Error",
        description: "Failed to save sensei information",
        variant: "destructive",
      });
    }
  };

  const saveDojoInfo = async (info: DojoInfo) => {
    try {
      const { error } = await supabase
        .from('dojo_info')
        .update({ title: info.title, content: info.content })
        .eq('id', info.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dojo information updated successfully",
      });
    } catch (error) {
      console.error('Error saving dojo info:', error);
      toast({
        title: "Error",
        description: "Failed to save dojo information",
        variant: "destructive",
      });
    }
  };

  const saveCoreValue = async (value: CoreValue) => {
    try {
      const { error } = await supabase
        .from('core_values')
        .update({
          icon: value.icon,
          title: value.title,
          description: value.description,
          display_order: value.display_order,
        })
        .eq('id', value.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Core value updated successfully",
      });
    } catch (error) {
      console.error('Error saving core value:', error);
      toast({
        title: "Error",
        description: "Failed to save core value",
        variant: "destructive",
      });
    }
  };

  const deleteCoreValue = async (id: string) => {
    try {
      const { error } = await supabase.from('core_values').delete().eq('id', id);
      if (error) throw error;

      setCoreValues(coreValues.filter(v => v.id !== id));
      toast({
        title: "Success",
        description: "Core value deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting core value:', error);
      toast({
        title: "Error",
        description: "Failed to delete core value",
        variant: "destructive",
      });
    }
  };

  const addCoreValue = async () => {
    try {
      const newValue = {
        icon: 'Star',
        title: 'New Value',
        description: 'Description',
        display_order: coreValues.length + 1,
      };

      const { data, error } = await supabase
        .from('core_values')
        .insert(newValue)
        .select()
        .single();

      if (error) throw error;
      if (data) setCoreValues([...coreValues, data]);

      toast({
        title: "Success",
        description: "Core value added successfully",
      });
    } catch (error) {
      console.error('Error adding core value:', error);
      toast({
        title: "Error",
        description: "Failed to add core value",
        variant: "destructive",
      });
    }
  };

  const saveContactInfo = async (info: ContactInfo) => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .update({ info_value: info.info_value })
        .eq('id', info.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "Error",
        description: "Failed to save contact information",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Content Management</h1>
          </div>
        </div>

        <Tabs defaultValue="sensei" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sensei">Sensei</TabsTrigger>
            <TabsTrigger value="dojo">Dojo Info</TabsTrigger>
            <TabsTrigger value="values">Core Values</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="sensei">
            {senseiInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Sensei Information</CardTitle>
                  <CardDescription>Update the sensei's details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={senseiInfo.name}
                      onChange={(e) => setSenseiInfo({ ...senseiInfo, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Rank</Label>
                    <Input
                      value={senseiInfo.rank}
                      onChange={(e) => setSenseiInfo({ ...senseiInfo, rank: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Experience (years)</Label>
                    <Input
                      type="number"
                      value={senseiInfo.experience_years}
                      onChange={(e) => setSenseiInfo({ ...senseiInfo, experience_years: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={senseiInfo.image_url || ''}
                      onChange={(e) => setSenseiInfo({ ...senseiInfo, image_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={senseiInfo.bio}
                      onChange={(e) => setSenseiInfo({ ...senseiInfo, bio: e.target.value })}
                      rows={6}
                    />
                  </div>
                  <Button onClick={saveSenseiInfo}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dojo">
            <div className="space-y-4">
              {dojoInfo.map((info) => (
                <Card key={info.id}>
                  <CardHeader>
                    <CardTitle>{info.section_key}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={info.title}
                        onChange={(e) => {
                          setDojoInfo(dojoInfo.map(d => 
                            d.id === info.id ? { ...d, title: e.target.value } : d
                          ));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={info.content}
                        onChange={(e) => {
                          setDojoInfo(dojoInfo.map(d => 
                            d.id === info.id ? { ...d, content: e.target.value } : d
                          ));
                        }}
                        rows={4}
                      />
                    </div>
                    <Button onClick={() => saveDojoInfo(info)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="values">
            <div className="space-y-4">
              <Button onClick={addCoreValue}>
                <Plus className="h-4 w-4 mr-2" />
                Add Core Value
              </Button>
              {coreValues.map((value) => (
                <Card key={value.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Icon (Lucide name)</Label>
                        <Input
                          value={value.icon}
                          onChange={(e) => {
                            setCoreValues(coreValues.map(v => 
                              v.id === value.id ? { ...v, icon: e.target.value } : v
                            ));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={value.display_order}
                          onChange={(e) => {
                            setCoreValues(coreValues.map(v => 
                              v.id === value.id ? { ...v, display_order: parseInt(e.target.value) } : v
                            ));
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => {
                          setCoreValues(coreValues.map(v => 
                            v.id === value.id ? { ...v, title: e.target.value } : v
                          ));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={value.description}
                        onChange={(e) => {
                          setCoreValues(coreValues.map(v => 
                            v.id === value.id ? { ...v, description: e.target.value } : v
                          ));
                        }}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => saveCoreValue(value)}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="destructive" onClick={() => deleteCoreValue(value.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <Card key={info.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label className="capitalize">{info.info_key.replace('_', ' ')}</Label>
                      <Input
                        value={info.info_value}
                        onChange={(e) => {
                          setContactInfo(contactInfo.map(c => 
                            c.id === info.id ? { ...c, info_value: e.target.value } : c
                          ));
                        }}
                      />
                    </div>
                    <Button onClick={() => saveContactInfo(info)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContent;
