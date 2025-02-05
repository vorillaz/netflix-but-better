import { openai } from "@ai-sdk/openai";

export const embeddingModel = openai.embedding("text-embedding-3-small", {
  dimensions: 1024,
});

export const objectModel = openai("gpt-4o-mini", {
  structuredOutputs: true,
});
