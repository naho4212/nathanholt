# nateholt.com

Personal portfolio + AI chat for Nathan Holt. Built with Next.js 16 (App Router), TypeScript, Tailwind v4, Anthropic SDK, and Supabase + Voyage for retrieval.

## Stack

- **Framework:** Next.js 16 App Router on Fluid Compute (Vercel)
- **UI:** Tailwind v4 + a custom design system in `app/globals.css` (warm editorial dark, single terracotta accent, Newsreader / Inter / JetBrains Mono)
- **AI:** `@anthropic-ai/sdk` streaming `claude-haiku-4-5`, grounded via Voyage embeddings + pgvector
- **Data:** Supabase Postgres (chunks, chat_logs)
- **Analytics:** PostHog (client + server)

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Required env vars (`.env.local`)

```
ANTHROPIC_API_KEY=
VOYAGE_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=
NEXT_PUBLIC_POSTHOG_HOST=
```

### Optional env vars (production-only — for `/api/admin/verify-logs`)

```
ADMIN_VERIFY_TOKEN=          # random secret, gate for the verify endpoint
POSTHOG_PROJECT_ID=          # PostHog project numeric ID
POSTHOG_PERSONAL_API_KEY=    # PostHog personal API key (read events scope)
```

The verify endpoint compares Supabase `chat_logs` row count against PostHog
`chat_api_request` event count over a 14-day window. Returns metadata only —
no question/response text leaves the server.

## Knowledge base ingestion

Source markdown lives in `content/`. Re-embed and upload chunks to Supabase:

```bash
npm run ingest
```

Schema lives in `supabase/schema.sql` with timestamped migrations under `supabase/migrations/`.

## Project map

```
app/
  page.tsx                  Home (server component)
  layout.tsx                Fonts, metadata, Cal init, StackPanel mount
  globals.css               Design tokens + component CSS
  api/chat/route.ts         POST streaming chat (Anthropic + Voyage RAG)
  case/[slug]/page.tsx      Case-study route (statically generated)
  components/               Client components
  sitemap.ts, robots.ts     SEO routes
lib/
  cases.ts                  Case-study content + types
  scrollToChat.ts           Shared scroll helpers
  posthog-server.ts         Server PostHog singleton
  window.d.ts               Shared client globals
content/                    Markdown knowledge base for the chat
scripts/ingest.ts           Embedding + Supabase upload pipeline
supabase/                   Schema + migrations
```

## Deploy

Auto-deploy via Vercel on push to `main`. Preview deployments on branches.
