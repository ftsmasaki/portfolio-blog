# フェーズ3: アプリケーション層実装

## 概要
アプリケーション層の実装：エラー型定義、Zodスキーマ、ユースケース、ドメインサービス、DIコンテナ設定を実装する。

## サブフェーズ構成
- **✅ フェーズ3.1**: エラー型とバリデーション関数の実装
- **✅ フェーズ3.2**: Zodスキーマ定義（ブログ、実績、タグ）
- **フェーズ3.3**: ユースケース（ブログ、実績、タグ）の実装
- **フェーズ3.4**: ドメインサービスの実装
- **フェーズ3.5**: DIコンテナ設定

---

## ✅ フェーズ3.1: エラー型とバリデーション関数

### 目的
アプリケーション全体で使用するエラー型の定義とバリデーション関数の実装

### 実装内容
- エラー型定義（NetworkError, ApiError, NotFoundError, ValidationError, UnknownError）
- バリデーション関数

### 主要ファイル

**エラー型 (`application/common/errors.ts`)**
```typescript
// アプリケーション全体で発生しうるエラーの型
export type NetworkError = { _tag: 'NetworkError'; error: Error };
export type ApiError = { _tag: 'ApiError'; status: number; message: string };
export type NotFoundError = { _tag: 'NotFoundError'; resource: string };
export type ValidationError = { _tag: 'ValidationError'; field: string; message: string };
export type UnknownError = { _tag: 'UnknownError'; error: unknown };

export type AppError = 
  | NetworkError 
  | ApiError 
  | NotFoundError 
  | ValidationError 
  | UnknownError;

// エラーを生成するコンストラクタ関数
export const networkError = (error: Error): AppError => ({ _tag: 'NetworkError', error });
export const apiError = (status: number, message: string): AppError => ({ _tag: 'ApiError', status, message });
export const notFoundError = (resource: string): AppError => ({ _tag: 'NotFoundError', resource });
export const validationError = (field: string, message: string): AppError => ({ _tag: 'ValidationError', field, message });
export const unknownError = (error: unknown): AppError => ({ _tag: 'UnknownError', error });
```

### 完了条件
- ✅ エラー型が定義済み
- ✅ バリデーション関数が実装済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ3.2: Zodスキーマ定義（ブログ、実績、タグ）

### 目的
WordPress APIレスポンスとドメインエンティティのZodスキーマ定義

### 実装内容
- ブログスキーマ
- 実績スキーマ
- タグスキーマ

### 主要ファイル

**ブログスキーマ (`application/blog/schemas.ts`)**
```typescript
import { z } from 'zod';

// WordPress APIレスポンス用スキーマ
export const WordPressPostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
  date: z.string(),
  modified: z.string(),
  featured_media: z.number().optional(),
  tags: z.array(z.number()).optional(),
  _embedded: z.object({
    'wp:featuredmedia': z.array(z.object({ source_url: z.string() })).optional(),
  }).optional(),
});

// ドメインエンティティ用スキーマ
export const PostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  featuredImage: z.string().optional(),
  tags: z.array(z.string()),
});

export type WordPressPost = z.infer<typeof WordPressPostSchema>;
export type Post = z.infer<typeof PostSchema>;
```

### 完了条件
- ✅ ブログスキーマが定義済み
- ✅ 実績スキーマが定義済み
- ✅ タグスキーマが定義済み
- ✅ 型チェックエラーが0件

---

## フェーズ3.3: ユースケース（ブログ、実績、タグ）の実装

### 目的
リポジトリを利用したユースケースの実装（関数ファクトリパターン）

### 実装内容
- ブログユースケース
- 実績ユースケース
- タグユースケース

### 主要ファイル

**ブログユースケース (`application/blog/usecases.ts`)**
```typescript
import type { PostRepository } from '../../domain/blog/ports';

// 関数ファクトリパターン（推奨）
export const createGetPostsUseCase = (repo: PostRepository) => 
  repo.findAll;

export const createGetPostBySlugUseCase = (repo: PostRepository) => 
  repo.findBySlug;

export const createGetPostsByTagUseCase = (repo: PostRepository) => 
  repo.findByTagSlug;

export const createSearchPostsUseCase = (repo: PostRepository) => 
  repo.search;
```

### 完了条件
- [ ] ブログユースケースが実装済み
- [ ] 実績ユースケースが実装済み
- [ ] タグユースケースが実装済み
- [ ] 型チェックエラーが0件

---

## フェーズ3.4: ドメインサービスの実装

### 目的
複数のエンティティにまたがるビジネスロジックの実装（純粋関数）

### 実装内容
- 関連記事抽出機能
- 関連実績抽出機能

