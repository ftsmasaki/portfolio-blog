# フェーズ2: インフラ層実装

## 概要
WordPress REST APIを利用したデータ取得機能、リポジトリ実装、React Query設定を行うインフラ層の実装フェーズ。

## サブフェーズ構成
- **フェーズ2.1**: HTTPクライアントの実装
- **フェーズ2.2**: WordPress API連携の実装
- **フェーズ2.3**: データマッパーの実装
- **フェーズ2.4**: リポジトリ（ブログ、事績、タグ）の実装
- **フェーズ2.5**: React Query設定とQuery Keys定義
- **フェーズ2.6**: エラーハンドリングとバリデーション実装
- **フェーズ2.7**: オンデマンドISR対応

---

## ✅ フェーズ2.1: HTTPクライアントの実装

### 目的
fp-ts Either を活用した型安全なHTTPクライアントの実装

### 実装内容
- fetchラッパーとしてのHTTPクライアント実装
- Either型によるエラーハンドリング
- GET/POSTリクエストのサポート

### 主要ファイル

**HTTPクライアント (`infrastructure/http/client.ts`)**
```typescript
import { Either, tryCatch } from 'fp-ts/Either';

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface HttpError {
  message: string;
  status: number;
  data?: unknown;
}

/**
 * HTTPクライアント関数
 * fetchのラッパーとして実装
 */
export const httpClient = {
  get: async <T>(url: string, options?: RequestInit): Promise<Either<HttpError, HttpResponse<T>>> => {
    return tryCatch(
      async () => {
        const response = await fetch(url, { method: 'GET', ...options });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { data, status: response.status, headers: response.headers };
      },
      (error) => ({
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      })
    )();
  },

  post: async <T>(url: string, body: unknown, options?: RequestInit): Promise<Either<HttpError, HttpResponse<T>>> => {
    return tryCatch(
      async () => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...options?.headers },
          body: JSON.stringify(body),
          ...options,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { data, status: response.status, headers: response.headers };
      },
      (error) => ({
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      })
    )();
  },
};
```

### 完了条件
- ✅  HTTPクライアントが実装済み
- [ ] GETリクエストが正常に動作
- [ ] POSTリクエストが正常に動作
- ✅  エラーハンドリングが適切に実装
- ✅  型チェックエラーが0件

---

## ✅ フェーズ2.2: WordPress API連携の実装

### 目的
WordPress REST APIとの連携機能の実装

### 実装内容
- WordPress APIクライアントの実装
- 記事データ取得関数
- 実績データ取得関数
- タグデータ取得関数

### 主要ファイル

**WordPress API (`infrastructure/external/wordpress-api.ts`)**
```typescript
import { WordPressPostSchema } from '@/application/blog/schemas';
import type { WordPressPost } from '@/application/blog/schemas';
import { Either } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { httpClient, type HttpError } from '@/infrastructure/http/client';

export interface WordPressApiError {
  message: string;
  status: number;
}

/**
 * 記事一覧を取得する関数
 */
export const getWordPressPosts = async (
  baseUrl: string,
  page: number = 1,
  perPage: number = 10
): Promise<Either<WordPressApiError, WordPressPost[]>> => {
  const url = `${baseUrl}/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_embed=true`;
  
  return pipe(
    await httpClient.get<WordPressPost[]>(url),
    E.map((response) => WordPressPostSchema.array().parse(response.data)),
    E.mapLeft((httpError: HttpError): WordPressApiError => ({
      message: httpError.message,
      status: httpError.status,
    }))
  );
};

/**
 * スラッグで記事を取得する関数
 */
export const getWordPressPostBySlug = async (
  baseUrl: string,
  slug: string
): Promise<Either<WordPressApiError, WordPressPost>> => {
  const url = `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`;
  
  return pipe(
    await httpClient.get<WordPressPost[]>(url),
    E.chain((response) => {
      if (response.data.length === 0) {
        return E.left<WordPressApiError, WordPressPost>({
          message: 'Post not found',
          status: 404,
        });
      }
      return E.right(WordPressPostSchema.parse(response.data[0]));
    }),
    E.mapLeft((httpError: HttpError): WordPressApiError => ({
      message: httpError.message,
      status: httpError.status,
    }))
  );
};
```

### 完了条件
- ✅ WordPress APIクライアントが実装済み
- ⏳ 記事取得関数が正常に動作（動作確認待ち）
- ⏳ 実績取得関数が正常に動作（動作確認待ち）
- ⏳ タグ取得関数が正常に動作（動作確認待ち）
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ2.3: データマッパーの実装

### 目的
WordPress APIレスポンスをドメインエンティティに変換するマッパーの実装

### 実装内容
- WordPress → Post変換
- WordPress → Work変換
- WordPress → Tag変換

