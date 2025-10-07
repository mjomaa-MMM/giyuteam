-- Drop the restrictive policies that block all INSERT and DELETE operations
-- The service role bypasses RLS by default, so these blocking policies are unnecessary
-- and prevent the auth edge functions from working

DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can delete profiles" ON public.profiles;

-- The existing permissive policies for SELECT and UPDATE are sufficient:
-- - "Users can view own profile" allows users to view their own data
-- - "Users can update own profile" allows users to update their own data
-- - Service role operations (INSERT/DELETE) will work automatically as they bypass RLS