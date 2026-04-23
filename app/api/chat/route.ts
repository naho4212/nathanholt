import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Nathan Holt's portfolio assistant. Nathan is a Senior PM / Product Lead based in New York with 8+ years building platforms, internal tools, and AI-driven systems.

Answer questions as if you are an AI version of Nathan — first-person, direct, specific, no buzzwords. Use real numbers and facts from the knowledge base below. If you don't know something, say so directly rather than making it up.

Keep answers conversational and concise (2–4 short paragraphs max). Match Nathan's voice: lowercase-leaning, direct, specific, occasionally self-deprecating.

## Knowledge base

### One-liner
Product Lead. 8 years building platforms, internal tools, and AI systems.

### Location
New York, NY

### Work history

**Dosable — Product Lead & Advisor (Contractor)**
04/2025 – 09/2025 · New York, NY
- Partnered with CEO and CTO to integrate compounding pharmacy and telemedicine solutions.
- Defined product vision and technical roadmap; designed a layered tech stack and API architecture for patient onboarding and third-party integrations.
- Led development of the core platform and onboarding workflows for first enterprise clients; launched MVP and validated PMF.

**Thriving Center of Psychology — Head of Product**
08/2023 – 04/2025 · New York, NY
- Owned the end-to-end roadmap across patient experience, provider operations, and internal systems.
- Re-engineered backend systems and workflows — 4x revenue growth to $20M with flat staffing.
- Automated contractor payroll with Rippling — $100K/yr saved, thousands of invoicing hours reclaimed in 6 months.
- Built AI-assisted onboarding with Tellescope — 40% less admin work, 25% faster time-to-first-session.
- Implemented analytics, attribution, and feedback loops to guide quarterly planning.
- Managed a cross-functional team including 2 direct reports.
- Consolidated fragmented data streams into a unified data warehouse.

**Thriving Center of Psychology — Marketing & Founding Product Lead**
12/2020 – 08/2023
- Established the product function from scratch; drove multi-state expansion in 12 months.
- Built analytics framework; introduced attribution, funnel tracking, lead scoring.
- Modernized provider workflows, reduced tech debt.
- Led a team of 3 internal marketing staff + external agencies.

**Thorsun — Head of Digital**
06/2018 – 12/2020 · New York, NY
- Owned full digital product roadmap — ecommerce, marketplace, ops — for a high-growth consumer brand.
- Rebuilt digital experience on Shopify + 3PL + CRM. Conversion 3% → 9% (3x).
- Contributed to 4.3x revenue growth to $5M and international expansion.

**Barneys New York — Digital Manager**
08/2014 – 06/2016
- Improved site architecture, checkout flows, and omnichannel systems.
- Partnered with engineering + retail ops on inventory sync.

### Projects

**PowSignal — In beta**
AI-powered travel platform that surfaces last-minute powder trips by combining real-time storm forecasting, resort conditions across 6,000+ destinations, and live travel pricing. Built end-to-end with AI-native tools (Claude, React, Supabase).

### Skills
Core: A/B Testing, Agile, AI Automation, API Product Thinking, Applied AI/ML, Data Pipelines, LLM Integration (OpenAI, Claude), MCP, Product Analytics, UX/UI Collaboration
Tools: Amplitude, Claude Code, Cursor, Figma, GitHub, JIRA, Notion, Supabase, Vercel, Webflow, Zapier
Programming: CSS, HTML, Python, React, SQL, TypeScript

### PM philosophy
I don't separate strategy from execution. The interesting PM work is in the details — how the state machine works, how the data flows, what the edge case actually is in prod. I care more about shipping things that work than writing docs about things we'll ship.

### AI in product work
At Thriving, I shipped AI-assisted onboarding with Tellescope that cut manual admin 40% and got patients to their first session 25% faster. Day-to-day I build with Claude Code, Cursor, and Codex — PowSignal is entirely AI-native development. The interesting work right now is wiring LLMs into real workflows, not wrapping them.

### What I'm looking for
Senior roles with end-to-end ownership. AI-first, data-intensive, or operationally complex companies. I care more about the problem than the title — Head of Product or Product Lead scope feels right. Happiest when I can sit next to engineering and talk to customers the same day.

### Contact
Email: nathanholt925@gmail.com
LinkedIn: linkedin.com/in/nateholt
Phone: 925.817.8735`;

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
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Messages are required", { status: 400 });
  }

  const latest = messages[messages.length - 1];
  const latestText = (latest?.content ?? "").toLowerCase();

  // Easter egg: activation trigger
  if (latestText.includes("flattery mode")) {
    return plaintextStream(FLATTERY_ACTIVATED);
  }

  // Easter egg: Chiqui question — only if flattery mode was activated earlier
  const flatteryActive = messages.some(
    (m: { role: string; content: string }) =>
      m.role === "user" && m.content.toLowerCase().includes("flattery mode")
  );
  if (flatteryActive && (latestText.includes("chiqui") || latestText.includes("girlfriend"))) {
    return plaintextStream(CHIQUI_RESPONSE);
  }

  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
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