### 主要ファイル

**ドメインサービス (`application/services.ts`)**
```typescript
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import type { Post } from '../domain/blog/entities';
import type { Work } from '../domain/works/entities';

/**
 * 記事の関連記事を抽出する
 * - 同じタグを持つ記事を最大5件まで抽出
 */
export const extractRelatedPosts = (
  targetPost: Post,
  allPosts: Post[],
  maxCount: number = 5
): Post[] => {
  return pipe(
    allPosts,
    A.filter((post) => post.id !== targetPost.id),
    A.filter((post) => {
      const targetTags = targetPost.tags.map((t) => t.id);
      const postTags = post.tags.map((t) => t.id);
      return targetTags.some((tag) => postTags.includes(tag));
    }),
    A.takeLeft(maxCount)
  );
};

/**
 * 関連する実績を抽出する
 */
export const extractRelatedWorks = (
  targetWork: Work,
  allWorks: Work[],
  maxCount: number = 3
): Work[] => {
  return pipe(
    allWorks,
    A.filter((work) => work.id !== targetWork.id),
    A.filter((work) => {
      const targetTechs = targetWork.technologies.map((t) => t.toLowerCase());
      const workTechs = work.technologies.map((t) => t.toLowerCase());
      return targetTechs.some((tech) => workTechs.includes(tech));
    }),
    A.takeLeft(maxCount)
  );
};
```

### 完了条件
- [ ] 関連記事抽出機能が実装済み
- [ ] 関連実績抽出機能が実装済み
- [ ] 純粋関数として実装済み
- [ ] 型チェックエラーが0件

---

## フェーズ3.5: DIコンテナ設定

### 目的
Tsyringeを用いた依存性注入コンテナの設定

### 実装内容
- DIコンテナ初期化
- リポジトリ登録
- 注入済みユースケースエクスポート

### 主要ファイル

**DIコンテナ設定 (`application/di/di-container.ts`)**
```typescript
import 'reflect-metadata';
import { container } from 'tsyringe';
import { wpApiPostRepository } from '@/infrastructure/repositories/WpApiPostRepository';
import { wpApiWorkRepository } from '@/infrastructure/repositories/WpApiWorkRepository';
import { wpApiTagRepository } from '@/infrastructure/repositories/WpApiTagRepository';

export const TYPES = {
  PostRepository: 'PostRepository',
  WorkRepository: 'WorkRepository',
  TagRepository: 'TagRepository',
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
```

**注入済みユースケース (`application/di/usecases.ts`)**
```typescript
import {
  createGetPostsUseCase,
  createGetPostBySlugUseCase,
  createGetPostsByTagUseCase,
  createSearchPostsUseCase
} from '@/application/blog/usecases';
import {
  createGetWorksUseCase,
  createGetWorkBySlugUseCase
} from '@/application/works/usecases';
import { createGetTagsUseCase } from '@/application/tags/usecases';
import { wpApiPostRepository } from '@/infrastructure/repositories/WpApiPostRepository';
import { wpApiWorkRepository } from '@/infrastructure/repositories/WpApiWorkRepository';
import { wpApiTagRepository } from '@/infrastructure/repositories/WpApiTagRepository';

// 注入済みの、すぐに実行できるユースケースをエクスポート
export const getPosts = createGetPostsUseCase(wpApiPostRepository);
export const getPostBySlug = createGetPostBySlugUseCase(wpApiPostRepository);
export const getPostsByTag = createGetPostsByTagUseCase(wpApiPostRepository);
export const searchPosts = createSearchPostsUseCase(wpApiPostRepository);
export const getWorks = createGetWorksUseCase(wpApiWorkRepository);
export const getWorkBySlug = createGetWorkBySlugUseCase(wpApiWorkRepository);
export const getTags = createGetTagsUseCase(wpApiTagRepository);
```

### 完了条件
- [ ] DIコンテナが初期化済み
- [ ] リポジトリが登録済み
- [ ] 注入済みユースケースがエクスポート済み
- [ ] reflect-metadataがインポート済み
- [ ] 型チェックエラーが0件

---

## フェーズ3全体の完了条件

### 技術指標
- [ ] 型チェックエラーが0件
- [ ] エラー型が定義済み
- [ ] Zodスキーマが定義済み
- [ ] ユースケースが実装済み
- [ ] DIコンテナが正常に動作

### 機能指標
- [ ] ユースケースが正常に動作
- [ ] ドメインサービスが正常に動作
- [ ] エラーハンドリングが適切

### 次のフェーズ
**フェーズ4: プレゼンテーション層実装（基本コンポーネント）** に進む

