import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  json,
  timestamp,
  vector,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const CONTENT_TYPES = {
  MOVIE: "Movie",
  TV_SHOW: "TV Show",
};

// Actors table
export const actors = pgTable(
  "actors",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
  },
  (table) => [index("idx_actors_name").on(table.name)]
);

// Directors table
export const directors = pgTable(
  "directors",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
  },
  (table) => [index("idx_directors_name").on(table.name)]
);

// Categories table
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
  },
  (table) => [index("idx_categories_name").on(table.name)]
);

// Genres table
export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Countries table
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Shows table
export const shows = pgTable(
  "shows",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    poster: text("poster"),
    description: text("description"),
    releaseYear: integer("release_year"),
    duration: text("duration"),
    imdbScore: decimal("imdb_score", { precision: 2, scale: 1 }), // imdb_score as a number
    imdbId: text("imdb_id"), // imdb_id as a string
    contentType: text("content_type", {
      enum: [CONTENT_TYPES.MOVIE, CONTENT_TYPES.TV_SHOW],
    }),
    awards: text("awards"),
    dateAdded: timestamp("date_added"),
    // Embedding
    embedding: vector("embedding", { dimensions: 1024 }),
    metadata: json("metadata"),
    searchText: text("search_text"), // Will store concatenated searchable text with title, actors, directors, description, genres, categories
  },
  (table) => [
    index("embeddingIndex").using(
      "ivfflat",
      table.embedding.op("vector_cosine_ops")
    ),
    index("idx_shows_title").on(table.title),
    index("idx_shows_imdb_score").on(table.imdbScore),
    index("idx_shows_content_type").on(table.contentType),
    index("idx_shows_search_text_tsv").using(
      "gin",
      sql`to_tsvector('english', ${table.searchText})`
    ),
  ]
);

// Show Actors junction table
export const showActors = pgTable(
  "show_actors",
  {
    showId: integer("show_id")
      .notNull()
      .references(() => shows.id),
    actorId: integer("actor_id")
      .notNull()
      .references(() => actors.id),
  },
  (table) => [
    primaryKey({
      columns: [table.showId, table.actorId],
    }),
    index("idx_show_actors_show").on(table.showId),
    index("idx_show_actors_actor").on(table.actorId),
  ]
);

// Show Directors junction table
export const showDirectors = pgTable(
  "show_directors",
  {
    showId: integer("show_id")
      .notNull()
      .references(() => shows.id),
    directorId: integer("director_id")
      .notNull()
      .references(() => directors.id),
  },
  (table) => [
    primaryKey({
      columns: [table.showId, table.directorId],
    }),
    index("idx_show_directors_show").on(table.showId),
    index("idx_show_directors_director").on(table.directorId),
  ]
);

// Show Genres junction table
export const showCategories = pgTable(
  "show_categories",
  {
    showId: integer("show_id")
      .notNull()
      .references(() => shows.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (table) => [
    primaryKey({
      columns: [table.showId, table.categoryId],
    }),
    index("idx_show_categories_show").on(table.showId),
    index("idx_show_categories_category").on(table.categoryId),
  ]
);

// Show Genres junction table
export const showGenres = pgTable(
  "show_genres",
  {
    showId: integer("show_id")
      .notNull()
      .references(() => shows.id),
    genreId: integer("genre_id")
      .notNull()
      .references(() => genres.id),
  },
  (table) => [
    primaryKey({
      columns: [table.showId, table.genreId],
    }),
    index("idx_show_genres_show").on(table.showId),
    index("idx_show_genres_genre").on(table.genreId),
  ]
);

// Show Countries junction table
export const showCountries = pgTable(
  "show_countries",
  {
    showId: integer("show_id")
      .notNull()
      .references(() => shows.id),
    countryId: integer("country_id")
      .notNull()
      .references(() => countries.id),
  },
  (table) => [
    primaryKey({
      columns: [table.showId, table.countryId],
    }),
    index("idx_show_countries_show").on(table.showId),
    index("idx_show_countries_country").on(table.countryId),
  ]
);

export type Show = typeof shows.$inferSelect;
