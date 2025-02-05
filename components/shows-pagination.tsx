"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { searchParamsParsers } from "@/lib/search";
import { useQueryState } from "nuqs";
import NextLink from "next/link";

export interface ShowsPaginationProps {
  baseUrl?: string;
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export function ShowsPagination({
  currentPage,
  totalPages,
  totalResults,
}: ShowsPaginationProps) {
  const [page, setPage] = useQueryState("page", searchParamsParsers.page);
  // Check if page is correct
  if (currentPage < 1 || currentPage > totalPages) {
    return null;
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-10">
      <Pagination>
        <PaginationContent className="flex justify-between">
          <PaginationItem>
            <Button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              variant="ghost"
              size="icon"
              disabled={currentPage <= 1}
            >
              <ArrowLeft />
            </Button>
          </PaginationItem>

          <div className="text-muted-foreground">
            {totalResults.toLocaleString()} results (
            {currentPage.toLocaleString()} of {totalPages.toLocaleString()})
          </div>

          <PaginationItem>
            <Button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              variant="ghost"
              size="icon"
              disabled={currentPage >= totalPages}
            >
              <ArrowRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="sr-only">
        <NextLink href={`/browse?page=${currentPage - 1}`} prefetch>
          Previous
        </NextLink>
        <NextLink href={`/browse?page=${currentPage + 1}`} prefetch>
          Next
        </NextLink>
      </div>
    </div>
  );
}
