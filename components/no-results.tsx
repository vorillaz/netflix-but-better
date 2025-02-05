"use client";
import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";
import { searchParamsParsers } from "@/lib/search";
import NextLink from "next/link";
export const NoResults = () => {
  const [q, setQ] = useQueryState("q", searchParamsParsers.q);
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <p className="text-xl md:text-2xl text-gray-600">No shows found</p>
      <p className="text-gray-500 max-w-md text-center">
        You might need to reset your query or try some suggestions below.
      </p>
      <div className="flex gap-2 flex-wrap">
        <Button as={NextLink} href={`/browse?q=Breaking Bad`}>
          Show me "Breaking Bad"
        </Button>
        <Button as={NextLink} href={`/browse?q=Movies with Tom Cruise`}>
          Movies with Tom Cruise
        </Button>
        <Button as={NextLink} href={`/browse?q=TV shows with a female lead`}>
          TV shows with a female lead
        </Button>
      </div>
    </div>
  );
};
