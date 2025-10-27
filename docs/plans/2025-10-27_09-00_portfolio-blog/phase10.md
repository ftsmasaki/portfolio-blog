# フェーズ10: アナリティクスと監視実装

## 概要
GA4統合、カスタムイベント追跡、パフォーマンス監視の実装。

## サブフェーズ構成
- **フェーズ10.1**: GA4統合の実装
- **フェーズ10.2**: カスタムイベント追跡の実装
- **フェーズ10.3**: パフォーマンス監視の実装

---

## フェーズ10.1: GA4統合の実装

### 目的
Google Analytics 4 の統合実装

### 実装内容
- GA4コンポーネントの実装
- 環境変数の設定
- ルートレイアウトへの統合

### 主要ファイル

**Analytics コンポーネント (`presentation/components/common/analytics.tsx`)**
```typescript
'use client';

import { GoogleAnalytics } from '@next/third-parties/google';

/**
 * Google Analytics 4 コンポーネント
 * 本番環境でのみ有効化
 */
export const Analytics = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // 開発環境ではGA4を無効化
  if (!gaId || process.env.NODE_ENV === 'development') {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
};
```

### GA4設定手順
1. Google Analytics 4でプロパティ作成
   - Google Analyticsにアクセス
   - 「管理」→「プロパティを作成」
   - 測定ID（G-XXXXXXXXXX）を取得
2. 環境変数の設定
   - `.env.local`ファイルを作成
   - `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`を追加
3. 本番環境での確認
   - 本番環境でGA4が正常に動作することを確認

### 完了条件
- [ ] GA4コンポーネントが実装済み
- [ ] ルートレイアウトに統合済み
- [ ] 本番環境で正常に動作
- [ ] 型チェックエラーが0件

---

## フェーズ10.2: カスタムイベント追跡の実装

### 目的
カスタムイベント追跡機能の実装

### 実装内容
- 記事閲覧の追跡
- 実績閲覧の追跡
- リンククリックの追跡

### 主要ファイル

**Analytics ユーティリティ (`presentation/utils/analytics.ts`)**
```typescript
/**
 * グローバル型定義を拡張
 */
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * GA4カスタムイベントを送信
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * 記事閲覧を追跡
 */
export const trackPostView = (slug: string, title: string) => {
  trackEvent('view_blog_post', {
    post_slug: slug,
    post_title: title,
  });
};

/**
 * 実績閲覧を追跡
 */
export const trackWorkView = (slug: string, title: string) => {
  trackEvent('view_work', {
    work_slug: slug,
    work_title: title,
  });
};
```

### 完了条件
- [ ] カスタムイベント追跡が実装済み
- [ ] 記事閲覧が追跡される
- [ ] 実績閲覧が追跡される
- [ ] 型チェックエラーが0件

---

## フェーズ10.3: パフォーマンス監視の実装

### 目的
パフォーマンス監視機能の実装

### 実装内容
- Web Vitals の監視
- パフォーマンス指標の測定
- エラートラッキング

### 完了条件
- [ ] パフォーマンス監視が実装済み
- [ ] Web Vitalsが測定される
- [ ] エラートラッキングが動作
- [ ] 型チェックエラーが0件

---

## フェーズ10全体の完了条件

### 技術指標
- [ ] 型チェックエラーが0件
- [ ] GA4が実装済み

### 機能指標
- [ ] GA4が正常に動作
- [ ] カスタムイベントが記録される
- [ ] パフォーマンス監視が動作

### 次のフェーズ
**フェーズ11: デプロイと自動化実装** に進む

