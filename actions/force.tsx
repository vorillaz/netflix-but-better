"use server";
import { revalidatePath } from "next/cache";

export async function revalidateWatchlist() {
  await revalidatePath("/watchlist", "page");
}
