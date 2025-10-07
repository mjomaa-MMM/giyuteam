import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AddUserRequest {
  username: string;
  password: string;
  role?: 'admin' | 'user';
  sessionToken?: string;
}

// Verify session and get user info
async function verifySession(supabaseAdmin: any, sessionToken: string) {
  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .select('user_id')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !session) {
    return null;
  }

  // Get user role
  const { data: roleData } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user_id)
    .single();

  return {
    user_id: session.user_id,
    role: roleData?.role || 'user'
  };
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

    const { username, password, role = 'user', sessionToken }: AddUserRequest = await req.json();

    // Authentication check - only admins can add users
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const sessionUser = await verifySession(supabaseAdmin, sessionToken);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized - admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Input validation
    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username and password required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (username.length < 3 || username.length > 50 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username must be 3-50 alphanumeric characters or underscores' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ success: false, error: 'Password must be at least 8 characters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if username already exists
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
      );
    }

    // Generate unique user ID
    const userId = crypto.randomUUID();

    // Hash password with bcrypt (12 salt rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        username: username,
        is_subscribed: false
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create user profile' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Insert password hash
    const { error: passwordError } = await supabaseAdmin
      .from('user_passwords')
      .insert({
        user_id: userId,
        password_hash: passwordHash
      });

    if (passwordError) {
      console.error('Error storing password:', passwordError);
      // Rollback: delete profile
      await supabaseAdmin.from('profiles').delete().eq('user_id', userId);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to store password' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Insert user role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });

    if (roleError) {
      console.error('Error assigning role:', roleError);
      // Rollback: delete password and profile
      await supabaseAdmin.from('user_passwords').delete().eq('user_id', userId);
      await supabaseAdmin.from('profiles').delete().eq('user_id', userId);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to assign user role' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('User created successfully:', username, 'by admin:', sessionUser.user_id);
    return new Response(
      JSON.stringify({ success: true, user_id: userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    );
  } catch (error) {
    console.error('Add user error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
