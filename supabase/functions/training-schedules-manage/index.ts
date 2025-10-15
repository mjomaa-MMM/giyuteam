import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Action = 'create' | 'update' | 'delete';

interface ManageRequestBase {
  sessionToken: string;
  action: Action;
}

interface CreateRequest extends ManageRequestBase {
  action: 'create';
  data: {
    type: 'private' | 'group';
    title: string;
    time_start?: string | null;
    time_end?: string | null;
    days: string;
    age_group?: string | null;
    color?: string | null;
  };
}

interface UpdateRequest extends ManageRequestBase {
  action: 'update';
  id: string;
  data: {
    type?: 'private' | 'group';
    title?: string;
    time_start?: string | null;
    time_end?: string | null;
    days?: string;
    age_group?: string | null;
    color?: string | null;
  };
}

interface DeleteRequest extends ManageRequestBase {
  action: 'delete';
  id: string;
}

type ManageRequest = CreateRequest | UpdateRequest | DeleteRequest;

async function verifySessionAndRole(supabaseAdmin: any, sessionToken: string) {
  // Validate session
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('user_id, expires_at')
    .eq('session_token', sessionToken)
    .single();

  if (sessionError || !session) {
    return { ok: false, status: 401, message: 'Invalid session' } as const;
  }

  if (new Date(session.expires_at) < new Date()) {
    // Cleanup expired session
    await supabaseAdmin.from('sessions').delete().eq('session_token', sessionToken);
    return { ok: false, status: 401, message: 'Session expired' } as const;
  }

  // Check role
  const { data: roleData } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user_id)
    .single();

  const role = roleData?.role ?? 'user';
  if (role !== 'admin') {
    return { ok: false, status: 403, message: 'Unauthorized - admin access required' } as const;
  }

  return { ok: true, user_id: session.user_id } as const;
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

    const body = (await req.json()) as ManageRequest;

    if (!body?.sessionToken || !body?.action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing sessionToken or action' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const auth = await verifySessionAndRole(supabaseAdmin, body.sessionToken);
    if (!('ok' in auth) || !auth.ok) {
      return new Response(
        JSON.stringify({ success: false, error: auth.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: auth.status }
      );
    }

    switch (body.action) {
      case 'create': {
        const { data, error } = await supabaseAdmin
          .from('training_schedules')
          .insert([{ ...body.data }])
          .select('id')
          .single();
        if (error) {
          console.error('Create schedule error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create schedule' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        return new Response(
          JSON.stringify({ success: true, id: data?.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      case 'update': {
        const { error } = await supabaseAdmin
          .from('training_schedules')
          .update({ ...(body as UpdateRequest).data })
          .eq('id', (body as UpdateRequest).id);
        if (error) {
          console.error('Update schedule error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to update schedule' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      case 'delete': {
        const { error } = await supabaseAdmin
          .from('training_schedules')
          .delete()
          .eq('id', (body as DeleteRequest).id);
        if (error) {
          console.error('Delete schedule error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to delete schedule' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Unsupported action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
  } catch (error) {
    console.error('training-schedules-manage error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});