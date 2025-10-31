"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { SearchBar } from "@/presentation/components/common/search-bar";
import { SearchResult } from "@/presentation/components/common/search-result";
import type { SearchableDocument } from "@/infrastructure/search/search-index";
import {
  createSearchIndex,
  searchInIndex,
} from "@/infrastructure/search/search-index";
import * as E from "fp-ts/Either";
import { useMemo, useState } from "react";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: SearchableDocument[];
}

export const SearchModal = ({
  open,
  onOpenChange,
  documents,
}: SearchModalProps) => {
  const [results, setResults] = useState<SearchableDocument[]>(documents);
  const [query, setQuery] = useState("");

  const indexEither = useMemo(() => createSearchIndex(documents), [documents]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q) {
      setResults(documents);
      return;
    }

    if (E.isRight(indexEither)) {
      const idsEither = searchInIndex(indexEither.right, q);
      if (E.isRight(idsEither)) {
        const idSet = new Set(idsEither.right);
        const filtered = documents.filter(d => idSet.has(d.id));
        setResults(filtered);
      } else {
        setResults(documents);
      }
    } else {
      setResults(documents);
    }
  };

  const initialResults = useMemo(() => documents, [documents]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden sm:top-16 sm:translate-y-0">
        <DialogHeader>
          <DialogTitle>記事を検索</DialogTitle>
          <DialogDescription>
            キーワードを入力して記事を検索します
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <SearchBar key={open ? "open" : "closed"} onSearch={handleSearch} />
          {query && results.length > 0 ? (
            <SearchResult
              documents={results}
              onItemClick={() => {
                setQuery("");
                setResults(documents);
                onOpenChange(false);
              }}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
