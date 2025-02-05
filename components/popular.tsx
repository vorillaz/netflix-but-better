import { getPopularCategories } from "@/lib/db/queries";
import { Skeleton } from "@/components/ui/skeleton";
import NextLink from "next/link";

export async function CategoriesSection() {
  const categories = await getPopularCategories();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Popular Categories</h2>
        <div className="w-20 md:w-32 h-1 bg-gray-200 rounded-full">
          <div className="w-1/2 h-full bg-netflix-primary rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <NextLink
            key={category.id}
            href={`/categories/${category.id}`}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <div className="flex gap-1 mb-3 items-center">
              <div className="flex -space-x-2 ">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              </div>
              <div className="text-sm text-gray-500">people watching</div>
            </div>

            <h3 className="font-bold text-sm mb-1">{category.name}</h3>
          </NextLink>
        ))}
      </div>
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-48" />
        <div className="w-20 md:w-32 h-1 bg-gray-200 rounded-full">
          <div className="w-1/2 h-full bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex gap-1 mb-3 items-center">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="w-6 h-6 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-4 w-24 ml-1" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
