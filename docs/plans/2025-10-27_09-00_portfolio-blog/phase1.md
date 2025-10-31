# フェーズ1: 基盤構築

## 概要
Next.js 16 + React 19 + TypeScript環境の構築と、bulletproof-react準拠のディレクトリ構成、関数型ドメインモデリングの実装を行う基盤構築フェーズ。

## サブフェーズ構成
- **フェーズ1.1**: プロジェクト初期設定
- **フェーズ1.2**: ディレクトリ構成と型定義作成
- **フェーズ1.3**: fp-ts拡張機能の実装
- **フェーズ1.4**: 値オブジェクト（ブログ・実績・タグ関連）の実装
- **フェーズ1.5**: ドメインエンティティとポートの実装
- **フェーズ1.6**: 共通ユーティリティ関数の実装
- **フェーズ1.7**: shadcn/uiコンポーネントのセットアップ
- **フェーズ1.8**: テーマシステムとカラーモード実装
- **フェーズ1.9**: 基本レイアウト（Header/Footer）の実装
- **フェーズ1.10**: ナビゲーション実装
- **フェーズ1.11**: レスポンシブ対応とモバイル最適化

---

## ✅ フェーズ1.1: プロジェクト初期設定

### 目的
Next.js 16 + React 19 + TypeScript環境の構築と必要なライブラリのインストール

### 実装内容
- Next.js 16 + React 19 + TypeScript環境の構築
- Tailwind CSS 4の設定
- ESLint + Prettierの設定
- ディレクトリ構成の作成
- 基本設定ファイルの作成
- 必要なライブラリのインストール

### インストールコマンド

```bash
# 基本依存関係
npm install fp-ts lucide-react clsx tailwind-merge

# 状態管理・データフェッチング・バリデーション
npm install zustand @tanstack/react-query zod

# DIコンテナ（Tsyringe）
npm install tsyringe reflect-metadata

# 全文検索
npm install flexsearch

# テーマ管理
npm install next-themes

# アニメーション
npm install framer-motion

# 日付操作
npm install date-fns

# アナリティクス
npm install @next/third-parties

# Markdown処理
npm install remark remark-html remark-gfm rehype rehype-highlight rehype-slug rehype-autolink-headings

# shadcn/ui初期化
npx shadcn@latest init

# 必要なshadcn/uiコンポーネント
npx shadcn@latest add button card navigation-menu input popover pagination dialog
```

### セットアップ手順
1. shadcn/uiの初期設定（components.jsonの設定）
2. Tailwind CSS設定の更新
3. 型定義ファイルの作成
4. ユーティリティ関数の設定

### 完了条件
- ✅ Next.js 16 + React 19 + TypeScript環境が動作
- ✅ Tailwind CSS 4が正常に動作
- ✅ ESLint + Prettierが正常に動作
- ✅ ディレクトリ構成が作成済み
- ✅ 必要なライブラリがインストール済み
- ✅ shadcn/uiが初期化・設定済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ1.2: ディレクトリ構成と型定義作成

### 目的
bulletproof-react準拠のディレクトリ構成と基本的な型定義の作成

### 実装内容
- ページルート定数の実装
- ドメインエンティティの型定義
- ドメインポートの型定義
- アプリケーションエラー型の定義

### 主要ファイル

#### ページルート定数 (`shared/constants/routes.ts`)
```typescript
/**
 * アプリケーション全体のページルート定数
 * 型安全なルート定義と、リンク生成ヘルパー関数を提供
 */

/**
 * ブログページルート
 */
export const BLOG_ROUTES = {
  INDEX: '/blog',
  POST: (slug: string) => `/blog/${slug}`,
  SEARCH: (query?: string) => query ? `/blog/search?q=${query}` : '/blog/search',
  TAG: (slug: string) => `/tags/${slug}`,
} as const;

/**
 * 実績ページルート
 */
export const WORK_ROUTES = {
  INDEX: '/works',
  DETAIL: (slug: string) => `/works/${slug}`,
} as const;

/**
 * タグページルート
 */
export const TAG_ROUTES = {
  INDEX: '/tags',
  DETAIL: (slug: string) => `/tags/${slug}`,
} as const;

/**
 * 共通ページルート
 */
export const COMMON_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  NOT_FOUND: '/404',
} as const;

/**
 * APIルート
 */
export const API_ROUTES = {
  WEBHOOK: '/api/webhook',
  SITEMAP: '/sitemap.xml',
  ROBOTS: '/robots.txt',
} as const;
```

#### ドメインエンティティ型定義

**ブログエンティティ (`domain/blog/entities.ts`)**
```typescript
import type { Tag } from '../tags/entities';

export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: string;
  tags: Tag[];
}
```

