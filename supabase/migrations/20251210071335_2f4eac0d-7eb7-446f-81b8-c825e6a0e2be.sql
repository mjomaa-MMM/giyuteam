-- Create products table for shop
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (is_active = true);

-- Admins can manage products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all products (including inactive)
CREATE POLICY "Admins can view all products"
ON public.products
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 7 default products
INSERT INTO public.products (name, name_ar, description, description_ar, price, display_order) VALUES
('Kyokushin Gi (Uniform)', 'بدلة كيوكوشن', 'High-quality karate uniform for training', 'بدلة كاراتيه عالية الجودة للتدريب', 85.00, 1),
('Training Gloves', 'قفازات التدريب', 'Protective gloves for sparring sessions', 'قفازات واقية لجلسات القتال', 35.00, 2),
('Shin Guards', 'واقيات الساق', 'Durable shin protection for kumite', 'حماية متينة للساق للكوميتيه', 40.00, 3),
('Chest Protector', 'واقي الصدر', 'Full chest protection for safe training', 'حماية كاملة للصدر للتدريب الآمن', 55.00, 4),
('Focus Mitts', 'أهداف التركيز', 'Professional training mitts for technique practice', 'أهداف تدريب احترافية لممارسة التقنيات', 45.00, 5),
('Kyokushin Belt', 'حزام كيوكوشن', 'Official Kyokushin colored belt', 'حزام كيوكوشن الرسمي الملون', 15.00, 6),
('Training Bag', 'حقيبة التدريب', 'Spacious bag for all your training gear', 'حقيبة واسعة لجميع معدات التدريب', 50.00, 7);