"use client";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import useCookie from "@/lib/use-cookie";
import { useMemo, useCallback } from "react";
import { revalidateWatchlist } from "@/actions/force";
import dynamic from "next/dynamic";

const COOKIE_NAME = "watchlist";

// A store with fixed length of 24 ids, works a FIFO with arrays
const createStore = (cookieStore: any) => {
  let parsed = JSON.parse(cookieStore ?? "[]");
  if (!parsed || !Array.isArray(parsed)) {
    parsed = [];
  }
  return parsed;
};

const AddToWatchlist = ({
  showId,
  size = 20,
  force,
}: {
  showId: number;
  size?: number;
  force?: boolean;
}) => {
  const [value, updateCookie] = useCookie(COOKIE_NAME);
  const store = useMemo(() => createStore(value), [value]);

  const exists = useCallback(
    (id: number) => store.includes(id),
    [store, showId]
  );
  const add = useCallback(() => {
    if (store.length >= 24) {
      store.shift();
    }
    store.push(showId);
    updateCookie(JSON.stringify(store));
    revalidateWatchlist();
  }, [store, showId]);

  const remove = useCallback(() => {
    store.splice(store.indexOf(showId), 1);
    updateCookie(JSON.stringify(store));
    revalidateWatchlist();
  }, [store, showId]);

  return (
    <button
      type="submit"
      className="text-gray-900 z-10 hover:text-gray-900"
      onClick={exists(showId) ? remove : add}
    >
      <Heart
        size={size}
        suppressHydrationWarning
        weight={exists(showId) ? "fill" : "duotone"}
        className={`
          transition-colors
          hover:text-netflix-primary
          ${exists(showId) ? "text-netflix-primary" : "text-gray-900"}`}
      />
    </button>
  );
};

export default dynamic(() => Promise.resolve(AddToWatchlist), {
  ssr: false,
});
