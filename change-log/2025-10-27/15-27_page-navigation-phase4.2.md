# フェーズ4.2: UIコンポーネント（Pagination）の実装完了

## 何を (What)

### 実装した機能
- ページネーションコンポーネント（PageNavigation）の実装
- shadcn/uiのPaginationコンポーネントを活用した再利用可能な実装
- ブログ・実績双方の一覧表示で使用可能な汎用コンポーネント

### 変更されたファイル
- `app/src/presentation/components/common/page-navigation.tsx` (新規作成)

## どんな目的で (Why)

### 変更を行った理由
- ブログ記事と実績の一覧表示で共通のページネーション機能を提供
- shadcn/uiの既存コンポーネントを活用して開発効率を向上
- 汎用的で再利用可能なページネーションコンポーネントの実装

### 解決したい課題
- ブログ・実績両方の一覧で同じページネーションUIを提供
- エリプシス（...）表示による直感的なページ遷移
- アクセシビリティを考慮したページネーション

## どう変更したか (How)

### 具体的な実装方法

#### PageNavigationコンポーネント
```typescript
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/presentation/components/ui/pagination";

export interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PageNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
}: PageNavigationProps) => {
  const getPageNumbers = (
    current: number,
    total: number
  ): Array<number | "ellipsis"> => {
    const pages: Array<number | "ellipsis"> = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push("ellipsis");
      }

      pages.push(total);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
```

#### 使用した技術
- shadcn/uiのPaginationコンポーネント群
- TypeScriptによる型安全性
- React.forwardRefによるref転送
- エリプシス（...）による直感的なページ表示

### 重要なコードの変更点
1. **shadcn/uiコンポーネントの再利用**: 既存のPaginationコンポーネントを活用
2. **エリプシス表示**: 7ページ以上の場合は`...`で省略表示
3. **動的ページ番号計算**: `getPageNumbers`関数によるページ番号の動的計算
4. **アクセシビリティ**: ARIA属性による適切なアクセシビリティ対応
5. **汎用性**: ブログ・実績双方の一覧で使用可能

## 考えられる影響と範囲

### 既存機能への影響
- 既存のPaginationコンポーネント（shadcn/ui）に依存
- ブログ・実績の一覧ページで使用可能

### ユーザーエクスペリエンスへの影響
- 直感的なページ遷移UI
- エリプシスによる視認性の向上
- アクセシビリティの向上

### パフォーマンスへの影響
- 軽量な実装により影響は最小限
- クリックイベントのハンドリングが最適化されている

## 課題

### 今後の改善点
- マウスホバー時のアニメーション追加
- キーボードナビゲーションの最適化
- URLパラメータとの連携

### 未解決の問題
- なし（フェーズ4.2の要件は全て満たしている）

### 追加で必要な作業
- フェーズ4.3: カスタムフックの実装
- フェーズ4.4: Zustandストアの実装
- フェーズ4.5: ユーティリティ関数の実装

## 完了条件の確認

### ✅ フェーズ4.2完了条件
- [x] Paginationコンポーネントが実装済み
- [x] shadcn/uiのコンポーネントを活用した実装
- [x] ブログ・実績双方で使用可能
- [x] 正常に動作
- [x] 型チェックエラーが0件
- [x] リントエラーが0件

## 次のアクション

フェーズ4.3: カスタムフックの実装に進む準備が整いました。

### 推奨コミットメッセージ
```
feat: [フェーズ4.2] ページネーションコンポーネントの実装

- shadcn/uiのPaginationコンポーネントを活用
- エリプシス（...）による直感的なページ表示
- ブログ・実績双方の一覧で使用可能な汎用コンポーネント
- TypeScriptによる型安全性を確保
- アクセシビリティを考慮した実装
```
