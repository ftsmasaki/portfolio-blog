import type { Tag } from "../tags/entities";

/**
 * ブログエンティティ
 */
export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: string;
  tags: Tag[];
  author: Author;
}

/**
 * 著者エンティティ
 */
export interface Author {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}
