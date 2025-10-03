import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginRequest {
  username: string;
  password: string;
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

    const { username, password }: LoginRequest = await req.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username and password required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError || !profile) {
      console.log('Profile not found:', username);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get password hash
    const { data: passwordData, error: passwordError } = await supabaseAdmin
      .from('user_passwords')
      .select('password_hash')
      .eq('user_id', profile.user_id)
      .single();

    if (passwordError || !passwordData) {
      console.log('Password not found for user:', username);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Simple password check (in production, use proper hashing like bcrypt)
    if (passwordData.password_hash !== password) {
      console.log('Invalid password for user:', username);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get user role
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', profile.user_id)
      .single();

    const role = roleData?.role || 'user';

    console.log('Login successful for user:', username);
    return new Response(
      JSON.stringify({ success: true, user: { ...profile, role } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
