import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: texts, model: "voyage-3-lite" }),
  });
  if (!res.ok) throw new Error(`Voyage API error: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.data.map((d: { embedding: number[] }) => d.embedding);
}

type Chunk = { source: string; heading: string | null; content: string };

function chunkMarkdown(source: string, raw: string): Chunk[] {
  const chunks: Chunk[] = [];
  let heading: string | null = null;
  let lines: string[] = [];

  const flush = () => {
    const text = lines.join("\n").trim();
    if (text.length > 20) chunks.push({ source, heading, content: text });
    lines = [];
  };

  for (const line of raw.split("\n")) {
    if (line.startsWith("## ") || line.startsWith("# ")) {
      flush();
      heading = line.replace(/^#{1,2} /, "").trim();
    } else {
      lines.push(line);
    }
  }
  flush();
  return chunks;
}

function walkContent(dir: string, base: string): { rel: string; full: string }[] {
  const results: { rel: string; full: string }[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "system") continue;
      results.push(...walkContent(full, base));
    } else if (entry.name.endsWith(".md")) {
      const rel = path.relative(base, full).replace(/\.md$/, "");
      results.push({ rel, full });
    }
  }
  return results;
}

async function main() {
  const contentDir = path.join(process.cwd(), "content");
  const files = walkContent(contentDir, contentDir);
  const allChunks: Chunk[] = [];

  for (const { rel, full } of files) {
    const raw = fs.readFileSync(full, "utf-8");
    allChunks.push(...chunkMarkdown(rel, raw));
  }

  console.log(`Chunked ${files.length} files → ${allChunks.length} chunks`);

  const { error: delErr } = await supabase.from("chunks").delete().gte("id", 0);
  if (delErr) {
    console.error("Delete failed:", delErr.message);
    process.exit(1);
  }

  // Embed in batches of 8 with 22s delay between batches (respects 3 RPM + 10K TPM free tier)
  console.log("Embedding chunks via Voyage AI...");
  const texts = allChunks.map((c) => [c.heading, c.content].filter(Boolean).join("\n"));
  const BATCH_SIZE = 8;
  const embeddings: number[][] = [];
  for (let b = 0; b < texts.length; b += BATCH_SIZE) {
    if (b > 0) {
      process.stdout.write(`  waiting 22s for rate limit...\n`);
      await new Promise((r) => setTimeout(r, 22000));
    }
    const batch = texts.slice(b, b + BATCH_SIZE);
    const batchEmbeddings = await embedBatch(batch);
    embeddings.push(...batchEmbeddings);
    process.stdout.write(`\rEmbedded ${Math.min(b + BATCH_SIZE, texts.length)}/${texts.length} chunks`);
  }
  console.log();

  // Insert all chunks
  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    const { error } = await supabase.from("chunks").insert({
      source: chunk.source,
      heading: chunk.heading,
      content: chunk.content,
      embedding: embeddings[i],
    });

    if (error) {
      console.error(`Insert failed for ${chunk.source}:`, error.message);
      process.exit(1);
    }

    process.stdout.write(`\r[${i + 1}/${allChunks.length}] ${chunk.source}`);
  }

  console.log("\nIngestion complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
