import "reflect-metadata";
import { container } from "tsyringe";
import { wpApiPostRepository } from "@/infrastructure/repositories/WpApiPostRepository";
import { wpApiTagRepository } from "@/infrastructure/repositories/WpApiTagRepository";

export const TYPES = {
  PostRepository: "PostRepository",
  TagRepository: "TagRepository",
} as const;

/**
 * DIコンテナの初期化関数
 */
export const initializeContainer = () => {
  container.registerInstance(TYPES.PostRepository, wpApiPostRepository);
  container.registerInstance(TYPES.TagRepository, wpApiTagRepository);

  return container;
};

export const appContainer = initializeContainer();
export { container };
