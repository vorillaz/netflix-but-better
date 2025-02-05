import { mistral } from "@ai-sdk/mistral";

export const embeddingModel = mistral.textEmbeddingModel("mistral-embed");

export const objectModel = mistral("mistral-large-latest", {});
