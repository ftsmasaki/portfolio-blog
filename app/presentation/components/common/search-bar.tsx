'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="記事を検索..."
        value={query}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <button
          onClick={() => {
            setQuery('');
            onSearch?.('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
};


