import {
  sql,
  and,
  eq,
  gt,
  not,
  isNull,
  inArray,
  desc,
  asc,
  cosineDistance,
} from "drizzle-orm";
import { db } from "./drizzle";
import {
  countries,
  showCountries,
  shows,
  showActors,
  actors,
  categories,
  showCategories,
  directors,
  showDirectors,
} from "./schema";
import { PAGINATION_LIMIT, VECTOR_SIMILARITY_THRESHOLD } from "@/lib/constants";
import { embeddingModel } from "@/lib/ai/mistral";

import { embed } from "ai";

const parseId = (id: string) => {
  const numberId = Number(id);
  if (isNaN(numberId) || !Number.isInteger(numberId)) {
    throw new Error("Invalid numerid ID");
  }
  return numberId;
};

const escapeQuery = (query: string) => {
  return query
    .replace(/'/g, "") // remove single quotes
    .replace(/"/g, "") // remove double quotes
    .replace(/\\/g, "") // remove backslashes
    .replace(/;/g, "") // remove semicolons
    .replace(/--/g, "") // remove SQL comments
    .replace(/\/\*/g, "") // remove multi-line comment starts
    .replace(/\*\//g, "") // remove multi-line comment ends
    .trim(); // trim whitespace
};

export async function getPopularCategories() {
  const cats = await db
    .select({
      id: categories.id,
      name: categories.name,
      count: sql<number>`count(${shows.id})`,
    })
    .from(categories)
    .leftJoin(showCategories, eq(categories.id, showCategories.categoryId))
    .leftJoin(shows, eq(showCategories.showId, shows.id))
    .groupBy(categories.id)
    .limit(4)
    .orderBy(desc(sql<number>`count(${shows.id})`));
  return cats;
}

export async function getBestShows() {
  const bestShows = await db
    .select({
      id: shows.id,
      title: shows.title,
      poster: shows.poster,
      imdbScore: shows.imdbScore,
    })
    .from(shows)
    .limit(4)
    .orderBy(desc(shows.imdbScore));
  return bestShows;
}

export async function getAllCategories() {
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      count: sql<number>`count(${shows.id})`,
    })
    .from(categories)
    .leftJoin(showCategories, eq(categories.id, showCategories.categoryId))
    .leftJoin(shows, eq(showCategories.showId, shows.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.name));
  return allCategories;
}

export async function getCategoryById(categoryId: string) {
  const categoryIdNumber = parseId(categoryId);
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryIdNumber));
  return category[0];
}

export async function getWatchlist(showIds: number[]) {
  const watchlist = await db
    .select()
    .from(shows)
    .where(inArray(shows.id, showIds));
  return watchlist;
}

export async function getCategoryShows(categoryId: string, page?: number) {
  const pageNumber = page ? page : 0;
  const offset = pageNumber * PAGINATION_LIMIT;
  const categoryIdNumber = parseId(categoryId);
  const categoryShows = await db
    .select({
      id: shows.id,
      title: shows.title,
      poster: shows.poster,
      releaseYear: shows.releaseYear,
      imdbScore: shows.imdbScore,
    })
    .from(shows)
    .leftJoin(showCategories, eq(shows.id, showCategories.showId))
    .where(eq(showCategories.categoryId, categoryIdNumber))
    .orderBy(desc(shows.imdbScore))
    .limit(PAGINATION_LIMIT)
    .offset(offset);
  return categoryShows;
}

export async function getCategoryPagination(categoryId: string) {
  const explainResult = await db.execute(sql`
    EXPLAIN (FORMAT JSON)
    SELECT id FROM shows
    WHERE id IN (
      SELECT show_id FROM show_categories
      WHERE category_id = ${categoryId}
    );
    `);
  const planRows = (explainResult.rows[0] as any)["QUERY PLAN"][0]["Plan"][
    "Plan Rows"
  ];
  return planRows;
}

export async function getShowById(id: string) {
  const numberId = parseId(id);
  const show = await db
    .select({
      id: shows.id,
      title: shows.title,
      description: shows.description,
      imdbId: shows.imdbId,
      poster: shows.poster,
      releaseYear: shows.releaseYear,
      runtime: shows.duration,
      imdbScore: shows.imdbScore,
      awards: shows.awards,
      countries: sql<Array<{ id: number; name: string }>>`
        array_agg(
          DISTINCT jsonb_build_object(
            'id', ${countries.id},
            'name', ${countries.name}
          )
        )`,
      actors: sql<Array<{ id: number; name: string }>>`
        array_agg(
          DISTINCT jsonb_build_object(
            'id', ${actors.id},
            'name', ${actors.name}
          )
        )`,
      categories: sql<Array<{ id: number; name: string }>>`
        array_agg(
          DISTINCT jsonb_build_object(
            'id', ${categories.id},
            'name', ${categories.name}
          )
        )`,
      directors: sql<Array<{ id: number; name: string }>>`
        array_agg(
          DISTINCT jsonb_build_object(
            'id', ${directors.id},
            'name', ${directors.name}
          )
        )`,
    })
    .from(shows)
    .leftJoin(showActors, eq(shows.id, showActors.showId))
    .leftJoin(showCategories, eq(shows.id, showCategories.showId))
    .leftJoin(categories, eq(showCategories.categoryId, categories.id))
    .leftJoin(actors, eq(showActors.actorId, actors.id))
    .leftJoin(showDirectors, eq(shows.id, showDirectors.showId))
    .leftJoin(directors, eq(showDirectors.directorId, directors.id))
    .leftJoin(showCountries, eq(shows.id, showCountries.showId))
    .leftJoin(countries, eq(showCountries.countryId, countries.id))

    .groupBy(shows.id)
    .where(eq(shows.id, numberId));
  return show[0];
}

