import { ollama } from "ollama-ai-provider";
import dotenv from "dotenv";

dotenv.config();

export const embeddingModel = ollama.embedding("mxbai-embed-large", {
  // @ts-ignore
  dimensions: 1024,
});

export const objectModel = ollama("llama3.2", {
  structuredOutputs: true,
});