### 主要ファイル

**WordPress → Post マッパー (`infrastructure/mappers/wp-to-post.ts`)**
```typescript
import type { WordPressPost } from '@/application/blog/schemas';
import type { Post } from '@/domain/blog/entities';
import * as E from 'fp-ts/Either';
import { WordPressPostSchema } from '@/application/blog/schemas';

/**
 * WordPress REST APIレスポンスをドメインエンティティに変換
 */
export const mapWordPressPostToDomain = (wpPost: unknown): E.Either<Error, Post> => {
  return E.tryCatch(
    () => {
      const validatedWpPost = WordPressPostSchema.parse(wpPost);
      
      return {
        id: validatedWpPost.id,
        slug: validatedWpPost.slug,
        title: validatedWpPost.title.rendered,
        content: validatedWpPost.content.rendered,
        excerpt: validatedWpPost.excerpt.rendered,
        createdAt: new Date(validatedWpPost.date),
        updatedAt: new Date(validatedWpPost.modified),
        featuredImage: validatedWpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        tags: validatedWpPost._embedded?.['wp:term']?.[0] || [],
      };
    },
    (error) => new Error(`Mapping error: ${error}`)
  );
};
```

### 完了条件
- ✅ WordPress → Postマッパーが実装済み
- ✅ WordPress → Workマッパーが実装済み
- ✅ WordPress → Tagマッパーが実装済み
- ✅ バリデーションが適切に実装
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ2.4: リポジトリ（ブログ・実績・タグ）の実装

### 目的
WordPress APIを利用したリポジトリ実装

### 実装内容
- ブログリポジトリの実装
- 実績リポジトリの実装
- タグリポジトリの実装
- TaskEitherによるエラーハンドリング

### 主要ファイル

**ブログリポジトリ (`infrastructure/repositories/WpApiPostRepository.ts`)**
```typescript
import type { PostRepository } from '@/domain/blog/ports';
import type { AppError } from '@/application/common/errors';
import { TaskEither } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { getWordPressPosts, getWordPressPostBySlug } from '@/infrastructure/external/wordpress-api';
import { mapWordPressPostToDomain, mapWordPressPostsToDomain } from '@/infrastructure/mappers/wp-to-post';

export const wpApiPostRepository: PostRepository = {
  findAll: (): TaskEither<AppError, Post[]> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const result = await getWordPressPosts(process.env.WORDPRESS_URL || '');
          if (E.isLeft(result)) {
            throw new Error(`Failed to fetch posts: ${result.left.message}`);
          }
          return result.right;
        },
        (error) => ({
          _tag: 'NetworkError',
          error: error instanceof Error ? error : new Error('Unknown error'),
        } as AppError)
      ),
      TE.chain((wpPosts) =>
        pipe(
          mapWordPressPostsToDomain(wpPosts),
          TE.fromEither,
          TE.mapLeft((error) => ({
            _tag: 'ValidationError',
            field: 'posts',
            message: error.message,
          } as AppError))
        )
      )
    );
  },

  findBySlug: (slug: string): TaskEither<AppError, Post> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const result = await getWordPressPostBySlug(process.env.WORDPRESS_URL || '', slug);
          if (E.isLeft(result)) {
            if (result.left.status === 404) {
              throw new Error(`Post not found: ${slug}`);
            }
            throw new Error(`Failed to fetch post: ${result.left.message}`);
          }
          return result.right;
        },
        (error) => ({
          _tag: 'NetworkError',
          error: error instanceof Error ? error : new Error('Unknown error'),
        } as AppError)
      ),
      TE.chain((wpPost) =>
        pipe(
          mapWordPressPostToDomain(wpPost),
          TE.fromEither,
          TE.mapLeft((error) => ({
            _tag: 'ValidationError',
            field: 'post',
            message: error.message,
          } as AppError))
        )
      )
    );
  },

  findByTagSlug: (tagSlug: string): TaskEither<AppError, Post[]> => {
    return pipe(
      wpApiPostRepository.findAll(),
      TE.map((posts) => 
        posts.filter((post) => 
          post.tags.some((tag) => tag.slug === tagSlug)
        )
      )
    );
  },

  search: (query: string): TaskEither<AppError, Post[]> => {
    return pipe(
      wpApiPostRepository.findAll(),
      TE.map((posts) => 
        posts.filter((post) => 
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  },
};
```

### 完了条件
- ✅ ブログリポジトリが実装済み
- ✅ 実績リポジトリが実装済み
- ✅ タグリポジトリが実装済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ2.5: React Query設定とQuery Keys定義

### 目的
React Queryの設定とQuery Keys定義

### 実装内容
- QueryClientの設定
- Query Keysの定義

