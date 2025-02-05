import { BellSimple } from "@phosphor-icons/react/dist/ssr";
import NextLink from "next/link";
import { Suspense } from "react";
import { Search } from "./search";

export function Header() {
  return (
    <div className="flex items-center justify-between p-4 md:px-6 gap-4">
      <NextLink href="/" className="md:hidden">
        <h1 className="text-netflix-primary text-3xl font-bold relative leading-none">
          <span>N.</span>
        </h1>
      </NextLink>
      <div className="flex items-center space-x-4 flex-1">
        <Suspense fallback={null}>
          <Search />
        </Suspense>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
          <BellSimple className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-netflix-primary rounded-full"></span>
        </button>

        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