**実績エンティティ (`domain/works/entities.ts`)**
```typescript
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
```

**タグエンティティ (`domain/tags/entities.ts`)**
```typescript
export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}
```

#### ドメインポート型定義

**ブログポート (`domain/blog/ports.ts`)**
```typescript
import { TaskEither } from 'fp-ts/TaskEither';
import type { AppError } from '../../application/common/errors';
import type { Post } from './entities';

/**
 * ブログリポジトリのポート（インターフェース）
 * 依存性の逆転により、ドメイン層がインフラ層に依存しない
 */
export type PostRepository = {
  findAll: () => TaskEither<AppError, Post[]>;
  findBySlug: (slug: string) => TaskEither<AppError, Post>;
  findByTagSlug: (slug: string) => TaskEither<AppError, Post[]>;
  search: (query: string) => TaskEither<AppError, Post[]>;
};
```

**アプリケーションエラー (`application/common/errors.ts`)**
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
- ✅ ページルート定数が実装済み（routes.ts）
- ✅ ドメインエンティティの型定義が完了
- ✅ ドメインポートの型定義が完了
- ✅ アプリケーションエラー型が定義済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ1.3: fp-ts拡張機能の実装

### 目的
fp-tsの拡張機能を実装し、関数型プログラミングの基盤を整える

### 実装内容
- Either拡張機能
- TaskEither拡張機能
- Option拡張機能

### 主要ファイル

**Either拡張 (`shared/fp-ts/either.ts`)**
```typescript
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

/**
 * Either型の拡張機能
 */

/**
 * Eitherの値がRightかどうかを判定
 */
export const isRight = E.isRight;
export const isLeft = E.isLeft;

/**
 * Eitherから値を取得（Leftの場合はデフォルト値を返す）
 */
export const getOrElse = <A>(defaultValue: A) => <B>(ma: E.Either<B, A>): A => {
  return pipe(ma, E.getOrElse(() => defaultValue));
};
```

**TaskEither拡張 (`shared/fp-ts/task-either.ts`)**
```typescript
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import type { AppError } from '@/application/common/errors';

/**
 * TaskEither型の拡張機能
 */

/**
 * TaskEitherから値を取得（Leftの場合はデフォルト値を返す）
 */
export const getOrElse = <A>(defaultValue: A) => (ma: TE.TaskEither<AppError, A>) => 
  pipe(ma, TE.getOrElse(() => () => Promise.resolve(defaultValue)));
```

### 完了条件
- ✅ Either拡張機能が実装済み
- ✅ TaskEither拡張機能が実装済み
- ✅ Option拡張機能が実装済み
- ✅ 型チェックエラーが0件

---

## ❌ フェーズ1.4: 値オブジェクト（ブログ・実績・タグ関連）の実装（実績関連は削除済み）

### 目的
関数型ドメインモデリングに基づく値オブジェクトの実装

### 実装内容
- ブログ関連の値オブジェクト（PostId, PostTitle, PostSlug, PostExcerpt, PostDate）
- 実績関連の値オブジェクト（WorkId, WorkTitle, WorkDescription, Technology）
- タグ関連の値オブジェクト（TagId, TagName, TagSlug, TagCount）
- 共通の値オブジェクト（ImageUrl, GitHubUrl, LiveUrl）
- バリデーション関数の実装

### 主要ファイル

**ブログ関連の値オブジェクト (`domain/value-objects/post.ts`)**
```typescript
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

export interface PostId {
  readonly _tag: 'PostId';
  readonly value: string;
}

export const createPostId = (value: unknown): E.Either<string, PostId> => {
  if (typeof value === 'string' && value.length > 0) {
    return E.right({ _tag: 'PostId', value });
  }
  return E.left('無効なPostId: 空でない文字列である必要があります');
};

export interface PostTitle {
  readonly _tag: 'PostTitle';
  readonly value: string;
}

export const createPostTitle = (value: unknown): E.Either<string, PostTitle> => {
  if (typeof value === 'string' && value.length >= 1 && value.length <= 200) {
    return E.right({ _tag: 'PostTitle', value });
  }
  return E.left('無効なPostTitle: 1-200文字である必要があります');
};
```

**実績関連の値オブジェクト (`domain/value-objects/work.ts`)**
```typescript
import * as E from 'fp-ts/Either';

export interface WorkId {
  readonly _tag: 'WorkId';
  readonly value: string;
}

export const createWorkId = (value: unknown): E.Either<string, WorkId> => {
  if (typeof value === 'string' && value.length > 0) {
    return E.right({ _tag: 'WorkId', value });
  }
  return E.left('無効なWorkId: 空でない文字列である必要があります');
};
```

