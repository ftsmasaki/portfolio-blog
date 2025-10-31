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

  const indexEither = useMemo(() => createSearchIndex(documents), [documents]);

  const handleSearch = (query: string) => {
    if (!query) {
      setResults(documents);
      return;
    }

    if (E.isRight(indexEither)) {
      const idsEither = searchInIndex(indexEither.right, query);
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>記事を検索</DialogTitle>
          <DialogDescription>
            キーワードを入力して記事を検索します
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <SearchBar onSearch={handleSearch} />
          <SearchResult documents={results.length ? results : initialResults} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
