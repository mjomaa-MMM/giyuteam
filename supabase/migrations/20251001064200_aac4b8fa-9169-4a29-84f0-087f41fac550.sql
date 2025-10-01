-- Drop existing permissive policies
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Password access for authenticated users" ON public.user_passwords;

-- Create restrictive policies that deny all direct client access
-- Only service role (edge functions) can access these tables
CREATE POLICY "Service role only access" 
ON public.profiles 
FOR ALL 
USING (false);

CREATE POLICY "Service role only password access" 
ON public.user_passwords 
FOR ALL 
USING (false);