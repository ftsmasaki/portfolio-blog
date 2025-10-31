"use client";

import { SearchResultItem } from "@/presentation/components/common/search-result-item";
import type { SearchableDocument } from "@/infrastructure/search/search-index";

interface SearchResultProps {
  documents: SearchableDocument[];
}

export const SearchResult = ({ documents }: SearchResultProps) => {
  return (
    <div className="max-h-[60vh] overflow-y-auto space-y-2">
      {documents.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          検索キーワードを入力してください
        </p>
      ) : (
        documents.map(doc => <SearchResultItem key={doc.id} document={doc} />)
      )}
    </div>
  );
};
