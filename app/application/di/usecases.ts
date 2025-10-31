import {
  createGetPostsUseCase,
  createGetPostBySlugUseCase,
  createGetPostsByTagUseCase,
  createGetPostsByTagIdUseCase,
  createSearchPostsUseCase,
} from "@/application/blog/usecases";
import {
  createGetTagsUseCase,
  createGetTagBySlugUseCase,
} from "@/application/tags/usecases";
import { wpApiPostRepository } from "@/infrastructure/repositories/WpApiPostRepository";
import { wpApiTagRepository } from "@/infrastructure/repositories/WpApiTagRepository";

// 注入済みの、すぐに実行できるユースケースをエクスポート
export const getPosts = createGetPostsUseCase(wpApiPostRepository);
export const getPostBySlug = createGetPostBySlugUseCase(wpApiPostRepository);
export const getPostsByTag = createGetPostsByTagUseCase(wpApiPostRepository);
export const getPostsByTagId = createGetPostsByTagIdUseCase(wpApiPostRepository);
export const searchPosts = createSearchPostsUseCase(wpApiPostRepository);
export const getTags = createGetTagsUseCase(wpApiTagRepository);
export const getTagBySlug = createGetTagBySlugUseCase(wpApiTagRepository);
