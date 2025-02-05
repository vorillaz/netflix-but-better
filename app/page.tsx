import { Suspense } from "react";
import { BestShows, BestShowsSkeleton } from "@/components/best";
import { CategoriesSection, CategoriesSkeleton } from "@/components/popular";
import {
  FeaturedContent,
  FeaturedContentSkeleton,
} from "@/components/featured";

export default async function Home() {
  return (
    <div className="">
      <Suspense fallback={<FeaturedContentSkeleton />}>
        <FeaturedContent />
      </Suspense>
      <Suspense fallback={<BestShowsSkeleton />}>
        <BestShows />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>
    </div>
  );
}
