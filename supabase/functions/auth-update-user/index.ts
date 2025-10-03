import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateUserRequest {
  userId: string;
  updates: {
    username?: string;
    role?: string;
    is_subscribed?: boolean;
    subscription_date?: string;
    next_bill_date?: string;
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

    const { userId, updates }: UpdateUserRequest = await req.json();

    if (!userId || !updates) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID and updates required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Extract role from updates if present (handle separately)
    const { role, ...profileUpdates } = updates;

    // If username is being updated, check if it already exists
    if (profileUpdates.username) {
      const { data: existing } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('username', profileUpdates.username)
        .single();

      if (existing && existing.user_id !== userId) {
        console.log('Username already exists:', profileUpdates.username);
        return new Response(
          JSON.stringify({ success: false, error: 'Username already exists' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        );
      }
    }

    // Update profile (only non-role fields)
    if (Object.keys(profileUpdates).length > 0) {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update user' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Update role if provided
    if (role) {
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingRole) {
        // Update existing role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .update({ role })
          .eq('user_id', userId);

        if (roleError) {
          console.error('Error updating role:', roleError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to update role' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
      } else {
        // Insert new role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (roleError) {
          console.error('Error creating role:', roleError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to update role' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
      }
    }

    console.log('User updated successfully:', userId);
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
