import type {
  WorkId,
  WorkTitle,
  WorkSlug,
  WorkDescription,
  Technology,
  ImageUrl,
  GitHubUrl,
  LiveUrl,
  PostDate,
} from "@/domain/value-objects";

/**
 * 実績エンティティ
 */
export interface Work {
  readonly id: WorkId;
  readonly title: WorkTitle;
  readonly slug: WorkSlug;
  readonly description: WorkDescription;
  readonly technologies: Technology[];
  readonly githubUrl?: GitHubUrl;
  readonly liveUrl?: LiveUrl;
  readonly images: ImageUrl[];
  readonly createdAt: PostDate;
  readonly updatedAt: PostDate;
}
