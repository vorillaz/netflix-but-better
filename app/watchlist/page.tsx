import { Grid } from "@/components/grid";
import { getWatchlist } from "@/lib/db/queries";
import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { ShowSlim } from "@/lib/db/types";
import { Suspense } from "react";
import { Blank } from "@/components/blank";
import {
  WatchlistSuggestions,
  SuggestionsSkeleton,
} from "@/components/suggestions";

export default async function WatchlistPage() {
  try {
    const cookieStore = await cookies();
    const ids = cookieStore.get(COOKIE_NAME)?.value;

    const parsedIds = ids ? JSON.parse(ids) : [];
    const checked = Array.isArray(parsedIds) ? parsedIds : [];
    const checkIds = checked.filter((id) => id !== null);

    if (!checkIds || checkIds.length === 0) {
      throw new Error("No watchlist found");
    }

    const watchlist = await getWatchlist(checkIds);
    return (
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Watchlist</h1>
        <Grid shows={watchlist as ShowSlim[]} force={true} />
        <Suspense fallback={<SuggestionsSkeleton />}>
          <WatchlistSuggestions shows={watchlist as ShowSlim[]} />
        </Suspense>
      </>
    );
  } catch (error) {
    return <Blank />;
  }
}
