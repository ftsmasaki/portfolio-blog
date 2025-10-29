"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Image } from "lucide-react";
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
      <motion.article
        layoutId={`post-${post.id.value}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <Card className="h-full overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow">
          <div className="relative w-full aspect-video overflow-hidden bg-muted">
            {post.featuredImage ? (
              <motion.img
                layoutId={`post-image-${post.id.value}`}
                src={post.featuredImage.value}
                alt={post.title.value}
                transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="w-16 h-16 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <CardHeader>
            <motion.h3
              layoutId={`post-title-${post.id.value}`}
              transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
              className="text-lg font-semibold line-clamp-2"
            >
              {post.title.value}
            </motion.h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <motion.time
                layoutId={`post-date-${post.id.value}`}
                dateTime={post.createdAt.value.toISOString()}
                transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
              >
                {formatDate(post.createdAt.value)}
              </motion.time>
            </div>
          </CardHeader>
          <CardContent>
            <motion.p
              layoutId={`post-excerpt-${post.id.value}`}
              transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
              className="text-sm text-muted-foreground line-clamp-3"
            >
              {post.excerpt.value}
            </motion.p>
          </CardContent>
        </Card>
      </motion.article>
    </Link>
  );
};
