import { Metadata } from "next";
import { getBrowserShows, getSearchPagination } from "@/lib/db/queries";
import { Grid } from "@/components/grid";
import { ShowSlim } from "@/lib/db/types";
import { Suspense } from "react";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { ShowsPagination } from "@/components/shows-pagination";
import type { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/lib/search";
import { NoResults } from "@/components/no-results";

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse over 8000+ shows from Netflix",
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Browse({ searchParams }: PageProps) {
  const { q, page } = await loadSearchParams(searchParams);

  const [shows, estimated] = await Promise.all([
    getBrowserShows(q, page),
    getSearchPagination(q),
  ]);

  const totalPages = Math.ceil(estimated / PAGINATION_LIMIT);
  const currentPage = Math.max(1, Number(page) || 1);
  return (
    <>
      <h1 className="text-2xl font-bold">Browse</h1>
      {shows.length > 0 ? (
        <Grid shows={shows as ShowSlim[]} />
      ) : (
        <Suspense>
          <NoResults />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <ShowsPagination
          baseUrl="/browse"
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={estimated}
        />
      </Suspense>
    </>
  );
}
