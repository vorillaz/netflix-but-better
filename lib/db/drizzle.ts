import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL environment variable is not set");
}

// TODO: Change back when ready
export const sql = neon(process.env.NEON_DATABASE_URL);
export const db = drizzle(sql);