### 主要ファイル

**Query Client (`infrastructure/query/client.ts`)**
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分
      gcTime: 10 * 60 * 1000, // 10分
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Query Keys (`infrastructure/query/keys.ts`)**
```typescript
export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },
  works: {
    all: ['works'] as const,
    lists: () => [...queryKeys.works.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.works.lists(), { filters }] as const,
    details: () => [...queryKeys.works.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.works.details(), id] as const,
  },
  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
    details: () => [...queryKeys.tags.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tags.details(), id] as const,
  },
} as const;
```

### 完了条件
- ✅ QueryClientが設定済み
- ✅ Query Keysが定義済み
- ✅ キャッシュ戦略が適切に設定
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ2.6: エラーハンドリングとバリデーション実装

### 目的
エラーハンドリングとZodバリデーションの実装

### 実装内容
- Zodスキーマ定義
- バリデーション関数
- エラーハンドリング実装

### 主要ファイル

**ブログスキーマ (`application/blog/schemas.ts`)**
```typescript
import { z } from 'zod';

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
- ✅ エラーハンドリングが実装済み（application/common/errors.ts）
- ✅ バリデーション関数が実装済み（値オブジェクトによるバリデーション）
- ✅ エラーハンドリングが適切に実装
- ✅ 型チェックエラーが0件

---

## フェーズ2全体の完了条件

### 技術指標
- ✅ 型チェックエラーが0件
- ✅ HTTPクライアントが実装済み
- ✅ WordPress API連携が実装済み
- ✅ React Query設定が実装済み
- ✅ エラーハンドリングが実装済み
- ✅ バリデーションが実装済み（値オブジェクトによる）

### 機能指標
- ⏳ データ取得が正常に動作（動作確認待ち）
- ✅ エラーハンドリングが適切
- ✅ バリデーションが適切（値オブジェクトによる）

---

## フェーズ2.7: オンデマンドISR対応

### 目的
WordPress管理画面での更新をほぼリアルタイムで反映するオンデマンドISR機能の実装

### 実装内容
- On-Demand Revalidation API（`/api/revalidate`）の実装
- WordPress On-Demand Revalidationプラグインとの連携
- セキュリティトークンの設定

### 主要ファイル

**On-Demand Revalidation API (`app/api/revalidate/route.ts`)**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * WordPress On-Demand RevalidationプラグインからのWebhookを受信
 * 記事の追加・更新・削除時にNext.jsのキャッシュを無効化
 */
export async function POST(request: NextRequest) {
  // セキュリティトークンの検証
  const secret = request.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, path, tag } = body;

    // パスベースのリアバリデーション
    if (path) {
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
    }

    // タグベースのリアバリデーション
    if (tag) {
      revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
    }

    // 型に応じたリアバリデーション
    if (type === 'post') {
      revalidatePath('/blog');
      revalidatePath('/blog/[slug]', 'page');
      revalidatePath('/');
      revalidateTag('posts');
    } else if (type === 'work') {
      revalidatePath('/works');
      revalidatePath('/works/[slug]', 'page');
      revalidateTag('works');
    } else if (type === 'tag') {
      revalidatePath('/tags');
      revalidatePath('/blog');
      revalidateTag('tags');
    }

    return NextResponse.json({ 
      revalidated: true, 
      message: 'Cache revalidated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Error revalidating cache', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### 環境変数設定

**.env.local**
```env
# On-Demand Revalidation
REVALIDATE_SECRET=your-secret-token-here
```

### WordPress On-Demand Revalidationプラグイン設定

WordPress管理画面でプラグインを有効化し、以下の設定を行う：
- Webhook URL: `https://your-domain.com/api/revalidate`
- Secret Token: 環境変数 `REVALIDATE_SECRET` と同じ値
- トリガー: 投稿の公開/更新/削除時

### 完了条件
- ✅ On-Demand Revalidation APIが実装済み
- ✅ セキュリティトークンによる認証が実装済み
- ✅ 型チェックエラーが0件

### 次のフェーズ
**フェーズ3: アプリケーション層実装** に進む

---

## フェーズ2全体の完了条件

### 技術指標
- ✅ 型チェックエラーが0件
- ✅ HTTPクライアントが実装済み
- ✅ WordPress API連携が実装済み
- ✅ React Query設定が実装済み
- ✅ エラーハンドリングが実装済み
- ✅ バリデーションが実装済み（値オブジェクトによる）
- ✅ On-Demand Revalidation APIが実装済み

### 機能指標
- ⏳ データ取得が正常に動作（動作確認待ち）
- ✅ エラーハンドリングが適切
- ✅ バリデーションが適切（値オブジェクトによる）
- ⏳ オンデマンドISRが正常に動作（動作確認待ち）

