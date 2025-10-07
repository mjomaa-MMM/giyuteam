-- Create sessions table for secure session management
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Only service role can manage sessions (edge functions)
CREATE POLICY "Service role manages sessions"
ON public.sessions
FOR ALL
USING (false);

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
ON public.sessions
FOR SELECT
USING (auth.uid() = user_id);

-- Create index for faster session lookups
CREATE INDEX idx_sessions_token ON public.sessions(session_token);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON public.sessions(expires_at);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.sessions WHERE expires_at < now();
END;
$$;