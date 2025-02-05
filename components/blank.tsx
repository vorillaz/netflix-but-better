"use client";

import { Button } from "@/components/ui/button";
import NextLink from "next/link";

export const Blank = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <p className="text-xl md:text-2xl text-gray-600">No shows found</p>
      <p className="text-gray-500 max-w-md text-center">
        You might need to reset your filters or try to search for something
        else.
      </p>
      <Button as={NextLink} href="/">
        Back to Home
      </Button>
    </div>
  );
};
