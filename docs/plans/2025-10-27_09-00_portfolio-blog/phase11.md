# フェーズ11: デプロイと自動化実装

## 概要
GitHub Actions CI/CDパイプライン、WordPress Webhook自動デプロイ、環境変数とシークレット管理、本番環境デプロイの実装。

## サブフェーズ構成
- **フェーズ11.1**: GitHub Actions CI/CDパイプラインの実装
- **フェーズ11.2**: WordPress Webhook自動デプロイ機能の実装
- **フェーズ11.3**: 環境変数とシークレット管理の設定
- **フェーズ11.4**: 本番環境デプロイ設定

---

## フェーズ11.1: GitHub Actions CI/CDパイプラインの実装

### 目的
GitHub Actionsを使用したCI/CDパイプラインの実装

### 実装内容
- CI/CDワークフローの実装
- ビルドとテストの自動化
- デプロイの自動化

### 完了条件
- [ ] CI/CDパイプラインが実装済み
- [ ] ビルドが自動化済み
- [ ] テストが自動化済み
- [ ] デプロイが自動化済み

---

## フェーズ11.2: WordPress Webhook自動デプロイ機能の実装

### 目的
WordPress管理画面からの投稿でNext.jsアプリを自動ビルド・デプロイ

### 実装内容
- WordPress Webhook受信APIの実装
- GitHub Actionsワークフローの実装
- Webhookの検証機能

### 主要ファイル

**WordPress Webhook受信API (`app/api/webhook/route.ts`)**
```typescript
import { NextResponse } from 'next/server';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

/**
 * Webhookペイロードの型定義
 */
interface WebhookPayload {
  type: string;
  post_id: number;
  post_type: string;
  timestamp: string;
}

/**
 * POSTハンドラー: WordPress Webhookを受信
 */
export async function POST(request: Request) {
  const secret = request.headers.get('x-webhook-secret');
  const expectedSecret = process.env.WORDPRESS_WEBHOOK_SECRET;

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let payload: WebhookPayload;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  // GitHub Actionsのビルドをトリガー
  const repository = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repository}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'wordpress_updated',
          client_payload: {
            timestamp: new Date().toISOString(),
            source: 'wordpress',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Build triggered successfully',
      payload,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Build trigger failed' },
      { status: 500 }
    );
  }
}
```

**GitHub Actions Workflow (`.github/workflows/build-on-wordpress-update.yml`)**
```yaml
name: Build and Deploy on WordPress Update

on:
  repository_dispatch:
    types: [wordpress_updated]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Next.js
        run: npm run build
        env:
          WORDPRESS_URL: ${{ secrets.WORDPRESS_URL }}
```

### 完了条件
- [ ] Webhook受信APIが実装済み
- [ ] GitHub Actionsワークフローが設定済み
- [ ] 自動デプロイが正常に動作
- [ ] 型チェックエラーが0件

---

## フェーズ11.3: 環境変数とシークレット管理の設定

### 目的
環境変数とシークレット管理の設定

### 実装内容
- 環境変数の設定
- GitHub Secretsの設定
- Vercel環境変数の設定

### 完了条件
- [ ] 環境変数が設定済み
- [ ] GitHub Secretsが設定済み
- [ ] Vercel環境変数が設定済み

---

## フェーズ11.4: 本番環境デプロイ設定

### 目的
本番環境へのデプロイ設定

### 実装内容
- デプロイ設定の実装
- 本番環境の設定
- 監視設定の実装

### 完了条件
- [ ] デプロイ設定が完了
- [ ] 本番環境が設定済み
- [ ] 監視設定が実装済み
- [ ] 型チェックエラーが0件

---

## フェーズ11全体の完了条件

### 技術指標
- [ ] 型チェックエラーが0件
- [ ] CI/CDパイプラインが動作

### 機能指標
- [ ] 自動デプロイが正常に動作
- [ ] Webhookが正常に動作

### 次のフェーズ
**フェーズ12: テスト実装** に進む

