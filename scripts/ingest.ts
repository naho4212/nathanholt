import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pipeline, env } = require("@xenova/transformers");
import fs from "fs";
import path from "path";

env.cacheDir = "./.model-cache";
// Silence progress bars in CI/script context
env.allowLocalModels = false;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

type Chunk = {
  source: string;
  heading: string | null;
  content: string;
};

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
      results.push(...walkContent(full, base));
    } else if (entry.name.endsWith(".md")) {
      const rel = path.relative(base, full).replace(/\.md$/, "");
      results.push({ rel, full });
    }
  }
  return results;
}

async function main() {
  console.log("Loading embedding model (first run downloads ~22MB)...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const embed = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const contentDir = path.join(process.cwd(), "content");
  const files = walkContent(contentDir, contentDir);
  const allChunks: Chunk[] = [];

  for (const { rel, full } of files) {
    const raw = fs.readFileSync(full, "utf-8");
    allChunks.push(...chunkMarkdown(rel, raw));
  }

  console.log(`Chunked ${files.length} files → ${allChunks.length} chunks`);

  // Clear existing
  const { error: delErr } = await supabase.from("chunks").delete().gte("id", 0);
  if (delErr) {
    console.error("Delete failed — does the chunks table exist? Run supabase/schema.sql first.");
    process.exit(1);
  }

  // Embed and insert
  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    const text = [chunk.heading, chunk.content].filter(Boolean).join("\n");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const output = await embed(text, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data as Float32Array);

    const { error } = await supabase.from("chunks").insert({
      source: chunk.source,
      heading: chunk.heading,
      content: chunk.content,
      embedding,
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
