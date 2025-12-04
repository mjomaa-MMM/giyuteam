import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { compareSync } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginRequest {
  username: string;
  password: string;
}

// Generate cryptographically secure session token
function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
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

    // Input validation
    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username and password required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (username.length < 3 || username.length > 50) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username must be 3-50 characters' }),
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

    // Verify password using bcrypt (synchronous to avoid Worker issues)
    const isValidPassword = compareSync(password, passwordData.password_hash);
    
    if (!isValidPassword) {
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

    // Clean up old sessions for this user first
    await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('user_id', profile.user_id);

    // Create new session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

    const { error: sessionError } = await supabaseAdmin
      .from('sessions')
      .insert({
        user_id: profile.user_id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create session' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Login successful for user:', username);
    
    // Set HTTP-only cookie for session token
    const cookieHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Set-Cookie': `sessionToken=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${24 * 60 * 60}`
    };
    
    return new Response(
      JSON.stringify({ 
        success: true,
        sessionToken,
        user: { 
          user_id: profile.user_id,
          username: profile.username,
          role,
          belt_color: profile.belt_color || 'white',
          is_subscribed: profile.is_subscribed,
          subscription_date: profile.subscription_date,
          next_bill_date: profile.next_bill_date
        }
      }),
      { headers: cookieHeaders, status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