export async function getSimilarShows(showId: string) {
  const numberId = parseId(showId);
  const similarShows = await getSuggestions([numberId]);
  return similarShows;
}

export async function getSuggestions(showIds: number[]) {
  // First get the embedding of the target show
  const targetShow = await db
    .select({
      embedding: shows.embedding,
      title: shows.title,
    })
    .from(shows)
    .where(inArray(shows.id, showIds));

  if (!targetShow[0] || !targetShow[0].embedding) {
    throw new Error(`No embedding found for show ${showIds}`);
  }

  // Find similar shows using cosine similarity
  const similarShows = await db
    .select({
      id: shows.id,
      title: shows.title,
      poster: shows.poster,
      releaseYear: shows.releaseYear,
      imdbScore: shows.imdbScore,
      similarity: sql<number>`1 - (${cosineDistance(
        shows.embedding,
        targetShow[0].embedding
      )})`,
    })
    .from(shows)
    .where(
      and(
        not(inArray(shows.id, showIds)), // Exclude the target show itself
        not(isNull(shows.embedding)) // Ensure shows have embeddings
      )
    )
    .orderBy((t) => desc(t.similarity))
    .limit(6);

  return similarShows;
}

export async function getAllShows(page: number = 0) {
  const offset = page * PAGINATION_LIMIT;
  const categoryShows = await db
    .select({
      id: shows.id,
      title: shows.title,
      poster: shows.poster,
      releaseYear: shows.releaseYear,
      imdbScore: shows.imdbScore,
    })
    .from(shows)
    .groupBy(shows.id)
    .orderBy(desc(shows.imdbScore))
    .limit(PAGINATION_LIMIT)
    .offset(offset);
  return categoryShows;
}

export const searchByQuery = async (query: string, page: number = 0) => {
  const offset = page * PAGINATION_LIMIT;
  const freeTextQuery = query.trim().split(/\s+/).join(" & ");
  // Escape the query
  const exactMatches = await db
    .select({
      id: shows.id,
      title: shows.title,
      poster: shows.poster,
      imdbScore: shows.imdbScore,
      exactMatch: sql<boolean>`true`,
    })
    .from(shows)
    .where(
      sql`to_tsvector('english', search_text) @@ to_tsquery('english', ${freeTextQuery})`
    )
    .orderBy(desc(shows.imdbScore))
    .limit(PAGINATION_LIMIT)
    .offset(offset);

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  const queryEmbedding = await embed({
    model: embeddingModel,
    value: query,
  });

  const vectorMatches = await db
    .select({
      id: shows.id,
      title: shows.title,
      poster: shows.poster,
      imdbScore: shows.imdbScore,
      similarity: sql<number>`1 - (${cosineDistance(
        shows.embedding,
        queryEmbedding.embedding
      )})`,
      exactMatch: sql<boolean>`false`,
    })
    .from(shows)
    .where(
      gt(
        sql<number>`1 - (${cosineDistance(
          shows.embedding,
          queryEmbedding.embedding
        )})`,
        VECTOR_SIMILARITY_THRESHOLD
      )
    )
    .orderBy(
      // Combine similarity and IMDb score for better ranking
      desc(
        sql`(1 - (${cosineDistance(
          shows.embedding,
          queryEmbedding.embedding
        )})) * (${shows.imdbScore} / 10)`
      )
    )
    .limit(PAGINATION_LIMIT)
    .offset(offset);

  return vectorMatches;
};

export async function getBrowserShows(raw: string = "", page: number = 0) {
  // Satitize the query
  const q = escapeQuery(raw);
  const query = q ? q.trim() : "";

  if (!query || query.length < 3) {
    return getAllShows(page);
  }

  // Ok the query is long enough, we can search
  return searchByQuery(query, page);
}

export async function getSearchPagination(raw: string) {
  const query = escapeQuery(raw);
  // If the query is less than 5 characters, return all shows
  if (!query || query.length < 5) {
    const count = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(shows);
    return count[0].count;
  }

  const freeTextQuery = query.trim().split(/\s+/).join(" & ");

  const exactMatchesCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(shows)
    .where(
      sql`to_tsvector('english', search_text) @@ to_tsquery('english', ${freeTextQuery})`
    );

  if (exactMatchesCount[0].count > 0) {
    return exactMatchesCount[0].count;
  }

  // If no exact matches, get embedding and count vector matches
  const queryEmbedding = await embed({
    model: embeddingModel,
    value: query,
  });

  const vectorMatchesRawCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(shows)
    .where(
      gt(
        sql<number>`1 - (${cosineDistance(
          shows.embedding,
          queryEmbedding.embedding
        )})`,
        VECTOR_SIMILARITY_THRESHOLD
      )
    );

  return vectorMatchesRawCount[0].count;
}

export async function getFeaturedShows() {
  const bojackHorsemanId = 3398;
  const mindhunterId = 3611;
  const ourPlanetId = 6826;
  const featuredContent = await db
    .select({
      id: shows.id,
      title: shows.title,
      poster: shows.poster,
      imdbScore: shows.imdbScore,
    })
    .from(shows)
    .where(inArray(shows.id, [ourPlanetId, bojackHorsemanId, mindhunterId]));
  return featuredContent;
}
