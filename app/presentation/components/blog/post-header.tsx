"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Post } from "@/domain/blog/entities";
import { formatDate } from "@/presentation/utils/format";
import { TagList } from "@/presentation/components/common/tag-list";

interface PostHeaderProps {
  post: Post;
}

export const PostHeader = ({ post }: PostHeaderProps) => {
  return (
    <>
      {/* アイキャッチ画像 */}
      {post.featuredImage && (
        <motion.div
          layoutId={`post-image-${post.id.value}`}
          className="relative w-full aspect-1200/630 max-h-[400px] mb-8 overflow-hidden rounded-lg bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            layout: { duration: 0.2, ease: "easeOut" },
            opacity: { duration: 0.15 },
          }}
        >
          <Image
            src={post.featuredImage.value}
            alt={post.title.value}
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      )}

      {/* タイトル */}
      <motion.h1
        layoutId={`post-title-${post.id.value}`}
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          layout: { duration: 0.2, ease: "easeOut" },
          opacity: { duration: 0.15, delay: 0.05 },
        }}
      >
        {post.title.value}
      </motion.h1>

      {/* 日時 */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <motion.time
            layoutId={`post-date-${post.id.value}`}
            dateTime={post.createdAt.value.toISOString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              layout: { duration: 0.2, ease: "easeOut" },
              opacity: { duration: 0.15, delay: 0.08 },
            }}
          >
            投稿日: {formatDate(post.createdAt.value)}
          </motion.time>
          {post.updatedAt.value.getTime() !==
            post.createdAt.value.getTime() && (
            <time dateTime={post.updatedAt.value.toISOString()}>
              更新日: {formatDate(post.updatedAt.value)}
            </time>
          )}
        </div>
      </div>

      <div className="mb-6">
        {/* タグ */}
        {post.tags.length > 0 && (
          <TagList
            tags={post.tags}
            title={undefined}
            link={true}
            showCount={false}
          />
        )}
      </div>

      {/* 要約 */}
      {post.excerpt.value && (
        <motion.div
          layoutId={`post-excerpt-${post.id.value}`}
          className="mb-8 p-4 bg-muted rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            layout: { duration: 0.2, ease: "easeOut" },
            opacity: { duration: 0.15, delay: 0.1 },
          }}
        >
          <p className="text-lg">{post.excerpt.value}</p>
        </motion.div>
      )}
    </>
  );
};
