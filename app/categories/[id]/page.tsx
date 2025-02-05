import {
  getCategoryShows,
  getCategoryPagination,
  getCategoryById,
} from "@/lib/db/queries";
import { Grid } from "@/components/grid";
import { notFound } from "next/navigation";
import { ShowsPagination } from "@/components/shows-pagination";
import { Suspense } from "react";
import { Blank } from "@/components/blank";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { ShowSlim } from "@/lib/db/types";
import type { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/lib/search";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  try {
    const { id } = await params;
    const { page } = await loadSearchParams(searchParams);
    const category = await getCategoryById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    const [shows, estimated] = await Promise.all([
      getCategoryShows(id, page),
      getCategoryPagination(id),
    ]);
    const totalPages = Math.ceil(estimated / PAGINATION_LIMIT);
    const currentPage = Math.max(1, Number(page) || 1);

    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {category?.name}
        </h1>
        <div className="flex items-center justify-between mb-4">
          <div className="w-20 md:w-32 h-1 bg-gray-200 rounded-full">
            <div className="w-1/2 h-full bg-netflix-primary rounded-full"></div>
          </div>
        </div>
        {shows.length > 0 && <Grid shows={shows as ShowSlim[]} />}
        {shows.length === 0 && <Blank />}
        <Suspense fallback={null}>
          <ShowsPagination
            baseUrl={`/categories/${id}`}
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={estimated}
          />
        </Suspense>
      </div>
    );
  } catch (_error) {
    return notFound();
  }
}
