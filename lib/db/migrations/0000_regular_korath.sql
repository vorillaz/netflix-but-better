CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "actors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "actors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "directors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "directors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "show_actors" (
	"show_id" integer NOT NULL,
	"actor_id" integer NOT NULL,
	CONSTRAINT "show_actors_show_id_actor_id_pk" PRIMARY KEY("show_id", "actor_id")
);
--> statement-breakpoint
CREATE TABLE "show_categories" (
	"show_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "show_categories_show_id_category_id_pk" PRIMARY KEY("show_id", "category_id")
);
--> statement-breakpoint
CREATE TABLE "show_countries" (
	"show_id" integer NOT NULL,
	"country_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "show_directors" (
	"show_id" integer NOT NULL,
	"director_id" integer NOT NULL,
	CONSTRAINT "show_directors_show_id_director_id_pk" PRIMARY KEY("show_id", "director_id")
);
--> statement-breakpoint
CREATE TABLE "show_genres" (
	"show_id" integer NOT NULL,
	"genre_id" integer NOT NULL,
	CONSTRAINT "show_genres_show_id_genre_id_pk" PRIMARY KEY("show_id", "genre_id")
);
--> statement-breakpoint
CREATE TABLE "shows" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"poster" text,
	"description" text,
	"release_year" integer,
	"duration" text,
	"imdb_score" numeric,
	"imdb_id" text,
	"content_type" text,
	"awards" text,
	"date_added" timestamp,
	"embedding" vector(1024),
	"metadata" json
);
--> statement-breakpoint
ALTER TABLE "show_actors"
ADD CONSTRAINT "show_actors_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_actors"
ADD CONSTRAINT "show_actors_actor_id_actors_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actors"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_categories"
ADD CONSTRAINT "show_categories_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_categories"
ADD CONSTRAINT "show_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_countries"
ADD CONSTRAINT "show_countries_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_countries"
ADD CONSTRAINT "show_countries_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_directors"
ADD CONSTRAINT "show_directors_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_directors"
ADD CONSTRAINT "show_directors_director_id_directors_id_fk" FOREIGN KEY ("director_id") REFERENCES "public"."directors"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_genres"
ADD CONSTRAINT "show_genres_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "show_genres"
ADD CONSTRAINT "show_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_actors_name" ON "actors" USING btree ("name");
--> statement-breakpoint
CREATE INDEX "idx_categories_name" ON "categories" USING btree ("name");
--> statement-breakpoint
CREATE INDEX "idx_directors_name" ON "directors" USING btree ("name");
--> statement-breakpoint
CREATE INDEX "idx_show_actors_show" ON "show_actors" USING btree ("show_id");
--> statement-breakpoint
CREATE INDEX "idx_show_actors_actor" ON "show_actors" USING btree ("actor_id");
--> statement-breakpoint
CREATE INDEX "idx_show_categories_show" ON "show_categories" USING btree ("show_id");
--> statement-breakpoint
CREATE INDEX "idx_show_categories_category" ON "show_categories" USING btree ("category_id");
--> statement-breakpoint
CREATE INDEX "idx_show_directors_show" ON "show_directors" USING btree ("show_id");
--> statement-breakpoint
CREATE INDEX "idx_show_directors_director" ON "show_directors" USING btree ("director_id");
--> statement-breakpoint
CREATE INDEX "idx_show_genres_show" ON "show_genres" USING btree ("show_id");
--> statement-breakpoint
CREATE INDEX "idx_show_genres_genre" ON "show_genres" USING btree ("genre_id");
--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "shows" USING ivfflat ("embedding" vector_cosine_ops);
--> statement-breakpoint
CREATE INDEX "idx_shows_title" ON "shows" USING btree ("title");
--> statement-breakpoint
CREATE INDEX "idx_shows_imdb_score" ON "shows" USING btree ("imdb_score");
--> statement-breakpoint
CREATE INDEX "idx_shows_content_type" ON "shows" USING btree ("content_type");