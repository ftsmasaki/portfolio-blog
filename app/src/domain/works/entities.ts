/**
 * 実績エンティティ
 */
export interface Work {
  id: number;
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
