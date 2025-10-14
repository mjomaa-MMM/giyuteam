-- Create table for training schedules
CREATE TABLE public.training_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('private', 'group')),
  title text NOT NULL,
  time_start text,
  time_end text,
  days text NOT NULL,
  age_group text,
  color text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.training_schedules ENABLE ROW LEVEL SECURITY;

-- Anyone can view schedules
CREATE POLICY "Anyone can view training schedules"
ON public.training_schedules
FOR SELECT
USING (true);

-- Only admins can insert schedules
CREATE POLICY "Admins can insert training schedules"
ON public.training_schedules
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can update schedules
CREATE POLICY "Admins can update training schedules"
ON public.training_schedules
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete schedules
CREATE POLICY "Admins can delete training schedules"
ON public.training_schedules
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_training_schedules_updated_at
BEFORE UPDATE ON public.training_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default schedules
INSERT INTO public.training_schedules (type, title, time_start, time_end, days, age_group, color) VALUES
('private', 'Private Classes', NULL, NULL, 'Monday - Thursday', NULL, 'bg-dojo-red'),
('group', 'Kids Group 1', '4:00 PM', '5:00 PM', 'Friday & Saturday', 'Kids', 'bg-pink-500'),
('group', 'Kids Group 2', '5:00 PM', '6:00 PM', 'Friday & Saturday', 'Kids', 'bg-blue-500'),
('group', 'Teens Group', '6:00 PM', '7:15 PM', 'Friday & Saturday', 'Teens', 'bg-green-500'),
('group', 'Adults Group', '7:15 PM', '9:00 PM', 'Friday & Saturday', 'Adults', 'bg-dojo-red');