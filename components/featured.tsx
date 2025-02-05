import { Play } from "@phosphor-icons/react/dist/ssr";
import { getFeaturedShows } from "@/lib/db/queries";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedContentSkeleton() {
  return (
    <div className="flex gap-6 justify-between mb-8">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="relative flex flex-col md:flex-row gap-6 animate-pulse pt-8"
        >
          <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
            <Skeleton className="w-[300px] h-[450px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent top-0">
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <div className="hidden sm:flex -space-x-2">
                  <div className="flex -space-x-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                  </div>
                </div>
                <Skeleton className="hidden sm:inline h-4 w-32" />
              </div>

              <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 max-w-xl">
                <Skeleton className="h-6 w-48 mb-2 md:mb-4" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export async function FeaturedContent() {
  const shows = await getFeaturedShows();
  return (
    <div className="flex gap-6 justify-between mb-8 flex-col md:flex-row">
      {shows.map((show, index) => (
        <div
          key={show.id}
          className={`relative flex flex-col md:flex-row gap-6 animate-fade-in pt-8 md:block ${
            index === 0 ? "" : "hidden"
          }`}
        >
          <Link
            href={`/shows/${show.id}`}
            className="relative flex items-center justify-center overflow-hidden rounded-lg"
          >
            <Image
              width={300}
              height={450}
              src={show.poster || ""}
              alt={show.title ?? "Movie Poster"}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent top-0">
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <div className="hidden sm:flex -space-x-2">
                  <div className="flex -space-x-2 ">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-cyan-500"></div>
                  </div>
                </div>
                <span className="hidden sm:inline text-white text-sm">
                  +{show.id} people are watching
                </span>
              </div>

              <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 max-w-xl">
                <h1 className="text-xl md:text-xl font-bold text-white mb-2 md:mb-4">
                  {show.title}
                </h1>

                <div className="flex items-center space-x-2 md:space-x-4">
                  <button className="bg-netflix-primary text-white px-4 md:px-8 py-2 rounded-md flex items-center space-x-2 hover:bg-netflix-red/90 transition-colors transform hover:scale-105 duration-200">
                    <Play className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Watch</span>
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