**タグ関連の値オブジェクト (`domain/value-objects/tag.ts`)**
```typescript
import * as E from 'fp-ts/Either';

export interface TagId {
  readonly _tag: 'TagId';
  readonly value: number;
}

export const createTagId = (value: unknown): E.Either<string, TagId> => {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return E.right({ _tag: 'TagId', value });
  }
  return E.left('無効なTagId: 正の整数である必要があります');
};
```

**一括エクスポート (`domain/value-objects/index.ts`)**
```typescript
export * from './post';
export * from './work';
export * from './tag';
export * from './common';
export * from './validation';
```

### 完了条件
- ✅ 値オブジェクトのモジュール分割が完了
- ✅ 各値オブジェクトのバリデーション機能が実装済み
- ✅ fp-tsを活用した型安全な実装が完了
- ✅ 一括エクスポート機能が動作
- ✅ 型チェックエラーが0件

**注意**: 実績関連の値オブジェクト（`work.ts`）は削除済み

---

## ✅ フェーズ1.5: ドメインエンティティとポートの実装

### 目的
値オブジェクトを使用したドメインエンティティとポートの実装

### 実装内容
- ドメインエンティティの実装（Post, Work, Tag）
- ドメインポートの実装（PostRepository, WorkRepository, TagRepository）

### 主要ファイル

**ドメインエンティティ (`domain/entities.ts`)**
```typescript
import type { 
  PostId, PostTitle, PostSlug, PostExcerpt, PostDate, 
  WorkId, WorkTitle, WorkDescription, Technology,
  TagId, TagName, TagSlug, TagCount,
  ImageUrl, GitHubUrl, LiveUrl, WorkSlug
} from './value-objects';

export interface Post {
  id: PostId;
  title: PostTitle;
  slug: PostSlug;
  excerpt: PostExcerpt;
  content: string;
  createdAt: PostDate;
  updatedAt: PostDate;
  featuredImage?: ImageUrl;
  tags: TagName[];
}

export interface Work {
  id: WorkId;
  title: WorkTitle;
  slug: WorkSlug;
  description: WorkDescription;
  technologies: Technology[];
  githubUrl?: GitHubUrl;
  liveUrl?: LiveUrl;
  images: ImageUrl[];
  createdAt: PostDate;
  updatedAt: PostDate;
}

export interface Tag {
  id: TagId;
  name: TagName;
  slug: TagSlug;
  count: TagCount;
}
```

### 完了条件
- ✅ ドメインエンティティが値オブジェクトを使用して実装済み
- ✅ ドメインポートが実装済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ1.6: 共通ユーティリティ関数の実装

### 目的
共通で使用するユーティリティ関数の実装

### 実装内容
- cn（クラス名ユーティリティ）
- フォーマット関数
- バリデーション関数

### 主要ファイル

**cn ユーティリティ (`presentation/utils/cn.ts`)**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名をマージする関数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**format ユーティリティ (`presentation/utils/format.ts`)**
```typescript
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 日付をフォーマットする関数
 */
export const formatDate = (
  date: Date,
  formatStr: string = 'yyyy年MM月dd日'
): string => {
  return format(date, formatStr, { locale: ja });
};

/**
 * 日付を相対的に表示する関数（例: "3日前"）
 */
export const getRelativeDate = (date: Date): string => {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ja,
  });
};
```

**バリデーション関数**
- ドメイン層（`domain/value-objects/validation.ts`）に実装済み
- `validateRequired`, `validateMinLength`, `validateMaxLength`, `validateUrl`, `validateSlug` など

### 完了条件
- ✅ cn関数が実装済み
- ✅ フォーマット関数が実装済み
- ✅ バリデーション関数が実装済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ1.7: shadcn/uiコンポーネントのセットアップ

### 目的
shadcn/uiコンポーネントの初期設定と基本コンポーネントの追加

### 実装内容
- shadcn/uiの初期設定
- 必要なコンポーネントの追加

### セットアップ
```bash
# shadcn/ui初期化（フェーズ1.1で実行済み）
npx shadcn@latest init

# 必要なコンポーネントを追加
npx shadcn@latest add button card navigation-menu input popover pagination dialog
```

### インストール済みコンポーネント
- ✅ button.tsx
- ✅ card.tsx
- ✅ dialog.tsx
- ✅ input.tsx
- ✅ navigation-menu.tsx
- ✅ pagination.tsx
- ✅ popover.tsx

