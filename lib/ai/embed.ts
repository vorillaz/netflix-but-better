import { sql, eq, isNull, not, desc, asc, and } from "drizzle-orm";
import { db } from "../db/drizzle";
import {
  genres,
  showGenres,
  shows,
  showActors,
  actors,
  categories,
  showCategories,
  directors,
  showDirectors,
} from "../db/schema";
import { embed, generateObject } from "ai";
import { z } from "zod";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import { embeddingModel, objectModel } from "./mistral";

export interface Show {
  id: number;
  title: string;
  description: string | null;
  contentType: string | null;
  imdbScore: number | null;
  duration: string | null;
  genres: string[] | null;
  categories: string[] | null;
  actors: string[] | null;
  directors: string[] | null;
}

const BATCH_SIZE = 40;
const CONCURRENCY = 5;

const showMetadataSchema = z.object({
  mood: z.array(z.string()).optional(),
  targetAudience: z.array(z.string()),
  themes: z.array(z.string()),
  characters: z.array(z.string()),
  setting: z.array(z.string()),
  viewerEngagement: z.array(z.string()),
  plotComplexity: z.array(z.string()).optional(),
  plot: z.string().optional(),
  eras: z.array(z.string()).optional(),
});

async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}

async function generateShowMetadata(show: Show) {
  const result = await generateObject({
    // @ts-ignore
    model: objectModel,
    schemaName: "showMetadata",
    schemaDescription: "Information for semantic search",
    schema: showMetadataSchema,
    prompt: `
          Analyze the following show information and generate metadata, return the metadata as a JSON object.
          plotComplexity should be a list of  keywords that describe the plot complexity of the show.
          characters should be a list of character names.
          setting should be a list of keywords that describe the setting of the show. Use countries, places, cities or other locations that are relevant to the show.
          eras should be a list of keywords that describe the eras of the show.
          viewerEngagement should be a list of single keywords that describe the viewer engagement of the show, how the show sticks with the viewer.
          targetAudience should be a list of single keywords that describe the target audience of the show.
          mood should be a list of single keywords that describe the mood of the show.
          plot should be a single sentence that describes the plot of the show.

          Here is the show information:
          Title: ${show.title}
          Description: ${show.description || "N/A"}
          IMDB Rating: ${show.imdbScore || "N/A"}
          Type: ${show.contentType || "N/A"}
          Actors: ${show.actors || "N/A"}
          Categories: ${show.categories || "N/A"}
          Directors: ${show.directors || "N/A"}
          Duration: ${show.duration || "N/A"}
          Genres: ${show.genres || "N/A"}
          Based on this information, provide the metadata as specified in the schema.
        `,
  });

  return result.object;
}
async function processShow(show: Show) {
  try {
    let metadata;
    try {
      metadata = await generateShowMetadata(show);
    } catch (error) {
      console.error(`Error generating metadata for ${show.title}`);

      throw error;
    }

    const embeddingText = `
    Title: ${show.title}
    Description: ${show.description || "N/A"}
    IMDB Rating: ${show.imdbScore || "N/A"}
    Duration: ${show.duration || "N/A"}
    Genres: ${show.genres || "N/A"}
    Mood: ${metadata.mood?.join(", ") || "N/A"}
    Target Audience: ${metadata.targetAudience?.join(", ") || "N/A"}
    Type: ${show.contentType || "N/A"}
    Themes: ${metadata.themes?.join(", ") || "N/A"}
    Setting: ${metadata.setting?.join(", ") || "N/A"}
    Actors: ${show.actors || "N/A"}
    Directors: ${show.directors || "N/A"}
    Plot: ${metadata.plot}
    Characters: ${metadata.characters?.join(", ") || "N/A"}
    Plot Complexity: ${metadata.plotComplexity?.join(", ") || "N/A"}
    Viewer Engagement: ${metadata.viewerEngagement?.join(", ") || "N/A"}
    Eras: ${metadata.eras?.join(", ") || "N/A"}
    `;

    let embedding;
    try {
      embedding = await generateEmbedding(embeddingText);
    } catch (error) {
      console.error(`Error generating embedding for ${show.title}`);
      throw error;
    }

    await db
      .update(shows)
      .set({
        metadata: JSON.stringify(metadata),
        embedding,
      })
      .where(sql`${shows.id} = ${show.id}`);
  } catch (error) {
    console.error(`Error processing show ${show.title}`);
    console.error(error);
  }
}

async function processShowBatch(shows: Show[]) {
  const updatePromises = shows.map(processShow);
  await Promise.all(updatePromises);
}

export const updateShowsWithEmbeddings = async () => {
  console.log("-- Starting embedding process --");
  let batchCount = 0;
  let offset = 0;
  let totalProcessed = 0;

  const showswithembeddings = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(shows)
    .where(not(isNull(shows.embedding)));

  console.log(
    `There are ${showswithembeddings[0].count} shows with embeddings`
  );

  while (true) {
    const batch = await db
      .select({
        id: shows.id,
        title: shows.title,
        description: shows.description,
        contentType: shows.contentType,
        imdbScore: shows.imdbScore,
        duration: shows.duration,
        genres: sql`string_agg(DISTINCT ${genres.name}, ', ')`,
        categories: sql`string_agg(DISTINCT ${categories.name}, ', ')`,
        actors: sql`string_agg(DISTINCT ${actors.name}, ', ')`,
        directors: sql`string_agg(DISTINCT ${directors.name}, ', ')`,
      })
      // add genres,
      .from(shows)
      .where(and(isNull(shows.embedding), not(isNull(shows.imdbScore))))
      .leftJoin(showGenres, eq(shows.id, showGenres.showId))
      .leftJoin(genres, eq(showGenres.genreId, genres.id))
      .leftJoin(showActors, eq(shows.id, showActors.showId))
      .leftJoin(showCategories, eq(shows.id, showCategories.showId))
      .leftJoin(categories, eq(showCategories.categoryId, categories.id))
      .leftJoin(actors, eq(showActors.actorId, actors.id))
      .leftJoin(showDirectors, eq(shows.id, showDirectors.showId))
      .leftJoin(directors, eq(showDirectors.directorId, directors.id))
      .limit(5)
      .groupBy(shows.id)
      .orderBy(desc(shows.imdbScore));

    const batchPromises = [];

    if (batch.length === 0) {
      break;
    }

    for (let i = 0; i < batch.length; i += CONCURRENCY) {
      const concurrentBatch = batch.slice(i, i + CONCURRENCY);
      batchPromises.push(processShowBatch(concurrentBatch as Show[]));
      await delay(2000);
    }
    await Promise.allSettled(batchPromises);

    batchCount++;
    totalProcessed += batch.length;
    offset += BATCH_SIZE;
    console.log(
      `Processed batch ${batchCount}, Total shows processed: ${totalProcessed}`
    );
  }
  console.log(`Finished updating embeddings for ${totalProcessed} shows`);
};

updateShowsWithEmbeddings().catch(console.error);
