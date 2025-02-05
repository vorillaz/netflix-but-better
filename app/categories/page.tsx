import { getAllCategories } from "@/lib/db/queries";
import NextLink from "next/link";

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return (
    <div>
      <h1 className="ttext-3xl font-bold text-gray-900 mb-4">Categories</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="w-20 md:w-32 h-1 bg-gray-200 rounded-full">
          <div className="w-1/2 h-full bg-netflix-primary rounded-full"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-4">
        {categories.map((category) => (
          <div key={category.id}>
            <NextLink
              prefetch={true}
              href={`/categories/${category.id}`}
              className="group text-left flex flex-col"
            >
              <span
                className="text-2xl text-blue font-bold text-gray-900 transition-all duration-300 
                  group-hover:text-netflix-red animate-fade-in 
                  leading-snug
                  hover:text-netflix-primary"
              >
                {category.name}
              </span>
              <span className="text-sm text-gray-500">
                {category.count} shows
              </span>
            </NextLink>
          </div>
        ))}
      </div>
    </div>
  );
}
