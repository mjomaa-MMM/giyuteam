import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetUsersRequest {
  sessionToken?: string;
}

// Helper to extract session token from cookie
function getSessionTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('sessionToken='));
  return sessionCookie ? sessionCookie.split('=')[1] : null;
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

    // Try to get session token from cookie first, then from request body
    let sessionToken = getSessionTokenFromCookie(req.headers.get('cookie'));
    
    if (!sessionToken) {
      const body: GetUsersRequest = await req.json();
      sessionToken = body.sessionToken || null;
    }

    // Authentication check - only admins can get all users
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

    // Get all profiles
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get roles for all users
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    }

    // Map roles to profiles
    const rolesMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);
    const usersWithRoles = profiles?.map(profile => ({
      ...profile,
      role: rolesMap.get(profile.user_id) || 'user'
    })) || [];

    console.log('Fetched users:', usersWithRoles.length, 'by admin:', sessionUser.user_id);
    return new Response(
      JSON.stringify({ success: true, users: usersWithRoles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
