ALTER TABLE "show_countries" ADD CONSTRAINT "show_countries_show_id_country_id_pk" PRIMARY KEY("show_id","country_id");--> statement-breakpoint
CREATE INDEX "idx_show_countries_show" ON "show_countries" USING btree ("show_id");--> statement-breakpoint
CREATE INDEX "idx_show_countries_country" ON "show_countries" USING btree ("country_id");