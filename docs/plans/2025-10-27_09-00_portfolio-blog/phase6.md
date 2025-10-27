# フェーズ6: 検索機能実装

## 概要
FlexSearchを使った全文検索機能の実装フェーズ。

## サブフェーズ構成
- **フェーズ6.1**: FlexSearchインデックス作成機能の実装
- **フェーズ6.2**: 検索モーダルとSearchModalTriggerの実装
- **フェーズ6.3**: SearchBarとSearchResultコンポーネントの実装
- **フェーズ6.4**: リアルタイム検索機能の実装

---

## フェーズ6.1: FlexSearchインデックス作成機能

### 目的
検索可能なドキュメント用のFlexSearchインデックスの作成

### 実装内容
- 検索可能なドキュメントの型定義
- インデックス作成機能
- 検索実行機能

### 主要ファイル

**検索インデックス (`infrastructure/search/index.ts`)**
```typescript
import { Index } from 'flexsearch';
import type { Post } from '@/domain/blog/entities';

export interface SearchableDocument {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
}

export const postToSearchableDocument = (post: Post): SearchableDocument => ({
  id: typeof post.id === 'string' ? parseInt(post.id) : post.id,
  title: post.title,
  content: post.content,
  excerpt: post.excerpt,
  slug: post.slug,
});

export const createSearchIndex = (
  documents: SearchableDocument[]
): E.Either<Error, Index<SearchableDocument>> => {
  return E.tryCatch(
    () => {
      const index = new Index({
        preset: 'performance',
        tokenize: 'forward',
        language: 'ja',
      });

      documents.forEach((doc) => {
        const searchableText = `${doc.title} ${doc.content} ${doc.excerpt}`;
        index.add(doc.id, searchableText);
      });

      return index;
    },
    (error) => new Error(`Failed to create search index: ${error}`)
  );
};
```

### 完了条件
- [ ] 検索インデックスが実装済み
- [ ] インデックス作成が正常に動作
- [ ] 型チェックエラーが0件

---

## フェーズ6.2: 検索モーダルとSearchModalTriggerの実装

### 目的
shadcn/ui の dialog.tsx を使用した検索モーダルとナビゲーションバーのトリガーの実装

### 実装内容
- SearchModalTrigger（ナビゲーションバー配置）
- SearchModal（モーダルコンテナ）
- shadcn/ui dialog.tsx の活用

### 主要ファイル

**SearchModalTrigger (`presentation/components/common/search-modal-trigger.tsx`)**
```typescript
'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SearchModalTriggerProps {
  onOpen: () => void;
}

export const SearchModalTrigger = ({ onOpen }: SearchModalTriggerProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={onOpen}
      aria-label="記事を検索"
    >
      <Search className="h-4 w-4" />
      <span className="hidden md:inline">検索</span>
    </Button>
  );
};
```

**SearchModal (`presentation/components/common/search-modal.tsx`)**
```typescript
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchBar } from './search-bar';
import { SearchResult } from './search-result';
import type { SearchableDocument } from '@/infrastructure/search/index';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: SearchableDocument[];
}

export const SearchModal = ({ open, onOpenChange, documents }: SearchModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>記事を検索</DialogTitle>
          <DialogDescription>キーワードを入力して記事を検索します</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <SearchBar documents={documents} />
          <SearchResult documents={documents} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

### 完了条件
- [ ] SearchModalTriggerが実装済み
- [ ] SearchModalが実装済み
- [ ] shadcn/ui dialogが正常に動作
- [ ] 型チェックエラーが0件

---

## フェーズ6.3: SearchBarとSearchResultコンポーネントの実装

### 目的
モーダル内の検索バーと検索結果表示コンポーネントの実装

### 実装内容
- SearchBar（キーワード入力）
- SearchResult（検索結果表示エリア）
- ResultItem（各検索結果の表示）

### 主要ファイル

**SearchBar (`presentation/components/common/search-bar.tsx`)**
```typescript
'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface SearchBarProps {
  documents: SearchableDocument[];
  onSearch?: (results: SearchableDocument[]) => void;
}

export const SearchBar = ({ documents, onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  // リアルタイム検索ロジック
  const handleSearchChange = (value: string) => {
    setQuery(value);
    // 検索実行ロジックはSearchResultコンポーネントに移譲
    onSearch?.(documents);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="記事を検索..."
        value={query}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <button
          onClick={() => {
            setQuery('');
            onSearch?.(documents);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
};
```

**SearchResult (`presentation/components/common/search-result.tsx`)**
```typescript
'use client';

import { ResultItem } from './result-item';
import type { SearchableDocument } from '@/infrastructure/search/index';

interface SearchResultProps {
  documents: SearchableDocument[];
}

export const SearchResult = ({ documents }: SearchResultProps) => {
  return (
    <div className="max-h-[60vh] overflow-y-auto space-y-2">
      {documents.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          検索キーワードを入力してください
        </p>
      ) : (
        documents.map((doc) => (
          <ResultItem key={doc.id} document={doc} />
        ))
      )}
    </div>
  );
};
```

**ResultItem (`presentation/components/common/result-item.tsx`)**
```typescript
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { SearchableDocument } from '@/infrastructure/search/index';
import { BLOG_ROUTES } from '@/shared/constants/routes';

interface ResultItemProps {
  document: SearchableDocument;
}

export const ResultItem = ({ document }: ResultItemProps) => {
  return (
    <Link href={BLOG_ROUTES.POST(document.slug)}>
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{document.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {document.excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
```

### 完了条件
- [ ] SearchBarが実装済み
- [ ] SearchResultが実装済み
- [ ] ResultItemが実装済み
- [ ] 型チェックエラーが0件

---

## フェーズ6.4: リアルタイム検索機能の実装

### 目的
リアルタイム検索機能の実装

### 実装内容
- リアルタイム検索ロジックの実装
- 検索インデックスの活用
- 検索パフォーマンスの最適化

### 完了条件
- [ ] リアルタイム検索が正常に動作
- [ ] 検索パフォーマンスが最適化済み
- [ ] 型チェックエラーが0件

---

## フェーズ6全体の完了条件

### 技術指標
- [ ] 型チェックエラーが0件
- [ ] 検索機能が正常に動作

### 機能指標
- [ ] 検索インデックスがビルド時に生成
- [ ] 検索バーが正常に動作
- [ ] リアルタイム検索が動作

### 次のフェーズ
**フェーズ7: 実績機能実装** に進む

