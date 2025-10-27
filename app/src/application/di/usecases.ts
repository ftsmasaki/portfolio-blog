import {
  createGetPostsUseCase,
  createGetPostBySlugUseCase,
  createGetPostsByTagUseCase,
  createSearchPostsUseCase,
} from "@/application/blog/usecases";
import {
  createGetWorksUseCase,
  createGetWorkBySlugUseCase,
} from "@/application/works/usecases";
import {
  createGetTagsUseCase,
  createGetTagBySlugUseCase,
} from "@/application/tags/usecases";
import { wpApiPostRepository } from "@/infrastructure/repositories/WpApiPostRepository";
import { wpApiWorkRepository } from "@/infrastructure/repositories/WpApiWorkRepository";
import { wpApiTagRepository } from "@/infrastructure/repositories/WpApiTagRepository";

// 注入済みの、すぐに実行できるユースケースをエクスポート
export const getPosts = createGetPostsUseCase(wpApiPostRepository);
export const getPostBySlug = createGetPostBySlugUseCase(wpApiPostRepository);
export const getPostsByTag = createGetPostsByTagUseCase(wpApiPostRepository);
export const searchPosts = createSearchPostsUseCase(wpApiPostRepository);
export const getWorks = createGetWorksUseCase(wpApiWorkRepository);
export const getWorkBySlug = createGetWorkBySlugUseCase(wpApiWorkRepository);
export const getTags = createGetTagsUseCase(wpApiTagRepository);
export const getTagBySlug = createGetTagBySlugUseCase(wpApiTagRepository);
