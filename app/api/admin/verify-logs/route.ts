import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const WINDOW_DAYS = 14;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

type ChatLogRow = {
  id: number;
  question: string | null;
  response: string | null;
  context_chunks: string | null;
  asked_at: string;
};

async function postHogEventCount(since: string): Promise<number | null> {
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  if (!projectId || !apiKey) return null;

  const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query: `SELECT count() FROM events WHERE event = 'chat_api_request' AND timestamp > toDateTime('${since}')`,
      },
    }),
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  const cell = json?.results?.[0]?.[0];
  return typeof cell === "number" ? cell : null;
}

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_VERIFY_TOKEN;
  if (!expected || !token || token !== expected) {
    return new Response("Forbidden", { status: 403 });
  }

  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000).toISOString();

  const { data, error, count } = await supabase
    .from("chat_logs")
    .select("id, question, response, context_chunks, asked_at", { count: "exact" })
    .gte("asked_at", since);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as ChatLogRow[];
  const total = count ?? rows.length;
  const nullQuestion = rows.filter((r) => !r.question).length;
  const nullResponse = rows.filter((r) => !r.response).length;
  const withContext = rows.filter((r) => r.context_chunks).length;

  // Aggregate-only spot-check — no question/response text leaves the server.
  const sample = rows
    .filter((r) => r.context_chunks)
    .slice(0, 3)
    .map((r) => ({
      id: r.id,
      asked_at: r.asked_at,
      response_length: r.response?.length ?? 0,
      context_length: r.context_chunks?.length ?? 0,
    }));

  const phCount = await postHogEventCount(since);
  const divergencePct =
    phCount !== null && phCount > 0
      ? ((phCount - total) / phCount) * 100
      : null;

  return Response.json({
    window_days: WINDOW_DAYS,
    since,
    chat_logs: {
      total,
      null_question: nullQuestion,
      null_response: nullResponse,
      with_context: withContext,
      sample_with_context: sample,
    },
    posthog: {
      chat_api_request_count: phCount,
      available: phCount !== null,
    },
    divergence_pct: divergencePct,
    healthy:
      divergencePct === null
        ? null
        : Math.abs(divergencePct) <= 10 && nullQuestion === 0 && nullResponse === 0,
  });
}
