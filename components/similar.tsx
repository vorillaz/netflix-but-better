import { getSimilarShows } from "@/lib/db/queries";
import { Grid, GridSkeleton } from "@/components/grid";
import { ShowSlim } from "@/lib/db/types";

export function SimilarSkeleton() {
  return (
    <>
      <div className="w-full h-px bg-gray-100 my-10"></div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar shows</h2>
        <GridSkeleton />
      </div>
    </>
  );
}

export async function Similar({ showId }: { showId: string }) {
  const shows = await getSimilarShows(showId);
  return (
    <>
      <div className="w-full h-px bg-gray-100 my-10"></div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar shows</h2>
        <Grid shows={shows as ShowSlim[]} />
      </div>
    </>
  );
}
