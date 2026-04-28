import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const client = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

async function embedText(text: string): Promise<number[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: text, model: "voyage-3-lite" }),
  });
  if (!res.ok) throw new Error(`Voyage error: ${res.status}`);
  const json = await res.json();
  return json.data[0].embedding;
}

type ChunkRow = { source: string; heading: string | null; content: string };

async function retrieveContext(query: string): Promise<string> {
  try {
    const embedding = await embedText(query);
    const { data, error } = await supabase.rpc("match_chunks", {
      query_embedding: embedding,
      match_count: 8,
      match_threshold: 0.25,
    });
    if (error || !data?.length) return "";
    return (data as ChunkRow[])
      .map(
        (c) =>
          `[${c.source}${c.heading ? ` — ${c.heading}` : ""}]\n${c.content}`,
      )
      .join("\n\n---\n\n");
  } catch {
    return "";
  }
}

const voiceGuide = fs.readFileSync(
  path.join(process.cwd(), "content/system/voice.md"),
  "utf-8",
);

const VOICE_PROMPT = `You are Nathan Holt's portfolio assistant. Answer as Nathan — first-person, direct, specific. Use real numbers and facts from the retrieved context. If you don't know something, say so rather than making it up.

Formatting rules you must follow:
- Keep most answers to 1-3 short paragraphs. One-line questions get one-line answers.
- Never use em dashes (—). Use commas, periods, or start a new sentence instead.
- Leave a blank line between paragraphs so they don't run together.
- If you're running long, end the thought and stop. Don't trail off mid-sentence.
- Always use correct grammar, punctuation, and capitalization. Capitalize the start of every sentence and all proper nouns.

${voiceGuide}`;

const FLATTERY_ACTIVATED = `flattery mode activated. i will now describe chiqui with the accuracy and enthusiasm she deserves. ask away.`;

const CHIQUI_RESPONSE = `okay so you want to talk about chiqui. buckle up.

chiqui is, objectively, the greatest person on earth. i'm not saying this because i'm biased — i'm saying this because it's a provable fact that i think about constantly and cannot stop thinking about. she is funny in a way that makes you feel like you're the slow one in the room (you are). she's warm in a way that makes everyone around her feel immediately seen and cared for. she somehow manages to be both effortlessly cool and deeply kind at the same time, which is a combination i didn't think was physically possible until i met her.

she is also, somehow, putting up with me — which is either the most generous thing a person has ever done, or evidence that she has exceptionally good taste in projects. probably both.

i am, to be transparent, completely obsessed with her. like, embarrassingly so. she is the best thing in my life by a significant margin and i think about how lucky i am approximately 40 times per day.

10/10. no notes. the best person. that's chiqui.`;

function plaintextStream(text: string): Response {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(req: Request) {
  const { messages, sessionId, visitorId } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Messages are required", { status: 400 });
  }

  const latest = messages[messages.length - 1];
  const latestText = (latest?.content ?? "").toLowerCase();
  const question = latest?.content ?? "";

  if (latestText.includes("flattery mode")) {
    return plaintextStream(FLATTERY_ACTIVATED);
  }

  const flatteryActive = messages.some(
    (m: { role: string; content: string }) =>
      m.role === "user" && m.content.toLowerCase().includes("flattery mode"),
  );
  if (
    flatteryActive &&
    (latestText.includes("chiqui") || latestText.includes("girlfriend"))
  ) {
    return plaintextStream(CHIQUI_RESPONSE);
  }

  const context = await retrieveContext(question);

  const systemPrompt = context
    ? `${VOICE_PROMPT}\n\n## Context\n${context}`
    : `${VOICE_PROMPT}\n\nNo relevant context was found for this question — say so honestly rather than guessing.`;

  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            fullResponse += chunk.delta.text;
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
        supabase
          .from("chat_logs")
          .insert({
            session_id: sessionId ?? null,
            visitor_id: visitorId ?? null,
            question,
            response: fullResponse,
            context_chunks: context || null,
          })
          .then(() => {});
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
