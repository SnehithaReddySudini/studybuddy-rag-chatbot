import { embed, cosineSimilarity } from "ai";
import { google } from "@ai-sdk/google";
import data from "@/data/embeddings.json";

export async function retrieve(query: string, k = 4) {
  const { embedding } = await embed({
    model: google.textEmbeddingModel("gemini-embedding-001"),
    value: query,
  });
  return data
    .map((d) => ({ text: d.text, score: cosineSimilarity(embedding, d.vec) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}