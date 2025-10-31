"use client";

import { SearchResultItem } from "@/presentation/components/common/search-result-item";
import type { SearchableDocument } from "@/infrastructure/search/search-index";

interface SearchResultProps {
  documents: SearchableDocument[];
  onItemClick?: () => void;
}

export const SearchResult = ({ documents, onItemClick }: SearchResultProps) => {
  if (documents.length === 0) return null;
  return (
    <div className="max-h-[60vh] overflow-y-auto space-y-2">
      {documents.map(doc => (
        <SearchResultItem key={doc.id} document={doc} onClick={onItemClick} />
      ))}
    </div>
  );
};
