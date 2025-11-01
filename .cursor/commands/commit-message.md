シンプルなコミットメッセージ（Conventional Commits 準拠／日本語）を生成してください。

前提:
- まずリポジトリルートで実行（このプロジェクトでは /home/yuki/repos/portfolio-blog）

実行手順（変更把握のためのコマンドを順に実行し、結果を要約に反映）:

1) 現在ブランチ名
```
git rev-parse --abbrev-ref HEAD
```

2) 作業ツリーの概要（未ステージ/ステージ済みを把握）
```
git status --porcelain=v1 -uall
```

3) ステージ済みの差分（優先）
```
git diff --staged --name-only
git diff --staged --stat
git diff --staged -U0
```

4) ステージされていない差分（3で変更が無い場合のみ）
```
git diff --name-only
git diff --stat
git diff -U0
```

5) 重要ファイルの変更有無（あれば要約に反映）
```
ls -1 app/package.json 2>/dev/null || true
```

出力フォーマット（日本語。短く簡潔に）:
- タイプは変更内容から自動選択: feat | fix | refactor | chore | docs | style | test
- サブジェクトは 60文字以内で要点のみ
- ボディは箇条書き 3行以内、重要な変更のみ

テンプレート:
```
<type>: <subject>

- 変更点1
- 変更点2
- 影響範囲/注意点（あれば）
```

ルール:
- 冗長な説明や実装詳細は避け、要約重視
- ファイル大量変更時は代表的なディレクトリ単位でまとめる
- テストや型・リントのみなら `test:`/`chore:` を選ぶ
- パッケージ更新や設定変更は `chore:`


