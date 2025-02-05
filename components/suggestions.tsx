import { getSuggestions } from "@/lib/db/queries";
import { Grid } from "@/components/grid";
import { ShowSlim } from "@/lib/db/types";
import { GridSkeleton } from "@/components/grid";

export function SuggestionsSkeleton() {
  return (
    <>
      <div className="w-full h-px bg-gray-100 my-10"></div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          You might also like
        </h2>
        <GridSkeleton />
      </div>
    </>
  );
}

export async function WatchlistSuggestions({ shows }: { shows: ShowSlim[] }) {
  const showIds = shows.map((show) => show.id);
  const suggested = await getSuggestions(showIds);
  return (
    <>
      <div className="w-full h-px bg-gray-100 my-10"></div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          You might also like
        </h2>
        <Grid force={true} shows={suggested as ShowSlim[]} />
      </div>
    </>
  );
}
