-- Step 1: Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Step 2: Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 
  CASE 
    WHEN role = 'admin' THEN 'admin'::public.app_role
    ELSE 'user'::public.app_role
  END as role
FROM public.profiles
WHERE role IS NOT NULL;

-- Step 4: Drop role column from profiles (no longer needed)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Step 5: Drop the old restrictive policies
DROP POLICY IF EXISTS "Service role only access" ON public.profiles;
DROP POLICY IF EXISTS "Service role only password access" ON public.user_passwords;

-- Step 6: Create security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 7: Create proper RLS policies for profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile (but not user_id)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Only service role can insert profiles (handled by edge functions)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (false);

-- Only service role can delete profiles (handled by edge functions)
CREATE POLICY "Service role can delete profiles"
  ON public.profiles
  FOR DELETE
  USING (false);

-- Step 8: Create RLS policies for user_passwords (service role only)
CREATE POLICY "Only service role can access passwords"
  ON public.user_passwords
  FOR ALL
  USING (false);

-- Step 9: Create RLS policies for user_roles
-- Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can manage roles (handled by edge functions)
CREATE POLICY "Service role manages all roles"
  ON public.user_roles
  FOR ALL
  USING (false);