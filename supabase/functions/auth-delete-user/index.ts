import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeleteUserRequest {
  userId: string;
  sessionToken: string;
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

    const { userId, sessionToken }: DeleteUserRequest = await req.json();

    // Authentication check - only admins can delete users
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

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Delete user sessions first
    await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('user_id', userId);

    // Delete user role
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Delete user password
    await supabaseAdmin
      .from('user_passwords')
      .delete()
      .eq('user_id', userId);

    // Delete user profile
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to delete user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('User deleted successfully:', userId, 'by admin:', sessionUser.user_id);
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
