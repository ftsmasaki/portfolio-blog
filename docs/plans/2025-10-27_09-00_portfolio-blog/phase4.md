# フェーズ4: プレゼンテーション層実装（基本コンポーネント）

## 概要
UIコンポーネント、カスタムフック、Zustandストアの実装。

## サブフェーズ構成
- **✅ フェーズ4.1**: UIコンポーネント（Button/Card/GlassCard）の実装
- **✅ フェーズ4.2**: UIコンポーネント（Pagination）の実装
- **✅ フェーズ4.3**: カスタムフック（useTheme、useIntersection、useLocalStorage）の実装
- **✅ フェーズ4.4**: Zustandストアの実装
- **✅ フェーズ4.5**: ユーティリティ関数の実装

---

## ✅ フェーズ4.1: UIコンポーネント（Button/Card/GlassCard）

### 目的
基本UIコンポーネントの実装

### 実装内容
- Buttonコンポーネント（shadcn/ui）
- Cardコンポーネント（shadcn/ui）
- GlassCardコンポーネント（グラスモーフィズム）

### 主要ファイル

**GlassCard (`presentation/components/ui/glass-card.tsx`)**
```typescript
import * as React from "react";
import { cn } from "@/presentation/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "blur" | "frosted";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white/10 backdrop-blur-md border-white/20",
      blur: "bg-white/5 backdrop-blur-lg border-white/10",
      frosted: "bg-white/20 backdrop-blur-sm border-white/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border shadow-lg",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
```

### 完了条件
- ✅ Buttonコンポーネントが実装済み（既存）
- ✅ Cardコンポーネントが実装済み（既存）
- ✅ GlassCardコンポーネントが実装済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ4.2: UIコンポーネント（Pagination）

### 目的
ページネーションコンポーネントの実装

### 主要ファイル

**Pagination (`presentation/components/ui/pagination.tsx`)**
```typescript
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { cn } from '@/presentation/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = (
    current: number,
    total: number
  ): Array<number | 'ellipsis'> => {
    const pages: Array<number | 'ellipsis'> = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (current > 3) {
        pages.push('ellipsis');
      }
      
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < total - 2) {
        pages.push('ellipsis');
      }
      
      pages.push(total);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="ページネーション">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <Button key={`ellipsis-${index}`} variant="ghost" size="sm" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};
```

### 完了条件
- ✅ Paginationコンポーネントが実装済み
- ✅ 正常に動作
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ4.3: カスタムフック（useTheme、useIntersection、useLocalStorage）の実装

### 目的
再利用可能なカスタムフックの実装

### 実装内容
- useTheme（テーマ管理）
- useIntersection（スクロール監視）
- useLocalStorage（ローカルストレージ）

### 主要ファイル

**useTheme (`src/presentation/hooks/use-theme.ts`)**
```typescript
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  return {
    theme: theme as 'light' | 'dark' | 'system' | undefined,
    resolvedTheme,
    systemTheme,
    setTheme: (newTheme: 'light' | 'dark' | 'system') => setTheme(newTheme),
    changeTheme: (newTheme: 'light' | 'dark' | 'system') => setTheme(newTheme),
  };
};
```

### 完了条件
- ✅ useThemeが実装済み
- ✅ useIntersectionが実装済み
- ✅ useLocalStorageが実装済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ4.4: Zustandストアの実装

### 目的
状態管理のためのZustandストア実装

### 主要ファイル

**Theme Store (`src/presentation/store/theme-store.ts`)**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  setResolvedTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme) => set({ theme }),
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
```

### 完了条件
- ✅ Theme Storeが実装済み
- ✅ UI Storeが実装済み
- ✅ 正常に動作
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ4.5: ユーティリティ関数の実装

### 目的
プレゼンテーション層で使用するユーティリティ関数の実装

### 実装内容
- format関数（日付フォーマット）
- cn関数（クラス名ユーティリティ）
- SEO関連ユーティリティ

### 主要ファイル

**format (`src/presentation/utils/format.ts`)**
```typescript
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale/ja';

export const formatDate = (
  date: Date, 
  formatStr: string = 'yyyy年MM月dd日'
): string => {
  return format(date, formatStr, { locale: ja });
};

export const getRelativeDate = (date: Date): string => {
  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: ja 
  });
};
```

### 完了条件
- ✅ format関数が実装済み
- ✅ cn関数が実装済み
- ✅ ユーティリティ関数が実装済み
- ✅ 型チェックエラーが0件

---

## ✅ フェーズ4全体の完了条件

### 技術指標
- ✅ 型チェックエラーが0件
- ✅ UIコンポーネントが実装済み
- ✅ カスタムフックが実装済み
- ✅ Zustandストアが実装済み

### 機能指標
- ✅ UIコンポーネントが正常に表示
- ✅ カスタムフックが正常に動作
- ✅ 状態管理が正常に動作

### 次のフェーズ
**✅ フェーズ4完了！次のフェーズ5: ブログ機能実装** に進む

