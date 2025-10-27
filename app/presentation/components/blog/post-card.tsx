"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/presentation/components/ui/card";
import type { Post } from "@/domain/blog/entities";
import { formatDate } from "@/presentation/utils/format";
import { BLOG_ROUTES } from "@/shared/constants/routes";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link href={BLOG_ROUTES.POST(post.slug.value)} scroll={false}>
      <Card className="h-full overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow">
        {post.featuredImage && (
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={post.featuredImage.value}
              alt={post.title.value}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader>
          <h3 className="text-lg font-semibold line-clamp-2">
            {post.title.value}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.createdAt.value.toISOString()}>
              {formatDate(post.createdAt.value)}
            </time>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt.value}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
