import Link from "next/link";
import type { Tag } from "@/domain/tags/entities";
import { TAG_ROUTES } from "@/shared/constants/routes";

interface TagBadgeProps {
  readonly tag: Tag;
  readonly showCount?: boolean;
  readonly className?: string;
}

// shadcn/ui Badge 相当の最小実装（既存にbadgeが未導入のため）
const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors " +
      "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 " +
      className
    }
  >
    {children}
  </span>
);

export const TagBadge = ({
  tag,
  showCount = true,
  className,
}: TagBadgeProps) => {
  return (
    <Link href={TAG_ROUTES.DETAIL(tag.slug.value)} prefetch className="group">
      <Badge className={className}>
        #{tag.name.value}
        {showCount && (
          <span className="ml-2 text-[10px] text-muted-foreground group-hover:text-foreground">
            {tag.count.value}
          </span>
        )}
      </Badge>
    </Link>
  );
};
