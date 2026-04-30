// Visitor-facing live chat sender. Uses service role to bypass RLS.
// Creates a conversation if needed and inserts a 'user' message.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const visitorId = String(body.visitor_id || "").trim();
    const content = String(body.content || "").trim();
    const visitorName = body.visitor_name ? String(body.visitor_name).slice(0, 80) : null;
    const visitorEmail = body.visitor_email ? String(body.visitor_email).slice(0, 160) : null;
    let conversationId: string | null = body.conversation_id || null;

    if (!visitorId || visitorId.length < 8 || visitorId.length > 100) {
      return json({ error: "visitor_id required" }, 400);
    }
    if (!content || content.length > 2000) {
      return json({ error: "content required (max 2000 chars)" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get or create conversation
    if (!conversationId) {
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("visitor_id", visitorId)
        .order("last_message_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (existing) {
        conversationId = existing.id;
      } else {
        const { data: created, error: cErr } = await supabase
          .from("conversations")
          .insert({ visitor_id: visitorId, visitor_name: visitorName, visitor_email: visitorEmail })
          .select("id")
          .single();
        if (cErr) throw cErr;
        conversationId = created.id;
      }
    }

    // Update conversation profile if new info supplied
    if (visitorName || visitorEmail) {
      await supabase
        .from("conversations")
        .update({
          ...(visitorName ? { visitor_name: visitorName } : {}),
          ...(visitorEmail ? { visitor_email: visitorEmail } : {}),
        })
        .eq("id", conversationId!);
    }

    // Insert message
    const { data: msg, error: mErr } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender: "user", content })
      .select("*")
      .single();
    if (mErr) throw mErr;

    // Bump conversation
    await supabase
      .from("conversations")
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: content.slice(0, 140),
        unread_admin_count: (await getCount(supabase, conversationId!, "admin")) + 1,
        unread_user_count: 0,
        status: "open",
      })
      .eq("id", conversationId!);

    return json({ conversation_id: conversationId, message: msg });
  } catch (err) {
    console.error("chat-send error", err);
    return json({ error: "internal error" }, 500);
  }
});

async function getCount(supabase: ReturnType<typeof createClient>, id: string, _kind: string) {
  const { data } = await supabase.from("conversations").select("unread_admin_count").eq("id", id).single();
  return data?.unread_admin_count ?? 0;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
