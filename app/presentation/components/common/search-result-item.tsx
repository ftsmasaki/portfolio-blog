import Link from "next/link";
import { Card, CardContent } from "@/presentation/components/ui/card";
import type { SearchableDocument } from "@/infrastructure/search/search-index";
import { BLOG_ROUTES } from "@/shared/constants/routes";

interface ResultItemProps {
  document: SearchableDocument;
}

export const SearchResultItem = ({ document }: ResultItemProps) => {
  return (
    <Link href={BLOG_ROUTES.POST(document.slug)}>
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{document.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {document.excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
