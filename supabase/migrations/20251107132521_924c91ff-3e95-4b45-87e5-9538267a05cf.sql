-- Create table for site settings
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for sensei information
CREATE TABLE public.sensei_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  rank text NOT NULL,
  experience_years integer NOT NULL,
  bio text NOT NULL,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for dojo information
CREATE TABLE public.dojo_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for core values
CREATE TABLE public.core_values (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for contact information
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  info_key text NOT NULL UNIQUE,
  info_value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensei_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dojo_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for sensei_info
CREATE POLICY "Anyone can view sensei info" ON public.sensei_info FOR SELECT USING (true);
CREATE POLICY "Admins can update sensei info" ON public.sensei_info FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert sensei info" ON public.sensei_info FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete sensei info" ON public.sensei_info FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for dojo_info
CREATE POLICY "Anyone can view dojo info" ON public.dojo_info FOR SELECT USING (true);
CREATE POLICY "Admins can update dojo info" ON public.dojo_info FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert dojo info" ON public.dojo_info FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete dojo info" ON public.dojo_info FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for core_values
CREATE POLICY "Anyone can view core values" ON public.core_values FOR SELECT USING (true);
CREATE POLICY "Admins can update core values" ON public.core_values FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert core values" ON public.core_values FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete core values" ON public.core_values FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for contact_info
CREATE POLICY "Anyone can view contact info" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Admins can update contact info" ON public.contact_info FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert contact info" ON public.contact_info FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete contact info" ON public.contact_info FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sensei_info_updated_at BEFORE UPDATE ON public.sensei_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dojo_info_updated_at BEFORE UPDATE ON public.dojo_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_core_values_updated_at BEFORE UPDATE ON public.core_values FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data for sensei
INSERT INTO public.sensei_info (name, rank, experience_years, bio, image_url)
VALUES (
  'Shihan Marcus Silva',
  '4th Dan Black Belt',
  20,
  'Shihan Marcus Silva is a dedicated martial artist with over 20 years of experience in Kyokushin Karate. Under the guidance of Kyoshi André Luiz Massao, he has developed a deep understanding of both the physical and philosophical aspects of the art. His teaching philosophy emphasizes discipline, respect, and continuous personal growth.',
  '/src/assets/sensei-portrait.jpg'
);

-- Insert default data for dojo info
INSERT INTO public.dojo_info (section_key, title, content) VALUES
('mission', 'Our Mission', 'At Giyu Karate Team, we are dedicated to teaching traditional Kyokushin Karate while fostering personal growth, discipline, and respect. Our mission is to develop not only skilled martial artists but also confident, principled individuals.'),
('location', 'Location', 'Av. Pres. Vargas, 590 - Centro, Rio de Janeiro - RJ, 20071-001');

-- Insert default core values
INSERT INTO public.core_values (icon, title, description, display_order) VALUES
('Target', 'Discipline', 'Building mental and physical strength through consistent practice and dedication.', 1),
('Award', 'Excellence', 'Striving for continuous improvement in technique, character, and spirit.', 2),
('Heart', 'Respect', 'Honoring our traditions, instructors, and fellow practitioners.', 3),
('Users', 'Community', 'Creating a supportive environment where everyone can grow together.', 4);

-- Insert default contact info
INSERT INTO public.contact_info (info_key, info_value) VALUES
('phone', '+55 21 98765-4321'),
('email', 'contato@giyukarate.com'),
('address', 'Av. Pres. Vargas, 590 - Centro, Rio de Janeiro - RJ, 20071-001'),
('whatsapp', '5521987654321'),
('facebook', 'https://facebook.com/giyukarate'),
('instagram', 'https://instagram.com/giyukarate');