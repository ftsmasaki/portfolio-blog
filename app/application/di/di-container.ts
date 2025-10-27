import "reflect-metadata";
import { container } from "tsyringe";
import { wpApiPostRepository } from "@/infrastructure/repositories/WpApiPostRepository";
import { wpApiWorkRepository } from "@/infrastructure/repositories/WpApiWorkRepository";
import { wpApiTagRepository } from "@/infrastructure/repositories/WpApiTagRepository";

export const TYPES = {
  PostRepository: "PostRepository",
  WorkRepository: "WorkRepository",
  TagRepository: "TagRepository",
} as const;

/**
 * DIコンテナの初期化関数
 */
export const initializeContainer = () => {
  container.registerInstance(TYPES.PostRepository, wpApiPostRepository);
  container.registerInstance(TYPES.WorkRepository, wpApiWorkRepository);
  container.registerInstance(TYPES.TagRepository, wpApiTagRepository);

  return container;
};

export const appContainer = initializeContainer();
export { container };
