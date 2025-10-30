import Link from "next/link";
import type { Tag } from "@/domain/tags/entities";
import { TAG_ROUTES } from "@/shared/constants/routes";

interface TagListProps {
  readonly tags: Tag[];
  readonly title?: string;
  readonly className?: string;
}

export const TagList = ({ tags, title, className }: TagListProps) => {
  if (tags.length === 0) {
    return (
      <div className={className}>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <p className="text-sm text-muted-foreground">タグがありません</p>
      </div>
    );
  }

  const sorted = [...tags].sort((a, b) => b.count.value - a.count.value);

  return (
    <div className={className}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <ul className="flex flex-wrap gap-2">
        {sorted.map(tag => (
          <li key={tag.id.value}>
            <Link
              href={TAG_ROUTES.DETAIL(tag.slug.value)}
              className="px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-sm"
            >
              {tag.name.value}
              <span className="ml-2 text-xs text-muted-foreground">{tag.count.value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};


