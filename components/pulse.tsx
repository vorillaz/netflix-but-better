"use client";
// A client component that detects changes in the URL
// if there is a change in the URL, it will pulse the grid

import { useTransition, useLayoutEffect } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";

export function Pulse() {
  const [isLoading, startTransition] = useTransition();
  const [q, page] = useQueryStates({
    q: parseAsString.withOptions({
      shallow: false,
      startTransition,
    }),
    page: parseAsInteger.withOptions({
      shallow: false,
      startTransition,
    }),
  });

  useLayoutEffect(() => {
    startTransition(() => {
      console.log("transitioning");
    });
  }, [q, page]);

  return <div data-pending={isLoading ? "" : undefined} />;
}
