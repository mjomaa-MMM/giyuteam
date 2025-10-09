-- Create news table
CREATE TABLE public.news (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  published boolean NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view published news
CREATE POLICY "Anyone can view published news"
ON public.news
FOR SELECT
USING (published = true);

-- Only admins can insert news
CREATE POLICY "Admins can insert news"
ON public.news
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update news
CREATE POLICY "Admins can update news"
ON public.news
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete news
CREATE POLICY "Admins can delete news"
ON public.news
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for news images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('news-images', 'news-images', true);

-- Storage policies for news images
CREATE POLICY "Anyone can view news images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'news-images');

CREATE POLICY "Admins can upload news images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'news-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update news images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'news-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete news images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'news-images' 
  AND public.has_role(auth.uid(), 'admin')
);