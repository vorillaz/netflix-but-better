import { SORT_IMDB_RATING, SORT_RELEASE_DATE } from "./constants";
import {
  parseAsString,
  parseAsInteger,
  parseAsStringLiteral,
  createLoader,
} from "nuqs/server";

const sort = [SORT_IMDB_RATING, SORT_RELEASE_DATE] as const;

export const searchParamsParsers = {
  q: parseAsString.withDefault("").withOptions({
    shallow: false,
    throttleMs: 800,
  }),
  page: parseAsInteger.withDefault(0).withOptions({
    shallow: false,
    throttleMs: 500,
  }),
  sort: parseAsStringLiteral(sort).withDefault(SORT_IMDB_RATING).withOptions({
    shallow: false,
  }),
};

export const loadSearchParams = createLoader(searchParamsParsers);
