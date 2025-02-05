import { sql, eq, desc } from "drizzle-orm";
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

const BATCH_SIZE = 10;
const CONCURRENCY = 5;

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

const processShowBatch = async (batch: Show[]) => {
  for (const show of batch) {
    const searchText = `
      ${show.title} 
      ${show.contentType}
      ${show.actors || ""} 
      ${show.directors || ""} 
      ${show.genres || ""}
      ${show.categories || ""}
    `
      .toLowerCase()
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ");

    await db.update(shows).set({ searchText }).where(eq(shows.id, show.id));
  }
};

export const updateShowsWithSearchTerms = async () => {
  console.log("-- Starting search terms process --");
  let batchCount = 0;
  let offset = 0;
  let totalProcessed = 0;

  while (true) {
    const batch = await db
      .select({
        id: shows.id,
        title: shows.title,
        contentType: shows.contentType,
        genres: sql`string_agg(DISTINCT ${genres.name}, ', ')`,
        categories: sql`string_agg(DISTINCT ${categories.name}, ', ')`,
        actors: sql`string_agg(DISTINCT ${actors.name}, ', ')`,
        directors: sql`string_agg(DISTINCT ${directors.name}, ', ')`,
      })
      .from(shows)
      .leftJoin(showGenres, eq(shows.id, showGenres.showId))
      .leftJoin(genres, eq(showGenres.genreId, genres.id))
      .leftJoin(showActors, eq(shows.id, showActors.showId))
      .leftJoin(showCategories, eq(shows.id, showCategories.showId))
      .leftJoin(categories, eq(showCategories.categoryId, categories.id))
      .leftJoin(actors, eq(showActors.actorId, actors.id))
      .leftJoin(showDirectors, eq(shows.id, showDirectors.showId))
      .leftJoin(directors, eq(showDirectors.directorId, directors.id))
      .groupBy(shows.id)
      .limit(BATCH_SIZE)
      .orderBy(desc(shows.id))
      .offset(offset);

    const batchPromises = [];

    if (batch.length === 0) {
      break;
    }

    for (let i = 0; i < batch.length; i += CONCURRENCY) {
      const concurrentBatch = batch.slice(i, i + CONCURRENCY);
      batchPromises.push(processShowBatch(concurrentBatch as Show[]));
    }

    await Promise.all(batchPromises);
    offset += BATCH_SIZE;
    batchCount++;
    totalProcessed += batch.length;

    console.log(`Processed ${totalProcessed} shows in ${batchCount} batches`);
  }
};

updateShowsWithSearchTerms().catch(console.error);