### 完了条件
- ✅ shadcn/uiが初期化済み
- ✅ 必要なコンポーネントがインストール済み
- ✅ components.jsonが正しく設定されている
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ1.8: テーマシステムとカラーモード実装

### 目的
統一されたデザインシステムとテーマ管理の実装

### 実装内容
- カラーパレットの定義（globals.cssに既存）
- タイポグラフィシステムの実装（Tailwind CSS）
- スペーシングシステムの実装（Tailwind CSS）
- テーマ管理フックの実装
- カラーモードスイッチャーの実装

### 主要ファイル

**テーマ管理フック (`presentation/hooks/use-theme.ts`)**
```typescript
"use client";

import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  return {
    theme: theme as "light" | "dark" | "system" | undefined,
    resolvedTheme,
    systemTheme,
    setTheme: (newTheme: "light" | "dark" | "system") => setTheme(newTheme),
    changeTheme: (newTheme: "light" | "dark" | "system") => setTheme(newTheme),
  };
};
```

**カラーモードスイッチャー (`presentation/components/common/theme-toggle.tsx`)**
- ライト/ダーク/システムの切り替えUI
- DropdownMenuを使用した実装
- クライアントサイドでのハイドレーション対応

### 完了条件
- ✅ カラーパレットが定義済み
- ✅ タイポグラフィシステムが実装済み
- ✅ スペーシングシステムが実装済み
- ✅ テーマ管理フックが実装済み
- ✅ カラーモードスイッチャーが実装済み
- ✅ 型チェックエラーが0件

**注意**: ThemeProviderはフェーズ1.9で実装予定

---

## ✅ フェーズ1.9: 基本レイアウト（Header/Footer）の実装

### 目的
レスポンシブ対応の基本レイアウトとグラスモーフィズムナビゲーションの実装

### 実装内容
- ルートレイアウトの実装
- ヘッダーコンポーネント（グラスモーフィズム、角丸）
- フッターコンポーネント
- レスポンシブ対応
- ダークモード対応

### 主要ファイル

**ルートレイアウト (`app/layout.tsx`)**
- ThemeProviderの追加
- Noto Sans JPフォントの設定
- Header/Footerコンポーネントの統合

**ヘッダーコンポーネント (`presentation/components/common/header.tsx`)**
- グラスモーフィズムスタイル
- ThemeToggleの統合
- レスポンシブ対応

**フッターコンポーネント (`presentation/components/common/footer.tsx`)**
- サイト情報とコピーライト
- レスポンシブ対応

### 完了条件
- ✅ ルートレイアウトが正常に動作
- ✅ ThemeProviderが正しく設定されている
- ✅ ヘッダーがグラスモーフィズムで表示
- ✅ フッターが正常に表示
- ✅ レスポンシブ対応が完了
- ✅ ダークモード切り替えが動作
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ1.10: ナビゲーション実装

### 目的
追従ナビゲーションバーの実装

### 実装内容
- ヘッダーナビゲーションの実装
- モバイルメニューの実装
- アクティブリンクの管理

### 主要ファイル

**Header コンポーネント (`presentation/components/common/header.tsx`)**
- デスクトップナビゲーション（5つのリンク）
- モバイルメニュー（Sheetコンポーネント使用）
- アクティブリンクの管理（usePathname使用）
- レスポンシブ対応（md:breakpoint）

**追加コンポーネント**
- Sheetコンポーネント（shadcn/uiからインストール）

### 完了条件
- ✅ ナビゲーションが正常に動作
- ✅ モバイルメニューが正常に動作
- ✅ アクティブリンクが正常に表示
- ✅ 型チェックエラーが0件

---

## ⚠️ フェーズ1.11: レスポンシブ対応とモバイル最適化

### TODO
プレゼンテーション層の実装が進んできたら着手する

### 目的
レスポンシブ対応とモバイル最適化の実装

### 実装内容
- レスポンシブブレークポイントの設定
- モバイル最適化
- タッチフレンドリーなUI

### 完了条件
- [ ] レスポンシブ対応が完了
- [ ] モバイル最適化が完了
- [ ] タッチフレンドリーなUIが実装済み
- [ ] 型チェックエラーが0件

---

## フェーズ1全体の完了条件

### 技術指標
- [ ] 型チェックエラーが0件
- [ ] ESLintエラーが0件
- [ ] ディレクトリ構成が正しく作成されている
- [ ] 必要なライブラリが全てインストール済み

### 機能指標
- [ ] テーマ切り替えが正常に動作
- [ ] ヘッダー・フッターが正常に表示
- [ ] ナビゲーションが正常に動作
- [ ] レスポンシブ対応が完了

### 次のフェーズ
**フェーズ2: インフラ層実装** に進む

