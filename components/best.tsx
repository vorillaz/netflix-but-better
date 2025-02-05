import { getBestShows } from "@/lib/db/queries";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export async function BestShows() {
  const bestShows = await getBestShows();
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Notable Shows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bestShows.map((show) => (
          <Link
            prefetch={true}
            href={`/shows/${show.id}`}
            key={show.id}
            className="group cursor-pointer rounded-lg overflow-hidden"
          >
            <div
              key={show.id}
              className="group cursor-pointer rounded-lg overflow-hidden"
            >
              <div className="relative w-full rounded-lg overflow-hidden aspect-[2/3]">
                <Image
                  src={show.poster || ""}
                  alt={show.title ?? "Movie Poster"}
                  fill
                  blurDataURL={show.poster || ""}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300">
                  <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {show.imdbScore}
                  </span>
                </div>
              </div>
              <div className="mt-2 py-2">
                <div className="px-1">
                  <h3 className="font-bold text-sm">{show.title}</h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BestShowsSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            <div className="relative w-full rounded-lg overflow-hidden aspect-[2/3]">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="mt-2 py-2">
              <div className="px-1">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
