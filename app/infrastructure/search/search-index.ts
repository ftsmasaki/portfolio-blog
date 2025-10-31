import { Index } from "flexsearch";
import * as E from "fp-ts/Either";
import type { Post } from "@/domain/blog/entities";

export interface SearchableDocument {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
}

export const postToSearchableDocument = (post: Post): SearchableDocument => {
  const numericId = Number(String((post as unknown as { id: unknown }).id));
  return {
    id: Number.isNaN(numericId) ? 0 : numericId,
    title: String((post as unknown as { title: unknown }).title),
    content: String((post as unknown as { content: unknown }).content),
    excerpt: String((post as unknown as { excerpt: unknown }).excerpt),
    slug: String((post as unknown as { slug: unknown }).slug),
  };
};

export const createSearchIndex = (
  documents: SearchableDocument[]
): E.Either<Error, Index> => {
  return E.tryCatch(
    () => {
      const index = new Index({
        preset: "performance",
        tokenize: "forward",
      });

      for (const doc of documents) {
        const searchableText = `${doc.title} ${doc.content} ${doc.excerpt}`;
        index.add(doc.id, searchableText);
      }

      return index;
    },
    error => new Error(`Failed to create search index: ${String(error)}`)
  );
};

export const searchInIndex = (
  index: Index,
  query: string
): E.Either<Error, number[]> => {
  return E.tryCatch(
    () => {
      const results = index.search(query) as Array<number | string>;
      return results
        .map(r => (typeof r === "string" ? Number(r) : r))
        .filter(n => !Number.isNaN(n)) as number[];
    },
    error => new Error(`Failed to search index: ${String(error)}`)
  );
};
