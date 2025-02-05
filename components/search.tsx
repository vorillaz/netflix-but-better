"use client";

import Form from "next/form";
import {
  useRef,
  useEffect,
  useCallback,
  useTransition,
  useLayoutEffect,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Binoculars, KeyReturn } from "@phosphor-icons/react/dist/ssr";
import { MAX_QUERY_LENGTH } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { searchParamsParsers } from "@/lib/search";
import {
  useQueryState,
  useQueryStates,
  parseAsString,
  parseAsInteger,
} from "nuqs";
import { usePathname } from "next/navigation";

export function Loading({ query }: { query: string }) {
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/browse" && query && query.length > 0) {
      setShouldSubmit(true);
    } else {
      setShouldSubmit(false);
    }
  }, [pathname, query]);

  return (
    shouldSubmit && (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-netflix-primary rounded-lg px-2 py-1 flex items-center justify-center gap-1">
        <span className="text-white text-sm">Search</span>
        <KeyReturn weight="duotone" className="z-10 w-4 h-4 text-white" />
      </div>
    )
  );
}

export function SearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [query, setQuery] = useQueryState("q", searchParamsParsers.q);
  const prevQuery = useRef<string | null>(query);
  const [_page, setPage] = useQueryState("page", searchParamsParsers.page);

  const batchUpdate = useCallback((q: string) => {
    setQuery(q);
    prevQuery.current = q;
    setPage(null);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, []);

  useEffect(() => {
    if (query !== prevQuery.current) {
      prevQuery.current = query;
    }
  }, [query]);

  async function handleSubmit(formData: FormData) {
    const query = formData.get("q") as string;
    const newUrl = `/browse?q=${encodeURIComponent(query)}`;
    router.push(newUrl);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setQuery(newValue);
    batchUpdate(newValue);
  }

  return (
    <Form
      ref={formRef}
      action={handleSubmit}
      className="relative flex-1 w-full flex  flex-wrap"
    >
      <div className="flex relative flex-wrap">
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <Binoculars className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <Input
          ref={inputRef}
          type="text"
          name="q"
          id="q"
          onChange={handleInputChange}
          value={query}
          maxLength={MAX_QUERY_LENGTH}
          placeholder="Search for a show..."
          autoComplete="off"
          className="pl-10 flex-1 min-w-[450px] h-12"
        />
        <Loading query={query} />
        <button type="submit" className="hidden">
          Search
        </button>
      </div>
    </Form>
  );
}

export function Search() {
  return <SearchForm />;
}
