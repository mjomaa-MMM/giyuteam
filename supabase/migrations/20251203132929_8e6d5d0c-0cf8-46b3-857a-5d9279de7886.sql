-- Add belt_color column to profiles table
ALTER TABLE public.profiles ADD COLUMN belt_color text DEFAULT 'white';

-- Add check constraint for valid colors
ALTER TABLE public.profiles ADD CONSTRAINT valid_belt_color CHECK (belt_color IN ('white', 'orange', 'blue', 'yellow', 'green', 'brown', 'black'));