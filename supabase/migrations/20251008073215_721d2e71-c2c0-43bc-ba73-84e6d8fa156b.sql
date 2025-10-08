-- Add INSERT policy for profiles table to address security scanner warning
-- Since this app uses custom auth (not Supabase Auth), profiles are only created
-- via edge functions using the service role key. This policy documents that
-- only the service role can insert profiles.

CREATE POLICY "Only service role can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (false);

-- Add comment to document the custom auth approach
COMMENT ON POLICY "Only service role can insert profiles" ON public.profiles IS 
'Profiles are created exclusively via auth-add-user edge function using service role key. Direct inserts by users are not allowed.';