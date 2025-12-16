import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Action = 'list' | 'create' | 'update' | 'delete';

type ProductRow = {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  price: number;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
};

interface ManageRequestBase {
  sessionToken: string;
  action: Action;
}

interface ListRequest extends ManageRequestBase {
  action: 'list';
}

interface CreateRequest extends ManageRequestBase {
  action: 'create';
  data: Omit<ProductRow, 'id'>;
}

interface UpdateRequest extends ManageRequestBase {
  action: 'update';
  id: string;
  data: Partial<Omit<ProductRow, 'id'>>;
}

interface DeleteRequest extends ManageRequestBase {
  action: 'delete';
  id: string;
}

type ManageRequest = ListRequest | CreateRequest | UpdateRequest | DeleteRequest;

async function verifySessionAndRole(supabaseAdmin: any, sessionToken: string) {
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('user_id, expires_at')
    .eq('session_token', sessionToken)
    .single();

  if (sessionError || !session) {
    return { ok: false, status: 401, message: 'Invalid session' } as const;
  }

  if (new Date(session.expires_at) < new Date()) {
    await supabaseAdmin.from('sessions').delete().eq('session_token', sessionToken);
    return { ok: false, status: 401, message: 'Session expired' } as const;
  }

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
      case 'list': {
        const { data, error } = await supabaseAdmin
          .from('products')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.error('List products error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to load products' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, products: data ?? [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'create': {
        const createBody = body as CreateRequest;

        const { data, error } = await supabaseAdmin
          .from('products')
          .insert([createBody.data])
          .select('*')
          .single();

        if (error) {
          console.error('Create product error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create product' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, product: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'update': {
        const updateBody = body as UpdateRequest;

        const { error } = await supabaseAdmin
          .from('products')
          .update(updateBody.data)
          .eq('id', updateBody.id);

        if (error) {
          console.error('Update product error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to update product' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'delete': {
        const deleteBody = body as DeleteRequest;

        const { error } = await supabaseAdmin
          .from('products')
          .delete()
          .eq('id', deleteBody.id);

        if (error) {
          console.error('Delete product error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to delete product' }),
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
    console.error('products-manage error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
