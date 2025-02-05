import { getShowById } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import {
  Star,
  Calendar,
  Popcorn,
  GlobeHemisphereWest,
  Clock,
  FilmSlate,
  FilmStrip,
  FilmReel,
  Trophy,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Suspense } from "react";
import NextLink from "next/link";
import { Similar, SimilarSkeleton } from "@/components/similar";
import AddToWatchlist from "@/components/add";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const show = await getShowById(id);
    if (!show) {
      throw new Error("Show not found");
    }

    const directors = show?.directors
      ?.map((director) => director.name)
      .join(", ");
    const actors = show?.actors?.map((actor) => actor.name).join(", ");
    const countries = show?.countries
      ?.map((country) => country.name)
      .join(", ");

    return (
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8 animate-fade-in pt-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            {show?.poster && (
              <Image
                src={show.poster || ""}
                alt={show.title ?? "Movie Poster"}
                width={500}
                height={500}
                className="rounded-lg"
              />
            )}
            {!show?.poster && (
              <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>{show.title}</span>
              <AddToWatchlist showId={show.id} size={24} />
            </h1>
            {/* Rating and other information */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 justify-center">
                <Star size={20} weight="duotone" className="text-gray-900" />
                <p className="text-md font-bold text-gray-900 leading-none">
                  {show.imdbScore}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar
                  size={20}
                  weight="duotone"
                  className="text-gray-900"
                />
                <p className="text-md font-bold text-gray-900 leading-none">
                  {show.releaseYear}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock
                  size={20}
                  weight="duotone"
                  className="text-gray-900 flex-shrink-0"
                />
                <p className="text-md font-bold text-gray-900 leading-none">
                  {show.runtime}
                </p>
              </div>
              <a
                href={`https://www.imdb.com/title/${show?.imdbId}`}
                target="_blank"
                className="text-sm font-bold text-gray-900 hover:text-yellow-500 transition-colors flex items-center gap-2"
              >
                <Popcorn size={20} weight="duotone" className="text-gray-900" />
                <span>IMDB</span>
              </a>
            </div>
            {/* Information */}

            <p className="leading-relaxed text-black mt-3">
              {show.description}
            </p>

            <div className="w-full h-px bg-gray-100 my-10"></div>
            {/* Categories */}

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="text-md text-gray-900 flex flex-wrap gap-2">
                  <FilmStrip
                    size={20}
                    weight="duotone"
                    className="text-gray-900"
                  />
                  {show.categories.map((category) => (
                    <NextLink
                      key={category.id}
                      href={`/categories/${category.id}`}
                      className=" text-gray-900 hover:text-netflix-primary transition-colors"
                    >
                      {category.name}
                    </NextLink>
                  ))}
                </div>
              </div>
              {/* Directors  */}
              <div className="flex gap-2">
                <FilmSlate
                  size={20}
                  weight="duotone"
                  className="text-gray-900 flex-shrink-0"
                />
                <div className="text-md text-gray-900 flex flex-wrap gap-2">
                  {directors && directors.length > 0 ? (
                    <span>{directors}</span>
                  ) : (
                    <div>No directors found</div>
                  )}
                </div>
              </div>
              {/* Actors */}
              <div className="flex gap-2">
                <FilmReel
                  size={20}
                  weight="duotone"
                  className="text-gray-900 flex-shrink-0"
                />
                <div className="text-md text-gray-900 flex flex-wrap gap-2">
                  {actors && actors.length > 0 ? (
                    <span>{actors}</span>
                  ) : (
                    <div>No actors found</div>
                  )}
                </div>
              </div>
              {/* Awards */}
              <div className="flex gap-2">
                <Trophy
                  size={20}
                  weight="duotone"
                  className="text-gray-900 flex-shrink-0"
                />
                <div className="text-md text-gray-900 flex flex-wrap gap-2">
                  {show.awards && show.awards.length > 0 ? (
                    <span>{show.awards}</span>
                  ) : (
                    <div>No awards found</div>
                  )}
                </div>
              </div>
              {/*  */}
              {/* Countries */}
              <div className="flex gap-2">
                <GlobeHemisphereWest
                  size={20}
                  weight="duotone"
                  className="text-gray-900 flex-shrink-0"
                />
                <div className="text-md text-gray-900 flex flex-wrap gap-2">
                  {countries && countries.length > 0 ? (
                    <span>{countries}</span>
                  ) : (
                    <div>No countries found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Similar shows */}
        </div>
        <Suspense fallback={<SimilarSkeleton />}>
          <Similar showId={id} />
        </Suspense>
      </div>
    );
  } catch (_error) {
    return notFound();
  }
}
