import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateUserRequest {
  userId: string;
  updates: {
    username?: string;
    is_subscribed?: boolean;
    subscription_date?: string | null;
    next_bill_date?: string | null;
    role?: 'admin' | 'user';
  };
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

    const body: UpdateUserRequest = await req.json();
    const { userId, updates } = body;
    
    // Try to get session token from cookie first, then from request body
    let sessionToken = getSessionTokenFromCookie(req.headers.get('cookie'));
    if (!sessionToken) {
      sessionToken = body.sessionToken || null;
    }

    // Authentication check
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const sessionUser = await verifySession(supabaseAdmin, sessionToken);
    if (!sessionUser) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired session' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Authorization check
    // Users can only update their own profile (except role)
    // Admins can update any user
    const isAdmin = sessionUser.role === 'admin';
    const isOwnProfile = sessionUser.user_id === userId;

    if (!isAdmin && !isOwnProfile) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized - cannot update other users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Regular users cannot change roles
    if (!isAdmin && updates.role) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized - cannot change roles' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    if (!userId || !updates) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID and updates required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { role, ...profileUpdates } = updates;

    // Validate username if provided
    if (profileUpdates.username) {
      if (profileUpdates.username.length < 3 || profileUpdates.username.length > 50 || 
          !/^[a-zA-Z0-9_]+$/.test(profileUpdates.username)) {
        return new Response(
          JSON.stringify({ success: false, error: 'Username must be 3-50 alphanumeric characters or underscores' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Check if username already exists (excluding current user)
      const { data: existingUser } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('username', profileUpdates.username)
        .neq('user_id', userId)
        .single();

      if (existingUser) {
        return new Response(
          JSON.stringify({ success: false, error: 'Username already exists' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        );
      }
    }

    // Update profile if there are profile updates
    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update user profile' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Update role if provided (admin only)
    if (role && isAdmin) {
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingRole) {
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .update({ role })
          .eq('user_id', userId);

        if (roleError) {
          console.error('Error updating role:', roleError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to update user role' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
      } else {
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (roleError) {
          console.error('Error creating role:', roleError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create user role' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
      }
    }

    console.log('User updated successfully:', userId, 'by:', sessionUser.user_id);
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Update user error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
