import Link from "next/link";
import { TagList } from "@/presentation/components/tags/tag-list";
import { getTags } from "@/application/di/usecases";
import type { Tag } from "@/domain/tags/entities";

export const revalidate = 7200;

export const metadata = {
  title: "タグ一覧",
  description: "ブログのタグ一覧",
};

export default async function TagsPage() {
  const tagsResult = await getTags()();

  if (tagsResult._tag === "Left") {
    const errorMsg =
      tagsResult.left._tag === "NetworkError"
        ? tagsResult.left.error.message
        : tagsResult.left._tag === "ValidationError"
        ? tagsResult.left.message
        : "Unknown error";
    throw new Error(errorMsg);
  }

  const tags: Tag[] = tagsResult.right;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">タグ一覧</h1>
      <TagList tags={tags} />
      <div className="mt-10">
        <Link href="/blog" className="text-sm text-primary hover:underline">
          ブログ一覧へ戻る
        </Link>
      </div>
    </div>
  );
}


