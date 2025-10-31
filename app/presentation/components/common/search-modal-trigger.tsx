"use client";

import { Search } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

interface SearchModalTriggerProps {
  onOpen: () => void;
}

export const SearchModalTrigger = ({ onOpen }: SearchModalTriggerProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={onOpen}
      aria-label="記事を検索"
    >
      <Search className="h-4 w-4" />
      <span className="hidden md:inline">検索</span>
    </Button>
  );
};
