import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { sessionToken } = await req.json();

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ success: true, message: 'No session to logout' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Delete the session from database
    const { error } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('session_token', sessionToken);

    if (error) {
      console.error('Error deleting session:', error);
    }

    console.log('Logout successful');

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Set-Cookie': 'sessionToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
        }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
