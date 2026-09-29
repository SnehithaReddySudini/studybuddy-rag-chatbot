import fs from "fs";
import path from "path";
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";

async function main() {
  const dir = "data/docs";
  const chunks: string[] = [];
  for (const f of fs.readdirSync(dir)) {
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    for (let i = 0; i < text.length; i += 700) chunks.push(`[${f}] ` + text.slice(i, i + 800));
  }
  const { embeddings } = await embedMany({
    model: google.textEmbeddingModel("gemini-embedding-001"),
    values: chunks,
  });
  fs.writeFileSync(
    "data/embeddings.json",
    JSON.stringify(chunks.map((c, i) => ({ text: c, vec: embeddings[i] })))
  );
  console.log(`Embedded ${chunks.length} chunks`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});