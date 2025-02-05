import { ShowSlim } from "@/lib/db/types";
import Link from "next/link";
import Image from "next/image";
import { Star } from "@phosphor-icons/react/dist/ssr";
import AddToWatchlist from "@/components/add";
import { Pulse } from "@/components/pulse";
import { Skeleton } from "@/components/ui/skeleton";

export const GridSkeleton = ({ size = 6 }) => {
  const skeletons = Array.from({ length: size });
  return (
    <div className="group relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative animate-fade-in group-has-[[data-pending]]:animate-pulse">
        {skeletons.map((_, index) => (
          <div key={index} className="flex flex-col gap-2 relative w-full">
            <Skeleton className="w-full h-[200px]"></Skeleton>
            <Skeleton className="w-full h-[20px]"></Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Grid = async ({
  shows,
  force,
}: {
  shows: ShowSlim[];
  force?: boolean;
}) => {
  return (
    <div className="group relative">
      <Pulse />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative animate-fade-in group-has-[[data-pending]]:animate-pulse">
        {shows.map((show, index) => (
          <div key={show.id} className="flex flex-col gap-2 relative w-full">
            <div className="absolute top-0 left-0 w-full">
              <div className="flex justify-between  align-middle p-2">
                <span className="flex gap-2">
                  <span className="z-10 bg-black/50 text-white text-xs px-2 py-1 rounded flex gap-1 items-center">
                    <Star
                      size={16}
                      weight="duotone"
                      className="text-yellow-500"
                    />
                    {show.imdbScore}
                  </span>
                </span>
                <AddToWatchlist showId={show.id} force={force} />
              </div>
            </div>
            <Link
              prefetch={true}
              href={`/shows/${show.id}`}
              className="cursor-pointer rounded-lg overflow-hidden hover:text-netflix-primary"
            >
              <div
                className="relative w-full rounded-lg overflow-hidden aspect-[2/3]"
                data-image
              >
                {show?.poster && show?.poster !== "N/A" ? (
                  <Image
                    src={show.poster || ""}
                    alt={show.title ?? "Movie Poster"}
                    placeholder="blur"
                    fill
                    blurDataURL={show.poster || ""}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
                {show.exactMatch && (
                  <div className="absolute bottom-2 left-2 z-10 w-full">
                    <span className="z-10 bg-netflix-primary text-white text-xs px-2 py-1 rounded">
                      Exact Match
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 font-bold text-sm leading-snug">
                {show.title}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
