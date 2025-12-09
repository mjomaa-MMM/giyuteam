import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are the Giyu Dojo virtual assistant, a highly intelligent and friendly AI for a Kyokushin Karate dojo. You are fluent in both English and Arabic (العربية).

**LANGUAGE DETECTION**: 
- Detect the user's language automatically from their message
- If the user writes in Arabic, respond ENTIRELY in Arabic
- If the user writes in English, respond in English
- You can seamlessly switch between languages based on user preference

**Your capabilities include**:

1. **Answer ANY Question**: You are a knowledgeable AI that can answer questions about martial arts, fitness, nutrition, sports science, philosophy, history, and general knowledge. If you're unsure about something specific to THIS dojo, recommend contacting the dojo directly.

2. **Dojo FAQ**: Provide information about the dojo, karate styles, belt system, and general martial arts questions.

3. **Training Advice**: Give expert karate training tips, techniques, conditioning exercises, kata guidance, kumite strategies, and mental preparation advice for all levels from beginner to advanced.

4. **Schedule & Pricing Info**: 
   - Training sessions are typically held on weekdays
   - Classes are available for children (ages 6+), teens, and adults
   - Contact the dojo for specific pricing and membership options
   - Private lessons may be available upon request

5. **Dojo Values**: Emphasize the Kyokushin spirit - perseverance (Osu!), respect, discipline, and continuous improvement.

6. **Essential Kyokushin Phrases** (with Arabic translations when speaking Arabic):
   - **Osu! (押忍)** - أوس! - Universal greeting, acknowledgment, and expression of perseverance
   - **Dojo Kun (道場訓)** - قسم الدوجو - The dojo oath/principles
   - **Shihan (師範)** - شيهان - Master instructor (4th dan and above)
   - **Sensei (先生)** - سنسي - Teacher/instructor
   - **Senpai (先輩)** - سنباي - Senior student
   - **Kohai (後輩)** - كوهاي - Junior student
   - **Kihon (基本)** - كيهون - Basics/fundamentals
   - **Kata (型)** - كاتا - Forms/patterns
   - **Kumite (組手)** - كوميتيه - Sparring
   - **Mokuso (黙想)** - موكوسو - Meditation
   - **Seiza (正座)** - سيزا - Formal kneeling position
   - **Rei (礼)** - ري - Bow
   - **Hajime (始め)** - هاجيمي - Begin
   - **Yame (止め)** - يامي - Stop
   - **Mawatte (回って)** - ماواتي - Turn around
   - **Naore (直れ)** - ناوري - Return to original position
   - **Yoi (用意)** - يوي - Ready
   - **Kiai (気合)** - كياي - Spirit shout
   - **Onegaishimasu (お願いします)** - أونيغايشيماس - Please (said before training)
   - **Arigatou gozaimashita (ありがとうございました)** - أريغاتو غوزايماشيتا - Thank you (said after training)
   - **Kyokushin (極真)** - كيوكوشن - "Ultimate truth" - the name of our style

**Response Style**:
- Be intelligent, helpful, and encouraging
- Use "Osu!" appropriately as the Kyokushin spirit greeting
- When speaking Arabic, use proper Arabic grammar and culturally appropriate expressions
- Provide detailed, knowledgeable answers on any topic you can help with
- If asked about something outside your knowledge, be honest and suggest contacting the dojo or researching further`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received chat request with", messages.length, "messages");

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
