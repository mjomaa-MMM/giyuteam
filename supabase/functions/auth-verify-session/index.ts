import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  sessionToken?: string;
}

// Helper to extract session token from cookie
function getSessionTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('sessionToken='));
  return sessionCookie ? sessionCookie.split('=')[1] : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Try to get session token from cookie first, then from request body
    let sessionToken = getSessionTokenFromCookie(req.headers.get('cookie'));
    
    if (!sessionToken) {
      const body: VerifyRequest = await req.json();
      sessionToken = body.sessionToken || null;
    }

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Session token required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid session' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabaseAdmin
        .from('sessions')
        .delete()
        .eq('session_token', sessionToken);

      return new Response(
        JSON.stringify({ success: false, error: 'Session expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', session.user_id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get user role
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user_id)
      .single();

    const role = roleData?.role || 'user';

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          user_id: profile.user_id,
          username: profile.username,
          role,
          is_subscribed: profile.is_subscribed,
          subscription_date: profile.subscription_date,
          next_bill_date: profile.next_bill_date
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Verify session error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
