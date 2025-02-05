CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS unaccent;
--> statement-breakpoint
ALTER TABLE "shows"
ADD COLUMN "search_text" text;
--> statement-breakpoint
CREATE INDEX "idx_shows_search_text_tsv" ON "shows" USING gin (to_tsvector('english', "search_text"));