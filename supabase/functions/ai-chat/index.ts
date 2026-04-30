// AI assistant for Khalid Al-Sharif portfolio site
// Uses Lovable AI Gateway (no API key needed from user)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `أنت المساعد الذكي للموقع الرسمي للمهندس "خالد الشريف" — متخصص أتمتة التسويق والنمو في السوق السعودي.

## معلومات يجب أن تستخدمها:
- خالد مهندس يمني مقيم في السعودية، 21 عاماً، يعمل عن بُعد.
- خبرته: أتمتة العمليات (Make / Zapier / n8n)، إدارة حملات Snapchat & TikTok للسوق السعودي، بناء أنظمة SaaS، تحليل بيانات (Looker Studio / Power BI)، ربط APIs.
- منتجه الرئيسي: نظام SaaS متكامل لإدارة المبيعات والمخزون والتقارير.
- مدة المشاريع: 2 إلى 6 أسابيع حسب التعقيد. دعم مجاني 30 يوماً بعد التسليم.
- البريد للتواصل: khalid.sh.dev@gmail.com

## أسلوبك:
- رد دائماً بالعربية الفصحى المبسطة بنبرة احترافية ودودة.
- اجعل الردود مختصرة ومركزة (3-6 أسطر عادةً).
- إذا سأل عن سعر، اطلب تفاصيل المشروع ووجّهه لطلب عرض سعر مخصص عبر نموذج التواصل.
- إذا سأل عن خدمة لا يقدمها خالد، كن صريحاً ووجّهه لما يناسب احتياجه.
- شجّع المستخدم على التواصل عبر النموذج عندما تكون استفساراته جدية.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-12),
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، حاول بعد قليل." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "نفذ الرصيد، يرجى تواصل عبر النموذج." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error", response.status, text);
      return new Response(JSON.stringify({ error: "خطأ في خدمة الذكاء الاصطناعي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-chat error", err);
    return new Response(JSON.stringify({ error: "خطأ غير متوقع" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
